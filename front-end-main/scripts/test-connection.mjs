import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

console.log('🔍 Testing Backend Connection\n');

async function testConnection() {
  try {
    console.log('1. Testing basic connectivity...');

    // Test dengan curl equivalent
    const response = await axios.get(API_URL, {
      timeout: 5000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Connection successful!');
    console.log('   Status:', response.status);
    console.log('   Data:', response.data);

    console.log('\n2. Testing products endpoint...');
    const productsResponse = await axios.get(`${API_URL}/getAllProduct`, {
      timeout: 10000,
    });

    console.log('✅ Products endpoint working!');
    console.log('   Products count:', productsResponse.data.data?.length || 0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('   Code:', error.code);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend is not running. Steps to fix:');
      console.log('   1. cd back-end-main');
      console.log('   2. python main.py');
      console.log('   3. Wait for "Running on http://127.0.0.1:5000"');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 DNS resolution failed. Try:');
      console.log('   • Use 127.0.0.1 instead of localhost');
      console.log('   • Check your hosts file');
    } else {
      console.log('\n💡 Other error details:');
      console.log('   • Response:', error.response?.data);
      console.log('   • Status:', error.response?.status);
    }
  }
}

testConnection();
