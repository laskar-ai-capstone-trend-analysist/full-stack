import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

async function testConnection() {
  console.log('🔍 Testing backend connection...');
  console.log('📍 API Base URL:', API_BASE_URL);

  try {
    // Test health check
    console.log('\n1. Testing health check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ Health check successful:', healthResponse.data);

    // Test getAllProduct
    console.log('\n2. Testing getAllProduct...');
    const productsResponse = await axios.get(`${API_BASE_URL}/getAllProduct`);
    console.log('✅ Products fetch successful:', {
      error: productsResponse.data.error,
      message: productsResponse.data.message,
      dataType: Array.isArray(productsResponse.data.data)
        ? 'array'
        : typeof productsResponse.data.data,
      dataCount: productsResponse.data.data?.length || 0,
      isNull: productsResponse.data.data === null,
      isUndefined: productsResponse.data.data === undefined,
    });

    // Test getAllCategory
    console.log('\n3. Testing getAllCategory...');
    const categoriesResponse = await axios.get(
      `${API_BASE_URL}/getAllCategory`
    );
    console.log('✅ Categories fetch successful:', {
      error: categoriesResponse.data.error,
      message: categoriesResponse.data.message,
      dataType: Array.isArray(categoriesResponse.data.data)
        ? 'array'
        : typeof categoriesResponse.data.data,
      dataCount: categoriesResponse.data.data?.length || 0,
      isNull: categoriesResponse.data.data === null,
      isUndefined: categoriesResponse.data.data === undefined,
    });
  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('No response received - backend mungkin tidak berjalan');
    }
  }
}

testConnection();
