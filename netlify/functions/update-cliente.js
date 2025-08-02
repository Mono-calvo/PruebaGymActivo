import { neon } from "@netlify/neon";

function formatearFechaPostgres(fechaStr) {
  if (!fechaStr) return null;
  // fechaStr en formato "dd/mm/yy"
  const partes = fechaStr.split("/");
  if (partes.length !== 3) return null;

  let [dia, mes, anio] = partes.map(Number);
  if (anio < 100) anio += 2000; // Asumir siglo 2000+

  // Formato "yyyy-mm-dd"
  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(
    2,
    "0"
  )}`;
}

export default async (req) => {
  if (req.method !== "PUT") {
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

    const sql = neon();

    const fechaultimopagoSQL = formatearFechaPostgres(fechaultimopago);
    const fechavencimientoSQL = formatearFechaPostgres(fechavencimiento);

    await sql`
      UPDATE clientes SET
        nombre = ${nombre},
        apellido = ${apellido},
        rut = ${rut},
        correo = ${correo},
        fechaultimopago = ${fechaultimopagoSQL},
        fechavencimiento = ${fechavencimientoSQL}
      WHERE correo = ${correoOriginal};
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
