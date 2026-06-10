import Module from 'module';
import fs from 'fs';
import path from 'path';

// Load .env variables manually before Prisma imports
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let value = trimmed.slice(idx + 1).trim();
        // Remove surrounding quotes if any
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  }
}

// Intercept 'server-only' resolution to allow running this script in vanilla node/tsx
const originalResolveFilename = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function(request: string, parent: any, isMain: boolean) {
  if (request === 'server-only') {
    return require.resolve('path');
  }
  return originalResolveFilename.apply(this, arguments);
};

async function runTest() {
  console.log("Starting Forgot Password Action verification...");

  // Dynamically import to ensure process.env.DATABASE_URL is set first
  const { requestPasswordReset } = await import('../src/lib/actions/auth');
  const { prisma } = await import('../src/lib/prisma');

  // 1. Create a dummy user first to make sure there is at least one active user to look up
  const testEmail = `user-${Date.now()}@testcompany.com`;
  console.log(`Creating dummy user with email: ${testEmail}`);
  const user = await prisma.user.create({
    data: {
      company_name: "Test Company Ltd",
      email: testEmail,
      password_hash: "hashedpassword123", // dummy hash
    }
  });
  console.log(`User created with ID: ${user.id}`);

  // 2. Test requestPasswordReset with invalid email
  console.log("\nTesting with invalid email format...");
  const invalidFormData = new FormData();
  invalidFormData.append('email', 'not-an-email');
  
  const res1 = await requestPasswordReset({}, invalidFormData);
  console.log("Response for invalid email:", res1);
  if (res1.errors?.email) {
    console.log("✅ Correctly rejected invalid email format.");
  } else {
    console.log("❌ Failed to reject invalid email format.");
  }

  // 3. Test requestPasswordReset with non-existing email
  console.log("\nTesting with non-existing email...");
  const nonExistFormData = new FormData();
  nonExistFormData.append('email', 'doesnotexist@company.com');
  const res2 = await requestPasswordReset({}, nonExistFormData);
  console.log("Response for non-existing email:", res2);
  if (res2.success && res2.message?.includes("sent password reset instructions")) {
    console.log("✅ Correctly returned general success message for non-existent email (security best practice).");
  } else {
    console.log("❌ Failed to handle non-existing email securely.");
  }

  // 4. Test requestPasswordReset with valid, existing email
  console.log("\nTesting with existing user email...");
  const validFormData = new FormData();
  validFormData.append('email', testEmail);
  const res3 = await requestPasswordReset({}, validFormData);
  console.log("Response for existing email:", res3);
  if (res3.success && res3.message?.includes("sent password reset instructions")) {
    console.log("✅ Success! Sent password reset instructions message returned.");
  } else {
    console.log("❌ Failed to process existing email.");
  }

  // Clean up
  console.log("\nCleaning up dummy user...");
  await prisma.user.delete({
    where: { id: user.id }
  });
  console.log("Cleanup complete!");
}

runTest().catch(err => {
  console.error("Test failed with error:", err);
});
