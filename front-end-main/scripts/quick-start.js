require('dotenv').config({ path: '.env.local' });
const { spawn } = require('child_process');
const axios = require('axios');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

async function checkBackend() {
  try {
    console.log('🔍 Checking backend status...');
    console.log(`URL: ${API_BASE_URL}`);

    // Health check
    const healthResponse = await axios.get(`${API_BASE_URL}/`, {
      timeout: 5000,
    });
    console.log('✅ Backend server is responding!');
    console.log(`Status: ${healthResponse.status}`);

    // Check database connection
    console.log('🗄️  Checking database connection...');
    const dbResponse = await axios.get(`${API_BASE_URL}/getAllCategory`, {
      timeout: 5000,
    });

    if (dbResponse.data.error === false && dbResponse.data.data.length > 0) {
      console.log('✅ Database connection successful!');
      console.log(`Categories found: ${dbResponse.data.data.length}`);
    } else {
      console.log('⚠️  Database might be empty or not configured');
      console.log('💡 Please check if db.sql has been imported');
    }

    // Test AI model endpoint (optional)
    try {
      console.log('🤖 Testing AI model endpoint...');
      const aiResponse = await axios.get(
        `${API_BASE_URL}/getSentimentByProduct?product=1`,
        {
          timeout: 10000,
        }
      );

      if (aiResponse.data.error === false) {
        console.log('✅ AI sentiment model is working!');
      } else {
        console.log('⚠️  AI model endpoint accessible but might have issues');
      }
    } catch (aiError) {
      console.log('⚠️  AI model endpoint not responding (this is optional)');
      console.log(`   Error: ${aiError.message}`);
    }

    return true;
  } catch (error) {
    console.log('❌ Backend is not running or not accessible');
    console.log(`Error: ${error.message}`);

    console.log('\n💡 Backend Setup Instructions:');
    console.log('1. Navigate to back-end directory: cd back-end');
    console.log(
      '2. Install Python dependencies: pip install -r requirements.txt'
    );
    console.log('3. Start MySQL server (XAMPP)');
    console.log('4. Import database: Import db.sql to phpMyAdmin');
    console.log('5. Configure .env file in back-end directory');
    console.log('6. Start backend server: python main.py');
    console.log(`\n💡 Current API URL: ${API_BASE_URL}`);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Common Issues:');
      console.log('• Backend server not running (python main.py)');
      console.log('• Port 5000 might be occupied by another process');
      console.log('• Firewall blocking the connection');
      console.log('• Wrong API URL in .env.local file');
    }

    return false;
  }
}

async function startFrontend() {
  console.log('🚀 Starting frontend development server...');
  console.log('📱 Opening at: http://localhost:3000');

  const child = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('close', (code) => {
    console.log(`Frontend server exited with code ${code}`);
  });

  child.on('error', (error) => {
    console.error('Error starting frontend server:', error);
    console.log('\n💡 Frontend Troubleshooting:');
    console.log('1. Make sure you are in the front-end directory');
    console.log('2. Run: npm install');
    console.log('3. Check if port 3000 is available');
  });
}

async function checkEnvironment() {
  console.log('🔧 Checking environment configuration...');

  // Check .env.local file
  const fs = require('fs');
  const path = require('path');

  const envPath = path.join(process.cwd(), '.env.local');

  if (fs.existsSync(envPath)) {
    console.log('✅ .env.local file found');

    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('NEXT_PUBLIC_API_URL')) {
      console.log('✅ API URL configured');
    } else {
      console.log('⚠️  NEXT_PUBLIC_API_URL not found in .env.local');
      console.log('💡 Add: NEXT_PUBLIC_API_URL=http://127.0.0.1:5000');
    }
  } else {
    console.log('⚠️  .env.local file not found');
    console.log(
      '💡 Create .env.local with: NEXT_PUBLIC_API_URL=http://127.0.0.1:5000'
    );

    // Create .env.local automatically
    try {
      fs.writeFileSync(
        envPath,
        'NEXT_PUBLIC_API_URL=http://127.0.0.1:5000\nNEXT_PUBLIC_DEBUG_MODE=true\n'
      );
      console.log('✅ .env.local created automatically');
    } catch (writeError) {
      console.log('❌ Failed to create .env.local automatically');
    }
  }
}

async function main() {
  console.log('🎯 Tokopedia Trends - Quick Start');
  console.log('================================\n');

  // Check environment first
  await checkEnvironment();
  console.log('');

  // Check if API_BASE_URL is properly configured
  if (!API_BASE_URL || API_BASE_URL === 'undefined') {
    console.error('❌ API_BASE_URL tidak terdefinisi!');
    console.error('💡 Pastikan file .env.local ada dan berisi:');
    console.error('   NEXT_PUBLIC_API_URL=http://127.0.0.1:5000');
    process.exit(1);
  }

  const backendRunning = await checkBackend();

  if (backendRunning) {
    console.log('\n✅ Backend verification successful!');
    console.log('📱 Starting frontend development server...\n');
    await startFrontend();
  } else {
    console.log('\n❌ Backend verification failed!');
    console.log('🛑 Cannot start frontend without backend connection.');
    console.log('\n🔄 You can still start frontend manually with: npm run dev');
    console.log(
      '   But some features may not work without backend connection.'
    );

    // Ask user if they want to start anyway
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question('\nStart frontend anyway? (y/N): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('\n⚠️  Starting frontend without backend verification...');
        startFrontend();
      } else {
        console.log('\n🛑 Startup cancelled. Please fix backend issues first.');
        process.exit(1);
      }
      readline.close();
    });
  }
}

main().catch((error) => {
  console.error('💥 Quick start error:', error);
  process.exit(1);
});
