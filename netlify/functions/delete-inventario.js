import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const { nombre } = await req.json();
    if (!nombre) return new Response("Falta nombre", { status: 400 });

    const sql = neon();
    await sql`DELETE FROM inventario WHERE nombre = ${nombre};`;

    return new Response("Producto eliminado", { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
