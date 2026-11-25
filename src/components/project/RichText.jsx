// Muestra un texto enriquecido de Sanity (Portable Text). Por ahora el
// Studio solo permite párrafos y links, que se ven subrayados y abren en otra
// pestaña. Si más adelante se habilitan negrita o itálica en el Studio, ya se
// muestran.

const MARK_TAGS = { strong: "strong", em: "em", underline: "u" };

const renderSpan = (span, markDefs) =>
  (span.marks ?? []).reduceRight((content, mark) => {
    const link = markDefs.find((def) => def._key === mark && def._type === "link");
    if (link?.href) {
      return (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className="underline">
          {content}
        </a>
      );
    }
    const Tag = MARK_TAGS[mark];
    return Tag ? <Tag>{content}</Tag> : content;
  }, span.text);

export default function RichText({ value, className }) {
  const blocks = (value ?? []).filter((block) => block._type === "block");
  if (blocks.length === 0) return null;

  return blocks.map((block) => (
    <p key={block._key} className={className}>
      {(block.children ?? []).map((span) => (
        <span key={span._key}>{renderSpan(span, block.markDefs ?? [])}</span>
      ))}
    </p>
  ));
}
