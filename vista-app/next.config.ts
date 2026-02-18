import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Use cwd as workspace root when multiple lockfiles exist (e.g. /var/www/demo and vista-app). Run build/start from vista-app.
  outputFileTracingRoot: path.resolve(process.cwd()),
};

export default nextConfig;
