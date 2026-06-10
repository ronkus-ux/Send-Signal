import { registerUser } from '../src/lib/actions/auth';

async function test() {
  const formData = new FormData();
  formData.append('name', 'Acme Corp');
  formData.append('email', `test-${Date.now()}@acme.com`);
  formData.append('password', 'Password123!');

  console.log("Calling registerUser...");
  try {
    const result = await registerUser({}, formData);
    console.log("Result:", result);
  } catch (err) {
    console.error("Caught error:", err);
  }
}

test();
