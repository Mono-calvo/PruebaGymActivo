import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const sql = neon();
    const ejercicios = await sql`SELECT * FROM ejercicios;`;

    return new Response(JSON.stringify(ejercicios), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
