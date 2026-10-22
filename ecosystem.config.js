module.exports = {
  apps: [
    {
      name: 'venkat-sai-web',
      cwd: './',
      script: 'server.mjs',
      args: '--prod -s dist/client dist/server/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,
      error_file: './logs/err-web.log',
      out_file: './logs/out-web.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '500M',
    },
  ],
}
