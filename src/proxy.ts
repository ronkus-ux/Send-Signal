import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('send_signal_session')?.value;
  
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');

  // If trying to access dashboard without a session cookie, redirect to login
  if (isDashboardRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access auth pages with a session cookie, redirect to dashboard
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
