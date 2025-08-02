import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const body = await req.json();
    const { id, nombre, apellido, correo, fechaultimopago, fechavencimiento } =
      body;

    const sql = neon();

    await sql`
      UPDATE clientes
      SET nombre = ${nombre},
          apellido = ${apellido},
          correo = ${correo},
          fechaultimopago = ${fechaultimopago},
          fechavencimiento = ${fechavencimiento}
      WHERE id = ${id};
    `;

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
