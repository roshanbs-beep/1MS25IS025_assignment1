export interface ResearchTopicInput {
  topic: string;
  field: string;
  academicLevel: 'Undergraduate' | 'Master' | 'Doctoral / Postdoc';
  methodologyPreference: 'Mixed Methods' | 'Quantitative / Empirical' | 'Qualitative / Case Study' | 'Computational / Simulation';
  targetLength?: 'Brief Paper (~1,500 words)' | 'Standard Research Paper (~3,000 words)' | 'Comprehensive Study (~4,500 words)';
}

export interface SuggestedTopic {
  field: string;
  topic: string;
  description: string;
  level: string;
}

export interface TopicAnalysis {
  mainTopic: string;
  field: string;
  backgroundSummary: string;
  primaryResearchQuestion: string;
  secondaryQuestions: string[];
  primaryObjective: string;
  specificObjectives: string[];
  identifiedGaps: string[];
  suggestedMethodology: {
    approach: string;
    dataStrategy: string;
    toolkits: string[];
    feasibilityNotes: string;
  };
}

export interface LiteratureStudy {
  id: string;
  title: string;
  authors: string[];
  year: number | string;
  publicationOrSource: string;
  url?: string;
  verified: boolean;
  coreContribution: string;
  methodology: string;
  keyFindings: string;
  limitationsOrGaps: string;
}

export interface LiteratureReviewData {
  searchQueriesUsed: string[];
  searchGrounded: boolean;
  groundingSourcesCount: number;
  summary: string;
  studies: LiteratureStudy[];
  comparativeMatrix: {
    dimensions: string[];
    studyComparisons: Array<{
      studyTitle: string;
      year: string | number;
      methodology: string;
      sampleOrData: string;
      keyAdvantage: string;
      limitation: string;
    }>;
  };
  similarities: string[];
  differences: string[];
  overallGaps: string[];
}

export interface CitationItem {
  id: string;
  authors: string[];
  title: string;
  journalOrConference: string;
  year: number | string;
  volumeIssuePages?: string;
  doiOrUrl?: string;
  isVerified: boolean;
  verificationSource?: string;
  citationApa: string;
  citationIeee: string;
  citationMla: string;
  bibtex: string;
}

export interface ResearchPaper {
  title: string;
  abstract: string;
  keywords: string[];
  introduction: string;
  problemStatement: string;
  literatureReview: string;
  researchObjectives: string;
  methodology: string;
  resultsAndDiscussion: {
    content: string;
    isHypothetical: boolean;
    disclaimer: string;
    keyMetrics?: Array<{ label: string; value: string; explanation: string }>;
  };
  conclusion: string;
  futureScope: string;
  references: CitationItem[];
}

export interface ResearchProject {
  id: string;
  timestamp: number;
  topicInput: ResearchTopicInput;
  analysis: TopicAnalysis;
  literature: LiteratureReviewData;
  paper: ResearchPaper;
}

export type CitationFormat = 'APA' | 'IEEE' | 'MLA';

export type PipelineStep =
  | 'idle'
  | 'analyzing_topic'
  | 'searching_literature'
  | 'synthesizing_paper'
  | 'formatting_citations'
  | 'complete'
  | 'error';
