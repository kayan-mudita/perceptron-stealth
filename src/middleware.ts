// Middleware disabled for Netlify deployment compatibility.
// Rate limiting is handled at the route level in each API endpoint.
// Re-enable when deploying to Vercel or self-hosted.

export function middleware() {
  // no-op
}

export const config = {
  matcher: [],
};
