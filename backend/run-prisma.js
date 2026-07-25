const { execSync } = require('child_process');

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.trim();
}

const args = process.argv.slice(2).join(' ');
if (!args) {
  console.error('No command specified for run-prisma.js');
  process.exit(1);
}

try {
  execSync(args, { stdio: 'inherit', env: process.env });
} catch (error) {
  process.exit(error.status || 1);
}
