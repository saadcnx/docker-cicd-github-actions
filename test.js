const http = require('http');

// Simple test to check if the server responds
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET'
};

console.log('Starting basic health check test...');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.status === 'healthy') {
        console.log('✅ Health check passed!');
        process.exit(0);
      } else {
        console.log('❌ Health check failed!');
        process.exit(1);
      }
    } catch (error) {
      console.log('❌ Invalid response format');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Test failed:', error.message);
  process.exit(1);
});

req.end();
