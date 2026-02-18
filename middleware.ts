import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// FIX: Ensure the function name is 'middleware' and it is exported
export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Your proxy/blocking logic here...
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    try {
      const user = JSON.parse(atob(token.split('.')[1]));
      if (user.role !== 'admin') {
        return NextResponse.rewrite(new URL('/404', request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

// Ensure your config is also exported correctly
export const config = {
  matcher: ['/admin/:path*'],
};