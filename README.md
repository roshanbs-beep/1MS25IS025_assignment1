# AI Academic Research Paper Agent

An intelligent, autonomous scholarly research assistant built with **React 19**, **Node.js (Express)**, and the **Google Gemini API (`@google/genai`)**. 

Designed for university researchers, graduate students, and scientists to discover, investigate, organize, and synthesize publication-ready academic papers with **real Google Search grounding** and **anti-hallucination citation protocols**.

---

## 🌟 Core Highlights & Capabilities

### 1. Research Topic Input & Scoping
- **Flexible Topic Ingestion:** Enter any hypothesis, research question, or domain challenge.
- **Multidisciplinary Curated Catalog:** Instant-load sample topics across Computer Science & AI, Medicine & Health Sciences, Climate & Environmental Sciences, Economics & Finance, Cognitive Psychology, and Quantum Materials.
- **Parametric Customization:** Select target scholarly level (*Undergraduate*, *Master's*, *Doctoral / Postdoc*) and methodology orientation (*Mixed Methods*, *Quantitative / Empirical*, *Qualitative / Case Study*, *Computational / Simulation*).

### 2. Autonomous Research Assistant
- **Topic Decomposition:** Formulates the overarching Primary Research Question (PRQ) and 3–4 granular secondary sub-questions.
- **Objective Definition:** Establishes overarching primary aims and numbered SMART sub-objectives.
- **Literature Gap Identification:** Explicitly detects unresolved bottlenecks and missing paradigms in the current body of work.
- **Methodological Blueprint:** Provides recommended methodological frameworks, dataset acquisition/sampling strategies, recommended computational toolkits, and feasibility/ethics guidelines.

### 3. Factual Literature Review & Comparative Matrix
- **Real Google Search Grounding:** Queries real-world scholarly repositories, preprint servers, and academic databases via Gemini API search grounding.
- **Anti-Hallucination Integrity:** Never fabricates papers or authors. Every grounded reference links to verifiable online sources and DOI destinations.
- **Comparative Studies Matrix:** Structured cross-study comparison evaluating Methodological Approach, Dataset/Sample Size, Key Advantages, and Critical Limitations.
- **Synthesis Dimensions:** Highlights converging findings across studies, methodological divergences, and unaddressed frontiers.
- **Unverified Fallback Warning:** Transparently informs users if a query is theoretical or lacks live search grounding.

### 4. Full 12-Section Academic Paper Generator
Generates publication-structured manuscripts adhering strictly to international academic standards:
1. **Title**
2. **Abstract** (~200–250 words structured with context, problem, methodology, findings, and significance)
3. **Keywords** (5–8 standardized indexing terms)
4. **Introduction** (Theoretical foundation, motivation, and structural roadmap)
5. **Problem Statement** (Formal mathematical or conceptual bottleneck formulation)
6. **Literature Review** (Thematic synthesis with inline references)
7. **Research Objectives** (Primary and SMART secondary goals)
8. **Methodology** (Protocol, data collection framework, and validation criteria)
9. **Results & Discussion** (Featuring an unmistakable **Preliminary / Simulated Validation Disclosure Notice** badge, accompanied by benchmark metric cards)
10. **Conclusion** (Comprehensive synthesis addressing the primary research question)
11. **Future Scope** (Scalability pathways and cross-disciplinary extensions)
12. **References** (Fully formatted academic references)

### 5. Multi-Style Citation Generator
- **Instant Style Toggling:** Switch seamlessly between **APA (7th Edition)**, **IEEE Numeric**, and **MLA (9th Edition)**.
- **LaTeX Integration:** Generates standard **BibTeX (`.bib`)** entries ready for Overleaf and LaTeX documents.
- **Verification Badging:** Distinguishes verified search-grounded citations from suggested literature avenues.
- **Direct Source Links:** Clickable external links to original papers and preprints.

### 6. Export & Archival
- **Download as Plain Text (`.txt`):** Submission-ready formatted ASCII manuscript.
- **Download as Markdown (`.md`):** Formatted for GitHub, Obsidian, and Notion with markdown tables.
- **Export Full Research Data (`.json`):** Complete structured JSON payload containing all questions, objectives, matrix, paper sections, and groundings.
- **Print / PDF Formatted View:** Academic print styling hiding UI controls and formatting margins for paper/PDF export.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend:** Node.js, Express 4, TypeScript via `tsx`.
- **AI Engine:** Google Gemini API (`@google/genai` SDK, model: `gemini-3.8-flash`) with Google Search Grounding.
- **Security:** Secure server-side API proxying (`/api/research/*`); `GEMINI_API_KEY` is never exposed to the client bundle.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (version 20 or higher recommended)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Step 1: Clone Repository
```bash
git clone https://github.com/<your-username>/ai-research-paper-agent.git
cd ai-research-paper-agent
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
```

### Step 4: Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📤 How to Deploy & Upload to GitHub

Follow these steps to upload this project to your GitHub account:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "feat: complete AI Academic Research Paper Agent"

# 4. Set main branch
git branch -M main

# 5. Link your remote GitHub repository
git remote add origin https://github.com/<your-username>/ai-research-paper-agent.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 🎓 College Assignment Demonstration Guide

When presenting this project for an evaluation, showcase these key differentiators:

1. **Anti-Hallucination Grounding:** Open the **Literature Review** tab and demonstrate the real URLs and search-grounding badges retrieved via Gemini's Google Search tool.
2. **Transparent Agent Specification:** Click the **Agent Spec** button in the header to show evaluators `research_agent_config.json` and `research_agent_prompt.txt` directly inside the app.
3. **Ethical Scientific Disclosure:** Navigate to **Section 6 (Results and Discussion)** to highlight the automated disclaimer warning reviewers that findings reflect simulated or proposed experimental validation rather than unverified empirical trial data.
4. **Interactive Citation Formatter:** Toggle between APA, IEEE, and MLA formats to demonstrate automated citation formatting and BibTeX export.
5. **Session Persistence:** Show that generated projects are preserved in the sidebar's **Research History**, allowing multiple topics to be investigated and retrieved.

---

## 📄 License
Apache-2.0
