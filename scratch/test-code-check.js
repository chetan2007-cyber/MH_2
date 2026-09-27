const http = require('http');

async function testEndpoint() {
  const payload = JSON.stringify({
    code: `async function fetchUserData(userId) {
  if (!userId) {
    throw new Error("Missing required userId parameter");
  }
  try {
    const response = await api.get("/users/" + encodeURIComponent(userId));
    return response.data;
  } catch (err) {
    logger.error("Failed fetching user", err);
    throw err;
  }
}`,
    language: 'javascript',
  });

  const req = http.request(
    'http://localhost:5001/api/code-check/analyze',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    },
    (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        const json = JSON.parse(raw);
        console.log('Result Success:', json.success);
        if (json.data) {
          console.log('Quality Score:', json.data.qualityScore, json.data.qualityStatus);
          console.log('Dimensions:', json.data.dimensions);
          console.log('Similarity Signal:', json.data.similarityScore + '%', json.data.similarityStatus);
          console.log('Integrity Status:', json.data.integrityStatus);
          console.log('Tests Passed:', json.data.testResults.passed + '/' + json.data.testResults.total);
          console.log('Strengths:', json.data.strengths);
          console.log('Recommendations:', json.data.suggestions);
        } else {
          console.log('Error:', json);
        }
      });
    }
  );

  req.on('error', (e) => console.error('Req error:', e));
  req.write(payload);
  req.end();
}

testEndpoint();
