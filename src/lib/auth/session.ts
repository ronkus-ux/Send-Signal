import 'server-only';
import { cookies } from 'next/headers';
import { prisma } from '../prisma';
import { generateSessionToken, hashToken } from './crypto';

const SESSION_COOKIE_NAME = 'send_signal_session';
const SESSION_EXPIRATION_DAYS = 30;

export async function createSession(userId: string) {
  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_EXPIRATION_DAYS);

  await prisma.session.create({
    data: {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (token) {
    const tokenHash = hashToken(token);
    await prisma.session.deleteMany({
      where: { token_hash: tokenHash },
    });
  }
  
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) return null;
  
  const tokenHash = hashToken(token);
  const session = await prisma.session.findUnique({
    where: { token_hash: tokenHash },
    include: { user: true },
  });
  
  if (!session) return null;
  
  if (session.expires_at < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  
  return session;
}
