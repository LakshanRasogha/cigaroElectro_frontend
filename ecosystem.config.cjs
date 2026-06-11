module.exports = {
  apps: [
    {
      name: "cigaroelectro-frontend",
      cwd: __dirname,
      script: "node",
      args: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        API_URL: "http://127.0.0.1:4023",
      },
      max_memory_restart: "500M",
      instances: 1,
      autorestart: true,
    },
  ],
};
