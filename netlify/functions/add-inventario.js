import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const { nombre, cantidad, descripcion } = await req.json();

    if (!nombre || !cantidad) {
      return new Response("Faltan campos", { status: 400 });
    }

    const sql = neon();
    await sql`
      INSERT INTO inventario (nombre, cantidad, descripcion)
      VALUES (${nombre}, ${cantidad}, ${descripcion || ""});
    `;

    return new Response("Producto agregado correctamente", { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
