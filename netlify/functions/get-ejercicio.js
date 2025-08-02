import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const sql = neon();
    const result =
      await sql`SELECT nombre, grupo, descripcion FROM ejercicios;`;

    // Asegura compatibilidad con diferentes retornos (array o objeto con rows)
    const rows = Array.isArray(result) ? result : result.rows;

    // Devuelve como texto plano con separadores "|"
    const textoPlano = rows
      .map(
        ({ nombre, grupo, descripcion }) =>
          `${nombre}|${grupo}|${descripcion || ""}`
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
