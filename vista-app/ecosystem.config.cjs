/**
 * PM2 ecosystem file. Run from vista-app directory:
 *   pm2 start ecosystem.config.cjs
 *
 * Uses __dirname so cwd is always this app folder (no wrong /var/www/demo).
 */
const path = require("path");

module.exports = {
  apps: [
    {
      name: "vista-app",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: __dirname,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
