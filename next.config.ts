import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.1", "192.168.0.1", "192.168.*", "10.*", "localhost", "127.0.0.1"],
};

export default nextConfig;
