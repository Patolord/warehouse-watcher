/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "helpful-eel-68.convex.cloud",
      },
      {
        hostname: "stoic-puffin-88.convex.cloud",
      }
    ],
  }, 
};

export default nextConfig;