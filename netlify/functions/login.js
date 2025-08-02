import { neon } from "@netlify/neon";

const sql = neon();

export default async function handler(event, context) {
  try {
    const { rut, password } = JSON.parse(event.body);

    if (!rut || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan rut o contraseña" }),
      };
    }

    const [user] = await sql`
      SELECT rol, nombre, apellido, rut, correo, fechaultimopago, fechavencimiento
      FROM clientes
      WHERE rut = ${rut} AND contrasena = ${password};
    `;

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Usuario o contraseña incorrectos" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
