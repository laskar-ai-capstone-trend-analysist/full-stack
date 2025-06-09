import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config({ path: '.env.local' });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

const endpoints = [
  { name: 'Health Check', url: '/' },
  { name: 'Get All Products', url: '/getAllProduct' },
  { name: 'Get All Categories', url: '/getAllCategory' },
  { name: 'Get All Reviews', url: '/getAllReview' },
  { name: 'Search Products by Name', url: '/getAllProductsByName?name=jam' },
  {
    name: 'Get Products by Category',
    url: '/getAllProductByCategory?category=1',
  },
  { name: 'Get Reviews by Product', url: '/getAllReviewByProduct?product=1' },
  {
    name: 'Get Reviews by Category',
    url: '/getAllReviewByCategory?category=1',
  },
  { name: 'Get Sentiment by Product', url: '/getSentimentByProduct?product=1' },
];

async function testEndpoint(endpoint) {
  try {
    console.log(`🧪 Testing: ${endpoint.name}`);
    const startTime = Date.now();

    const response = await axios.get(`${API_BASE_URL}${endpoint.url}`, {
      timeout: 15000, // Increase timeout for AI model endpoints
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const duration = Date.now() - startTime;
    console.log(`✅ ${endpoint.name} - ${response.status} (${duration}ms)`);

    // Enhanced response data logging
    if (response.data && typeof response.data === 'object') {
      // Check for backend API response format: { error, message, data }
      if (response.data.hasOwnProperty('error')) {
        console.log(`   Error Status: ${response.data.error}`);
        console.log(`   Message: ${response.data.message}`);

        if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            console.log(`   Data Count: ${response.data.data.length}`);
            if (response.data.data.length > 0) {
              console.log(
                `   Sample Data: ${JSON.stringify(response.data.data[0], null, 2)}`
              );
            }
          } else {
            console.log(`   Data Type: ${typeof response.data.data}`);
            console.log(
              `   Data: ${JSON.stringify(response.data.data, null, 2)}`
            );
          }
        }
      } else {
        // For endpoints that might return different formats
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      }
    }

    return { success: true, status: response.status, duration };
  } catch (error) {
    console.log(`❌ ${endpoint.name} - ${error.message}`);

    // Enhanced error reporting with specific backend context
    if (error.code === 'ECONNREFUSED') {
      console.log(
        '   💡 Backend server tidak berjalan atau tidak dapat diakses'
      );
      console.log(`   💡 Pastikan server Python berjalan di: ${API_BASE_URL}`);
      console.log('   💡 Jalankan: python main.py di folder back-end');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   💡 Request timeout - server mungkin lambat merespons');
      console.log(
        '   💡 AI model endpoints mungkin membutuhkan waktu lebih lama'
      );
    } else if (error.response) {
      console.log(
        `   💡 HTTP Error: ${error.response.status} - ${error.response.statusText}`
      );
      if (error.response.data) {
        console.log(
          `   💡 Error Detail: ${JSON.stringify(error.response.data, null, 2)}`
        );
      }
    } else if (error.code === 'ENOTFOUND') {
      console.log('   💡 DNS lookup failed - periksa URL backend');
    }

    return { success: false, error: error.message };
  }
}

async function checkDatabaseConnection() {
  try {
    console.log('🗄️  Checking database connection...');

    // Test dengan endpoint yang pasti ada data
    const response = await axios.get(`${API_BASE_URL}/getAllCategory`, {
      timeout: 5000,
    });

    if (response.data.error === false && response.data.data.length > 0) {
      console.log('✅ Database connection working');
      console.log(`   Categories found: ${response.data.data.length}`);
      return true;
    } else {
      console.log('⚠️  Database might be empty or not properly configured');
      return false;
    }
  } catch (error) {
    console.log('❌ Database connection failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  console.log(`Base URL: ${API_BASE_URL}\n`);

  // Check if API_BASE_URL is properly set
  if (!API_BASE_URL || API_BASE_URL === 'undefined') {
    console.error('❌ API_BASE_URL tidak terdefinisi!');
    console.error(
      '💡 Pastikan file .env.local ada dan berisi NEXT_PUBLIC_API_URL'
    );
    console.error('💡 Contoh: NEXT_PUBLIC_API_URL=http://127.0.0.1:5000');
    process.exit(1);
  }

  // Check database connection first
  const dbConnected = await checkDatabaseConnection();
  console.log(''); // Empty line

  const results = [];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ ...endpoint, ...result });
    console.log(''); // Empty line for readability
  }

  // Summary
  console.log('📊 Test Summary:');
  console.log('================');

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  console.log(`🗄️  Database: ${dbConnected ? 'Connected' : 'Issues detected'}`);

  if (failed > 0) {
    console.log('\n🚨 Failed endpoints:');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`   - ${r.name}: ${r.error}`));

    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Pastikan backend server berjalan: python main.py');
    console.log(
      '2. Verifikasi .env.local berisi NEXT_PUBLIC_API_URL=http://127.0.0.1:5000'
    );
    console.log('3. Pastikan database MySQL berjalan (XAMPP)');
    console.log('4. Cek apakah file db.sql sudah di-import');
    console.log('5. Verifikasi file .env di backend sudah dikonfigurasi');
    console.log('6. Jalankan health check: npm run health-check');
  }

  console.log('\n🏁 Tests completed!');
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error('💥 Test runner error:', error);
  process.exit(1);
});
