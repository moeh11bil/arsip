module.exports = {
  apps: [
    {
      name: 'eduarch',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        STORAGE_PATH: process.env.STORAGE_PATH || '/var/www/eduarch/storage',
      },
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/eduarch-error.log',
      out_file: '/var/log/pm2/eduarch-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
}
