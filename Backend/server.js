import dotenv from 'dotenv';
import app from './src/app.js';
import { initDatabase } from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    // Initialize DB and sync schemas
    await initDatabase();

    // Start Express HTTP server
    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` Node.js E-commerce Server Running on Port ${PORT}`);
      console.log(` Base URL: http://localhost:${PORT}`);
      console.log(` API Base: http://localhost:${PORT}/api`);
      console.log(`===============================================`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ [Port Conflict] Port ${PORT} is already in use by another process (likely your Java backend).`);
        console.error(`👉 To free port ${PORT} on Windows (PowerShell):`);
        console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
        console.error(`👉 Or change PORT in Backend1/.env to another port (e.g. PORT=8081).\n`);
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
