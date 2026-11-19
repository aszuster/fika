"use server";

import { MAX_MUESTRAS } from "@/data/muestras";
import {
  escapeHtml,
  formatDateTime,
  getCompanyEmails,
  sendEmail,
} from "@/utils/email";

// Envía el pedido de muestras por mail a la empresa (MUESTRAS_EMAIL_TO) y una
// confirmación a la persona que lo pidió. Configuración en utils/email.js.

const CONTACT_FIELDS = [
  ["fullName", "Nombre y Apellido", true],
  ["email", "Mail de contacto", true],
  ["phone", "Teléfono", true],
  ["instagram", "Instagram del profesional / empresa / estudio", false],
  ["province", "Provincia", true],
  ["address", "Dirección", true],
  ["postalCode", "Código Postal", true],
];

const clean = (value) => (typeof value === "string" ? value.trim() : "");

export async function sendMuestrasOrder({ contact, chips }) {
  // Validación: el navegador ya valida, pero esto llega desde afuera.
  const data = Object.fromEntries(
    CONTACT_FIELDS.map(([name]) => [name, clean(contact?.[name])]),
  );
  const missing = CONTACT_FIELDS.some(
    ([name, , required]) => required && !data[name],
  );
  if (missing) return { ok: false, error: "Faltan datos de contacto." };

  const items = (Array.isArray(chips) ? chips : [])
    .map((chip) => `${clean(chip?.productTitle)} ${clean(chip?.variantName)}`.trim())
    .filter(Boolean);
  if (items.length === 0 || items.length > MAX_MUESTRAS) {
    return { ok: false, error: "La selección de muestras no es válida." };
  }

  const date = formatDateTime();
  const companyEmails = getCompanyEmails("MUESTRAS_EMAIL_TO");

  // 1) El pedido a la empresa: si falla, el pedido no se envió.
  const sent = await sendEmail({
    label: "muestras",
    to: companyEmails,
    replyTo: data.email,
    subject: `Pedido de material box – ${data.fullName}`,
    text: [
      `Pedido de material box (${date})`,
      "",
      "Datos de contacto",
      ...CONTACT_FIELDS.map(([name, label]) => `${label}: ${data[name] || "-"}`),
      "",
      `Muestras (${items.length}/${MAX_MUESTRAS})`,
      ...items.map((item, index) => `${index + 1}. ${item}`),
    ].join("\n"),
    html: `
      <h2>Pedido de material box</h2>
      <p>${escapeHtml(date)}</p>
      <h3>Datos de contacto</h3>
      <table cellpadding="4">
        ${CONTACT_FIELDS.map(
          ([name, label]) =>
            `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(data[name] || "-")}</td></tr>`,
        ).join("")}
      </table>
      <h3>Muestras (${items.length}/${MAX_MUESTRAS})</h3>
      <ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
    `,
  });
  if (!sent) {
    return { ok: false, error: "No pudimos enviar el pedido. Intentá de nuevo." };
  }

  // 2) La confirmación a la persona: si falla, el pedido igual llegó, así que
  // no se muestra error (queda registrado en la consola del servidor).
  const firstName = data.fullName.split(" ")[0];
  await sendEmail({
    label: "muestras",
    to: data.email,
    replyTo: companyEmails,
    subject: "Recibimos tu pedido de material box",
    text: [
      `¡Hola ${firstName}!`,
      "",
      "Recibimos tu pedido de material box. ¡Gracias por contactarte con nosotros! En breve te responderemos.",
      "",
      `Muestras elegidas (${items.length}/${MAX_MUESTRAS})`,
      ...items.map((item, index) => `${index + 1}. ${item}`),
      "",
      "Dirección de envío",
      `${data.address}, ${data.province} (CP ${data.postalCode})`,
      "",
      "Fika",
    ].join("\n"),
    html: `
      <p>¡Hola ${escapeHtml(firstName)}!</p>
      <p>Recibimos tu pedido de material box. ¡Gracias por contactarte con nosotros! En breve te responderemos.</p>
      <h3>Muestras elegidas (${items.length}/${MAX_MUESTRAS})</h3>
      <ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
      <h3>Dirección de envío</h3>
      <p>${escapeHtml(data.address)}, ${escapeHtml(data.province)} (CP ${escapeHtml(data.postalCode)})</p>
      <p>Fika</p>
    `,
  });

  return { ok: true };
}
