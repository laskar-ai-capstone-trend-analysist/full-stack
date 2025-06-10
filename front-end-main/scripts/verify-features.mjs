import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, '..', '.env.local') });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export async function verifyNewFeatures() {
  console.log('🔍 YAPIN - Verifikasi Fitur Baru');
  console.log('=====================================\n');

  const tests = [
    {
      name: 'Backend Connection',
      test: async () => {
        try {
          const response = await axios.get(API_BASE_URL, { timeout: 5000 });
          return {
            success: true,
            details: `Backend is running (Status: ${response.status})`,
            data: response.data,
          };
        } catch (error) {
          return {
            success: false,
            details: `Backend not accessible: ${error.message}`,
            data: null,
          };
        }
      },
    },
    {
      name: 'Product Recommendations API',
      test: async () => {
        const response = await axios.get(
          `${API_BASE_URL}/getRecommendProducts?product=1`,
          { timeout: 15000 }
        );
        return {
          success: response.data.error === false,
          details: `Found ${response.data.data?.length || 0} recommendations`,
          data: response.data,
        };
      },
    },
    {
      name: 'Review Summary API',
      test: async () => {
        const response = await axios.get(
          `${API_BASE_URL}/getReviewsSumOfProduct?product=1`,
          { timeout: 15000 }
        );
        return {
          success: response.data.error === false,
          details: `Summary length: ${response.data.data?.summary?.length || 0} chars`,
          data: response.data,
        };
      },
    },
    {
      name: 'Frontend Components',
      test: async () => {
        const projectRoot = path.join(__dirname, '..');
        const components = [
          'src/components/product/ProductRecommendations.tsx',
          'src/components/review/ReviewSummary.tsx',
          'src/components/product/ProductModal.tsx',
        ];

        const exists = components.map((comp) => {
          const fullPath = path.join(projectRoot, comp);
          return {
            component: path.basename(comp),
            exists: fs.existsSync(fullPath),
            path: comp,
          };
        });

        const allExist = exists.every((c) => c.exists);
        return {
          success: allExist,
          details: `Components: ${exists.map((c) => c.component + (c.exists ? '✓' : '✗')).join(', ')}`,
          data: exists,
        };
      },
    },
    {
      name: 'API Client Updates',
      test: async () => {
        const projectRoot = path.join(__dirname, '..');
        const apiFilePath = path.join(projectRoot, 'src/lib/api.ts');

        if (!fs.existsSync(apiFilePath)) {
          return { success: false, details: 'API file not found' };
        }

        const content = fs.readFileSync(apiFilePath, 'utf8');
        const hasRecommendations = content.includes('getRecommendations');
        const hasSummary = content.includes('getSummary');

        return {
          success: hasRecommendations && hasSummary,
          details: `Recommendations: ${hasRecommendations ? '✓' : '✗'}, Summary: ${hasSummary ? '✓' : '✗'}`,
          data: { hasRecommendations, hasSummary },
        };
      },
    },
    {
      name: 'TypeScript Interfaces',
      test: async () => {
        const projectRoot = path.join(__dirname, '..');
        const typesFilePath = path.join(projectRoot, 'src/lib/types.ts');

        if (!fs.existsSync(typesFilePath)) {
          return { success: false, details: 'Types file not found' };
        }

        const content = fs.readFileSync(typesFilePath, 'utf8');
        const hasRecommendedProduct = content.includes('RecommendedProduct');
        const hasReviewSummary = content.includes('ReviewSummary');

        return {
          success: hasRecommendedProduct && hasReviewSummary,
          details: `RecommendedProduct: ${hasRecommendedProduct ? '✓' : '✗'}, ReviewSummary: ${hasReviewSummary ? '✓' : '✗'}`,
          data: { hasRecommendedProduct, hasReviewSummary },
        };
      },
    },
    {
      name: 'Custom Hooks',
      test: async () => {
        const projectRoot = path.join(__dirname, '..');
        const hooks = [
          { file: 'src/hooks/useProducts.ts', methods: ['getRecommendations'] },
          { file: 'src/hooks/useReviews.ts', methods: ['getReviewSummary'] },
        ];

        const results = hooks.map((hook) => {
          const hookPath = path.join(projectRoot, hook.file);
          if (!fs.existsSync(hookPath)) {
            return { name: hook.file, exists: false, methods: [] };
          }

          const content = fs.readFileSync(hookPath, 'utf8');
          const foundMethods = hook.methods.filter((method) =>
            content.includes(method)
          );

          return {
            name: path.basename(hook.file),
            exists: true,
            methods: foundMethods,
            expectedMethods: hook.methods,
          };
        });

        const allHooksValid = results.every(
          (result) =>
            result.exists &&
            result.methods.length === result.expectedMethods.length
        );

        return {
          success: allHooksValid,
          details: results
            .map(
              (r) =>
                `${r.name}: ${r.exists ? '✓' : '✗'} (${r.methods?.length || 0}/${r.expectedMethods?.length || 0} methods)`
            )
            .join(', '),
          data: results,
        };
      },
    },
    {
      name: 'Integration Test',
      test: async () => {
        // Test if homepage has recommendation integration
        const projectRoot = path.join(__dirname, '..');
        const pageFilePath = path.join(projectRoot, 'src/app/page.tsx');

        if (!fs.existsSync(pageFilePath)) {
          return { success: false, details: 'Homepage file not found' };
        }

        const content = fs.readFileSync(pageFilePath, 'utf8');
        const hasRecommendationImport = content.includes(
          'ProductRecommendations'
        );
        const hasRecommendationUsage = content.includes('showRecommendations');
        const hasRecommendationComponent = content.includes(
          '<ProductRecommendations'
        );

        const integrationScore = [
          hasRecommendationImport,
          hasRecommendationUsage,
          hasRecommendationComponent,
        ].filter(Boolean).length;

        return {
          success: integrationScore === 3,
          details: `Integration: ${integrationScore}/3 components (Import: ${hasRecommendationImport ? '✓' : '✗'}, Usage: ${hasRecommendationUsage ? '✓' : '✗'}, Component: ${hasRecommendationComponent ? '✓' : '✗'})`,
          data: {
            hasRecommendationImport,
            hasRecommendationUsage,
            hasRecommendationComponent,
            score: integrationScore,
          },
        };
      },
    },
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`🧪 Testing: ${test.name}`);
      const result = await test.test();
      results.push({ name: test.name, ...result });

      if (result.success) {
        console.log(`✅ PASS: ${result.details}\n`);
      } else {
        console.log(`❌ FAIL: ${result.details}\n`);
      }
    } catch (error) {
      results.push({
        name: test.name,
        success: false,
        details: error.message,
        error: error,
      });
      console.log(`❌ ERROR: ${test.name} - ${error.message}\n`);
    }
  }

  // Summary
  console.log('=====================================');
  console.log('📊 SUMMARY RESULTS');
  console.log('=====================================');

  const passed = results.filter((r) => r.success).length;
  const total = results.length;

  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);

  // Detailed breakdown
  if (passed > 0) {
    console.log('\n🎉 WORKING FEATURES:');
    results
      .filter((r) => r.success)
      .forEach((result) => {
        console.log(`  ✓ ${result.name}`);
      });
  }

  if (passed < total) {
    console.log('\n🚨 FAILED FEATURES:');
    results
      .filter((r) => !r.success)
      .forEach((result) => {
        console.log(`  ✗ ${result.name}: ${result.details}`);
      });
  }

  if (passed === total) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('🚀 Fitur baru siap digunakan!');
    console.log('\n📋 What to do next:');
    console.log('   1. Start frontend: npm run dev');
    console.log('   2. Test recommendations di UI');
    console.log('   3. Check review summaries di product modal');
    console.log('   4. Verify homepage recommendations section');
    console.log('\n🎯 Key Features to Test:');
    console.log('   • Click any product → Modal opens');
    console.log('   • Check "Overview" tab → Review summary');
    console.log('   • Check "Recommendations" tab → AI suggestions');
    console.log('   • Scroll homepage → "Mungkin Anda Juga Suka" section');
  } else {
    console.log('\n🔧 Some tests failed. Check the details above.');
    console.log('\n💡 Quick fixes:');
    console.log('   • API issues: Ensure backend is running');
    console.log('   • Component issues: Check file paths and imports');
    console.log('   • Hook issues: Verify function implementations');
    console.log('   • Integration issues: Check component usage in pages');
  }

  return results;
}

// ✅ Fixed standalone execution detection
async function main() {
  console.log('🔍 Running YAPin Feature Verification...\n');

  try {
    const results = await verifyNewFeatures();

    // Exit with appropriate code
    const allPassed = results.every((r) => r.success);
    console.log(
      `\n🎯 Verification completed with exit code: ${allPassed ? 0 : 1}`
    );
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.log('\n🔍 Check your setup:');
    console.log('   • Backend running on port 5000');
    console.log('   • All dependencies installed');
    console.log('   • Files in correct locations');
    process.exit(1);
  }
}

// Run if this is the main module
if (process.argv[1].endsWith('verify-features.mjs')) {
  main();
}
