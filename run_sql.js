const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  host: 'db.bwydmkobkvzscswmphou.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'BR0XM8EhIGziAdsV',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("Připojeno k databázi...");
    const sql = fs.readFileSync('supabase_schema.sql', 'utf8');
    await client.query(sql);
    console.log("✅ Všechny tabulky a bezpečnostní pravidla byly úspěšně vytvořeny!");
  } catch (err) {
    console.error("❌ Chyba:", err);
  } finally {
    await client.end();
  }
}
run();
