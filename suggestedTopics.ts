import { SuggestedTopic } from '../types/research.ts';

export const ACADEMIC_FIELDS = [
  'Computer Science & AI',
  'Medicine & Health Sciences',
  'Climate & Environmental Science',
  'Economics & Financial Systems',
  'Cognitive Psychology & Neuroscience',
  'Quantum Physics & Materials Science',
  'Educational Technology & Pedagogy',
];

export const SUGGESTED_TOPICS: SuggestedTopic[] = [
  {
    field: 'Computer Science & AI',
    topic: 'Mitigating Hallucinations in Multi-Agent Large Language Models Using Graph-Based Grounding',
    description: 'Investigating structural retrieval and knowledge graphs to enforce verifiable truthfulness in collaborative LLM workflows.',
    level: 'Master',
  },
  {
    field: 'Computer Science & AI',
    topic: 'Differential Privacy Guarantees in Federated Learning for Edge Medical Diagnostics',
    description: 'Analyzing trade-offs between gradient noise addition and diagnostic classification accuracy across distributed clinical nodes.',
    level: 'Doctoral / Postdoc',
  },
  {
    field: 'Medicine & Health Sciences',
    topic: 'CRISPR-Cas9 Off-Target Mutation Reduction via Machine-Learned Guide RNA Optimization',
    description: 'Assessing algorithmic sequence predictors to minimize non-specific cleavage in therapeutic gene editing.',
    level: 'Doctoral / Postdoc',
  },
  {
    field: 'Medicine & Health Sciences',
    topic: 'Telemedicine Interventions in Rural Geriatric Chronic Care: Longitudinal Patient Outcome Analysis',
    description: 'Evaluating hospital readmission rates, cost-effectiveness, and patient compliance across remote monitoring cohorts.',
    level: 'Undergraduate',
  },
  {
    field: 'Climate & Environmental Science',
    topic: 'Direct Air Carbon Capture Scalability Using Metal-Organic Frameworks (MOFs)',
    description: 'Comparative thermodynamic efficiency and energy recovery metrics of emerging solid-sorbent MOFs vs amine solutions.',
    level: 'Master',
  },
  {
    field: 'Climate & Environmental Science',
    topic: 'Urban Heat Island Mitigation Through High-Albedo Retrofits and Pocket Green Infrastructure',
    description: 'Micrometeorological sensor modeling of ambient surface cooling in high-density metropolitan zones.',
    level: 'Undergraduate',
  },
  {
    field: 'Economics & Financial Systems',
    topic: 'Central Bank Digital Currencies (CBDCs) and Macro-Financial Transmission Channels',
    description: 'Theoretical and empirical modeling of commercial banking disintermediation and systemic liquidity during monetary shocks.',
    level: 'Master',
  },
  {
    field: 'Cognitive Psychology & Neuroscience',
    topic: 'Neural Correlates of Working Memory Degradation in Chronic Smartphone Multitasking',
    description: 'fMRI and EEG event-related potential analysis of prefrontal cortex executive control under persistent digital distraction.',
    level: 'Master',
  },
  {
    field: 'Quantum Physics & Materials Science',
    topic: 'Topological Insulator Superlattices for Room-Temperature Quantum Computing Interconnects',
    description: 'Exploration of dissipationless edge state transport and spin-orbit torque coherence times in 2D heterostructures.',
    level: 'Doctoral / Postdoc',
  },
];
