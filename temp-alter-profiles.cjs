const { Client } = require('pg');
const connectionString = 'postgresql://postgres.yhldkhkaepemcgsgqrqu:Adeela160900@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
const client = new Client({ connectionString });
(async () => {
  try {
    await client.connect();
    await client.query('ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "profile_picture_url" varchar(500)');
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'profile_picture_url'");
    console.log(JSON.stringify(res.rows));
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
