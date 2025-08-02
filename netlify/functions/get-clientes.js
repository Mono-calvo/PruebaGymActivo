import { neon } from "@netlify/neon";

function formatearFechaSQL(fecha) {
  const d = new Date(fecha);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const anio = String(d.getFullYear()).slice(2); // Obtener los últimos 2 dígitos
  return `${dia}/${mes}/${anio}`;
}

export default async (req, context) => {
  const sql = neon();

  try {
    const clientesRaw = await sql`
      SELECT id, rol, nombre, apellido, rut, correo, fechaultimopago, fechavencimiento
      FROM clientes;
    `;

    // Formatear fechas para cada cliente
    const clientes = clientesRaw.map((cliente) => ({
      ...cliente,
      fechaultimopago: cliente.fechaultimopago
        ? formatearFechaSQL(cliente.fechaultimopago)
        : null,
      fechavencimiento: cliente.fechavencimiento
        ? formatearFechaSQL(cliente.fechavencimiento)
        : null,
    }));

    return new Response(JSON.stringify(clientes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
