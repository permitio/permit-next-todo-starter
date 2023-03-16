// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { Permit } from 'permitio';

const permit = new Permit({
  pdp: 'http://localhost:7766',
  token: process.env.PERMIT_SDK_TOKEN,
});

export default async function middleware(req: NextRequest) {
  // console.log(permit);
  const user = req.headers.get('authorization') || 'admin';
  const { method = '', url = '', body } = req;
  if (!user) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'unauthorized' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  const isAllowed = await permit.check(user as string, method, {
    type: url.substring(url.indexOf('/api') + 5),
    attributes: body || {},
  });

  if (!isAllowed) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'unauthorized' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/tasks',
}
