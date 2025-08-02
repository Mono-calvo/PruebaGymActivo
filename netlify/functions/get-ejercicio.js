import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const sql = neon();
    // Cambié grupo por zona, y descripcion por archivo, que son las columnas correctas
    const result = await sql`SELECT nombre, zona, archivo FROM ejercicios;`;

    const rows = Array.isArray(result) ? result : result.rows;

    // Genera texto plano con separadores "|"
    const textoPlano = rows
      .map(({ nombre, zona, archivo }) => `${nombre}|${zona}|${archivo || ""}`)
      .join("\n");

    return new Response(textoPlano, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
