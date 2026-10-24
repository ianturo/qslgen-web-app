/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      { source: "/", destination: "/index.html" },
    ];
  },
  outputFileTracingIncludes: {
    "/api/logos": ["./public/logos/**/*"],
  },
};

export default nextConfig;