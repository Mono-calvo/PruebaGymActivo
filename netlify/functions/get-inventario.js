import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    // Ejecutar consulta y desestructurar `rows` directamente
    const result =
      await sql`SELECT nombre, cantidad, descripcion FROM inventario;`;

    // Si `result` es un array directamente, úsalo tal cual
    const rows = Array.isArray(result) ? result : result.rows;

    const textoPlano = rows
      .map(
        ({ nombre, cantidad, descripcion }) =>
          `${nombre}|${cantidad}|${descripcion || ""}`
      )
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
