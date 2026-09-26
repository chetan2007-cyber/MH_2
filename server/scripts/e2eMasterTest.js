const http = require('http');

function apiRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (dataString) {
      headers['Content-Length'] = Buffer.byteLength(dataString);
    }

    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path,
      method,
      headers
    }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runEndToEndMasterQASuite() {
  console.log('====================================================');
  console.log('KAUSHAL — COMPLETE FULL-STACK QA, AUDIT & VALIDATION SUITE');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(name, condition, extra = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${name} ${extra}`);
    } else {
      console.error(`  ❌ [FAIL] ${name} ${extra}`);
    }
  }

  // 1. HEALTH & CORE INFRASTRUCTURE
  console.log('--- 1. Core Health & Infrastructure ---');
  const healthRes = await apiRequest('GET', '/health');
  assert('Server Healthcheck Status 200', healthRes.status === 200 && healthRes.body.status === 'healthy');

  // 2. CANDIDATE WORKFLOW
  console.log('\n--- 2. Candidate Domain & Proof Workflow ---');
  const userMe = await apiRequest('GET', '/api/users/me');
  assert('Get Current Active Profile', userMe.status === 200 && !!userMe.body.user);

  const caps = await apiRequest('GET', '/api/users/me/capabilities');
  assert('Get Verified Capability Vectors', caps.status === 200 && Array.isArray(caps.body.capabilities));

  const challenges = await apiRequest('GET', '/api/challenges');
  assert('Fetch Multi-Domain Challenges Pool', challenges.status === 200 && challenges.body.count >= 10, `(${challenges.body.count} challenges available)`);

  // 3. RECRUITER TALENT DISCOVERY & COMPARISON
  console.log('\n--- 3. Recruiter Talent Discovery & Vector Search ---');
  const candSearch = await apiRequest('GET', '/api/candidates?domain=Technology');
  assert('Search Verified Candidates by Domain', candSearch.status === 200 && candSearch.body.count > 0, `(${candSearch.body.count} candidates returned)`);

  if (candSearch.body.data && candSearch.body.data.length >= 2) {
    const c1 = candSearch.body.data[0];
    const c2 = candSearch.body.data[1];

    const singleCand = await apiRequest('GET', `/api/candidates/${c1.id || c1._id}`);
    assert('Get Candidate Full Proof Dossier', singleCand.status === 200 && !!singleCand.body.data?.name);

    const compareRes = await apiRequest('POST', '/api/candidates/compare', {
      candidateIds: [c1.id || c1._id, c2.id || c2._id]
    });
    assert('Compare Candidates Side-by-Side Proof', compareRes.status === 200 && compareRes.body.count === 2);

    const outreachRes = await apiRequest('POST', '/api/opportunities', {
      candidateId: c1.id || c1._id,
      roleTitle: 'Staff Backend & Concurrency Architect',
      message: 'Direct outreach based on verified ADR decision rigor and chaos test passing.',
      compensationRange: '$180k - $240k'
    });
    assert('Send Direct Verified Opportunity Outreach', outreachRes.status === 201 && outreachRes.body.success);
  }

  // 4. RECRUITER JOB REQUISITIONS & JOB DNA
  console.log('\n--- 4. Job Requisitions, Job DNA & Assessments ---');
  const newJobRes = await apiRequest('POST', '/api/jobs', {
    title: 'Lead Systems & Reliability Architect',
    department: 'Engineering',
    careerDomain: 'technology',
    profession: 'Software Developer',
    experience: '5+ years',
    employmentType: 'Full-time',
    location: 'Bangalore, India (Hybrid)',
    description: 'Lead architecture of mission-critical low-latency systems and maintain zero-data loss SLAs.',
    requiredSkills: ['Distributed Systems', 'Chaos Engineering', 'Go/Rust', 'ADR Rigor'],
    difficulty: 'Advanced',
    assessmentDurationMinutes: 60
  });
  assert('Create Job Requisition', newJobRes.status === 201 && !!newJobRes.body.data?._id);

  const createdJob = newJobRes.body.data;
  if (createdJob?._id) {
    const dnaRes = await apiRequest('POST', `/api/jobs/${createdJob._id}/generate-dna`, {
      title: createdJob.title,
      department: createdJob.department
    });
    assert('Synthesize AI Job DNA & Calibrate Competency Weights', dnaRes.status === 200 && !!dnaRes.body.data?.jobDNA);

    const assessmentGen = await apiRequest('POST', `/api/assessments/generate/${createdJob._id}`, {
      assessmentType: 'CHALLENGE_WITH_DEFENSE',
      timeLimitMinutes: 60
    });
    assert('Generate Practical Proof Assessment Aligned with Job DNA', assessmentGen.status === 201 && !!assessmentGen.body.data);
  }

  // 5. REVIEWER QUEUE & EVALUATION
  console.log('\n--- 5. Reviewer Queue & Double-Blind Audit ---');
  const revQueue = await apiRequest('GET', '/api/reviews/queue');
  assert('Fetch Double-Blind Review Queue with Full Data', revQueue.status === 200 && Array.isArray(revQueue.body.data), `(${revQueue.body.data?.length} queued submissions)`);

  if (revQueue.body.data && revQueue.body.data.length > 0) {
    const targetSub = revQueue.body.data[0];
    const dossier = await apiRequest('GET', `/api/reviews/dossier/${targetSub.submissionId}`);
    assert('Fetch Anonymized Review Dossier', dossier.status === 200 && !!dossier.body.dossier);

    const auditEvaluation = await apiRequest('POST', `/api/reviews/${targetSub.submissionId}/evaluate`, {
      rubricScores: {
        architecture: { score: 5, note: 'Exemplary distributed isolation' },
        resilience: { score: 4, note: 'Strong fallback semantics' },
        observability: { score: 5, note: 'P99 trace correlation configured' }
      },
      qualitativeSynthesis: 'Exceptional systems architecture matching staff level expectations.',
      improvementRecommendations: ['Consider adding circuit breaker jitter metrics'],
      reviewerConfidence: 5
    });
    assert('Submit Peer Review Rubric & Recalculate Vectors', auditEvaluation.status === 201 && auditEvaluation.body.success);
  }

  // 6. PIPELINE, SHORTLISTING & DECISION
  console.log('\n--- 6. Pipeline, Evidence Interviews & Decisions ---');
  const appsRes = await apiRequest('GET', '/api/applications');
  assert('Fetch Applications Pipeline with Role Fit Scores', appsRes.status === 200 && Array.isArray(appsRes.body.data));

  if (appsRes.body.data && appsRes.body.data.length > 0) {
    const targetApp = appsRes.body.data[0];
    const interviewGen = await apiRequest('POST', `/api/interviews/generate/${targetApp._id}`);
    assert('Generate Deep-Dive Evidence Interview Kit', (interviewGen.status === 200 || interviewGen.status === 201) && Array.isArray(interviewGen.body.data?.questions));

    const decisionRes = await apiRequest('POST', `/api/applications/${targetApp._id}/decision`, {
      decision: 'SELECT',
      reason: 'Verified exceptional distributed systems competency, passed peer audit, and high role fit.'
    });
    assert('Record Final Decision with Audit Trail', decisionRes.status === 200 && decisionRes.body.success);
  }

  const analyticsRes = await apiRequest('GET', '/api/analytics/recruiter');
  assert('Fetch Recruiter Pipeline Funnel & Efficiency Metrics', analyticsRes.status === 200 && !!analyticsRes.body.data?.pipelineFunnel);

  console.log('\n====================================================');
  console.log(`TOTAL QA TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  console.log('====================================================');
  if (passedTests === totalTests) {
    console.log('🎉 100% COMPLETE END-TO-END QA SUITE PASSED WITH ZERO FAILURES!');
  }
}

runEndToEndMasterQASuite().catch(console.error);
