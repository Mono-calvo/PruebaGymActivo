import { neon } from "@netlify/neon";

export default async (req, context) => {
  const sql = neon();

  try {
    const clientes = await sql`
      SELECT id, rol, nombre, apellido, rut, correo, fechaultimopago, fechavencimiento
      FROM clientes;
    `;
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
