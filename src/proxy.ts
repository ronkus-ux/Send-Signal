import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('send_signal_session');

  // If trying to access dashboard and no session cookie is present, redirect to login
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If trying to access login/register/forgot-password/reset-password while already authenticated, redirect to dashboard
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/forgot-password') ||
    request.nextUrl.pathname.startsWith('/reset-password')
  ) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Matcher to specify which routes this proxy runs on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
