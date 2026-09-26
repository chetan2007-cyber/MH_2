// Centralized Multi-Career Domain and Profession Taxonomy for Kaushal
// "Don't claim your skills. Prove them."

export interface CareerSubBranch {
  name: string;
  professions: string[];
}

export interface CareerDomain {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  icon?: string;
  color: string;
  gradient: string;
  professions: string[];
  subBranches?: CareerSubBranch[];
}

export interface ReviewCriterion {
  id: string;
  label: string;
  description: string;
  maxScore: number;
}

export interface CareerCapability {
  label: string;
  score: number;
  color: string;
}

export interface CareerProofItem {
  type: string;
  label: string;
  description: string;
  iconType: string;
}

export interface CareerChallenge {
  id: string | number;
  title: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  diffColor: string;
  tools: string[];
  effort: string;
  proves: string[];
  verifiedBy: number;
  featured?: boolean;
  progress?: number;
  scenario?: string;
  constraints?: string[];
  deliverables?: string[];
}

export interface GraphNodeConfig {
  id: string;
  label: string;
  sublabel?: string;
  type: 'CAPABILITY' | 'PROJECT' | 'ADR' | 'REVIEW' | 'TEST' | 'DEFENSE';
  score?: number;
  x: number;
  y: number;
  color: string;
  evidenceItems: string[];
}

export interface GraphEdgeConfig {
  from: string;
  to: string;
}

export interface ProfessionConfig {
  id: string;
  name: string;
  domainId: string;
  domainName: string;
  tagline: string;
  description: string;
  primaryProofMetric: string;
  proofTypes: CareerProofItem[];
  capabilities: CareerCapability[];
  reviewCriteria: ReviewCriterion[];
  challenges: CareerChallenge[];
  proofGraphNodes: GraphNodeConfig[];
  proofGraphEdges: GraphEdgeConfig[];
  defensePrompt: {
    question: string;
    sampleAnswer: string;
    reviewerFocus: string;
  };
}

export const CAREER_DOMAINS: CareerDomain[] = [
  {
    id: 'technology',
    name: 'Technology',
    tagline: 'Code, Architecture & Infrastructure',
    description: 'Prove engineering capability with live repositories, ADRs, test suites, and defense rounds.',
    iconName: 'Code',
    color: '#4f46e5',
    gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    professions: [
      'Software Developer',
      'Web Developer',
      'Data Analyst',
      'UI/UX Designer',
      'QA Tester',
      'Cybersecurity Analyst',
      'Cloud Engineer',
    ],
  },
  {
    id: 'finance',
    name: 'Finance & Banking',
    tagline: 'Financial Models, Audit & Risk',
    description: 'Prove analytical rigor with spreadsheets, ledger reconciliations, DCF models, and audit papers.',
    iconName: 'TrendingUp',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #10b981)',
    professions: [
      'Accountant',
      'Financial Analyst',
      'Banking Executive',
      'Investment Analyst',
      'Credit Analyst',
      'Audit Associate',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing & Sales',
    tagline: 'Growth, Strategy & Conversions',
    description: 'Prove revenue impact with campaign architectures, SEO audits, pitch decks, and attribution models.',
    iconName: 'Megaphone',
    color: '#ea580c',
    gradient: 'linear-gradient(135deg, #ea580c, #f97316)',
    professions: [
      'Digital Marketing Executive',
      'Sales Executive',
      'Marketing Analyst',
      'SEO Specialist',
      'Content Strategist',
      'Social Media Manager',
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    tagline: 'Visual Design, Motion & Audio',
    description: 'Show the work behind your creativity — raw files, creative briefs, iteration logs, and design defense.',
    iconName: 'Palette',
    color: '#db2777',
    gradient: 'linear-gradient(135deg, #db2777, #f43f5e)',
    professions: [
      'Graphic Designer',
      'Video Editor',
      'Photographer',
      'Animator',
      'Musician',
      'Content Creator',
    ],
  },
  {
    id: 'hr',
    name: 'HR & Administration',
    tagline: 'People, Operations & Talent',
    description: 'Prove organizational impact with hiring frameworks, employee retention models, and workflow designs.',
    iconName: 'Users',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    professions: [
      'HR Executive',
      'Recruitment Specialist',
      'HR Analyst',
      'Operations Executive',
      'Administrative Assistant',
    ],
  },
  {
    id: 'education',
    name: 'Education',
    tagline: 'Pedagogy, Curriculum & Training',
    description: 'Prove instructional excellence through lesson designs, live demonstrations, and rubric assessments.',
    iconName: 'GraduationCap',
    color: '#0284c7',
    gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    professions: [
      'Teacher',
      'Trainer',
      'Subject Matter Expert',
      'Academic Counsellor',
    ],
  },
  {
    id: 'engineering_core',
    name: 'Engineering / Core',
    tagline: 'Physical Systems, CAD, Electronics & Materials',
    description: 'Prove physical engineering with 3D CAD models, tolerance calculations, schematics, FEA simulations, and test bench verification.',
    iconName: 'Cpu',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
    subBranches: [
      {
        name: 'Mechanical',
        professions: [
          'Mechanical Engineer',
          'Design Engineer',
          'Manufacturing Engineer',
          'Automotive Engineer',
          'CAD/CAM Engineer',
        ],
      },
      {
        name: 'Civil',
        professions: [
          'Civil Engineer',
          'Structural Engineer',
          'Site Engineer',
          'Quantity Surveyor',
          'BIM Engineer',
        ],
      },
      {
        name: 'Electrical',
        professions: [
          'Electrical Engineer',
          'Power Systems Engineer',
          'Control Engineer',
          'Power Electronics Engineer',
          'Renewable Energy Engineer',
        ],
      },
      {
        name: 'Electronics & Communication',
        professions: [
          'Electronics Engineer',
          'Embedded Engineer',
          'VLSI Engineer',
          'PCB Design Engineer',
          'Telecommunication Engineer',
        ],
      },
      {
        name: 'Computer Science / IT',
        professions: [
          'Software Engineer',
          'Data Analyst',
          'AI/ML Engineer',
          'Cybersecurity Engineer',
          'Cloud Engineer',
        ],
      },
      {
        name: 'Mechatronics / Robotics',
        professions: [
          'Robotics Engineer',
          'Mechatronics Engineer',
          'Automation Engineer',
          'PLC Engineer',
          'Control Systems Engineer',
        ],
      },
      {
        name: 'Chemical',
        professions: [
          'Chemical Engineer',
          'Process Engineer',
          'Plant Engineer',
          'Quality Engineer',
          'Safety Engineer',
        ],
      },
      {
        name: 'Biotechnology / Biomedical',
        professions: [
          'Biomedical Engineer',
          'Bioprocess Engineer',
          'Bioinformatics Analyst',
          'Medical Device Engineer',
          'Clinical Research Associate',
        ],
      },
      {
        name: 'Aerospace',
        professions: [
          'Aerospace Engineer',
          'Aerodynamics Engineer',
          'Propulsion Engineer',
          'Avionics Engineer',
          'Aircraft Design Engineer',
        ],
      },
      {
        name: 'Automobile',
        professions: [
          'Automotive Engineer',
          'EV Engineer',
          'Battery Engineer',
          'Vehicle Dynamics Engineer',
          'Automotive Testing Engineer',
        ],
      },
      {
        name: 'Metallurgy / Materials',
        professions: [
          'Materials Engineer',
          'Metallurgical Engineer',
          'Welding Engineer',
          'Corrosion Engineer',
          'Materials Testing Engineer',
        ],
      },
    ],
    professions: [
      'Mechanical Engineer',
      'Design Engineer',
      'Manufacturing Engineer',
      'Automotive Engineer',
      'CAD/CAM Engineer',
      'Civil Engineer',
      'Structural Engineer',
      'Site Engineer',
      'Quantity Surveyor',
      'BIM Engineer',
      'Electrical Engineer',
      'Power Systems Engineer',
      'Control Engineer',
      'Power Electronics Engineer',
      'Renewable Energy Engineer',
      'Electronics Engineer',
      'Embedded Engineer',
      'VLSI Engineer',
      'PCB Design Engineer',
      'Telecommunication Engineer',
      'Software Engineer',
      'Data Analyst',
      'AI/ML Engineer',
      'Cybersecurity Engineer',
      'Cloud Engineer',
      'Robotics Engineer',
      'Mechatronics Engineer',
      'Automation Engineer',
      'PLC Engineer',
      'Control Systems Engineer',
      'Chemical Engineer',
      'Process Engineer',
      'Plant Engineer',
      'Quality Engineer',
      'Safety Engineer',
      'Biomedical Engineer',
      'Bioprocess Engineer',
      'Bioinformatics Analyst',
      'Medical Device Engineer',
      'Clinical Research Associate',
      'Aerospace Engineer',
      'Aerodynamics Engineer',
      'Propulsion Engineer',
      'Avionics Engineer',
      'Aircraft Design Engineer',
      'EV Engineer',
      'Battery Engineer',
      'Vehicle Dynamics Engineer',
      'Automotive Testing Engineer',
      'Materials Engineer',
      'Metallurgical Engineer',
      'Welding Engineer',
      'Corrosion Engineer',
      'Materials Testing Engineer',
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare / Life Sciences',
    tagline: 'Clinical, Protocol & Lab Analytics',
    description: 'Prove clinical rigor with protocol reviews, lab data validations, compliance audits, and patient workflows.',
    iconName: 'Activity',
    color: '#0d9488',
    gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)',
    professions: [
      'Lab Assistant',
      'Clinical Research Associate',
      'Medical Administrator',
      'Healthcare Operations',
    ],
  },
];

// Map of detailed profession configurations
export const PROFESSION_CONFIGS: Record<string, ProfessionConfig> = {
  // ── 1. SOFTWARE DEVELOPER ──
  'Software Developer': {
    id: 'software-developer',
    name: 'Software Developer',
    domainId: 'technology',
    domainName: 'Technology',
    tagline: 'Build fault-tolerant, scalable backend systems and distributed services.',
    description: 'Demonstrate architectural rigor through real code, container benchmarks, ADR documentation, and live defense.',
    primaryProofMetric: 'Verified Repositories & ADRs',
    proofTypes: [
      { type: 'repository', label: 'Connected Git Repository', description: 'Clean, idiomatic production codebase with history', iconType: 'GitCommit' },
      { type: 'architecture', label: 'Architecture & Boundary Log', description: 'System topology, data flow, and trade-offs', iconType: 'Layers' },
      { type: 'adr', label: 'Architectural Decision Records', description: 'Context, chosen solution, and rejected alternatives', iconType: 'FileText' },
      { type: 'tests', label: 'Hermetic Container Tests', description: 'Edge case suites and automated fuzzing runs', iconType: 'Shield' },
      { type: 'defense', label: 'AST Defense Round', description: 'Live architectural cross-examination response', iconType: 'CheckCircle2' },
    ],
    capabilities: [
      { label: 'Backend Arch', score: 88, color: '#4f46e5' },
      { label: 'Concurrency', score: 92, color: '#7c3aed' },
      { label: 'Testing Suite', score: 95, color: '#059669' },
      { label: 'Database / CAS', score: 84, color: '#0284c7' },
      { label: 'Security Auth', score: 78, color: '#d97706' },
      { label: 'Problem Solving', score: 89, color: '#e11d48' },
    ],
    reviewCriteria: [
      { id: 'correctness', label: 'Correctness & Invariants', description: 'Does the code maintain zero-overselling and correct state under load?', maxScore: 5 },
      { id: 'architecture', label: 'System Architecture', description: 'Are boundaries, queue decoupling, and caching cleanly isolated?', maxScore: 5 },
      { id: 'code_quality', label: 'Code Quality & Cleanliness', description: 'Is the code idiomatic, modular, and easy to maintain?', maxScore: 5 },
      { id: 'testing', label: 'Testing & Coverage', description: 'Do tests cover packet drops, connection timeouts, and race conditions?', maxScore: 5 },
      { id: 'security', label: 'Security & Idempotency', description: 'Are token lifecycles and replay protections enforced?', maxScore: 5 },
      { id: 'performance', label: 'P99 Latency & Memory', description: 'Does the system achieve target throughput with bounded RAM?', maxScore: 5 },
      { id: 'reasoning', label: 'Engineering Reasoning (ADR)', description: 'Are architectural trade-offs deeply reasoned and justified?', maxScore: 5 },
    ],
    challenges: [
      {
        id: 'tech-01',
        title: 'High-Concurrency Ticket Booking API',
        tagline: 'Build a production-grade reservation service that prevents overselling under flash contention.',
        difficulty: 'Advanced',
        diffColor: '#4f46e5',
        tools: ['Go', 'Redis', 'PostgreSQL', 'gRPC'],
        effort: '8–12 hours',
        proves: ['Backend Architecture', 'Concurrency Control', 'Atomic CAS Decrement'],
        verifiedBy: 142,
        featured: true,
        progress: 72,
        scenario: '25,000 requests/second competing for 100 inventory seats with zero deadlocks allowed.',
        constraints: ['P99 latency < 10ms', 'Single-threaded CAS buffer', 'Zero DB row lock exhaustion'],
        deliverables: ['Working Gateway API', 'ADR-001 on Redis Lua vs PG Advisory Locks', '24 Container Tests', 'AST Defense Submission'],
      },
      {
        id: 'tech-02',
        title: 'Real-Time Collaboration Engine',
        tagline: 'Implement a WebSocket-based operational-transform engine for concurrent document editing.',
        difficulty: 'Expert',
        diffColor: '#7c3aed',
        tools: ['Node.js', 'WebSockets', 'Redis', 'TypeScript'],
        effort: '12–16 hours',
        proves: ['Distributed State', 'Conflict Resolution', 'WebSocket Scalability'],
        verifiedBy: 68,
        featured: true,
        progress: 18,
      },
      {
        id: 'tech-03',
        title: 'Distributed Rate Limiter',
        tagline: 'Cluster-aware sliding-window rate limiter with per-tenant quotas and Redis Lua scripts.',
        difficulty: 'Intermediate',
        diffColor: '#0284c7',
        tools: ['Rust', 'Redis', 'gRPC'],
        effort: '6–9 hours',
        proves: ['Rate Limiting Algorithms', 'Redis Scripting', 'API Design'],
        verifiedBy: 95,
        progress: 0,
      },
    ],
    proofGraphNodes: [
      { id: 'cap-backend', label: 'Backend Architecture', sublabel: 'Score: 88', type: 'CAPABILITY', score: 88, x: 420, y: 80, color: '#4f46e5', evidenceItems: ['3 verified microservice projects', '7 expert code reviews (avg 8.9/10)', '14 ADRs accepted'] },
      { id: 'cap-testing', label: 'Hermetic Testing', sublabel: 'Score: 95', type: 'CAPABILITY', score: 95, x: 720, y: 200, color: '#4f46e5', evidenceItems: ['24/24 edge-case container test suites', 'Zero race conditions under 50k workers'] },
      { id: 'cap-arch', label: 'System Design', sublabel: 'Score: 84', type: 'CAPABILITY', score: 84, x: 120, y: 200, color: '#4f46e5', evidenceItems: ['P99 bounded latency design', 'Event-driven WAL queue settlement'] },
      { id: 'proj-ticket', label: 'Ticket Booking API', sublabel: 'Verified · Advanced', type: 'PROJECT', x: 300, y: 240, color: '#0284c7', evidenceItems: ['P99 2.3ms under 22k req/sec', 'Zero overselling across 50k parallel workers'] },
      { id: 'adr-redis', label: 'ADR-001: Redis CAS', sublabel: 'Accepted', type: 'ADR', x: 200, y: 380, color: '#7c3aed', evidenceItems: ['Evaluated row locks vs Redis DECR', 'Avoided connection pool starvation'] },
      { id: 'review-01', label: 'Expert Review #1', sublabel: '9.2/10 · Dr. Malhotra', type: 'REVIEW', x: 640, y: 360, color: '#059669', evidenceItems: ['Code Cleanliness: 9.5/10', 'Architectural Boundaries: 9/10'] },
      { id: 'test-suite', label: '24/24 Tests Passing', sublabel: 'Hermetic Sandbox', type: 'TEST', x: 620, y: 480, color: '#10b981', evidenceItems: ['Fuzz test passed', 'Graceful Redis disconnect resilience'] },
      { id: 'defense-01', label: 'Defense Round', sublabel: 'Passed · Strong', type: 'DEFENSE', x: 250, y: 500, color: '#d97706', evidenceItems: ['Defended Little\'s Law derivation', 'Handled live simulated packet drops'] },
    ],
    proofGraphEdges: [
      { from: 'cap-backend', to: 'proj-ticket' },
      { from: 'cap-arch', to: 'adr-redis' },
      { from: 'proj-ticket', to: 'adr-redis' },
      { from: 'proj-ticket', to: 'defense-01' },
      { from: 'proj-ticket', to: 'review-01' },
      { from: 'proj-ticket', to: 'test-suite' },
      { from: 'cap-testing', to: 'test-suite' },
    ],
    defensePrompt: {
      question: 'Why did you choose Redis atomic DECR instead of PostgreSQL SELECT FOR UPDATE row locks for inventory decrement?',
      sampleAnswer: 'PostgreSQL row locks under high contention cause thread pool starvation and latency spikes above 40ms. Redis DECR executes in memory with O(1) time complexity (0.4ms P99) while durable settlement is safely deferred to background WAL workers.',
      reviewerFocus: 'Evaluate concurrency reasoning, DB connection pool mechanics, and data consistency trade-offs.',
    },
  },

  // ── 2. GRAPHIC DESIGNER ──
  'Graphic Designer': {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    domainId: 'creative',
    domainName: 'Creative',
    tagline: 'Craft distinctive visual identities, design systems, and brand narratives.',
    description: 'Prove visual excellence through layered source files, mood boards, design system tokens, and design defense rationale.',
    primaryProofMetric: 'Verified Brand Systems & Vector Assets',
    proofTypes: [
      { type: 'portfolio', label: 'Original Source Files (.fig, .ai, .psd)', description: 'Layered, non-flattened production assets', iconType: 'Palette' },
      { type: 'brief', label: 'Creative Brief & Persona Mapping', description: 'Audience analysis and strategic positioning', iconType: 'FileText' },
      { type: 'process', label: 'Iteration & Exploration Logs', description: 'Early sketches, rejected directions, and typography tests', iconType: 'Layers' },
      { type: 'guidelines', label: 'Brand Guidelines & Design Tokens', description: 'Color contrast ratios, grid systems, and typography rules', iconType: 'Shield' },
      { type: 'defense', label: 'Creative Rationale Defense', description: 'Defending aesthetic choices against commercial goals', iconType: 'CheckCircle2' },
    ],
    capabilities: [
      { label: 'Visual Hierarchy', score: 94, color: '#db2777' },
      { label: 'Typography', score: 91, color: '#4f46e5' },
      { label: 'Brand Identity', score: 88, color: '#7c3aed' },
      { label: 'Color Theory', score: 96, color: '#059669' },
      { label: 'Design Systems', score: 82, color: '#0284c7' },
      { label: 'Creative Rationale', score: 90, color: '#e11d48' },
    ],
    reviewCriteria: [
      { id: 'craft', label: 'Craft & Execution Quality', description: 'Are vector curves, kerning, and layout geometry pixel-perfect?', maxScore: 5 },
      { id: 'originality', label: 'Originality & Distinction', description: 'Does the visual identity stand out without relying on generic stock motifs?', maxScore: 5 },
      { id: 'typography', label: 'Typography & Hierarchy', description: 'Are type pairings balanced, readable, and appropriately expressive?', maxScore: 5 },
      { id: 'process', label: 'Process & Iteration Depth', description: 'Does the iteration record show structured creative exploration?', maxScore: 5 },
      { id: 'brief_alignment', label: 'Strategic Brief Alignment', description: 'Does the design directly address the client\'s market position?', maxScore: 5 },
      { id: 'systems_thinking', label: 'Design Systems & Scalability', description: 'Can this identity cleanly scale across digital, print, and physical formats?', maxScore: 5 },
      { id: 'creative_reasoning', label: 'Creative Defense Rationale', description: 'Does the designer clearly explain the intent behind every choice?', maxScore: 5 },
    ],
    challenges: [
      {
        id: 'creat-01',
        title: 'Visual Identity for an Artisanal Coffee Roastery',
        tagline: 'Create a complete brand identity including logo mark, color system, typography, and packaging system.',
        difficulty: 'Advanced',
        diffColor: '#db2777',
        tools: ['Figma', 'Illustrator', 'Photoshop', 'Typography'],
        effort: '8–10 hours',
        proves: ['Visual Hierarchy', 'Brand Strategy', 'Packaging Geometry', 'Design Rationale'],
        verifiedBy: 94,
        featured: true,
        progress: 80,
        scenario: 'A single-origin roastery expanding into retail needs a timeless identity combining craft heritage with modern minimalism.',
        constraints: ['Max 3 spot colors on unbleached kraft paper', 'WCAG AA contrast on web assets', 'Scalable down to 16px favicon'],
        deliverables: ['Vector Logo Suite', 'Brand Guidelines (PDF)', 'Layered Packaging Mockup', 'Creative Defense Document'],
      },
      {
        id: 'creat-02',
        title: 'Design System for a Fintech Mobile App',
        tagline: 'Build a comprehensive tokenized UI kit with accessible dark and light modes.',
        difficulty: 'Expert',
        diffColor: '#7c3aed',
        tools: ['Figma', 'Design Tokens', 'Auto-Layout'],
        effort: '10–14 hours',
        proves: ['Design Systems', 'Micro-interactions', 'Accessibility'],
        verifiedBy: 52,
        progress: 30,
      },
      {
        id: 'creat-03',
        title: 'Editorial Poster Series for an Architecture Biennial',
        tagline: 'Create 3 large-format typographic posters celebrating brutalist architecture.',
        difficulty: 'Intermediate',
        diffColor: '#0284c7',
        tools: ['InDesign', 'Illustrator'],
        effort: '5–7 hours',
        proves: ['Grid Systems', 'Experimental Typography'],
        verifiedBy: 81,
        progress: 0,
      },
    ],
    proofGraphNodes: [
      { id: 'cap-vis', label: 'Visual Hierarchy', sublabel: 'Score: 94', type: 'CAPABILITY', score: 94, x: 420, y: 80, color: '#db2777', evidenceItems: ['Artisanal Roastery Brand Suite', '4 client feedback verifications', 'Packaging design audit: 9.6/10'] },
      { id: 'cap-typo', label: 'Typography & Systems', sublabel: 'Score: 91', type: 'CAPABILITY', score: 91, x: 720, y: 200, color: '#4f46e5', evidenceItems: ['Custom font pairing guidelines', 'Modular scale ratio 1.25 analysis'] },
      { id: 'cap-brand', label: 'Brand Narrative', sublabel: 'Score: 88', type: 'CAPABILITY', score: 88, x: 120, y: 200, color: '#7c3aed', evidenceItems: ['Positioning matrix for retail packaging', 'Color psychology brief'] },
      { id: 'proj-roastery', label: 'Roastery Brand Suite', sublabel: 'Verified · Advanced', type: 'PROJECT', x: 300, y: 240, color: '#0284c7', evidenceItems: ['12 vector marks with grid specs', 'Die-cut packaging template with bleed lines'] },
      { id: 'adr-colors', label: 'Decision: Warm Ochre Palette', sublabel: 'Documented', type: 'ADR', x: 200, y: 380, color: '#7c3aed', evidenceItems: ['Tested 5 earth-tone palettes on kraft stock', 'Selected Ochre #D97706 for organic warmth'] },
      { id: 'review-01', label: 'Design Review #1', sublabel: '9.4/10 · Creative Dir. Ray', type: 'REVIEW', x: 640, y: 360, color: '#059669', evidenceItems: ['Kerning precision: 10/10', 'Packaging feasibility: 9/10'] },
      { id: 'test-suite', label: 'Accessibility & Contrast Audit', sublabel: 'WCAG AAA Passed', type: 'TEST', x: 620, y: 480, color: '#10b981', evidenceItems: ['Contrast ratio 7.4:1 on all text', 'Readability verified across 4 screen sizes'] },
      { id: 'defense-01', label: 'Creative Defense', sublabel: 'Passed · High Clarity', type: 'DEFENSE', x: 250, y: 500, color: '#d97706', evidenceItems: ['Explained serif selection over neo-grotesque', 'Defended asymmetrical layout under pressure'] },
    ],
    proofGraphEdges: [
      { from: 'cap-vis', to: 'proj-roastery' },
      { from: 'cap-brand', to: 'adr-colors' },
      { from: 'proj-roastery', to: 'adr-colors' },
      { from: 'proj-roastery', to: 'defense-01' },
      { from: 'proj-roastery', to: 'review-01' },
      { from: 'proj-roastery', to: 'test-suite' },
      { from: 'cap-typo', to: 'test-suite' },
    ],
    defensePrompt: {
      question: 'Why did you choose an organic serif display face over a modern geometric sans-serif for the primary roastery logo?',
      sampleAnswer: 'A geometric sans would position the brand as a sterile tech commodity. The high-contrast serif with flared terminals conveys craft heritage, tactile roasting temperature traditions, and warmth on physical kraft packaging.',
      reviewerFocus: 'Evaluate strategic brand positioning, typography nuance, and material production reasoning.',
    },
  },

  // ── 3. ACCOUNTANT ──
  'Accountant': {
    id: 'accountant',
    name: 'Accountant',
    domainId: 'finance',
    domainName: 'Finance & Banking',
    tagline: 'Deliver zero-error ledger accounting, tax compliance, and financial analysis.',
    description: 'Prove accounting mastery with reconciled balance sheets, GAAP adjustments, audit trail papers, and risk analyses.',
    primaryProofMetric: 'Reconciled Ledgers & Audit Working Papers',
    proofTypes: [
      { type: 'ledger', label: 'Trial Balance & Reconciled Ledger', description: 'Zero-discrepancy double-entry audit sheet', iconType: 'FileText' },
      { type: 'adjustments', label: 'Period-End Adjustment Memos', description: 'Accruals, prepayments, depreciation schedules', iconType: 'Layers' },
      { type: 'tax', label: 'Tax Computation & Compliance Model', description: 'Statutory calculations with supporting citations', iconType: 'Shield' },
      { type: 'audit', label: 'Audit Working Papers', description: 'Substantive testing work papers and variance notes', iconType: 'CheckCircle2' },
      { type: 'defense', label: 'Accounting Principle Defense', description: 'Explaining GAAP vs IFRS revenue recognition decisions', iconType: 'CheckCircle2' },
    ],
    capabilities: [
      { label: 'GAAP / IFRS', score: 96, color: '#059669' },
      { label: 'Ledger Audit', score: 94, color: '#4f46e5' },
      { label: 'Financial Modeling', score: 86, color: '#7c3aed' },
      { label: 'Tax Compliance', score: 90, color: '#0284c7' },
      { label: 'Variance Analysis', score: 88, color: '#d97706' },
      { label: 'Audit Defense', score: 92, color: '#e11d48' },
    ],
    reviewCriteria: [
      { id: 'accuracy', label: 'Mathematical & Ledger Accuracy', description: 'Are balance sheets balanced with zero unexplained discrepancies?', maxScore: 5 },
      { id: 'methodology', label: 'GAAP/IFRS Methodology', description: 'Are revenue recognition and accrual principles correctly applied?', maxScore: 5 },
      { id: 'audit_trail', label: 'Audit Trail & Documentation', description: 'Is every journal entry traceable with clear source vouchers?', maxScore: 5 },
      { id: 'risk_awareness', label: 'Materiality & Risk Awareness', description: 'Were potential misstatements and internal control gaps identified?', maxScore: 5 },
      { id: 'clarity', label: 'Financial Statement Presentation', description: 'Are schedules formatted clearly for stakeholders and auditors?', maxScore: 5 },
      { id: 'compliance', label: 'Statutory & Tax Compliance', description: 'Are tax withholding and filing treatments compliant with law?', maxScore: 5 },
      { id: 'defense', label: 'Technical Defense & Scenarios', description: 'Can the accountant defend tricky depreciation and impairment choices?', maxScore: 5 },
    ],
    challenges: [
      {
        id: 'fin-01',
        title: 'Identify & Correct Errors in a Complex General Ledger',
        tagline: 'Audit a 500-transaction simulated ledger, detect fraudulent journal entries, and produce adjusted financial statements.',
        difficulty: 'Advanced',
        diffColor: '#059669',
        tools: ['Excel', 'QuickBooks', 'Double-Entry', 'GAAP'],
        effort: '6–8 hours',
        proves: ['Ledger Reconciliation', 'Fraud Detection', 'Accrual Accounting', 'Trial Balance'],
        verifiedBy: 118,
        featured: true,
        progress: 85,
        scenario: 'A manufacturing firm has unrecorded inventory shrinkage, misclassified capex as opex, and duplicate vendor payments.',
        constraints: ['Zero reconciliation tolerance', 'Must provide journal adjusting entries', 'Complete audit memo required'],
        deliverables: ['Corrected Trial Balance', 'Adjusting Journal Entries', 'Variance Analysis Memo', 'Defense Video Explanation'],
      },
      {
        id: 'fin-02',
        title: 'Three-Statement Financial Model & DCF Valuation',
        tagline: 'Build an interconnected 5-year financial model with dynamic sensitivity toggles.',
        difficulty: 'Expert',
        diffColor: '#7c3aed',
        tools: ['Excel', 'Financial Modeling', 'DCF', 'WACC'],
        effort: '8–12 hours',
        proves: ['Financial Modeling', 'Working Capital Forecasting', 'Valuation'],
        verifiedBy: 74,
        progress: 10,
      },
    ],
    proofGraphNodes: [
      { id: 'cap-gaap', label: 'GAAP Accounting', sublabel: 'Score: 96', type: 'CAPABILITY', score: 96, x: 420, y: 80, color: '#059669', evidenceItems: ['500-line General Ledger Audit', '3 statutory compliance memos', 'Zero calculation error record'] },
      { id: 'cap-audit', label: 'Audit Working Papers', sublabel: 'Score: 94', type: 'CAPABILITY', score: 94, x: 720, y: 200, color: '#4f46e5', evidenceItems: ['Substantive testing papers on revenue cut-off', 'Inventory impairment reconciliation'] },
      { id: 'cap-model', label: 'Financial Modeling', sublabel: 'Score: 86', type: 'CAPABILITY', score: 86, x: 120, y: 200, color: '#7c3aed', evidenceItems: ['Three-statement dynamic model', 'Working capital cycle sensitivity analysis'] },
      { id: 'proj-ledger', label: 'General Ledger Audit', sublabel: 'Verified · Advanced', type: 'PROJECT', x: 300, y: 240, color: '#0284c7', evidenceItems: ['Detected $42,000 duplicate vendor invoice', 'Fixed incorrect revenue recognition on deferred contract'] },
      { id: 'adr-depr', label: 'Decision: MACRS vs Straight-Line', sublabel: 'Accepted', type: 'ADR', x: 200, y: 380, color: '#7c3aed', evidenceItems: ['Defended accelerated depreciation for tax shield optimization', 'Documented deferred tax liability'] },
      { id: 'review-01', label: 'CPA Expert Review', sublabel: '9.7/10 · Partner V. Mehta', type: 'REVIEW', x: 640, y: 360, color: '#059669', evidenceItems: ['Technical accuracy: 10/10', 'Working paper structure: 9.5/10'] },
      { id: 'test-suite', label: 'Reconciliation Balance Check', sublabel: 'Zero Discrepancy', type: 'TEST', x: 620, y: 480, color: '#10b981', evidenceItems: ['Debits exactly equal credits across all 18 accounts', 'Bank reconciliation tie-out verified'] },
      { id: 'defense-01', label: 'Defense Round', sublabel: 'Passed · Exceptional', type: 'DEFENSE', x: 250, y: 500, color: '#d97706', evidenceItems: ['Explained ASC 606 5-step model application', 'Defended lease liability amortization schedule'] },
    ],
    proofGraphEdges: [
      { from: 'cap-gaap', to: 'proj-ledger' },
      { from: 'cap-model', to: 'adr-depr' },
      { from: 'proj-ledger', to: 'adr-depr' },
      { from: 'proj-ledger', to: 'defense-01' },
      { from: 'proj-ledger', to: 'review-01' },
      { from: 'proj-ledger', to: 'test-suite' },
      { from: 'cap-audit', to: 'test-suite' },
    ],
    defensePrompt: {
      question: 'Why did you treat the $60,000 software license payment as a prepaid asset amortized over 36 months rather than an immediate operating expense?',
      sampleAnswer: 'Under ASC 340-20, non-refundable enterprise software contracts delivering ongoing multi-year service must be capitalized as a deferred contract asset and amortized systematically to match revenue benefits, preventing artificial distortion of Q1 EBITDA.',
      reviewerFocus: 'Evaluate matching principle understanding, GAAP citation accuracy, and financial statement integrity.',
    },
  },

  // ── 4. MUSICIAN ──
  'Musician': {
    id: 'musician',
    name: 'Musician',
    domainId: 'creative',
    domainName: 'Creative',
    tagline: 'Compose, perform, produce, and arrange original musical works.',
    description: 'Prove musicianship through stem audio files, harmonic score sheets, mixing session logs, and composition defense.',
    primaryProofMetric: 'Mastered Tracks & Composition Scores',
    proofTypes: [
      { type: 'audio', label: 'Original Master Track (.wav)', description: 'Full dynamic range audio with clean LUFS mastering', iconType: 'Activity' },
      { type: 'stems', label: 'Separated DAW Stems', description: 'Isolated drums, bass, harmony, lead, and vocal tracks', iconType: 'Layers' },
      { type: 'score', label: 'Harmonic Score / Lead Sheet', description: 'Chord progression notation and arrangement layout', iconType: 'FileText' },
      { type: 'mixlog', label: 'Mixing & EQ Session Notes', description: 'Frequency allocation, stereo imaging, dynamic control', iconType: 'Shield' },
      { type: 'defense', label: 'Compositional Rationale', description: 'Explaining mode changes, tension builds, and instrumentation', iconType: 'CheckCircle2' },
    ],
    capabilities: [
      { label: 'Composition', score: 92, color: '#db2777' },
      { label: 'Harmonic Theory', score: 88, color: '#4f46e5' },
      { label: 'Arrangement', score: 90, color: '#7c3aed' },
      { label: 'Audio Mixing / EQ', score: 85, color: '#059669' },
      { label: 'Performance', score: 94, color: '#0284c7' },
      { label: 'Creative Defense', score: 89, color: '#e11d48' },
    ],
    reviewCriteria: [
      { id: 'composition', label: 'Melodic & Harmonic Composition', description: 'Is the melodic motif memorable, cohesive, and harmonically resolved?', maxScore: 5 },
      { id: 'arrangement', label: 'Orchestration & Dynamics', description: 'Do instrumentation layers build tension and emotional movement?', maxScore: 5 },
      { id: 'production', label: 'Mix Clarity & Frequency Spacing', description: 'Are low-end frequencies clean without mud or phase cancellation?', maxScore: 5 },
      { id: 'musicianship', label: 'Performance & Expressiveness', description: 'Is timing tight and dynamics human and expressive?', maxScore: 5 },
      { id: 'brief_fit', label: 'Mood & Thematic Brief Alignment', description: 'Does the piece successfully evoke the required narrative tone?', maxScore: 5 },
      { id: 'defense', label: 'Compositional Reasoning', description: 'Does the musician articulate the harmonic choices clearly?', maxScore: 5 },
    ],
    challenges: [
      {
        id: 'mus-01',
        title: 'Cinematic Sci-Fi Trailer Theme',
        tagline: 'Compose and produce a 90-second orchestral-electronic trailer theme with dynamic drops and sub-bass impact.',
        difficulty: 'Advanced',
        diffColor: '#db2777',
        tools: ['Logic Pro / Ableton', 'Orchestral VSTs', 'Analog Synth', 'Mix Bus'],
        effort: '8–12 hours',
        proves: ['Composition', 'Orchestration', 'Sound Design', 'LUFS Mastering'],
        verifiedBy: 63,
        featured: true,
        progress: 75,
        scenario: 'A cinematic studio needs a tension-building opening cue that shifts from intimate cello to epic brass and synth braams.',
        constraints: ['Exact 90s structure with 3 distinct acts', 'Integrated -14 LUFS master', 'All raw stems provided'],
        deliverables: ['Master Stereo Audio (.wav)', 'Lead Sheet / Chord Chart', '5 Separated Stems', 'Composition Defense Note'],
      },
    ],
    proofGraphNodes: [
      { id: 'cap-comp', label: 'Melodic Composition', sublabel: 'Score: 92', type: 'CAPABILITY', score: 92, x: 420, y: 80, color: '#db2777', evidenceItems: ['Sci-Fi Trailer Piece (90s)', '2 Master stem sets', 'Arrangement praised by film composer'] },
      { id: 'cap-mix', label: 'Mix & Production', sublabel: 'Score: 85', type: 'CAPABILITY', score: 85, x: 720, y: 200, color: '#4f46e5', evidenceItems: ['-14 LUFS integrated loudness', 'Side-chain dynamic compression on 50Hz sub'] },
      { id: 'cap-theory', label: 'Harmonic Theory', sublabel: 'Score: 88', type: 'CAPABILITY', score: 88, x: 120, y: 200, color: '#7c3aed', evidenceItems: ['Modulation from D Dorian to B-flat Lydian', 'Tritone substitution on resolution'] },
      { id: 'proj-trailer', label: 'Cinematic Trailer Theme', sublabel: 'Verified · Advanced', type: 'PROJECT', x: 300, y: 240, color: '#0284c7', evidenceItems: ['Live acoustic cello + Moog Sub 37 layers', '3 hit-point synch markers on grid'] },
      { id: 'adr-mode', label: 'Decision: Dorian Mode for Mystery', sublabel: 'Accepted', type: 'ADR', x: 200, y: 380, color: '#7c3aed', evidenceItems: ['Rejected Natural Minor for predictable gloom', 'Selected Dorian for ethereal optimism'] },
      { id: 'review-01', label: 'Master Producer Review', sublabel: '9.3/10 · K. Sen', type: 'REVIEW', x: 640, y: 360, color: '#059669', evidenceItems: ['Stereo field depth: 9.5/10', 'Emotional arc: 9/10'] },
      { id: 'test-suite', label: 'Phase & Frequency Verification', sublabel: 'Zero Phase Cancellation', type: 'TEST', x: 620, y: 480, color: '#10b981', evidenceItems: ['Mono compatibility verified', 'No clipping above -0.3 dB True Peak'] },
      { id: 'defense-01', label: 'Composition Defense', sublabel: 'Passed · Strong', type: 'DEFENSE', x: 250, y: 500, color: '#d97706', evidenceItems: ['Defended tempo acceleration at bar 32', 'Articulated tension-release dynamics'] },
    ],
    proofGraphEdges: [
      { from: 'cap-comp', to: 'proj-trailer' },
      { from: 'cap-theory', to: 'adr-mode' },
      { from: 'proj-trailer', to: 'adr-mode' },
      { from: 'proj-trailer', to: 'defense-01' },
      { from: 'proj-trailer', to: 'review-01' },
      { from: 'proj-trailer', to: 'test-suite' },
      { from: 'cap-mix', to: 'test-suite' },
    ],
    defensePrompt: {
      question: 'Why did you modulate to B-flat Lydian in the B-section rather than staying in D minor?',
      sampleAnswer: 'The sharp fourth in B-flat Lydian introduces an expansive, weightless space that creates contrast after the claustrophobic D minor bassline, musically mirroring the protagonist looking out into open cosmos before the action climax.',
      reviewerFocus: 'Evaluate harmonic intentionality, modal color understanding, and dramatic pacing.',
    },
  },

  // ── 5. TEACHER ──
  'Teacher': {
    id: 'teacher',
    name: 'Teacher',
    domainId: 'education',
    domainName: 'Education',
    tagline: 'Deliver transformative learning experiences, curriculum design, and assessment frameworks.',
    description: 'Prove pedagogical mastery through structured lesson plans, differentiated instruction rubrics, video demos, and student outcome reflections.',
    primaryProofMetric: 'Curriculum Units & Teaching Demonstrations',
    proofTypes: [
      { type: 'lesson', label: 'Complete Lesson Plan', description: 'Timed structure with learning objectives and checks for understanding', iconType: 'FileText' },
      { type: 'materials', label: 'Differentiated Learning Materials', description: 'Scaffolded worksheets, visual guides, and extension challenges', iconType: 'Layers' },
      { type: 'assessment', label: 'Formative Assessment & Rubric', description: 'Diagnostic quizzes and performance-based scoring rubrics', iconType: 'Shield' },
      { type: 'demo', label: 'Recorded Teaching Demonstration', description: '15-minute concept explanation showing classroom engagement', iconType: 'Activity' },
      { type: 'defense', label: 'Pedagogical Reflection & Defense', description: 'Defending scaffolding choices for diverse learning needs', iconType: 'CheckCircle2' },
    ],
    capabilities: [
      { label: 'Pedagogy / Bloom', score: 94, color: '#0284c7' },
      { label: 'Lesson Design', score: 92, color: '#4f46e5' },
      { label: 'Differentiation', score: 88, color: '#7c3aed' },
      { label: 'Assessment Design', score: 90, color: '#059669' },
      { label: 'Communication', score: 95, color: '#d97706' },
      { label: 'Pedagogical Defense', score: 91, color: '#e11d48' },
    ],
    reviewCriteria: [
      { id: 'clarity', label: 'Conceptual Clarity', description: 'Is the complex topic broken down into intuitive, relatable building blocks?', maxScore: 5 },
      { id: 'pedagogy', label: 'Pedagogy & Scaffolding', description: 'Are "I do, We do, You do" stages effectively timed and sequenced?', maxScore: 5 },
      { id: 'differentiation', label: 'Differentiation for Diverse Learners', description: 'Are there explicit adaptations for struggling and advanced students?', maxScore: 5 },
      { id: 'engagement', label: 'Student Engagement & Questioning', description: 'Does the teacher use effective inquiry and check-for-understanding hooks?', maxScore: 5 },
      { id: 'assessment', label: 'Assessment Alignment', description: 'Do the assessment questions directly evaluate the stated learning objective?', maxScore: 5 },
      { id: 'defense', label: 'Pedagogical Defense', description: 'Can the educator defend their pacing and cognitive load management?', maxScore: 5 },
    ],
    challenges: [
      {
        id: 'edu-01',
        title: 'Design a Lesson on Photosynthesis for Middle School',
        tagline: 'Create an inquiry-based lesson plan that makes cellular respiration and light reactions intuitive without rote memorization.',
        difficulty: 'Advanced',
        diffColor: '#0284c7',
        tools: ['Lesson Plan', 'Rubrics', 'Formative Assessment', 'Visual Aids'],
        effort: '6–8 hours',
        proves: ['Inquiry-Based Learning', 'Scaffolding', 'Formative Assessment'],
        verifiedBy: 104,
        featured: true,
        progress: 90,
        scenario: 'Students often confuse plant respiration with human breathing. Design an interactive model to bridge this misconception.',
        constraints: ['45-minute period', 'Must include low-tech hands-on activity', '3-tiered exit ticket'],
        deliverables: ['Detailed Lesson Plan', 'Scaffolded Student Handout', 'Exit Ticket & Rubric', '10-Minute Micro-Teaching Video'],
      },
    ],
    proofGraphNodes: [
      { id: 'cap-pedagogy', label: 'Inquiry Pedagogy', sublabel: 'Score: 94', type: 'CAPABILITY', score: 94, x: 420, y: 80, color: '#0284c7', evidenceItems: ['Photosynthesis Interactive Unit', '4 Peer teacher reviews (avg 9.2/10)', 'Scaffolding guide for ELL students'] },
      { id: 'cap-diff', label: 'Differentiated Learning', sublabel: 'Score: 88', type: 'CAPABILITY', score: 88, x: 720, y: 200, color: '#7c3aed', evidenceItems: ['3-tier cognitive complexity tasks', 'Graphic organizers for visual learners'] },
      { id: 'cap-assess', label: 'Formative Assessment', sublabel: 'Score: 90', type: 'CAPABILITY', score: 90, x: 120, y: 200, color: '#059669', evidenceItems: ['Real-time misconception detection cards', 'Standards-aligned rubric matrix'] },
      { id: 'proj-lesson', label: 'Photosynthesis Unit', sublabel: 'Verified · Advanced', type: 'PROJECT', x: 300, y: 240, color: '#0284c7', evidenceItems: ['Complete 45-min lesson plan with timer', 'Hands-on stomata simulation activity'] },
      { id: 'adr-inquiry', label: 'Decision: Phenomenon-First Hook', sublabel: 'Accepted', type: 'ADR', x: 200, y: 380, color: '#7c3aed', evidenceItems: ['Rejected standard slide presentation', 'Used vanishing carbon-dioxide indicator demo to provoke questions'] },
      { id: 'review-01', label: 'Master Educator Review', sublabel: '9.6/10 · Prof. S. Sen', type: 'REVIEW', x: 640, y: 360, color: '#059669', evidenceItems: ['Cognitive load pacing: 10/10', 'Exit ticket precision: 9.5/10'] },
      { id: 'test-suite', label: 'Objective & Rubric Alignment', sublabel: '100% Standards Aligned', type: 'TEST', x: 620, y: 480, color: '#10b981', evidenceItems: ['NGSS standard MS-LS1-6 fully mapped', 'Zero ambiguous grading criteria'] },
      { id: 'defense-01', label: 'Pedagogical Defense', sublabel: 'Passed · Clear', type: 'DEFENSE', x: 250, y: 500, color: '#d97706', evidenceItems: ['Explained handling of the "plants only produce oxygen" misconception', 'Defended formative checkpoint timing'] },
    ],
    proofGraphEdges: [
      { from: 'cap-pedagogy', to: 'proj-lesson' },
      { from: 'cap-diff', to: 'adr-inquiry' },
      { from: 'proj-lesson', to: 'adr-inquiry' },
      { from: 'proj-lesson', to: 'defense-01' },
      { from: 'proj-lesson', to: 'review-01' },
      { from: 'proj-lesson', to: 'test-suite' },
      { from: 'cap-assess', to: 'test-suite' },
    ],
    defensePrompt: {
      question: 'Why did you start the lesson with a chemical color-change demonstration rather than defining photosynthesis on the board first?',
      sampleAnswer: 'Starting with definitions creates passive memorization. By introducing an anchor phenomenon (bromothymol blue changing color in the presence of elodea plants in sunlight), students observe the effect first, generating intrinsic inquiry questions that our lesson systematically answers.',
      reviewerFocus: 'Evaluate constructivist teaching principles, cognitive engagement, and misconception pre-emption.',
    },
  },

  // ── 6. MECHANICAL ENGINEER ──
  'Mechanical Engineer': {
    id: 'mechanical-engineer',
    name: 'Mechanical Engineer',
    domainId: 'engineering_core',
    domainName: 'Engineering / Core',
    tagline: 'Design manufacturable mechanisms, FEA structural simulations, and thermal assemblies.',
    description: 'Prove physical engineering prowess with STEP CAD models, GD&T tolerance stacks, FEA stress analyses, and DFMA reports.',
    primaryProofMetric: 'CAD Assemblies & FEA Simulation Reports',
    proofTypes: [
      { type: 'cad', label: '3D CAD Model & STEP Assembly', description: 'Fully constrained parametric assembly with BOM', iconType: 'Cpu' },
      { type: 'drawing', label: 'Engineering Drawings & GD&T', description: '2D technical drawings with datum reference frames', iconType: 'FileText' },
      { type: 'fea', label: 'FEA Stress & Fatigue Simulation', description: 'Von Mises stress plots, factor of safety verification', iconType: 'Activity' },
      { type: 'calculations', label: 'Design Calculations Sheet', description: 'Hand calculations for shear, torque, and thermal expansion', iconType: 'Shield' },
      { type: 'defense', label: 'Engineering Trade-Off Defense', description: 'Defending material selection and tolerance stack-up', iconType: 'CheckCircle2' },
    ],
    capabilities: [
      { label: '3D CAD Modeling', score: 94, color: '#d97706' },
      { label: 'FEA & Simulation', score: 90, color: '#4f46e5' },
      { label: 'GD&T / Tolerancing', score: 92, color: '#059669' },
      { label: 'Material Science', score: 86, color: '#7c3aed' },
      { label: 'DFM / DFA', score: 89, color: '#0284c7' },
      { label: 'Engineering Defense', score: 91, color: '#e11d48' },
    ],
    reviewCriteria: [
      { id: 'correctness', label: 'Physical & Structural Feasibility', description: 'Are stress concentrations within yield limits under peak load?', maxScore: 5 },
      { id: 'gdt', label: 'GD&T & Tolerance Stack-up', description: 'Are datum references and fit tolerances correctly constrained?', maxScore: 5 },
      { id: 'dfm', label: 'Design for Manufacturing (DFM)', description: 'Can parts be milled/molded without costly undercut tooling?', maxScore: 5 },
      { id: 'calculations', label: 'Mathematical Rigor', description: 'Do first-principle calculations match numerical FEA outcomes?', maxScore: 5 },
      { id: 'safety', label: 'Factor of Safety & Redundancy', description: 'Is a minimum 2.0 FoS maintained under worst-case loading?', maxScore: 5 },
      { id: 'defense', label: 'Engineering Defense', description: 'Can the engineer defend material and fasteners choice under challenge?', maxScore: 5 },
    ],
    challenges: [
      {
        id: 'eng-01',
        title: 'Design a Lightweight Drone Arm Assembly',
        tagline: 'Design a carbon-fiber/aluminum motor mount arm able to withstand 150N thrust with minimal vibration and <120g weight.',
        difficulty: 'Advanced',
        diffColor: '#d97706',
        tools: ['SolidWorks / Fusion 360', 'ANSYS FEA', 'GD&T', 'Topology Optimization'],
        effort: '8–12 hours',
        proves: ['CAD Design', 'FEA Stress Analysis', 'Weight Optimization', 'Vibration Damping'],
        verifiedBy: 86,
        featured: true,
        progress: 80,
        scenario: 'An industrial inspection drone requires high-torsional rigidity under rapid yaw maneuvers without resonance frequencies matching motor RPM.',
        constraints: ['Max weight 120 grams', 'FoS > 2.2 under 150N shock load', 'First natural frequency > 180 Hz'],
        deliverables: ['STEP Assembly Model', '2D Manufacturing Drawing (PDF)', 'FEA Stress/Modal Report', 'Defense Calculation Sheet'],
      },
    ],
    proofGraphNodes: [
      { id: 'cap-cad', label: 'Parametric CAD', sublabel: 'Score: 94', type: 'CAPABILITY', score: 94, x: 420, y: 80, color: '#d97706', evidenceItems: ['Drone Arm STEP assembly (112g)', '3 Peer engineering reviews', 'Zero interference in motion study'] },
      { id: 'cap-fea', label: 'FEA Stress Analysis', sublabel: 'Score: 90', type: 'CAPABILITY', score: 90, x: 720, y: 200, color: '#4f46e5', evidenceItems: ['Von Mises max stress 142 MPa (Al 7075-T6)', 'Modal analysis: 1st mode at 214 Hz'] },
      { id: 'cap-gdt', label: 'GD&T Tolerancing', sublabel: 'Score: 92', type: 'CAPABILITY', score: 92, x: 120, y: 200, color: '#059669', evidenceItems: ['H7/p6 press fit for motor bearing sleeve', 'Position tolerance 0.05mm to Datum A-B'] },
      { id: 'proj-arm', label: 'Drone Motor Mount', sublabel: 'Verified · Advanced', type: 'PROJECT', x: 300, y: 240, color: '#0284c7', evidenceItems: ['Lightened with rib stiffeners', 'FoS 2.45 verified under 150N load'] },
      { id: 'adr-mat', label: 'Decision: 7075-T6 vs 6061-T6', sublabel: 'Accepted', type: 'ADR', x: 200, y: 380, color: '#7c3aed', evidenceItems: ['Selected 7075-T6 for 80% higher yield strength, saving 34g of material mass'] },
      { id: 'review-01', label: 'Senior PE Review', sublabel: '9.4/10 · Dr. K. Rao', type: 'REVIEW', x: 640, y: 360, color: '#059669', evidenceItems: ['Tooling accessibility: 10/10', 'FEA mesh convergence: 9.5/10'] },
      { id: 'test-suite', label: 'Tolerance Stack-up Verification', sublabel: 'Passed Worst-Case', type: 'TEST', x: 620, y: 480, color: '#10b981', evidenceItems: ['Bearing runout within 0.012mm', 'Zero thermal binding across -20C to +60C'] },
      { id: 'defense-01', label: 'Engineering Defense', sublabel: 'Passed · High Rigor', type: 'DEFENSE', x: 250, y: 500, color: '#d97706', evidenceItems: ['Derived beam deflection formula live', 'Defended fastener clamp load under cyclic fatigue'] },
    ],
    proofGraphEdges: [
      { from: 'cap-cad', to: 'proj-arm' },
      { from: 'cap-fea', to: 'adr-mat' },
      { from: 'proj-arm', to: 'adr-mat' },
      { from: 'proj-arm', to: 'defense-01' },
      { from: 'proj-arm', to: 'review-01' },
      { from: 'proj-arm', to: 'test-suite' },
      { from: 'cap-gdt', to: 'test-suite' },
    ],
    defensePrompt: {
      question: 'Why did you use an anisotropic carbon fiber tube with CNC-milled aluminum 7075 end-fittings instead of a monolithic unibody composite structure?',
      sampleAnswer: 'A monolithic composite unibody incurs massive non-recurring tooling and compression-molding costs ($15,000+). Using standard roll-wrapped carbon tubes coupled with 5-axis milled 7075 fittings provides identical stiffness-to-weight with modular field-serviceable replacement for crashed arms at 1/10th the prototyping cost.',
      reviewerFocus: 'Evaluate DFMA economics, structural joint mechanics, and fastener shear calculation rigor.',
    },
  },

  // ── 7. DIGITAL MARKETING EXECUTIVE ──
  'Digital Marketing Executive': {
    id: 'digital-marketing',
    name: 'Digital Marketing Executive',
    domainId: 'marketing',
    domainName: 'Marketing & Sales',
    tagline: 'Architect high-ROI acquisition funnels, multi-channel campaigns, and attribution analytics.',
    description: 'Prove growth capability with live ad creative architectures, CAC/LTV models, A/B test logs, and conversion defense.',
    primaryProofMetric: 'Campaign Architectures & CAC/ROAS Reports',
    proofTypes: [
      { type: 'campaign', label: 'Full Funnel Campaign Architecture', description: 'TOFU/MOFU/BOFU budget allocation and ad creative matrix', iconType: 'Megaphone' },
      { type: 'analytics', label: 'Attribution & Conversion Analytics', description: 'First-touch vs linear vs data-driven attribution models', iconType: 'Activity' },
      { type: 'abtest', label: 'A/B Experiment Hypothesis & Results', description: 'Statistical significance calculations and copy iterations', iconType: 'Shield' },
      { type: 'budget', label: 'CAC / LTV Financial Model', description: 'Blended vs paid customer acquisition cost projections', iconType: 'FileText' },
      { type: 'defense', label: 'Campaign Strategy Defense', description: 'Defending channel mix, bidding strategy, and audience targeting', iconType: 'CheckCircle2' },
    ],
    capabilities: [
      { label: 'Paid Acquisition', score: 92, color: '#ea580c' },
      { label: 'Funnel Analytics', score: 88, color: '#4f46e5' },
      { label: 'Creative Strategy', score: 90, color: '#db2777' },
      { label: 'SEO & Content', score: 84, color: '#059669' },
      { label: 'CRO / A/B Testing', score: 94, color: '#0284c7' },
      { label: 'Growth Defense', score: 89, color: '#e11d48' },
    ],
    reviewCriteria: [
      { id: 'strategy', label: 'Audience Strategy & Positioning', description: 'Is the audience segmentation specific, verified, and well-targeted?', maxScore: 5 },
      { id: 'economics', label: 'Unit Economics (CAC/LTV)', description: 'Are payback periods and blended acquisition costs realistic?', maxScore: 5 },
      { id: 'creativity', label: 'Creative Hook & Ad Copy', description: 'Do ad creatives feature strong scroll-stopping hooks and clear value propositions?', maxScore: 5 },
      { id: 'analytics', label: 'Data Interpretation & Attribution', description: 'Does the marketer correctly interpret statistical significance in test data?', maxScore: 5 },
      { id: 'channel_mix', label: 'Channel Synergy & Retargeting', description: 'Is retargeting sequence designed to avoid ad fatigue and audience overlap?', maxScore: 5 },
      { id: 'defense', label: 'Growth Reasoning Defense', description: 'Can the marketer defend scaling budget allocation under declining ROAS?', maxScore: 5 },
    ],
    challenges: [
      {
        id: 'mkt-01',
        title: 'Launch Strategy for a B2B SaaS Workflow Tool',
        tagline: 'Design a $50,000 multi-channel go-to-market campaign achieving <$85 qualified lead cost.',
        difficulty: 'Advanced',
        diffColor: '#ea580c',
        tools: ['Google Ads', 'LinkedIn Ads', 'Looker Studio', 'HubSpot'],
        effort: '6–8 hours',
        proves: ['Multi-Touch Attribution', 'Audience Segmentation', 'Funnel CRO', 'Ad Copywriting'],
        verifiedBy: 112,
        featured: true,
        progress: 70,
        scenario: 'A B2B developer tool expanding into enterprise needs a multi-stage funnel targeting VP of Engineering roles.',
        constraints: ['Blended CAC under $180', 'Include 4 ad creative variants per stage', 'Full UTM tagging taxonomy'],
        deliverables: ['Campaign Strategy Blueprint', 'Ad Creative & Copy Matrix', 'Looker Dashboard Mockup', 'Defense Strategy Video'],
      },
    ],
    proofGraphNodes: [
      { id: 'cap-paid', label: 'Paid Acquisition', sublabel: 'Score: 92', type: 'CAPABILITY', score: 92, x: 420, y: 80, color: '#ea580c', evidenceItems: ['B2B SaaS GTM Plan ($50k budget)', 'LinkedIn + Search retargeting mesh', 'ROAS 3.4x verified in audit'] },
      { id: 'cap-cro', label: 'Conversion Rate Opt', sublabel: 'Score: 94', type: 'CAPABILITY', score: 94, x: 720, y: 200, color: '#0284c7', evidenceItems: ['Landing page variant: +28% demo conversion', 'P-value 0.012 on statistical significance test'] },
      { id: 'cap-attr', label: 'Multi-Touch Attribution', sublabel: 'Score: 88', type: 'CAPABILITY', score: 88, x: 120, y: 200, color: '#4f46e5', evidenceItems: ['W-shaped attribution weighting model', 'Reduced wasted spend by 32%'] },
      { id: 'proj-b2b', label: 'B2B GTM Campaign', sublabel: 'Verified · Advanced', type: 'PROJECT', x: 300, y: 240, color: '#0284c7', evidenceItems: ['Targeted VP Eng on LinkedIn with problem-first video', 'Search intent capture on high-intent keywords'] },
      { id: 'adr-channel', label: 'Decision: LinkedIn vs Meta Ads', sublabel: 'Accepted', type: 'ADR', x: 200, y: 380, color: '#7c3aed', evidenceItems: ['Allocated 65% to LinkedIn Ads despite 3x higher CPC due to 5x higher deal close rate'] },
      { id: 'review-01', label: 'Growth Director Review', sublabel: '9.2/10 · M. Verma', type: 'REVIEW', x: 640, y: 360, color: '#059669', evidenceItems: ['Audience layering: 9.5/10', 'Financial CAC modeling: 9/10'] },
      { id: 'test-suite', label: 'UTM Tracking & Pixel Validation', sublabel: '100% Signal Integrity', type: 'TEST', x: 620, y: 480, color: '#10b981', evidenceItems: ['Conversions API server-side event tracking verified', 'Zero duplicate conversion firing'] },
      { id: 'defense-01', label: 'Growth Defense', sublabel: 'Passed · High Conviction', type: 'DEFENSE', x: 250, y: 500, color: '#d97706', evidenceItems: ['Defended CPC premium on LinkedIn', 'Explained retargeting frequency capping strategy'] },
    ],
    proofGraphEdges: [
      { from: 'cap-paid', to: 'proj-b2b' },
      { from: 'cap-attr', to: 'adr-channel' },
      { from: 'proj-b2b', to: 'adr-channel' },
      { from: 'proj-b2b', to: 'defense-01' },
      { from: 'proj-b2b', to: 'review-01' },
      { from: 'proj-b2b', to: 'test-suite' },
      { from: 'cap-cro', to: 'test-suite' },
    ],
    defensePrompt: {
      question: 'Why did you spend $8/click on LinkedIn Sponsored Content instead of $1.50/click on Meta Ads for this enterprise workflow software?',
      sampleAnswer: 'While Meta offers cheaper clicks, 82% of traffic bounced because targeting cannot strictly isolate verified Engineering Directors in Fortune 500 companies. LinkedIn delivered a 6.2x higher pipeline conversion rate, resulting in a $640 customer acquisition cost compared to $1,420 on Meta.',
      reviewerFocus: 'Evaluate funnel economics, B2B purchasing dynamics, and LTV/CAC mathematical grounding.',
    },
  },

  // ── 8. CLINICAL RESEARCH ASSOCIATE ──
  'Clinical Research Associate': {
    id: 'clinical-research',
    name: 'Clinical Research Associate',
    domainId: 'healthcare',
    domainName: 'Healthcare / Life Sciences',
    tagline: 'Ensure protocol integrity, GCP compliance, and clinical trial data validation.',
    description: 'Prove clinical oversight with trial master files (TMF), adverse event documentation, protocol deviation matrices, and regulatory audits.',
    primaryProofMetric: 'GCP Trial Audits & Protocol Verification Logs',
    proofTypes: [
      { type: 'protocol', label: 'Clinical Study Protocol Review', description: 'Inclusion/exclusion criterion analysis and visit schedule mapping', iconType: 'Activity' },
      { type: 'gcp', label: 'GCP Compliance & Monitoring Report', description: 'Source data verification (SDV) findings and corrective action plan', iconType: 'Shield' },
      { type: 'adverse', label: 'Adverse Event (SAE) Triage Memo', description: 'Severity grading, causality assessment, and IRB reporting', iconType: 'FileText' },
      { type: 'data', label: 'Electronic Data Capture (EDC) Audit', description: 'Query resolution rates and data parity checks', iconType: 'Layers' },
      { type: 'defense', label: 'Regulatory Protocol Defense', description: 'Explaining ethics compliance and patient safety interventions', iconType: 'CheckCircle2' },
    ],
    capabilities: [
      { label: 'GCP / ICH Standards', score: 98, color: '#0d9488' },
      { label: 'Protocol Monitoring', score: 93, color: '#4f46e5' },
      { label: 'Source Data Verif', score: 95, color: '#059669' },
      { label: 'SAE Regulatory Tri', score: 91, color: '#d97706' },
      { label: 'Audit Trail Review', score: 89, color: '#0284c7' },
      { label: 'Clinical Defense', score: 94, color: '#e11d48' },
    ],
    reviewCriteria: [
      { id: 'gcp', label: 'ICH-GCP & Regulatory Adherence', description: 'Are patient consent logs, IRB approvals, and protocol versions strictly tracked?', maxScore: 5 },
      { id: 'data_accuracy', label: 'Source Data Verification (SDV)', description: 'Is transcription from EHR to eCRF 100% verified with zero discrepancies?', maxScore: 5 },
      { id: 'safety_reporting', label: 'Safety & Serious Adverse Event (SAE) Reporting', description: 'Are SAEs categorized and reported within 24-hour mandatory windows?', maxScore: 5 },
      { id: 'capa', label: 'Corrective & Preventive Action (CAPA)', description: 'Are protocol deviation root causes identified and remediated?', maxScore: 5 },
      { id: 'ethics', label: 'Patient Safety & Informed Consent', description: 'Are re-consenting protocols followed when protocol amendments occur?', maxScore: 5 },
      { id: 'defense', label: 'Regulatory Audit Defense', description: 'Can the associate defend clinical monitoring decisions to an auditor?', maxScore: 5 },
    ],
    challenges: [
      {
        id: 'hlth-01',
        title: 'Audit a Simulated Multi-Center Phase III Oncology Trial',
        tagline: 'Review 30 patient records, identify critical unrecorded protocol deviations, evaluate SAE causality, and draft an FDA-ready CAPA report.',
        difficulty: 'Advanced',
        diffColor: '#0d9488',
        tools: ['ICH-GCP Guidelines', 'MedDRA Coding', 'eCRF Audit', 'CAPA Matrix'],
        effort: '8–10 hours',
        proves: ['GCP Compliance', 'SAE Reporting Timelines', 'Source Data Verification', 'CAPA Remediation'],
        verifiedBy: 58,
        featured: true,
        progress: 80,
        scenario: 'A clinical trial site missed reporting a Grade 3 neutropenia event within 24 hours and enrolled 2 patients outside platelet count criteria.',
        constraints: ['Zero tolerance for unflagged safety violations', 'Full MedDRA coding required', 'Draft formal site escalation notice'],
        deliverables: ['Clinical Monitoring Site Report', 'SAE Escalation Memo', 'Corrective Action Plan (CAPA)', 'Regulatory Defense Video'],
      },
    ],
    proofGraphNodes: [
      { id: 'cap-gcp', label: 'ICH-GCP Compliance', sublabel: 'Score: 98', type: 'CAPABILITY', score: 98, x: 420, y: 80, color: '#0d9488', evidenceItems: ['Phase III Oncology Trial Audit (30 subjects)', '100% Informed consent tracking verification', 'Zero FDA 483 inspection observations'] },
      { id: 'cap-sae', label: 'Safety & SAE Triage', sublabel: 'Score: 91', type: 'CAPABILITY', score: 91, x: 720, y: 200, color: '#d97706', evidenceItems: ['24-hour mandatory IRB reporting compliance', 'MedDRA preferred term coding precision'] },
      { id: 'cap-sdv', label: 'Source Data Verification', sublabel: 'Score: 95', type: 'CAPABILITY', score: 95, x: 120, y: 200, color: '#059669', evidenceItems: ['Discovered 2 unrecorded protocol deviations', '100% source-to-CRF audit completeness'] },
      { id: 'proj-oncology', label: 'Phase III Trial Audit', sublabel: 'Verified · Advanced', type: 'PROJECT', x: 300, y: 240, color: '#0284c7', evidenceItems: ['Identified out-of-window lab draw pattern', 'Implemented site re-training on temperature excursion logs'] },
      { id: 'adr-capa', label: 'Decision: Immediate Site Suspension', sublabel: 'Accepted', type: 'ADR', x: 200, y: 380, color: '#7c3aed', evidenceItems: ['Halted enrollment at Site #04 until PI completed re-training on inclusion criteria'] },
      { id: 'review-01', label: 'Medical Monitor Review', sublabel: '9.8/10 · Dr. S. Rao', type: 'REVIEW', x: 640, y: 360, color: '#059669', evidenceItems: ['Regulatory rigor: 10/10', 'Root cause CAPA analysis: 9.6/10'] },
      { id: 'test-suite', label: 'GCP Regulatory Checklist', sublabel: 'Passed 100%', type: 'TEST', x: 620, y: 480, color: '#10b981', evidenceItems: ['All 21 CFR Part 11 electronic signature rules verified', 'Drug accountability balance verified'] },
      { id: 'defense-01', label: 'Regulatory Audit Defense', sublabel: 'Passed · Expert', type: 'DEFENSE', x: 250, y: 500, color: '#d97706', evidenceItems: ['Defended handling of emergency unblinding event', 'Explained escalation protocol for PI non-compliance'] },
    ],
    proofGraphEdges: [
      { from: 'cap-gcp', to: 'proj-oncology' },
      { from: 'cap-sae', to: 'adr-capa' },
      { from: 'proj-oncology', to: 'adr-capa' },
      { from: 'proj-oncology', to: 'defense-01' },
      { from: 'proj-oncology', to: 'review-01' },
      { from: 'proj-oncology', to: 'test-suite' },
      { from: 'cap-sdv', to: 'test-suite' },
    ],
    defensePrompt: {
      question: 'Why did you immediately halt subject enrollment at Site #04 rather than simply issuing an informational query to the Principal Investigator?',
      sampleAnswer: 'Enrolling patients with baseline platelet counts below 75,000/mcL directly violates protocol exclusion criterion #4 and creates acute patient safety risk for chemotherapy-induced hemorrhaging. Issuing a standard query would allow ongoing enrollment of endangered patients; an immediate administrative hold was legally and ethically mandatory under ICH-GCP 4.3.1.',
      reviewerFocus: 'Evaluate patient safety prioritization, regulatory authority boundaries, and ethics compliance.',
    },
  },
};

// Map of all detailed profession configurations
export const ALL_PROFESSIONS = PROFESSION_CONFIGS;

// Dynamic generator for engineering and multidisciplinary professions
export function getProfessionConfig(professionName: string): ProfessionConfig {
  if (PROFESSION_CONFIGS[professionName]) {
    return PROFESSION_CONFIGS[professionName];
  }

  // Find if profession belongs to Engineering / Core
  const engDomain = CAREER_DOMAINS.find(d => d.id === 'engineering_core');
  const isEngineering = engDomain?.professions.includes(professionName);

  if (isEngineering) {
    const slug = professionName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      id: slug,
      name: professionName,
      domainId: 'engineering_core',
      domainName: 'Engineering / Core',
      tagline: `Demonstrate physical modeling, calculations, schematic integrity, and live defense in ${professionName}.`,
      description: `Prove engineering capability through verified CAD/CAM models, finite element simulations, manufacturing drawings, and defense rounds.`,
      primaryProofMetric: 'CAD/FEA Schematics & Defense Calculations',
      proofTypes: [
        { type: 'cad_model', label: '3D CAD / Schematic Assembly', description: 'Parametric solid model with GD&T drawings', iconType: 'Cpu' },
        { type: 'simulation', label: 'FEA / Circuit Simulation Report', description: 'Stress, thermal, or signal integrity convergence log', iconType: 'Shield' },
        { type: 'adr', label: 'Engineering Decision Records (EDR)', description: 'Material selection trade-offs and factor of safety justification', iconType: 'FileText' },
        { type: 'test_bench', label: 'Physical / Virtual Test Bench Data', description: 'Empirical sensor logs and tolerance stack-up validation', iconType: 'Activity' },
        { type: 'defense', label: 'Peer Engineering Defense Round', description: 'Live mathematical derivation and failure mode defense', iconType: 'CheckCircle2' },
      ],
      capabilities: [
        { label: 'System Design', score: 91, color: '#d97706' },
        { label: 'Simulation & FEA', score: 88, color: '#4f46e5' },
        { label: 'DFMA & Tolerancing', score: 94, color: '#059669' },
        { label: 'Material Selection', score: 87, color: '#0284c7' },
        { label: 'Failure Analysis', score: 89, color: '#e11d48' },
        { label: 'Engineering Defense', score: 92, color: '#7c3aed' },
      ],
      reviewCriteria: [
        { id: 'math_rigor', label: 'Mathematical & Physics Rigor', description: 'Are governing equations and free-body/circuit laws correctly formulated?', maxScore: 5 },
        { id: 'standards', label: 'Industry Standard Compliance', description: 'Adherence to ASME/IEEE/ISO standards and tolerances', maxScore: 5 },
        { id: 'dfma', label: 'DFMA & Manufacturing Feasibility', description: 'Can the design be fabricated cost-effectively within tolerance limits?', maxScore: 5 },
        { id: 'safety', label: 'Factor of Safety & Redundancy', description: 'Is a minimum specified FoS maintained under worst-case loading/voltage?', maxScore: 5 },
        { id: 'defense', label: 'Technical Conviction Defense', description: 'Can the engineer defend component and thermal choices live?', maxScore: 5 },
      ],
      challenges: [
        {
          id: `eng-${slug}-01`,
          title: `${professionName} Core Technical Challenge`,
          tagline: `Develop a verified, manufacturable system design meeting strict tolerance and thermal boundary conditions.`,
          difficulty: 'Advanced',
          diffColor: '#d97706',
          tools: ['SolidWorks / Altium / ANSYS / MATLAB', 'GD&T', 'Simulation Suite'],
          effort: '8–12 hours',
          proves: ['Domain Calculation', 'Simulation Rigor', 'Tolerance Analysis', 'Peer Defense'],
          verifiedBy: 42,
          featured: true,
          progress: 60,
          scenario: `An industrial client requires a high-reliability ${professionName} subsystem operating in harsh continuous duty conditions.`,
          constraints: ['Strict weight/power envelope', 'FoS > 2.0 under peak stress', 'ASME/IEEE compliance'],
          deliverables: ['Assembly Schematics/CAD', 'Simulation Verification Report', 'Engineering Decision Record', 'Peer Defense Video'],
        },
      ],
      proofGraphNodes: [
        { id: 'cap-sys', label: 'System Design', sublabel: 'Score: 91', type: 'CAPABILITY', score: 91, x: 420, y: 80, color: '#d97706', evidenceItems: [`Verified ${professionName} assembly`, 'Peer review score 9.2/10'] },
        { id: 'cap-sim', label: 'Simulation Rigor', sublabel: 'Score: 88', type: 'CAPABILITY', score: 88, x: 720, y: 200, color: '#4f46e5', evidenceItems: ['Convergence within 0.5%', 'Thermal gradient verified'] },
        { id: 'cap-dfma', label: 'DFMA Tolerancing', sublabel: 'Score: 94', type: 'CAPABILITY', score: 94, x: 120, y: 200, color: '#059669', evidenceItems: ['Zero collision stack-up', 'ISO standard fits'] },
        { id: 'proj-01', label: `${professionName} System`, sublabel: 'Verified · Advanced', type: 'PROJECT', x: 300, y: 240, color: '#0284c7', evidenceItems: ['Complete technical blueprint', 'Benchmarked performance'] },
        { id: 'adr-01', label: 'Engineering Decision Record', sublabel: 'Accepted', type: 'ADR', x: 200, y: 380, color: '#7c3aed', evidenceItems: ['Defended component topology trade-offs'] },
        { id: 'review-01', label: 'Principal Engineer Review', sublabel: '9.3/10', type: 'REVIEW', x: 640, y: 360, color: '#059669', evidenceItems: ['Design feasibility: 9.5/10', 'Safety analysis: 9.2/10'] },
        { id: 'test-01', label: 'Validation Test Bench', sublabel: 'Passed Worst-Case', type: 'TEST', x: 620, y: 480, color: '#10b981', evidenceItems: ['Peak stress test passed', 'Zero thermal runaway'] },
        { id: 'def-01', label: 'Live Defense Round', sublabel: 'Passed · High Conviction', type: 'DEFENSE', x: 250, y: 500, color: '#d97706', evidenceItems: ['Defended calculation assumptions', 'Addressed edge cases'] },
      ],
      proofGraphEdges: [
        { from: 'cap-sys', to: 'proj-01' },
        { from: 'cap-sim', to: 'adr-01' },
        { from: 'proj-01', to: 'adr-01' },
        { from: 'proj-01', to: 'def-01' },
        { from: 'proj-01', to: 'review-01' },
        { from: 'proj-01', to: 'test-01' },
        { from: 'cap-dfma', to: 'test-01' },
      ],
      defensePrompt: {
        question: `Why did you select this specific architecture/material/component for this ${professionName} requirement instead of standard industry alternatives?`,
        sampleAnswer: `The chosen approach optimizes for thermal dissipation and fatigue life while reducing total unit manufacturing cost by 22% and maintaining a 2.4x Factor of Safety under maximum dynamic load.`,
        reviewerFocus: `Evaluate mathematical grounding, physics principles, safety factor calculation, and technical conviction.`,
      },
    };
  }

  // Fallback to Software Developer
  return PROFESSION_CONFIGS['Software Developer'];
}

// Multi-career mock candidates for Recruiter search & comparison
export const RECRUITER_CANDIDATES_POOL = [
  {
    id: 'c1',
    name: 'Ananya Sharma',
    profession: 'Software Developer',
    domain: 'Technology',
    headline: 'Backend Engineer · Distributed Systems & Concurrency',
    proofScore: 89,
    confidence: 'HIGH',
    verifiedProjects: 4,
    expertReviews: 3,
    defenseRounds: 2,
    location: 'Bangalore, Remote OK',
    availability: 'Open to offers',
    capabilities: [
      { label: 'Distributed Systems', score: 92 },
      { label: 'Backend Architecture', score: 88 },
      { label: 'Testing', score: 95 },
    ],
    recentProof: { title: 'High-Concurrency Ticket API', status: 'Verified', difficulty: 'Advanced' },
    keyDecision: 'Redis Lua CAS instead of PostgreSQL row-locks',
    techDecision: 'Redis Lua CAS instead of PostgreSQL row-locks',
    initials: 'AS',
    gradientFrom: '#4f46e5',
    gradientTo: '#7c3aed',
    tags: ['Go', 'Redis', 'PostgreSQL', 'gRPC'],
    primaryProofLabel: '4 Verified Git Repositories',
  },
  {
    id: 'c2',
    name: 'Maya Patel',
    profession: 'Graphic Designer',
    domain: 'Creative',
    headline: 'Brand Identity & Visual Systems Designer',
    proofScore: 92,
    confidence: 'HIGH',
    verifiedProjects: 5,
    expertReviews: 4,
    defenseRounds: 2,
    location: 'Mumbai, Remote OK',
    availability: 'Open to offers',
    capabilities: [
      { label: 'Visual Hierarchy', score: 94 },
      { label: 'Typography', score: 91 },
      { label: 'Brand Systems', score: 96 },
    ],
    recentProof: { title: 'Artisanal Roastery Brand Suite', status: 'Verified', difficulty: 'Advanced' },
    keyDecision: 'Warm Ochre #D97706 palette for organic kraft stock',
    techDecision: 'Warm Ochre #D97706 palette for organic kraft stock',
    initials: 'MP',
    gradientFrom: '#db2777',
    gradientTo: '#f43f5e',
    tags: ['Figma', 'Illustrator', 'Design Systems', 'Typography'],
    primaryProofLabel: '5 Production Brand Suites',
  },
  {
    id: 'c3',
    name: 'Vikram Iyer',
    profession: 'Accountant',
    domain: 'Finance & Banking',
    headline: 'Senior Financial Accountant & GAAP Audit Specialist',
    proofScore: 94,
    confidence: 'HIGH',
    verifiedProjects: 4,
    expertReviews: 5,
    defenseRounds: 3,
    location: 'Delhi NCR, Remote OK',
    availability: 'Open to offers',
    capabilities: [
      { label: 'GAAP / IFRS', score: 96 },
      { label: 'Ledger Audit', score: 94 },
      { label: 'Tax Compliance', score: 90 },
    ],
    recentProof: { title: 'Complex General Ledger Audit', status: 'Verified', difficulty: 'Advanced' },
    keyDecision: 'ASC 340-20 deferred contract asset capitalization',
    techDecision: 'ASC 340-20 deferred contract asset capitalization',
    initials: 'VI',
    gradientFrom: '#059669',
    gradientTo: '#10b981',
    tags: ['GAAP', 'Excel', 'Audit Papers', 'QuickBooks'],
    primaryProofLabel: '4 Audited Financial Models',
  },
  {
    id: 'c4',
    name: 'Rohan Mehta',
    profession: 'Musician',
    domain: 'Creative',
    headline: 'Cinematic Composer, Multi-Instrumentalist & Producer',
    proofScore: 90,
    confidence: 'HIGH',
    verifiedProjects: 3,
    expertReviews: 3,
    defenseRounds: 2,
    location: 'Goa, Remote OK',
    availability: 'Exploring options',
    capabilities: [
      { label: 'Composition', score: 92 },
      { label: 'Orchestration', score: 90 },
      { label: 'Audio Mixing / EQ', score: 88 },
    ],
    recentProof: { title: 'Cinematic Sci-Fi Trailer Theme', status: 'Verified', difficulty: 'Advanced' },
    keyDecision: 'B-flat Lydian modulation for cosmic contrast',
    techDecision: 'B-flat Lydian modulation for cosmic contrast',
    initials: 'RM',
    gradientFrom: '#7c3aed',
    gradientTo: '#a855f7',
    tags: ['Logic Pro', 'Ableton', 'Stem Mixing', 'Orchestral'],
    primaryProofLabel: '3 Mastered Soundtracks & Stems',
  },
  {
    id: 'c5',
    name: 'Sunita Rao',
    profession: 'Teacher',
    domain: 'Education',
    headline: 'Secondary STEM Educator & Curriculum Developer',
    proofScore: 93,
    confidence: 'HIGH',
    verifiedProjects: 4,
    expertReviews: 4,
    defenseRounds: 2,
    location: 'Bangalore, Hybrid',
    availability: 'Open to offers',
    capabilities: [
      { label: 'Inquiry Pedagogy', score: 94 },
      { label: 'Differentiation', score: 88 },
      { label: 'Formative Assessment', score: 92 },
    ],
    recentProof: { title: 'Photosynthesis Inquiry Unit', status: 'Verified', difficulty: 'Advanced' },
    keyDecision: 'Phenomenon-first hook over rote textbook lecture',
    techDecision: 'Phenomenon-first hook over rote textbook lecture',
    initials: 'SR',
    gradientFrom: '#0284c7',
    gradientTo: '#38bdf8',
    tags: ['Lesson Design', 'Bloom Taxonomy', 'Differentiated Instruction'],
    primaryProofLabel: '4 Complete Curriculum Units',
  },
  {
    id: 'c6',
    name: 'Amit Kulkarni',
    profession: 'Mechanical Engineer',
    domain: 'Engineering / Core',
    headline: 'CAD Design & Finite Element Analysis (FEA) Engineer',
    proofScore: 91,
    confidence: 'HIGH',
    verifiedProjects: 3,
    expertReviews: 4,
    defenseRounds: 2,
    location: 'Pune, Onsite/Hybrid',
    availability: 'Open to offers',
    capabilities: [
      { label: '3D CAD Modeling', score: 94 },
      { label: 'FEA Stress Simulation', score: 90 },
      { label: 'GD&T Tolerancing', score: 92 },
    ],
    recentProof: { title: 'Drone Arm Motor Assembly', status: 'Verified', difficulty: 'Advanced' },
    keyDecision: '7075-T6 aluminum saving 34g mass at FoS 2.45',
    techDecision: '7075-T6 aluminum saving 34g mass at FoS 2.45',
    initials: 'AK',
    gradientFrom: '#d97706',
    gradientTo: '#f59e0b',
    tags: ['SolidWorks', 'ANSYS', 'GD&T', 'DFMA'],
    primaryProofLabel: '3 Validated CAD/FEA Assemblies',
  },
  {
    id: 'c7',
    name: 'Karan Mehra',
    profession: 'Digital Marketing Executive',
    domain: 'Marketing & Sales',
    headline: 'Growth & Multi-Touch Attribution Strategist',
    proofScore: 89,
    confidence: 'HIGH',
    verifiedProjects: 4,
    expertReviews: 3,
    defenseRounds: 2,
    location: 'Mumbai, Remote OK',
    availability: 'Open to offers',
    capabilities: [
      { label: 'Paid Acquisition', score: 92 },
      { label: 'Funnel CRO', score: 94 },
      { label: 'Attribution Modeling', score: 88 },
    ],
    recentProof: { title: 'B2B SaaS GTM Launch Campaign', status: 'Verified', difficulty: 'Advanced' },
    keyDecision: 'LinkedIn intent targeting over low-intent Meta traffic',
    techDecision: 'LinkedIn intent targeting over low-intent Meta traffic',
    initials: 'KM',
    gradientFrom: '#ea580c',
    gradientTo: '#f97316',
    tags: ['Google Ads', 'LinkedIn Ads', 'CRO', 'Attribution'],
    primaryProofLabel: '4 Multi-Channel GTM Blueprints',
  },
  {
    id: 'c8',
    name: 'Dr. Neha Sen',
    profession: 'Clinical Research Associate',
    domain: 'Healthcare / Life Sciences',
    headline: 'GCP Clinical Trial Monitor & Regulatory Auditor',
    proofScore: 96,
    confidence: 'HIGH',
    verifiedProjects: 4,
    expertReviews: 5,
    defenseRounds: 3,
    location: 'Hyderabad, Remote OK',
    availability: 'Open to offers',
    capabilities: [
      { label: 'ICH-GCP Standards', score: 98 },
      { label: 'Source Data Verif', score: 95 },
      { label: 'Safety SAE Triage', score: 91 },
    ],
    recentProof: { title: 'Phase III Oncology Protocol Audit', status: 'Verified', difficulty: 'Advanced' },
    keyDecision: 'Immediate site hold under ICH-GCP 4.3.1 for patient safety',
    techDecision: 'Immediate site hold under ICH-GCP 4.3.1 for patient safety',
    initials: 'NS',
    gradientFrom: '#0d9488',
    gradientTo: '#14b8a6',
    tags: ['ICH-GCP', 'MedDRA', 'Protocol Audit', 'CAPA'],
    primaryProofLabel: '4 Trial Compliance Audits',
  },
];
