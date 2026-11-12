import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

// Sanity llama acá (webhook) cada vez que se publica, edita o borra algo en
// el Studio. La firma prueba que el pedido viene de Sanity: sin el secreto
// correcto, nadie de afuera puede vaciar la caché.
export async function POST(request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ message: "Falta SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? "";
  if (!(await isValidSignature(body, signature, secret))) {
    return Response.json({ message: "Firma inválida" }, { status: 401 });
  }

  // expire: 0 → el próximo visitante ya ve el dato nuevo (sin servir la
  // versión anterior mientras se actualiza).
  revalidateTag("sanity", { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}
