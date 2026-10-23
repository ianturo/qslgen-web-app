/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/index.html", destination: "/" }];
  },
};

export default nextConfig;