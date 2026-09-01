/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static app: no server components, no API routes.
  // Export to plain static files served by Cloudflare Workers Static Assets.
  output: "export",
};

export default nextConfig;
