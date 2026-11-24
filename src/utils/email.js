// Envío de mails con Resend (https://resend.com/docs/api-reference/emails/send-email).
// Solo se usa en el servidor (server actions).
//
// Variables de entorno:
//   RESEND_API_KEY        clave de Resend
//   EMAIL_FROM            remitente (dominio verificado en Resend). Mientras no
//                         haya dominio, se usa "Fika <onboarding@resend.dev>",
//                         que solo puede mandar al mail de la cuenta de Resend.
//   MUESTRAS_EMAIL_TO     mail(s) de la empresa para pedidos de muestras
//   COTIZACIONES_EMAIL_TO mail(s) de la empresa para pedidos de cotización
//   (varios mails separados por coma)
//
// Si falta la clave o el destinatario, el mail no se envía: se muestra en la
// consola del servidor, para poder probar los flujos antes de tenerlos.

const DEFAULT_FROM = "Fika <onboarding@resend.dev>";

export const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Mails de la empresa guardados en una variable de entorno ("a@x.com, b@x.com").
export const getCompanyEmails = (envName) =>
  (process.env[envName] ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

export const formatDateTime = (date = new Date()) =>
  new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(date);

// Devuelve true si se envió (o si no hay configuración y solo se registró en
// la consola); false si Resend falló.
export async function sendEmail({ to, replyTo, subject, text, html, label = "mail" }) {
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  const { RESEND_API_KEY, EMAIL_FROM } = process.env;

  if (!RESEND_API_KEY || recipients.length === 0) {
    console.warn(
      `[${label}] Mail no configurado (falta RESEND_API_KEY o el destinatario). ` +
        `Se hubiera enviado a: ${recipients.join(", ") || "(sin destinatario)"}\n` +
        `Asunto: ${subject}\n${text}`,
    );
    return true;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM || DEFAULT_FROM,
        to: recipients,
        ...(replyTo && { reply_to: replyTo }),
        subject,
        text,
        html,
      }),
    });
    if (!response.ok) {
      console.error(`[${label}] Resend respondió`, response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error(`[${label}] Error al enviar el mail`, error);
    return false;
  }
}
