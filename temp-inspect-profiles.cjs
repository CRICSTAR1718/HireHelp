const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.yhldkhkaepemcgsgqrqu:Adeela160900@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' });
(async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' ORDER BY ordinal_position");
    console.log(JSON.stringify(res.rows, null, 2));
    const count = await client.query("SELECT COUNT(*) AS count FROM profiles");
    console.log('profiles count', count.rows[0].count);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
