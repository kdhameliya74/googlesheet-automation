const { spawn } = require('child_process');
const http = require('http');

console.log('Starting server for verification...');

const server = spawn('node', ['dist/bundle.js'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: '5000' }
});

let serverReady = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[Server]: ${output.trim()}`);
  if (output.includes('Server is running on port')) {
    serverReady = true;
    checkServer();
  }
});

server.stderr.on('data', (data) => {
  console.error(`[Server Error]: ${data.toString()}`);
});

function checkServer() {
  console.log('Verifying server response...');
  const req = http.get('http://localhost:5000', (res) => {
    console.log(`Response status code: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('✅ Verification successful: Server responded with 200 OK');
      cleanup(0);
    } else {
      console.error('❌ Verification failed: Server responded with non-200 status');
      cleanup(1);
    }
  });

  req.on('error', (err) => {
    console.error(`❌ Verification failed: Request error - ${err.message}`);
    cleanup(1);
  });
}

function cleanup(code) {
  if (server) {
    server.kill();
  }
  process.exit(code);
}

// Timeout after 30 seconds
setTimeout(() => {
  console.error('❌ Verification timed out');
  cleanup(1);
}, 30000);
