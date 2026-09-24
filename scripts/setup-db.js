try {
  require('dotenv').config({ path: '.env.local' });
  require('dotenv').config({ path: '.env' });
} catch (e) {
  // dotenv is optional and mainly for local development.
  // In Vercel, environment variables are injected directly into process.env.
}

const { neon } = require('@neondatabase/serverless');

async function setupDb() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn('⚠️ DATABASE_URL is not set. Skipping database setup.');
    return;
  }

  try {
    const sql = neon(connectionString);
    console.log('📦 Verifying database schema...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS visitors (
        visitor_id TEXT PRIMARY KEY,
        first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    
    console.log('✅ Database schema verified successfully.');
  } catch (error) {
    console.error('❌ Failed to setup database schema:', error.message);
    process.exit(1);
  }
}

setupDb();
