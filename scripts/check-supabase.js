const fs = require('fs');
const path = require('path');

// Try loading .env.local or .env
const envLocalPath = path.join(__dirname, '../.env.local');
const envPath = path.join(__dirname, '../.env');

let envFileToUse = null;
if (fs.existsSync(envLocalPath)) {
  envFileToUse = envLocalPath;
} else if (fs.existsSync(envPath)) {
  envFileToUse = envPath;
}

if (envFileToUse) {
  const content = fs.readFileSync(envFileToUse, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val.replace(/^["']|["']$/g, '');
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("==========================================");
console.log(" SUPABASE CONNECTION DIAGNOSTIC TOOL");
console.log("==========================================");
console.log(`Env File Detected: ${envFileToUse ? path.basename(envFileToUse) : "None (.env.local missing)"}`);
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? supabaseUrl : "NOT SET (undefined)"}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? (supabaseAnonKey.slice(0, 12) + "..." + supabaseAnonKey.slice(-6)) : "NOT SET (undefined)"}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? (supabaseServiceKey.slice(0, 12) + "..." + supabaseServiceKey.slice(-6)) : "NOT SET (undefined)"}`);
console.log("------------------------------------------");

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("❌ STATUS: NOT CONNECTED LOCALLY");
  console.log("");
  console.log("Reason: The local Next.js project is missing the Supabase environment variables in `.env.local`.");
  console.log("");
  console.log("To connect your local project to Supabase:");
  console.log("1. Create a file named `page3-salon/.env.local`");
  console.log("2. Add your Supabase project credentials:");
  console.log("   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co");
  console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>");
  console.log("   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>");
  console.log("");
  console.log("Note: If you connected Supabase via Vercel integration, these variables are injected into your live Vercel deployment.");
  process.exit(1);
}

// If credentials exist, test the connection via HTTP ping
async function testConnection() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log("Testing connection to Supabase REST endpoint...");
    const { data, error } = await supabase.from('services').select('count', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01') {
        console.log("⚠️ CONNECTED TO SUPABASE, BUT TABLES ARE MISSING!");
        console.log("Detail: Table 'services' does not exist yet.");
        console.log("Action required: Run `supabase/schema.sql` in your Supabase SQL Editor to initialize all 20 tables.");
      } else {
        console.log(`❌ Connection Error: [${error.code}] ${error.message}`);
      }
    } else {
      console.log("✅ SUCCESS! Connected to Supabase live database.");
      console.log("Table 'services' verified.");
    }
  } catch (err) {
    console.error("❌ Exception during connection test:", err.message);
  }
}

testConnection();
