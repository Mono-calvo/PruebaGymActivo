import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "PUT") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const { nombreOriginal, nombre, cantidad, descripcion } = await req.json();

    if (!nombreOriginal || !nombre || !cantidad) {
      return new Response("Faltan campos", { status: 400 });
    }

    const sql = neon();
    await sql`
      UPDATE inventario
      SET nombre = ${nombre}, cantidad = ${cantidad}, descripcion = ${
      descripcion || ""
    }
      WHERE nombre = ${nombreOriginal};
    `;

    return new Response("Producto actualizado", { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
