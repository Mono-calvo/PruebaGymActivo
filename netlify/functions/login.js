import { neon } from "@netlify/neon";

const sql = neon();

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }
  try {
    const { rut, password } = await req.json();

    const [user] = await sql`
      SELECT rol, nombre, apellido, rut, correo, fechaultimopago, fechavencimiento
      FROM clientes
      WHERE rut = ${rut} AND contrasena = ${password}
    `;

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuario o contraseña incorrectos" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
