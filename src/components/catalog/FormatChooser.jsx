import Link from "next/link";

export const formatParam = (label) => label.toLowerCase();


export default function FormatChooser({ formats }) {
  return (
    <div
      className="bg-primary-01 h-[calc(100dvh-3.125rem)] grid gap-px"
      style={{ gridTemplateColumns: `repeat(${formats.length}, minmax(0, 1fr))` }}
    >
      {formats.map(({ label, note }) => (
        <Link
          key={label}
          href={`/?formato=${encodeURIComponent(formatParam(label))}`}
          className="bg-primary-03 flex flex-col items-center justify-center gap-2 hover:bg-primary-00 hover:text-primary-03 transition-all duration-300 ease-in-out"
        >
          <p className="hl-lg uppercase">{label}</p>
          {note && <p className="by-sm text-secondary-02">{note}</p>}
        </Link>
      ))}
    </div>
  );
}
