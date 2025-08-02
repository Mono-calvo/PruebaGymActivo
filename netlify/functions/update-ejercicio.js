import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "PUT") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const { nombreOriginal, nombre, zona, archivo } = await req.json();

    if (!nombreOriginal || !nombre || !zona) {
      return new Response("Faltan campos", { status: 400 });
    }

    const sql = neon();
    await sql`
      UPDATE ejercicios
      SET nombre = ${nombre}, zona = ${zona}, archivo = ${archivo}
      WHERE nombre = ${nombreOriginal};
    `;

    return new Response("Ejercicio actualizado correctamente", { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
