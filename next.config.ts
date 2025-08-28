import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    // Tell Next.js that the source code is inside src/
    pageExtensions: ["ts", "tsx", "js", "jsx"],
    reactStrictMode: true
};

export default nextConfig;
