import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const { nombre, zona, archivo } = await req.json();

    if (!nombre || !zona || !archivo) {
      return new Response("Faltan campos", { status: 400 });
    }

    const sql = neon();

    await sql`
      INSERT INTO ejercicios (nombre, zona, archivo)
      VALUES (${nombre}, ${zona}, ${archivo});
    `;

    return new Response("Ejercicio guardado correctamente", { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
