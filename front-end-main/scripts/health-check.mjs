import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '.env.local' });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

async function healthCheck() {
  try {
    console.log('🏥 Checking API Health...');
    console.log(`URL: ${API_BASE_URL}`);

    const startTime = Date.now();
    const response = await axios.get(`${API_BASE_URL}/`, {
      timeout: 5000,
    });
    const duration = Date.now() - startTime;

    if (response.status === 200) {
      console.log(`✅ API is healthy! (${duration}ms)`);
      console.log(`Status: ${response.status}`);
      console.log(`Response: ${JSON.stringify(response.data, null, 2)}`);
      process.exit(0);
    } else {
      console.log(`⚠️ API responded with status: ${response.status}`);
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ API is not responding');
    console.log(`Error: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Make sure the backend server is running');
      console.log('2. Check if the port 5000 is correct');
      console.log('3. Verify the API_BASE_URL in .env.local');
      console.log(`4. Current URL being tested: ${API_BASE_URL}`);
    }

    process.exit(1);
  }
}

healthCheck();
