export const ROUTES = {
  LANDING: 'landing',
  OVERVIEW: 'overview',
  CHALLENGES: 'challenges',
  WORKSPACE: 'workspace',
  PROJECTS: 'projects',
  PROOFGRAPH: 'proofgraph',
  PASSPORT: 'passport',
  REVIEWER: 'reviewer',
  RECRUITER: 'recruiter',
  OPPORTUNITIES: 'opportunities',
  TRUST: 'trust',
  ADMIN: 'admin',
  SETTINGS: 'settings',
} as const;

export type RouteKey = typeof ROUTES[keyof typeof ROUTES];

export const getDefaultRouteForRole = (role?: string): RouteKey => {
  switch (role) {
    case 'CANDIDATE':
      return ROUTES.OVERVIEW;
    case 'REVIEWER':
      return ROUTES.REVIEWER;
    case 'RECRUITER':
      return ROUTES.RECRUITER;
    case 'ADMIN':
      return ROUTES.ADMIN;
    default:
      return ROUTES.LANDING;
  }
};
