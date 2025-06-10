import { config } from 'dotenv';
import { spawn } from 'child_process';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { verifyNewFeatures } from './verify-features.mjs';

// Load environment variables
config({ path: '.env.local' });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

async function checkBackend() {
  try {
    const response = await axios.get(API_BASE_URL, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

// ✅ Fixed package manager detection - make it sync function
function detectPackageManager() {
  // Check for lock files to determine package manager
  if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(process.cwd(), 'bun.lockb'))) {
    return 'bun';
  }
  // Default to npm
  return 'npm';
}

async function startComplete() {
  console.log('🚀 YAPin - Complete Setup & Verification');
  console.log('==========================================\n');

  // Check backend
  console.log('1️⃣ Checking backend connection...');
  const backendRunning = await checkBackend();

  if (!backendRunning) {
    console.log('❌ Backend not running!');
    console.log('💡 Please start backend first:');
    console.log('   cd back-end-main');
    console.log('   python main.py');
    console.log('\n🔍 Troubleshooting:');
    console.log('   • Make sure XAMPP MySQL is running');
    console.log('   • Check if port 5000 is available');
    console.log('   • Verify .env file configuration');
    return;
  }
  console.log('✅ Backend is running!\n');

  // Verify new features
  console.log('2️⃣ Verifying new features...');
  try {
    const verificationResults = await verifyNewFeatures();
    const allPassed = verificationResults.every((r) => r.success);

    if (!allPassed) {
      console.log('❌ Feature verification failed!');
      console.log('🔧 Please fix the issues above before continuing.');
      console.log('\n💡 Common fixes:');
      console.log('   • Run: npm install (if components missing)');
      console.log('   • Check TypeScript files for syntax errors');
      console.log('   • Verify API endpoints are working');
      return;
    }
  } catch (error) {
    console.log('⚠️ Feature verification had issues, but continuing...');
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n3️⃣ Starting frontend development server...');

  // Detect package manager
  const packageManager = detectPackageManager();
  console.log(`📦 Using package manager: ${packageManager}`);

  try {
    // Start frontend with detected package manager
    const frontend = spawn(packageManager, ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        FORCE_COLOR: '1', // Enable colors in terminal
      },
    });

    console.log('✅ Frontend development server starting...');
    console.log('\n🎯 YAPIN is now fully operational!');
    console.log('📱 Frontend: http://localhost:3000');
    console.log('🔗 Backend API: http://localhost:5000');

    console.log('\n🆕 NEW FEATURES TO TEST:');
    console.log('   • 🎯 Product recommendations (click any product)');
    console.log('   • 📝 Review summaries (in product modal > Overview tab)');
    console.log('   • 🏠 Homepage recommendations section');
    console.log('   • 🖼️ Enhanced product modal with tabs');
    console.log('   • 🤖 AI-powered sentiment analysis');

    console.log('\n📋 Development Workflow:');
    console.log('   1. Open http://localhost:3000 in browser');
    console.log('   2. Click any product to open modal');
    console.log('   3. Check "Overview" tab for review summary');
    console.log('   4. Check "Recommendations" tab for AI suggestions');
    console.log('   5. Scroll homepage to see recommendation section');

    console.log('\n🛠️ Development Commands:');
    console.log(`   • Test API: ${packageManager} run test:api`);
    console.log(`   • Health check: ${packageManager} run health-check`);
    console.log(`   • Build: ${packageManager} run build`);
    console.log(`   • Lint: ${packageManager} run lint`);

    // Error handling for frontend process
    frontend.on('error', (error) => {
      console.error('\n❌ Frontend process error:', error.message);
      console.log('💡 Try running manually:');
      console.log(`   ${packageManager} run dev`);
    });

    frontend.on('exit', (code, signal) => {
      if (code !== 0 && code !== null) {
        console.log(`\n⚠️ Frontend process exited with code ${code}`);
      }
      if (signal) {
        console.log(`\n⚠️ Frontend process killed with signal ${signal}`);
      }
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down gracefully...');
      frontend.kill('SIGTERM');

      // Give process time to cleanup
      setTimeout(() => {
        console.log('👋 YAPin development session ended.');
        process.exit(0);
      }, 1000);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM, shutting down...');
      frontend.kill('SIGTERM');
      process.exit(0);
    });

    // Keep the process alive
    process.stdin.resume();
  } catch (error) {
    console.error('❌ Failed to start frontend:', error.message);
    console.log('\n💡 Try starting manually:');
    console.log(`   ${packageManager} run dev`);
  }
}

// Enhanced error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('💡 This might indicate a configuration issue.');
  console.log('🔍 Check your .env.local file and backend connection.');
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.log('💡 This might indicate a serious issue.');
  console.log('🔍 Please check your Node.js version and dependencies.');
  process.exit(1);
});

// Start the application
startComplete().catch((error) => {
  console.error('❌ Failed to start YAPin:', error.message);
  console.log('\n🔍 Troubleshooting steps:');
  console.log('   1. Check if backend is running on port 5000');
  console.log('   2. Verify .env.local configuration');
  console.log('   3. Run: npm install to ensure dependencies');
  console.log('   4. Check for TypeScript errors: npm run type-check');
  process.exit(1);
});
