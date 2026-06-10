import { prisma } from '../src/lib/prisma';
import { hashPassword, generateSessionToken, hashToken } from '../src/lib/auth/crypto';

async function test() {
  const email = `test-${Date.now()}@acme.com`;
  const name = "Acme Corp";
  const password = "Password123!";

  console.log("1. Checking existing user...");
  let existingUser;
  try {
    existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log("✅ existingUser check passed! Result:", existingUser);
  } catch (err) {
    console.error("❌ existingUser check failed:", err);
    return;
  }

  console.log("\n2. Hashing password...");
  let hashedPassword = "";
  try {
    hashedPassword = hashPassword(password);
    console.log("✅ Password hashed! Result:", hashedPassword);
  } catch (err) {
    console.error("❌ Hashing failed:", err);
    return;
  }

  console.log("\n3. Creating user in database...");
  let user;
  try {
    user = await prisma.user.create({
      data: {
        company_name: name,
        email,
        password_hash: hashedPassword,
      },
    });
    console.log("✅ User created successfully! Result:", user.id);
  } catch (err) {
    console.error("❌ User creation failed:", err);
    return;
  }

  console.log("\n4. Generating and hashing session token...");
  let tokenHash;
  try {
    const token = generateSessionToken();
    tokenHash = hashToken(token);
    console.log("✅ Token hashed! Result:", tokenHash);
  } catch (err) {
    console.error("❌ Token hashing failed:", err);
    return;
  }

  console.log("\n5. Creating session in database...");
  try {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const session = await prisma.session.create({
      data: {
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    });
    console.log("✅ Session created successfully in database! Result:", session);
  } catch (err) {
    console.error("❌ Session creation failed in database:", err);
    return;
  }
}

test();
