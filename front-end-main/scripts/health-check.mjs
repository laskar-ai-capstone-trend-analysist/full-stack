import axios from 'axios';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

async function healthCheck() {
  console.log('🏥 YAPin Health Check');
  console.log('====================\n');

  const checks = [
    {
      name: 'Backend API Health',
      check: async () => {
        const response = await axios.get(API_BASE_URL, { timeout: 5000 });
        return { status: 'healthy', details: `Status: ${response.status}` };
      },
    },
    {
      name: 'Products Endpoint',
      check: async () => {
        const response = await axios.get(`${API_BASE_URL}/getAllProduct`, {
          timeout: 10000,
        });
        const count = response.data.data?.length || 0;
        return { status: 'healthy', details: `${count} products available` };
      },
    },
    {
      name: 'Categories Endpoint',
      check: async () => {
        const response = await axios.get(`${API_BASE_URL}/getAllCategory`, {
          timeout: 5000,
        });
        const count = response.data.data?.length || 0;
        return { status: 'healthy', details: `${count} categories available` };
      },
    },
    {
      name: 'Reviews Endpoint',
      check: async () => {
        const response = await axios.get(`${API_BASE_URL}/getAllReview`, {
          timeout: 10000,
        });
        const count = response.data.data?.length || 0;
        return { status: 'healthy', details: `${count} reviews available` };
      },
    },
    {
      name: 'Recommendations API',
      check: async () => {
        const response = await axios.get(
          `${API_BASE_URL}/getRecommendProducts?product=1`,
          { timeout: 15000 }
        );
        const count = response.data.data?.length || 0;
        return { status: 'healthy', details: `${count} recommendations found` };
      },
    },
    {
      name: 'Review Summary API',
      check: async () => {
        const response = await axios.get(
          `${API_BASE_URL}/getReviewsSumOfProduct?product=1`,
          { timeout: 15000 }
        );
        const summaryLength = response.data.data?.summary?.length || 0;
        return {
          status: 'healthy',
          details: `Summary: ${summaryLength} characters`,
        };
      },
    },
  ];

  const results = [];

  for (const check of checks) {
    try {
      console.log(`🔍 Checking: ${check.name}...`);
      const result = await check.check();
      results.push({ name: check.name, ...result });
      console.log(`✅ ${check.name}: ${result.details}`);
    } catch (error) {
      results.push({
        name: check.name,
        status: 'unhealthy',
        details: error.message,
        error: error.code || 'UNKNOWN_ERROR',
      });
      console.log(`❌ ${check.name}: ${error.message}`);
    }
    console.log(''); // Empty line for readability
  }

  // Summary
  console.log('===================');
  console.log('📊 HEALTH SUMMARY');
  console.log('===================');

  const healthy = results.filter((r) => r.status === 'healthy').length;
  const total = results.length;

  console.log(`✅ Healthy: ${healthy}/${total}`);
  console.log(`❌ Unhealthy: ${total - healthy}/${total}`);

  if (healthy === total) {
    console.log('\n🎉 All systems operational!');
    console.log('🚀 YAPin is ready to use.');
    console.log('\n📝 Next Steps:');
    console.log('   • Run: npm run dev (start frontend)');
    console.log('   • Open: http://localhost:3000');
    console.log('   • Test: Click products to see recommendations');
  } else {
    console.log('\n⚠️ Some issues detected:');
    results
      .filter((r) => r.status === 'unhealthy')
      .forEach((result) => {
        console.log(`  • ${result.name}: ${result.details}`);
      });

    console.log('\n💡 Troubleshooting:');
    console.log('  • Check if backend is running: python main.py');
    console.log('  • Verify database connection in XAMPP');
    console.log('  • Check .env configuration');
    console.log('  • Ensure all dependencies installed: npm install');

    // Specific troubleshooting for AI endpoints
    const aiIssues = results.filter(
      (r) =>
        r.status === 'unhealthy' &&
        (r.name.includes('Recommendations') || r.name.includes('Summary'))
    );

    if (aiIssues.length > 0) {
      console.log('\n🤖 AI Endpoint Issues:');
      console.log('  • Check if AI models are properly loaded');
      console.log(
        '  • Verify Python dependencies: pip install -r requirements.txt'
      );
      console.log('  • Ensure review_summarization module is working');
      console.log('  • Check recomm_system module is working');
    }
  }

  return results;
}

// ✅ Fixed standalone execution check
async function main() {
  try {
    const results = await healthCheck();
    const allHealthy = results.every((r) => r.status === 'healthy');

    console.log(
      `\n🔚 Health check completed with ${allHealthy ? 'SUCCESS' : 'WARNINGS'}`
    );
    process.exit(allHealthy ? 0 : 1);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.log('\n🔍 Critical Issues:');
    console.log('  • Backend may not be running');
    console.log('  • Database connection failed');
    console.log('  • Network connectivity issues');
    process.exit(1);
  }
}

// Run if this is the main module
if (process.argv[1].endsWith('health-check.mjs')) {
  main();
}

export { healthCheck };
