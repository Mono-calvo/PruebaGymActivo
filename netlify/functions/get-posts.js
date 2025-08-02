const { neon } = require("@netlify/neon");

exports.handler = async (event, context) => {
  const sql = neon(); // Usa la variable de entorno NETLIFY_DATABASE_URL automáticamente

  try {
    const posts = await sql`SELECT * FROM posts LIMIT 10`;
    return {
      statusCode: 200,
      body: JSON.stringify(posts),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
