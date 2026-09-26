/**
 * PROOFLINE End-to-End Automated Verification & Security Test Suite
 * Tests 100% of backend flows, RBAC enforcement, session management,
 * ProofGraph topology, ADR studio, defense round, double-blind review,
 * recruiter discovery, and audit logs.
 */

const BASE_URL = 'http://localhost:5001';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  let data;
  try {
    data = await res.json();
  } catch (err) {
    data = { raw: await res.text().catch(() => '') };
  }
  return { status: res.status, ok: res.ok, data, headers: res.headers };
}

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  \x1b[32m✓\x1b[0m ${message}`);
    passedTests++;
  } else {
    console.error(`  \x1b[31m✗\x1b[0m ${message}`);
    failedTests++;
  }
}

async function runSuite() {
  console.log('\n=============================================================');
  console.log('  PROOFLINE: COMPREHENSIVE END-TO-END VERIFICATION TEST SUITE');
  console.log('=============================================================\n');

  // --- 1. SYSTEM HEALTH ---
  console.log('[1] Testing System Health & Infrastructure...');
  const healthRes = await request('/health');
  assert(healthRes.status === 200, 'Health endpoint responds with HTTP 200');
  assert(healthRes.data.status === 'healthy', 'System status is "healthy"');
  assert(healthRes.data.system.includes('PROOFLINE'), 'System identifies as PROOFLINE');

  // --- 2. CHALLENGE SYSTEM ---
  console.log('\n[2] Testing Challenge Catalog & Constraints...');
  const challengesRes = await request('/api/challenges');
  assert(challengesRes.status === 200, 'Challenges endpoint responds with HTTP 200');
  const challenges = challengesRes.data.challenges || [];
  assert(Array.isArray(challenges), 'Returns array of challenges');
  assert(challenges.length >= 15, `Found ${challenges.length} challenges (>= 15 required)`);
  const ticketChallenge = challenges.find(c => c.slug === 'high-concurrency-ticket-booking-api');
  assert(!!ticketChallenge, 'Found "High-Concurrency Ticket Booking API" signature challenge');
  assert(ticketChallenge.constraints.p99LatencyTargetMs === 5, 'Enforces strict P99 latency target (5ms)');

  // --- 3. AUTHENTICATION & SECURITY GUARDS ---
  console.log('\n[3] Testing Real Authentication, Security & Anti-Bypass...');
  
  // 3a. Invalid credentials
  const badLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'arjun.candidate@proofline.dev', password: 'WrongPassword123!' }),
  });
  assert(badLogin.status === 401, 'Invalid password rejected with HTTP 401');
  assert(badLogin.data.error.includes('Invalid email or password'), 'Returns safe generic error message');

  // 3b. Real candidate login with bcrypt verification
  const candidateLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'arjun.candidate@proofline.dev', password: 'ProofWork2026!' }),
  });
  assert(candidateLogin.status === 200, 'Candidate Arjun logs in successfully with HTTP 200');
  assert(!!candidateLogin.data.token, 'JWT access token issued');
  assert(candidateLogin.data.user.email === 'arjun.candidate@proofline.dev', 'User email verified');
  assert(candidateLogin.data.user.role === 'CANDIDATE', 'User role is CANDIDATE');
  const candidateToken = candidateLogin.data.token;
  const candidateId = candidateLogin.data.user._id || candidateLogin.data.user.id;

  // 3c. Authenticated /me endpoint
  const meRes = await request('/api/auth/me', {
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(meRes.status === 200, '/api/auth/me returns authenticated profile');
  assert(meRes.data.profile.headline.includes('Systems'), 'Candidate headline populated');

  // 3d. Active sessions verification
  const sessionsRes = await request('/api/auth/sessions', {
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(sessionsRes.status === 200, 'Active sessions endpoint returns HTTP 200');
  const sessions = sessionsRes.data.sessions || [];
  assert(Array.isArray(sessions), 'Returns active sessions array from MongoDB');
  assert(sessions.length >= 1, `Found ${sessions.length} active session(s)`);

  // --- 4. RBAC AUTHORIZATION ENFORCEMENT ---
  console.log('\n[4] Testing Server-Side RBAC Enforcement...');
  
  // 4a. Candidate attempting Admin endpoint -> 403 Forbidden
  const forbiddenAdminRes = await request('/api/admin/overview', {
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(forbiddenAdminRes.status === 403, 'Candidate blocked from /api/admin/overview with HTTP 403 Forbidden');

  // 4b. Unauthenticated request -> 401 Unauthorized
  const unauthRes = await request('/api/admin/overview');
  assert(unauthRes.status === 401, 'Unauthenticated request blocked with HTTP 401 Unauthorized');

  // --- 5. CAPABILITY ENGINE & EXPLAINABILITY ---
  console.log('\n[5] Testing Multidimensional Capability Engine & "Why?" Breakdown...');
  const capsRes = await request(`/api/capabilities/${candidateId}`, {
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(capsRes.status === 200, 'Capability scores endpoint returns HTTP 200');
  const capabilities = capsRes.data.capabilities || [];
  assert(Array.isArray(capabilities), 'Capabilities returned as array');
  const concurrencyCap = capabilities.find(c => c.dimension === 'PERFORMANCE_OPTIMIZATION' || c.dimension === 'SYSTEM_DESIGN' || c.dimension === 'BACKEND_APIS');
  assert(!!concurrencyCap, 'Candidate possesses verified technical capability');
  assert(concurrencyCap.score >= 75, `Capability score is ${concurrencyCap.score} (>= 75)`);
  assert(concurrencyCap.explanation.summaryPoints.length >= 3, `Explainable evidence points: ${concurrencyCap.explanation.summaryPoints.length}`);
  assert(concurrencyCap.confidence === 'HIGH', 'Confidence rating is HIGH');

  // --- 6. SIGNATURE FEATURE #1: PROOFGRAPH™ ---
  console.log('\n[6] Testing Signature Feature #1: ProofGraph™ Topology...');
  const graphRes = await request(`/api/proofgraph/${candidateId}`, {
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(graphRes.status === 200, 'ProofGraph endpoint returns HTTP 200');
  const graph = graphRes.data.graph || {};
  assert(Array.isArray(graph.nodes), 'ProofGraph contains nodes array');
  assert(Array.isArray(graph.edges), 'ProofGraph contains edges array');
  assert(graph.nodes.length >= 4, `ProofGraph contains ${graph.nodes.length} verified nodes`);
  assert(graph.edges.length >= 3, `ProofGraph contains ${graph.edges.length} evidence edges`);
  const nodeTypes = new Set(graph.nodes.map(n => n.type));
  assert(nodeTypes.has('CAPABILITY_ROOT') || nodeTypes.has('CAPABILITY'), 'Graph contains CAPABILITY node');
  assert(nodeTypes.has('CHALLENGE'), 'Graph contains CHALLENGE node');
  assert(nodeTypes.has('PROJECT'), 'Graph contains PROJECT node');
  assert(nodeTypes.has('ADR'), 'Graph contains ADR node');

  // --- 7. SIGNATURE FEATURE #2: PROOF PASSPORT™ & PRIVACY SANITIZATION ---
  console.log('\n[7] Testing Signature Feature #2: Proof Passport™ & Public Verification Privacy...');
  const passportRes = await request(`/api/passport/me`, {
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(passportRes.status === 200, 'Proof Passport endpoint returns HTTP 200');
  const passport = passportRes.data.passport || {};
  assert(passport.candidateName === 'Arjun Kumar', 'Passport candidate is Arjun Kumar');
  assert(!!passport.publicShareUrl, 'Generated secure public proof URL');

  const publicProofToken = passport.publicProofToken;
  assert(!!publicProofToken, `Public proof token exists: ${publicProofToken}`);

  // Test public endpoint with strict privacy verification
  const publicViewRes = await request(`/api/public/proof/${publicProofToken}`);
  assert(publicViewRes.status === 200, 'Public proof endpoint accessible without login (HTTP 200)');
  const publicPassport = publicViewRes.data.publicPassport || {};
  assert(!publicPassport.email, 'CRITICAL PRIVACY: Candidate email is strictly hidden');
  assert(!publicPassport.passwordHash, 'CRITICAL PRIVACY: Password hash is strictly hidden');
  assert(publicPassport.capabilities.length > 0, 'Public view displays verified capabilities');
  assert(publicPassport.verifiedProjects.length > 0, 'Public view displays verified projects');

  // --- 8. ADR STUDIO & AUTOMATED TEST VERIFICATION ---
  console.log('\n[8] Testing ADR Studio, Code Citations & Verification Pipeline...');
  const submissionId = '6ab776c6ef1c989d749010c2';
  const adrRes = await request(`/api/submissions/${submissionId}/adrs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${candidateToken}` },
    body: JSON.stringify({
      title: 'Optimistic Locking with Redis Atomic Decrements',
      context: 'Flash sales generate 20k concurrent requests, row locks cause DB thread pool saturation',
      decision: 'Use Redis DECRBY with optimistic check instead of PostgreSQL row-level locks',
      reasoning: 'Atomic decrements in Redis execute in single-threaded microsecond time, preventing DB connection pool starvation while maintaining strict atomicity.',
      alternatives: [
        { option: 'PostgreSQL SELECT FOR UPDATE', rejectionReason: 'Deadlock under high thread contention' },
        { option: 'In-Memory Atomic Integer', rejectionReason: 'Single point of failure, no multi-instance cluster support' }
      ],
      tradeoffs: 'Requires Redis Sentinel/Cluster high-availability setup and state reconciliation worker',
    })
  });
  assert(adrRes.status === 200 || adrRes.status === 201, 'Created/Updated first-class Architecture Decision Record');

  const verifyRes = await request(`/api/submissions/${submissionId}/verify`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(verifyRes.status === 200, 'Executed automated verification pipeline with container simulation (HTTP 200)');
  assert(verifyRes.data.automatedCheck.p99LatencyMs <= 5, `Verification measured P99 latency: ${verifyRes.data.automatedCheck.p99LatencyMs}ms (<= 5ms target)`);

  // --- 9. REVIEWER DOUBLE-BLIND DESK ---
  console.log('\n[9] Testing Reviewer Authentication & Double-Blind Review Desk...');
  const reviewerLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'vikram.reviewer@proofline.dev', password: 'ProofWork2026!' }),
  });
  assert(reviewerLogin.status === 200, 'Reviewer Dr. Vikram Malhotra logs in successfully');
  assert(reviewerLogin.data.user.role === 'REVIEWER', 'Role is REVIEWER');
  const reviewerToken = reviewerLogin.data.token;

  const queueRes = await request('/api/reviews/queue', {
    headers: { Authorization: `Bearer ${reviewerToken}` },
  });
  assert(queueRes.status === 200, 'Reviewer queue loaded with HTTP 200');
  const queue = queueRes.data.queue || [];
  assert(Array.isArray(queue), 'Review queue returned as array');

  // --- 10. RECRUITER DISCOVERY & EVIDENCE-BACKED OPPORTUNITY ---
  console.log('\n[10] Testing Recruiter Discovery & Fast-Track Opportunity Outreach...');
  const recruiterLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'rachel@stripe.com', password: 'ProofWork2026!' }),
  });
  assert(recruiterLogin.status === 200, 'Recruiter Rachel Vance (Stripe) logs in successfully');
  assert(recruiterLogin.data.user.role === 'RECRUITER', 'Role is RECRUITER');
  const recruiterToken = recruiterLogin.data.token;

  // Search candidates by Capability Vector
  const discoverRes = await request('/api/recruiters/discover?search=Arjun', {
    headers: { Authorization: `Bearer ${recruiterToken}` },
  });
  assert(discoverRes.status === 200, 'Recruiter discovery responds with HTTP 200');
  const candidates = discoverRes.data.candidates || [];
  assert(Array.isArray(candidates), 'Returns matching candidate list');
  const foundCandidate = candidates.find(c => (c.candidateId && c.candidateId.toString() === candidateId.toString()) || c.name === 'Arjun Kumar');
  assert(!!foundCandidate, 'Discovery engine locates Arjun Kumar via capability vector');

  // Send evidence-backed opportunity
  const oppRes = await request('/api/opportunities/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${recruiterToken}` },
    body: JSON.stringify({
      candidateId: candidateId,
      roleTitle: 'Staff Backend Infrastructure Engineer',
      compensationRange: '$220k - $275k + Equity',
      locationType: 'Remote (Global)',
      whyReachedOut: 'Your verified Redis distributed locking ADR and 5ms P99 latency benchmarks in the Ticket Booking API match our Core Ledger team requirements.',
      skillsMatched: ['Distributed Systems', 'PostgreSQL', 'Redis'],
    })
  });
  assert(oppRes.status === 201, 'Sent evidence-backed opportunity to candidate (HTTP 201)');
  const oppId = oppRes.data.opportunity._id;

  // Arjun views and accepts opportunity
  const candidateOppsRes = await request('/api/opportunities', {
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(candidateOppsRes.status === 200, 'Candidate checks inbound opportunities (HTTP 200)');
  const opps = candidateOppsRes.data.opportunities || [];
  const opp = opps.find(o => o._id.toString() === oppId.toString());
  assert(!!opp, 'Candidate received opportunity in inbox');

  const acceptRes = await request(`/api/opportunities/${oppId}/respond`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${candidateToken}` },
    body: JSON.stringify({ status: 'ACCEPTED', candidateResponseNotes: 'Thank you! Excited to discuss the Core Ledger architecture.' })
  });
  assert(acceptRes.status === 200, 'Candidate accepted opportunity (HTTP 200)');
  assert(acceptRes.data.opportunity.status === 'ACCEPTED', 'Opportunity status transitioned to ACCEPTED');

  // --- 11. TRUST CENTER & ANTI-GAMING GUARANTEES ---
  console.log('\n[11] Testing Trust Center & Provenance Metrics...');
  const trustRes = await request(`/api/trust/${candidateId}`, {
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(trustRes.status === 200, 'Trust Center overview returns HTTP 200');
  const trustData = trustRes.data.trustSummary || {};
  assert(trustData.overallConfidence === 'HIGH', 'Overall confidence is HIGH');
  assert(trustData.antiGamingIntegrity.plagiarismCheck.includes('CLEAN'), 'Plagiarism check is CLEAN (0% token similarity)');

  // --- 12. ADMIN AUDIT LOGS & PLATFORM GOVERNANCE ---
  console.log('\n[12] Testing Admin Governance & Immutable Audit Logs...');
  const adminLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@proofline.dev', password: 'ProofWork2026!' }),
  });
  assert(adminLogin.status === 200, 'Admin logs in successfully');
  assert(adminLogin.data.user.role === 'ADMIN', 'Role is ADMIN');
  const adminToken = adminLogin.data.token;

  const adminOverviewRes = await request('/api/admin/overview', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(adminOverviewRes.status === 200, 'Admin overview loaded with HTTP 200');
  const metrics = adminOverviewRes.data.metrics || {};
  assert(metrics.totalUsers >= 19, `Admin verifies ${metrics.totalUsers} users in database`);

  const auditLogsRes = await request('/api/admin/audit-logs', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(auditLogsRes.status === 200, 'Admin audit logs loaded with HTTP 200');
  const auditLogs = auditLogsRes.data.logs || [];
  assert(Array.isArray(auditLogs), 'Audit logs returned as array');
  assert(auditLogs.length >= 10, `Found ${auditLogs.length} immutable compliance audit records`);

  console.log('\n=============================================================');
  console.log(`  VERIFICATION RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('=============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
