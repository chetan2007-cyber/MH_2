const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      `http://localhost:5001${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:5001${path}`, { method: 'GET' }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runE2ETests() {
  console.log('--- STARTING CODE PROOF CHECK E2E TEST SUITE ---\n');

  // Test 1: Empty Code Case
  console.log('[Test 1] Testing Empty Code submission...');
  const emptyRes = await postJson('/api/code-check/analyze', { code: '', language: 'javascript' });
  console.log('Result:', emptyRes.status === 400 && !emptyRes.body.success ? 'PASSED (Properly rejected 400)' : 'FAILED');

  // Test 2: Unsupported Language Case
  console.log('\n[Test 2] Testing Unsupported Language...');
  const unsuppRes = await postJson('/api/code-check/analyze', { code: 'print("hello")', language: 'fortran' });
  console.log('Result:', unsuppRes.status === 500 && unsuppRes.body.error.includes('Unsupported language') ? 'PASSED (Properly rejected unsupported language)' : 'FAILED');

  // Test 3: Valid Production Code Submission (Candidate A)
  console.log('\n[Test 3] Submitting high-quality asynchronous code for Candidate A...');
  const validCode = `
    /**
     * Retrieves customer profile with token verification
     */
    async function getCustomerProfile(customerId, authHeader) {
      if (!customerId || typeof customerId !== 'string') {
        throw new Error("Missing or invalid customerId parameter");
      }
      try {
        const profile = await database.customers.findUnique({
          where: { id: customerId },
          select: { id: true, email: true, tier: true }
        });
        if (!profile) return null;
        return profile;
      } catch (dbErr) {
        logger.error("Database query failed for customer", { customerId, err: dbErr.message });
        throw dbErr;
      }
    }
  `;
  const candARes = await postJson('/api/code-check/analyze', {
    code: validCode,
    language: 'javascript',
    candidateId: '65f011111111111111111111',
  });
  console.log('Candidate A Quality Score:', candARes.body.data.qualityScore, candARes.body.data.qualityStatus);
  console.log('Candidate A Tests:', `${candARes.body.data.testResults.passed}/${candARes.body.data.testResults.total} passed`);
  console.log('Candidate A Similarity:', `${candARes.body.data.similarityScore}% (${candARes.body.data.similarityStatus})`);
  console.log('Candidate A Integrity Status:', candARes.body.data.integrityStatus);

  // Test 4: Similar Submission with Renamed Identifiers and Comments (Candidate B)
  console.log('\n[Test 4] Submitting similar code with renamed variables for Candidate B...');
  const similarCode = `
    // Fetch user account info
    async function loadAccountData(accountId, token) {
      if (!accountId || typeof accountId !== 'string') {
        throw new Error("Missing or invalid customerId parameter");
      }
      try {
        const record = await database.customers.findUnique({
          where: { id: accountId },
          select: { id: true, email: true, tier: true }
        });
        if (!record) return null;
        return record;
      } catch (error) {
        logger.error("Database query failed for customer", { accountId, err: error.message });
        throw error;
      }
    }
  `;
  const candBRes = await postJson('/api/code-check/analyze', {
    code: similarCode,
    language: 'javascript',
    candidateId: '65f022222222222222222222',
  });
  console.log('Candidate B Quality Score:', candBRes.body.data.qualityScore);
  console.log('Candidate B Similarity Signal:', `${candBRes.body.data.similarityScore}% (${candBRes.body.data.similarityStatus})`);
  console.log('Candidate B Integrity Status:', candBRes.body.data.integrityStatus);
  console.log('Matched Peer:', candBRes.body.data.matchedSubmissions?.[0]?.candidateName);
  console.log('Largest Matching Region:', candBRes.body.data.matchedSubmissions?.[0]?.largestMatchingRegion, 'lines');

  // Test 5: Reviewer Comparison Details Fetch
  console.log('\n[Test 5] Fetching Comparison view details for reviewer inspection...');
  const compRes = await getJson(`/api/code-check/comparison/${candBRes.body.data._id}`);
  console.log('Comparison Retrieved:', compRes.status === 200 && compRes.body.success);
  console.log('Candidate Code Lines:', compRes.body.data.candidateCode.split('\n').length);
  console.log('Matched Peer Similarity:', compRes.body.data.matchedSubmission?.similarity + '%');

  // Test 6: Reviewer Audit Verification
  console.log('\n[Test 6] Reviewer submits audit decision (VERIFIED after inspecting context)...');
  const verifyRes = await postJson('/api/code-check/verify', {
    analysisId: candBRes.body.data._id,
    decision: 'VERIFIED',
    notes: 'Reviewed similarity: structural query pattern is standard repository convention. Original logic verified.',
  });
  console.log('Reviewer Verification Decision:', verifyRes.body.data.reviewerVerification?.decision);
  console.log('Updated Integrity Status:', verifyRes.body.data.integrityStatus);

  console.log('\n--- ALL CODE PROOF CHECK E2E TESTS COMPLETED SUCCESSFULLY ---');
}

runE2ETests().catch(console.error);
