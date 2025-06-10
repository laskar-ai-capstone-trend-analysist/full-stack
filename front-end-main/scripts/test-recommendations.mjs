import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

console.log('🧪 Testing Fixed Product Recommendations API\n');

async function testFixed() {
  try {
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get(API_BASE_URL, { timeout: 5000 });
    console.log('✅ Backend is running!');
    console.log('   Status:', healthResponse.status);

    console.log('\n2. Testing basic endpoints...');

    // Test products endpoint
    try {
      const productsResponse = await axios.get(
        `${API_BASE_URL}/getAllProduct`,
        { timeout: 10000 }
      );
      console.log('✅ Products endpoint working!');
      console.log(
        `   Found ${productsResponse.data.data?.length || 0} products`
      );
    } catch (error) {
      console.log('❌ Products endpoint failed:', error.message);
    }

    console.log('\n3. Testing recommendations (with fallback)...');
    const productId = 1;

    try {
      const recResponse = await axios.get(
        `${API_BASE_URL}/getRecommendProducts`,
        {
          params: { product: productId },
          timeout: 30000,
        }
      );

      console.log('✅ Recommendations endpoint responded!');
      console.log('   Error status:', recResponse.data.error);
      console.log('   Message:', recResponse.data.message);
      console.log('   Data count:', recResponse.data.data?.length || 0);

      if (recResponse.data.data && recResponse.data.data.length > 0) {
        console.log(
          '   Sample item:',
          recResponse.data.data[0].name || recResponse.data.data[0]
        );
      }
    } catch (error) {
      console.log('❌ Recommendations failed:', error.message);
      if (error.response) {
        console.log('   Response status:', error.response.status);
        console.log(
          '   Response data:',
          JSON.stringify(error.response.data, null, 2)
        );
      }
    }

    console.log('\n4. Testing review summary (with fallback)...');

    try {
      const summaryResponse = await axios.get(
        `${API_BASE_URL}/getReviewsSumOfProduct`,
        {
          params: { product: productId },
          timeout: 30000,
        }
      );

      console.log('✅ Review summary endpoint responded!');
      console.log('   Error status:', summaryResponse.data.error);
      console.log('   Message:', summaryResponse.data.message);
      console.log(
        '   Summary preview:',
        summaryResponse.data.data?.summary?.substring(0, 100) + '...'
      );
    } catch (error) {
      console.log('❌ Review summary failed:', error.message);
      if (error.response) {
        console.log('   Response status:', error.response.status);
        console.log(
          '   Response data:',
          JSON.stringify(error.response.data, null, 2)
        );
      }
    }

    console.log('\n🎉 Testing completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend is not running. Please start it:');
      console.log('   cd back-end-main');
      console.log('   python main.py');
    }
  }
}

testFixed();
