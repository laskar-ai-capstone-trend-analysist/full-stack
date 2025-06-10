import axios from 'axios';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

// ✅ Extended test endpoints including new ones
const endpoints = [
  { name: 'Health Check', url: '/', method: 'GET' },
  { name: 'Get All Products', url: '/getAllProduct', method: 'GET' },
  { name: 'Get All Categories', url: '/getAllCategory', method: 'GET' },
  { name: 'Get All Reviews', url: '/getAllReview', method: 'GET' },
  {
    name: 'Search Products by Name',
    url: '/getAllProductsByName?name=jam',
    method: 'GET',
  },
  {
    name: 'Get Products by Category',
    url: '/getAllProductByCategory?category=1',
    method: 'GET',
  },
  {
    name: 'Get Reviews by Product',
    url: '/getAllReviewByProduct?product=1',
    method: 'GET',
  },
  {
    name: 'Get Reviews by Category',
    url: '/getAllReviewByCategory?category=1',
    method: 'GET',
  },
  {
    name: 'Get Sentiment by Product',
    url: '/getSentimentByProduct?product=1',
    method: 'GET',
  },
  // ✅ New endpoints
  {
    name: 'Get Recommend Products',
    url: '/getRecommendProducts?product=1',
    method: 'GET',
    isNew: true,
  },
  {
    name: 'Get Reviews Summary',
    url: '/getReviewsSumOfProduct?product=1',
    method: 'GET',
    isNew: true,
  },
];

async function testEndpoint(endpoint) {
  try {
    console.log(
      `🧪 Testing: ${endpoint.name}${endpoint.isNew ? ' (NEW)' : ''}`
    );
    const startTime = Date.now();

    const response = await axios({
      method: endpoint.method,
      url: `${API_BASE_URL}${endpoint.url}`,
      timeout: 30000, // Extended timeout for AI endpoints
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const duration = Date.now() - startTime;
    console.log(`✅ ${endpoint.name} - ${response.status} (${duration}ms)`);

    // Enhanced response data logging
    if (response.data && typeof response.data === 'object') {
      if (response.data.hasOwnProperty('error')) {
        console.log(`   Error Status: ${response.data.error}`);
        console.log(`   Message: ${response.data.message}`);

        if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            console.log(`   Data Count: ${response.data.data.length}`);
            if (response.data.data.length > 0) {
              console.log(
                `   Sample Data:`,
                JSON.stringify(response.data.data[0], null, 2).substring(
                  0,
                  200
                ) + '...'
              );
            }
          } else {
            console.log(`   Data Type: ${typeof response.data.data}`);
            console.log(
              `   Data Sample:`,
              JSON.stringify(response.data.data, null, 2).substring(0, 200) +
                '...'
            );
          }
        }

        // ✅ Special logging for new endpoints
        if (endpoint.isNew) {
          console.log(`   🆕 NEW ENDPOINT RESULT:`);
          if (
            endpoint.url.includes('getRecommendProducts') &&
            response.data.data
          ) {
            console.log(
              `   📊 Recommendations: ${response.data.data.length} products found`
            );
          }
          if (
            endpoint.url.includes('getReviewsSumOfProduct') &&
            response.data.data
          ) {
            console.log(
              `   📝 Summary Length: ${response.data.data.summary?.length || 0} characters`
            );
          }
        }
      }
    }

    return {
      success: true,
      status: response.status,
      duration,
      data: response.data,
    };
  } catch (error) {
    console.log(`❌ ${endpoint.name} - ${error.message}`);

    // Enhanced error reporting
    if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Backend server not running or not accessible');
      console.log(
        `   💡 Make sure Python server is running at: ${API_BASE_URL}`
      );
      console.log('   💡 Run: python main.py in back-end folder');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   💡 Request timeout - server might be slow');
      console.log('   💡 AI model endpoints might need more time');
    } else if (error.response) {
      console.log(
        `   💡 HTTP Error: ${error.response.status} - ${error.response.statusText}`
      );
      if (error.response.data) {
        console.log(
          `   💡 Error Detail:`,
          JSON.stringify(error.response.data, null, 2)
        );
      }
    }

    return {
      success: false,
      error: error.message,
      details: error.response?.data,
    };
  }
}

async function runFullTest() {
  console.log('🚀 Starting Comprehensive API Tests...\n');
  console.log(`Base URL: ${API_BASE_URL}\n`);
  console.log('='.repeat(60));

  const results = [];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ endpoint: endpoint.name, ...result });
    console.log(''); // Empty line for readability
  }

  // ✅ Summary Report
  console.log('='.repeat(60));
  console.log('📊 TEST SUMMARY REPORT');
  console.log('='.repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log('\n🎉 WORKING ENDPOINTS:');
    successful.forEach((result) => {
      console.log(`  ✓ ${result.endpoint} (${result.duration}ms)`);
    });
  }

  if (failed.length > 0) {
    console.log('\n🚨 FAILED ENDPOINTS:');
    failed.forEach((result) => {
      console.log(`  ✗ ${result.endpoint}: ${result.error}`);
    });
  }

  // ✅ New endpoints specific check
  const newEndpoints = results.filter(
    (r) =>
      r.endpoint.includes('Recommend Products') ||
      r.endpoint.includes('Reviews Summary')
  );

  console.log('\n🆕 NEW FEATURES STATUS:');
  newEndpoints.forEach((result) => {
    const status = result.success ? '✅ WORKING' : '❌ FAILED';
    console.log(`  ${status}: ${result.endpoint}`);
  });

  console.log('\n💡 NEXT STEPS:');
  if (failed.length === 0) {
    console.log('  🎯 All endpoints working! You can now:');
    console.log('     1. Start frontend: npm run dev');
    console.log('     2. Test product recommendations in the UI');
    console.log('     3. Check review summaries in product modals');
  } else {
    console.log('  🔧 Fix failed endpoints before proceeding');
    console.log('     1. Check database connection');
    console.log('     2. Verify AI model dependencies');
    console.log('     3. Check backend logs for errors');
  }
}

runFullTest().catch(console.error);
