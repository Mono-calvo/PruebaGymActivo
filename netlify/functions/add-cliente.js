import { neon } from "@netlify/neon";

// Función para convertir fecha de "dd/mm/yy" a "yyyy-mm-dd"
function parseFecha(fechaStr) {
  if (!fechaStr) return null;

  const [dd, mm, yy] = fechaStr.split("/");
  const anio = parseInt(yy) < 50 ? `20${yy}` : `19${yy}`; // 25 → 2025
  return `${anio}-${mm}-${dd}`;
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const body = await req.json();
    const { data } = body;

    if (!data) {
      return new Response("Sin datos", { status: 400 });
    }

    const campos = data.split("|");

    if (campos.length < 6) {
      return new Response("Datos incompletos para nuevo cliente", {
        status: 400,
      });
    }

    // Asegurarse de que haya 8 campos
    while (campos.length < 8) campos.push("");

    // Forzar el rol a "cliente"
    campos[0] = "cliente";

    const [
      rol,
      nombre,
      apellido,
      rut,
      correo,
      contrasena,
      fechaultimopagoRaw,
      fechavencimientoRaw,
    ] = campos;

    // Formatear fechas a formato PostgreSQL (yyyy-mm-dd)
    const fechaultimopago = parseFecha(fechaultimopagoRaw);
    const fechavencimiento = parseFecha(fechavencimientoRaw);

    const sql = neon();

    await sql`
      INSERT INTO clientes (
        rol, nombre, apellido, rut, correo, contrasena, fechaultimopago, fechavencimiento
      )
      VALUES (
        ${rol}, ${nombre}, ${apellido}, ${rut}, ${correo}, ${contrasena},
        ${fechaultimopago}, ${fechavencimiento}
      );
    `;

    return new Response("Cliente guardado correctamente", {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
