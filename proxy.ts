import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Changed from "middleware" to "proxy"
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const isAuthPage = url.pathname.startsWith('/signin') || url.pathname.startsWith('/signup');

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }
  else if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}