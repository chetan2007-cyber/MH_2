/**
 * Determines whether an assessment, job, or submission involves coding.
 * Strict rules:
 * - Musician, Graphic Designer, Teacher, Photographer, Accountant, etc. are NOT shown the code checker
 *   unless the specific assessment explicitly requires code.
 * - Dynamic detection from profession, careerDomain, assessmentType, skills, tools, and deliverables.
 */

interface DetectCodingAssessmentParams {
  profession?: string;
  careerDomain?: string;
  assessmentType?: string;
  submissionType?: string;
  toolsAllowed?: string[];
  tools?: string[];
  deliverables?: string[];
  title?: string;
  scenario?: string;
  practicalTask?: string;
}

const CODING_PROFESSION_KEYWORDS = [
  'software',
  'developer',
  'engineer',
  'web developer',
  'frontend',
  'backend',
  'fullstack',
  'ai/ml',
  'machine learning',
  'cybersecurity',
  'cloud',
  'embedded',
  'plc',
  'firmware',
  'devops',
  'sre',
  'data engineer',
  'data scientist',
  'qa tester',
  'systems engineer',
];

const NON_CODING_PROFESSIONS = [
  'musician',
  'graphic designer',
  'teacher',
  'accountant',
  'photographer',
  'video editor',
  'animator',
  'content creator',
  'banking executive',
  'investment analyst',
  'credit analyst',
  'audit associate',
  'sales executive',
  'digital marketing',
  'seo specialist',
  'content strategist',
  'social media manager',
  'hr executive',
  'recruitment specialist',
  'administrative assistant',
];

const CODING_TOOLS = [
  'javascript', 'typescript', 'python', 'java', 'c', 'c++', 'c#', 'go', 'golang',
  'rust', 'php', 'ruby', 'sql', 'git', 'github', 'node', 'react', 'vue', 'angular',
  'docker', 'kubernetes', 'aws', 'terraform', 'graphql', 'c programming'
];

export function isCodingAssessment(params: DetectCodingAssessmentParams): boolean {
  if (!params) return false;

  const prof = (params.profession || '').toLowerCase().trim();
  const domain = (params.careerDomain || '').toLowerCase().trim();
  const type = (params.assessmentType || params.submissionType || '').toLowerCase().trim();
  const title = (params.title || '').toLowerCase().trim();
  const task = (params.practicalTask || params.scenario || '').toLowerCase().trim();

  const combinedTools = [
    ...(params.toolsAllowed || []),
    ...(params.tools || []),
  ].map(t => t.toLowerCase().trim());

  const combinedDeliverables = (params.deliverables || []).map(d => d.toLowerCase().trim());

  // 1. Explicit check for non-coding professions
  const isExplicitlyNonCoding = NON_CODING_PROFESSIONS.some(p => prof.includes(p));

  // If explicitly non-coding, ONLY allow if assessment explicitly specifies code or repository deliverable
  if (isExplicitlyNonCoding) {
    const explicitlyRequiresCode =
      type.includes('code') ||
      type.includes('programming') ||
      combinedDeliverables.some(d => d.includes('code') || d.includes('script') || d.includes('repository') || d.includes('pr'));
    return explicitlyRequiresCode;
  }

  // 2. Check if profession is coding-related
  const matchesCodingProfession = CODING_PROFESSION_KEYWORDS.some(k => prof.includes(k) || title.includes(k));
  if (matchesCodingProfession) return true;

  // 3. Check if tools include programming languages
  const hasCodingTool = combinedTools.some(tool => CODING_TOOLS.some(ct => tool.includes(ct)));
  if (hasCodingTool) return true;

  // 4. Check if deliverables or tasks explicitly mention code / repo
  const hasCodingDeliverable = combinedDeliverables.some(d =>
    d.includes('code') || d.includes('repository') || d.includes('pull request') || d.includes('implementation') || d.includes('script')
  );
  if (hasCodingDeliverable && (domain === 'technology' || type.includes('code') || task.includes('code'))) {
    return true;
  }

  // 5. Default domain check
  if (domain === 'technology' && !prof.includes('ui/ux designer') && !prof.includes('designer')) {
    return true;
  }

  return false;
}
