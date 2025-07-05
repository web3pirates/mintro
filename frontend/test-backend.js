// Simple test script to check backend connectivity
const axios = require('axios');

async function testBackend() {
  console.log('🔍 Testing backend connectivity...\n');
  
  const baseURL = 'http://localhost:5001';
  
  try {
    // Test 1: Health endpoint (without /api prefix)
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health endpoint working:', healthResponse.data);
    
    // Test 2: Stats endpoint
    console.log('\n2️⃣ Testing stats endpoint...');
    const statsResponse = await axios.get(`${baseURL}/api/transactions/stats`);
    console.log('✅ Stats endpoint working:', statsResponse.data);
    
    console.log('\n🎉 Backend is running and accessible!');
    
  } catch (error) {
    console.error('\n❌ Backend test failed:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   Backend server is not running on port 5001');
      console.error('   Please start your backend server first');
    } else if (error.response) {
      console.error('   HTTP Error:', error.response.status, error.response.statusText);
      console.error('   URL:', error.config.url);
    } else {
      console.error('   Network Error:', error.message);
    }
    
    console.log('\n💡 To start the backend:');
    console.log('   1. Follow the BACKEND_SETUP.md guide');
    console.log('   2. Run: npm run dev (in backend directory)');
    console.log('   3. Make sure to use port 5001 (not 5000)');
  }
}

testBackend(); 