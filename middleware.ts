import { withAuth } from "next-auth/middleware";

export const middleware = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/pharmacy-dashboard/:path*",
    "/user/:path*",
  ]
};


