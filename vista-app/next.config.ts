import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Fix: use this app directory as workspace root when multiple lockfiles exist (e.g. /var/www/demo and /var/www/demo/vista-app)
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
