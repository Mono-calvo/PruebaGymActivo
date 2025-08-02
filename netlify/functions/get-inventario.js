import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const sql = neon();
    const { rows } = await sql`SELECT * FROM inventario;`;

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
