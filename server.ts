import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  ResearchTopicInput,
  TopicAnalysis,
  LiteratureReviewData,
  ResearchPaper,
  ResearchProject,
  CitationItem,
} from './src/types/research.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: load config and prompt files
function getAgentConfig() {
  try {
    const configPath = path.resolve(process.cwd(), 'research_agent_config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading research_agent_config.json', err);
  }
  return { agent_name: 'AI Academic Research Paper Agent', version: '2.5.0' };
}

function getSystemPrompt() {
  try {
    const promptPath = path.resolve(process.cwd(), 'research_agent_prompt.txt');
    if (fs.existsSync(promptPath)) {
      return fs.readFileSync(promptPath, 'utf-8');
    }
  } catch (err) {
    console.error('Error reading research_agent_prompt.txt', err);
  }
  return 'You are an expert academic research assistant.';
}

// Clean markdown code blocks from model JSON output
function parseJsonFromText(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  }
  return JSON.parse(cleaned.trim());
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/agent/config', (req: Request, res: Response) => {
  res.json(getAgentConfig());
});

app.get('/api/agent/prompt', (req: Request, res: Response) => {
  res.send(getSystemPrompt());
});

// Step 1: Analyze Topic
app.post('/api/research/analyze-topic', async (req: Request, res: Response) => {
  try {
    const input: ResearchTopicInput = req.body;
    if (!input || !input.topic) {
      return res.status(400).json({ error: 'Research topic is required.' });
    }

    const systemPrompt = getSystemPrompt();
    const prompt = `
Analyze the following academic research topic and provide a structured academic research proposal breakdown.

TOPIC: "${input.topic}"
ACADEMIC FIELD: "${input.field || 'Interdisciplinary Studies'}"
ACADEMIC LEVEL: "${input.academicLevel || 'Master'}"
METHODOLOGY PREFERENCE: "${input.methodologyPreference || 'Mixed Methods'}"

Return ONLY a valid JSON object matching this schema:
{
  "mainTopic": string,
  "field": string,
  "backgroundSummary": string (2-3 paragraphs providing scholarly context and relevance),
  "primaryResearchQuestion": string (clear, rigorous question),
  "secondaryQuestions": string[] (3 to 4 granular sub-questions investigating specific aspects),
  "primaryObjective": string (broad research goal),
  "specificObjectives": string[] (3 to 4 SMART research objectives),
  "identifiedGaps": string[] (3 to 4 critical gaps in existing literature),
  "suggestedMethodology": {
    "approach": string (e.g. Mixed Methods, Quantitative Empirical, etc.),
    "dataStrategy": string (sampling, dataset acquisition, or experimental parameter plan),
    "toolkits": string[] (recommended software, frameworks, or analytical tools),
    "feasibilityNotes": string (ethical, computational, or timeline considerations)
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const analysis: TopicAnalysis = parseJsonFromText(response.text || '{}');
    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Error in analyze-topic:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze research topic.',
      details: error.toString(),
    });
  }
});

// Step 2: Literature Review with Google Search Grounding
app.post('/api/research/literature-review', async (req: Request, res: Response) => {
  try {
    const { topicInput, analysis } = req.body as {
      topicInput: ResearchTopicInput;
      analysis: TopicAnalysis;
    };

    if (!topicInput || !topicInput.topic) {
      return res.status(400).json({ error: 'Topic input is required.' });
    }

    const systemPrompt = getSystemPrompt();

    // Query with search grounding to find real academic papers, preprints, conferences, journals
    const searchPrompt = `
Search academic databases, IEEE, arXiv, PubMed, ACM, Springer, Nature, ScienceDirect, and scholar publications for recent (2020-2026) peer-reviewed and foundational research studies regarding:
Topic: "${topicInput.topic}" in Field: "${topicInput.field}".
Specific context: ${analysis?.primaryResearchQuestion || topicInput.topic}.

Identify at least 4 to 6 real, published papers, conference proceedings, or authoritative preprints.
Provide their exact real paper titles, authors, publication year, journal or venue, key findings, and real source links.
Do NOT invent or fabricate any author or paper title.
`;

    let groundingChunks: any[] = [];
    let groundedSearchResponseText = '';

    try {
      const searchResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: searchPrompt,
        config: {
          systemInstruction: systemPrompt,
          tools: [{ googleSearch: {} }],
        },
      });

      groundedSearchResponseText = searchResponse.text || '';
      groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    } catch (searchErr) {
      console.warn('Google Search grounding fallback:', searchErr);
    }

    // Extract web links from grounding chunks
    const realGroundingUrls: Array<{ title: string; url: string }> = [];
    groundingChunks.forEach((chunk) => {
      if (chunk.web?.uri) {
        realGroundingUrls.push({
          title: chunk.web.title || 'Scholarly Source',
          url: chunk.web.uri,
        });
      }
    });

    // Structure the literature review into a comparative matrix and academic review
    const structuringPrompt = `
You are compiling an academic Literature Review and Comparative Matrix for:
Topic: "${topicInput.topic}"
Field: "${topicInput.field}"
Research Questions: ${analysis?.primaryResearchQuestion || ''}

Here are the real search findings and grounded sources retrieved:
"""
${groundedSearchResponseText.slice(0, 4000)}
"""

Grounded URL references found:
${JSON.stringify(realGroundingUrls.slice(0, 10))}

TASK:
Synthesize this into a structured literature review.
STRICT RULE: Only include real, verified studies with their actual titles and authors from the search or foundational consensus literature. Set "verified": true if matched with search results/URLs. If you reference a classic foundational benchmark, provide accurate metadata. Never invent fake authors.

Return ONLY a valid JSON object matching this schema:
{
  "searchQueriesUsed": string[],
  "searchGrounded": boolean,
  "groundingSourcesCount": number,
  "summary": string (3-4 paragraphs of rigorous narrative synthesis reviewing the evolution, dominant theories, and state-of-the-art),
  "studies": [
    {
      "id": string (e.g. "study-1"),
      "title": string,
      "authors": string[],
      "year": number or string,
      "publicationOrSource": string (Journal, Conference, or Publisher),
      "url": string (valid real URL or DOI link if present, or leave empty if general),
      "verified": boolean,
      "coreContribution": string,
      "methodology": string,
      "keyFindings": string,
      "limitationsOrGaps": string
    }
  ],
  "comparativeMatrix": {
    "dimensions": ["Methodological Approach", "Dataset / Sample", "Key Advantage", "Critical Limitation"],
    "studyComparisons": [
      {
        "studyTitle": string,
        "year": string or number,
        "methodology": string,
        "sampleOrData": string,
        "keyAdvantage": string,
        "limitation": string
      }
    ]
  },
  "similarities": string[] (3 to 4 common patterns or converging conclusions across reviewed works),
  "differences": string[] (3 to 4 points of divergence, conflicting metrics, or opposing methodologies),
  "overallGaps": string[] (3 to 4 unaddressed gaps in the literature that this research paper will address)
}
`;

    const structuredResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: structuringPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const literatureData: LiteratureReviewData = parseJsonFromText(structuredResponse.text || '{}');
    literatureData.searchGrounded = realGroundingUrls.length > 0;
    literatureData.groundingSourcesCount = realGroundingUrls.length;

    // Attach groundings to studies if missing URLs
    if (literatureData.studies && literatureData.studies.length > 0 && realGroundingUrls.length > 0) {
      literatureData.studies.forEach((st, idx) => {
        if (!st.url && realGroundingUrls[idx]) {
          st.url = realGroundingUrls[idx].url;
          st.verified = true;
        }
      });
    }

    res.json({ success: true, literature: literatureData, groundingLinks: realGroundingUrls });
  } catch (error: any) {
    console.error('Error in literature-review:', error);
    res.status(500).json({
      error: error.message || 'Failed to conduct literature review.',
      details: error.toString(),
    });
  }
});

// Step 3: Generate Full 12-Section Research Paper
app.post('/api/research/generate-paper', async (req: Request, res: Response) => {
  try {
    const { topicInput, analysis, literature } = req.body as {
      topicInput: ResearchTopicInput;
      analysis: TopicAnalysis;
      literature: LiteratureReviewData;
    };

    if (!topicInput || !topicInput.topic) {
      return res.status(400).json({ error: 'Topic input is required.' });
    }

    const systemPrompt = getSystemPrompt();

    const paperPrompt = `
Synthesize a comprehensive, publication-ready academic research paper based on the topic analysis and literature review.

TOPIC: "${topicInput.topic}"
FIELD: "${topicInput.field}"
ACADEMIC LEVEL: "${topicInput.academicLevel}"
METHODOLOGY: "${topicInput.methodologyPreference}"
PRIMARY QUESTION: "${analysis?.primaryResearchQuestion || ''}"
OBJECTIVES: ${JSON.stringify(analysis?.specificObjectives || [])}
IDENTIFIED GAPS: ${JSON.stringify(analysis?.identifiedGaps || literature?.overallGaps || [])}
KEY STUDIES INCLUDED: ${JSON.stringify(
      (literature?.studies || []).map((s) => ({
        title: s.title,
        authors: s.authors,
        year: s.year,
        url: s.url,
        verified: s.verified,
      }))
    )}

CRITICAL SECTIONAL DIRECTIVES:
Generate the paper with ALL 12 required sections:
1. Title: Scholarly, specific, authoritative title.
2. Abstract: Structured scholarly abstract (~200-250 words) with Context, Problem, Proposed Methodology, Findings, and Significance.
3. Keywords: 5 to 8 standardized indexing terms.
4. Introduction: Rigorous background, motivation, scope, and structural roadmap.
5. Problem Statement: Formal technical problem definition, mathematical/conceptual formulation of bottlenecks.
6. Literature Review: In-depth thematic review citing the studies and comparative findings.
7. Research Objectives: Primary aim followed by numbered SMART sub-objectives.
8. Methodology: Detailed research design, data collection/sampling framework, experimental or computational setup, operationalized variables, and validation metrics.
9. Results and Discussion: Detailed experimental analysis or simulation outcomes.
   MANDATORY DISCLAIMER REQUIREMENT: Clearly label the results as empirical benchmarks, synthetic/simulated demonstrations, or proposed experimental validation design (e.g. "[Preliminary Benchmark / Simulated Validation: Results represent simulated experimental parameters and baseline comparative evaluations]"). Provide 3 to 4 illustrative data metrics with label, value, and scholarly context.
10. Conclusion: Comprehensive synthesis summarizing answers to research questions and research impact.
11. Future Scope: Explicit future research vectors, scalability directions, and potential cross-disciplinary extensions.
12. References: List of citations with complete academic metadata, verified vs suggested status, APA, IEEE, MLA format strings, and BibTeX entry for each.

Return ONLY a valid JSON object matching this schema:
{
  "title": string,
  "abstract": string,
  "keywords": string[],
  "introduction": string (3-4 substantive scholarly paragraphs),
  "problemStatement": string (2-3 paragraphs with clear problem formulation),
  "literatureReview": string (3-4 paragraphs integrating current paradigms and gap analysis),
  "researchObjectives": string (formatted with clear overarching goal and numbered objectives),
  "methodology": string (3-4 paragraphs detailing protocol, tools, datasets/sampling, and validation criteria),
  "resultsAndDiscussion": {
    "content": string (4-5 paragraphs discussing the findings, comparative performance, and implications),
    "isHypothetical": true,
    "disclaimer": string (clear scholarly notice regarding simulated/hypothetical validation),
    "keyMetrics": [
      { "label": string, "value": string, "explanation": string }
    ]
  },
  "conclusion": string (2-3 paragraphs synthesizing findings),
  "futureScope": string (2 paragraphs outlining open problems and emerging directions),
  "references": [
    {
      "id": string,
      "authors": string[],
      "title": string,
      "journalOrConference": string,
      "year": number or string,
      "volumeIssuePages": string,
      "doiOrUrl": string,
      "isVerified": boolean,
      "verificationSource": string (e.g. "Google Search Grounded" or "Domain Landmark Consensus" or "Suggested Literature Avenue"),
      "citationApa": string (Full APA 7th ed string),
      "citationIeee": string (Full IEEE numeric string, e.g. [1] A. Author...),
      "citationMla": string (Full MLA 9th ed string),
      "bibtex": string (Standard BibTeX entry format)
    }
  ]
}
`;

    const paperResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: paperPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const paper: ResearchPaper = parseJsonFromText(paperResponse.text || '{}');
    res.json({ success: true, paper });
  } catch (error: any) {
    console.error('Error in generate-paper:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate academic research paper.',
      details: error.toString(),
    });
  }
});

// Full Pipeline: Runs all steps in sequence
app.post('/api/research/full-pipeline', async (req: Request, res: Response) => {
  try {
    const topicInput: ResearchTopicInput = req.body;
    if (!topicInput || !topicInput.topic) {
      return res.status(400).json({ error: 'Research topic is required.' });
    }

    const systemPrompt = getSystemPrompt();

    // 1. Topic Analysis
    const analysisPrompt = `
Analyze this research topic for an academic investigation:
Topic: "${topicInput.topic}"
Field: "${topicInput.field}"
Level: "${topicInput.academicLevel}"
Methodology: "${topicInput.methodologyPreference}"

Return ONLY JSON:
{
  "mainTopic": string,
  "field": string,
  "backgroundSummary": string,
  "primaryResearchQuestion": string,
  "secondaryQuestions": string[],
  "primaryObjective": string,
  "specificObjectives": string[],
  "identifiedGaps": string[],
  "suggestedMethodology": {
    "approach": string,
    "dataStrategy": string,
    "toolkits": string[],
    "feasibilityNotes": string
  }
}
`;

    const analysisResp = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: analysisPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });
    const analysis: TopicAnalysis = parseJsonFromText(analysisResp.text || '{}');

    // 2. Literature Review with Google Search Grounding
    let realGroundingUrls: Array<{ title: string; url: string }> = [];
    let groundedSearchResponseText = '';
    try {
      const searchResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Search academic literature and recent publications for: "${topicInput.topic}" ${topicInput.field}. Return real paper titles, authors, and URLs. Do not hallucinate papers.`,
        config: {
          systemInstruction: systemPrompt,
          tools: [{ googleSearch: {} }],
        },
      });
      groundedSearchResponseText = searchResponse.text || '';
      const chunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      chunks.forEach((chunk) => {
        if (chunk.web?.uri) {
          realGroundingUrls.push({
            title: chunk.web.title || 'Scholarly Resource',
            url: chunk.web.uri,
          });
        }
      });
    } catch (sErr) {
      console.warn('Search grounding skipped/failed in pipeline:', sErr);
    }

    const litPrompt = `
Synthesize a literature review & comparative matrix for "${topicInput.topic}".
Search notes: """${groundedSearchResponseText.slice(0, 3000)}"""
Grounding URLs: ${JSON.stringify(realGroundingUrls.slice(0, 8))}

Return ONLY JSON:
{
  "searchQueriesUsed": string[],
  "searchGrounded": boolean,
  "groundingSourcesCount": number,
  "summary": string,
  "studies": [
    {
      "id": string,
      "title": string,
      "authors": string[],
      "year": number or string,
      "publicationOrSource": string,
      "url": string,
      "verified": boolean,
      "coreContribution": string,
      "methodology": string,
      "keyFindings": string,
      "limitationsOrGaps": string
    }
  ],
  "comparativeMatrix": {
    "dimensions": ["Methodological Approach", "Dataset / Sample", "Key Advantage", "Critical Limitation"],
    "studyComparisons": [
      {
        "studyTitle": string,
        "year": string or number,
        "methodology": string,
        "sampleOrData": string,
        "keyAdvantage": string,
        "limitation": string
      }
    ]
  },
  "similarities": string[],
  "differences": string[],
  "overallGaps": string[]
}
`;

    const litResp = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: litPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });
    const literature: LiteratureReviewData = parseJsonFromText(litResp.text || '{}');
    literature.searchGrounded = realGroundingUrls.length > 0;
    literature.groundingSourcesCount = realGroundingUrls.length;

    // 3. Full Paper
    const paperPrompt = `
Draft the full 12-section research paper:
TOPIC: "${topicInput.topic}"
FIELD: "${topicInput.field}"
LEVEL: "${topicInput.academicLevel}"
METHODOLOGY: "${topicInput.methodologyPreference}"
PRIMARY QUESTION: "${analysis.primaryResearchQuestion}"
STUDIES: ${JSON.stringify(literature.studies?.map((s) => ({ title: s.title, authors: s.authors, year: s.year, url: s.url })) || [])}

Include all 12 sections: Title, Abstract, Keywords, Introduction, Problem Statement, Literature Review, Research Objectives, Methodology, Results and Discussion (with disclaimer and keyMetrics array), Conclusion, Future Scope, References (with APA, IEEE, MLA, BibTeX).

Return ONLY JSON:
{
  "title": string,
  "abstract": string,
  "keywords": string[],
  "introduction": string,
  "problemStatement": string,
  "literatureReview": string,
  "researchObjectives": string,
  "methodology": string,
  "resultsAndDiscussion": {
    "content": string,
    "isHypothetical": true,
    "disclaimer": string,
    "keyMetrics": [
      { "label": string, "value": string, "explanation": string }
    ]
  },
  "conclusion": string,
  "futureScope": string,
  "references": [
    {
      "id": string,
      "authors": string[],
      "title": string,
      "journalOrConference": string,
      "year": number or string,
      "volumeIssuePages": string,
      "doiOrUrl": string,
      "isVerified": boolean,
      "verificationSource": string,
      "citationApa": string,
      "citationIeee": string,
      "citationMla": string,
      "bibtex": string
    }
  ]
}
`;

    const paperResp = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: paperPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });
    const paper: ResearchPaper = parseJsonFromText(paperResp.text || '{}');

    const project: ResearchProject = {
      id: 'proj_' + Date.now(),
      timestamp: Date.now(),
      topicInput,
      analysis,
      literature,
      paper,
    };

    res.json({ success: true, project });
  } catch (error: any) {
    console.error('Error in full-pipeline:', error);
    res.status(500).json({
      error: error.message || 'Failed to complete research pipeline.',
      details: error.toString(),
    });
  }
});

// Vite Middleware Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Research Paper Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
