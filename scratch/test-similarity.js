const http = require('http');

async function testSimilarity() {
  // Altered variable names, whitespace, and formatting from previous submission
  const alteredCode = `
    // Different comments
    async function getUserRecord(id) {
      if (!id) {
        throw new Error("Missing required userId parameter");
      }
      try {
        const result = await api.get("/users/" + encodeURIComponent(id));
        return result.data;
      } catch (exception) {
        logger.error("Failed fetching user", exception);
        throw exception;
      }
    }
  `;

  const payload = JSON.stringify({
    code: alteredCode,
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
        const json = JSON.parse(raw);
        console.log('Altered Code Submission Result:');
        console.log('Similarity Signal:', json.data.similarityScore + '%', json.data.similarityStatus);
        console.log('Integrity Status:', json.data.integrityStatus);
        console.log('Matched Submissions Count:', json.data.matchedSubmissions?.length);
        if (json.data.matchedSubmissions?.[0]) {
          console.log('Matched Peer:', json.data.matchedSubmissions[0].candidateName);
          console.log('Match Pct:', json.data.matchedSubmissions[0].similarity + '%');
          console.log('Matching Regions Count:', json.data.matchedSubmissions[0].matchingRegionsCount);
          console.log('Largest Matching Region:', json.data.matchedSubmissions[0].largestMatchingRegion, 'lines');
        }
      });
    }
  );

  req.write(payload);
  req.end();
}

testSimilarity();
