/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "localhost",
    "192.168.56.1",
    "192.168.100.27",
    "172.20.10.4",
  ],
  reactCompiler: true,
};

export default nextConfig;
