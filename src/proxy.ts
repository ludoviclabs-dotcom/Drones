import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("x-panoplie-boundary", "osint-strategique-non-operationnel");
  response.headers.set("x-panoplie-api-path", request.nextUrl.pathname);
  response.headers.set("x-content-type-options", "nosniff");

  return response;
}

export const config = {
  matcher: ["/api/panoplie/:path*"],
};
