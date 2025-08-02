import { neon } from "@netlify/neon";

export default async (req) => {
  if (req.method !== "PUT" && req.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const body = await req.json();
    const {
      id,
      nombre,
      apellido,
      rut,
      correo,
      correoOriginal,
      fechaultimopago,
      fechavencimiento,
    } = body;

    if (!correoOriginal) {
      return new Response(
        JSON.stringify({
          error: "Falta correoOriginal para identificar cliente.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sql = neon();

    // 1. Verificar si rut está duplicado (excluyendo el cliente original)
    const duplicadoRut = await sql`
      SELECT COUNT(*)::int AS count FROM clientes
      WHERE rut = ${rut} AND correo != ${correoOriginal};
    `;
    if (duplicadoRut[0].count > 0) {
      return new Response(
        JSON.stringify({ error: "Ya existe un cliente con ese RUT." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Verificar si correo está duplicado (excluyendo el cliente original)
    const duplicadoCorreo = await sql`
      SELECT COUNT(*)::int AS count FROM clientes
      WHERE correo = ${correo} AND correo != ${correoOriginal};
    `;
    if (duplicadoCorreo[0].count > 0) {
      return new Response(
        JSON.stringify({ error: "Ya existe un cliente con ese correo." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Actualizar cliente según correoOriginal
    const result = await sql`
      UPDATE clientes SET
        nombre = ${nombre},
        apellido = ${apellido},
        rut = ${rut},
        correo = ${correo},
        fechaultimopago = ${fechaultimopago},
        fechavencimiento = ${fechavencimiento}
      WHERE correo = ${correoOriginal}
      RETURNING id;
    `;

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ error: "Cliente original no encontrado." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        mensaje: "Cliente actualizado correctamente.",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error update-cliente:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
