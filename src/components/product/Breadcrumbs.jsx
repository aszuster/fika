import { Fragment } from "react";
import Link from "next/link";

const itemClassName =
  "btn-sm uppercase text-primary-00 hover:text-secondary-01 transition-colors duration-300 ease-in-out cursor-pointer";

// Cada item puede tener `href` (link), `onClick` (botón) o ninguno (página
// actual, el último).
const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb" className="h-full flex items-center">
    <ol className="flex items-center gap-3">
      {items.map(({ label, href, onClick }, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={`${index}-${label}`}>
            {index > 0 && (
              <li aria-hidden="true" className="btn-sm text-secondary-02">
                &gt;
              </li>
            )}
            <li>
              {isLast ? (
                <span aria-current="page" className="btn-sm uppercase">
                  {label}
                </span>
              ) : href ? (
                <Link href={href} className={itemClassName}>
                  {label}
                </Link>
              ) : (
                <button type="button" onClick={onClick} className={itemClassName}>
                  {label}
                </button>
              )}
            </li>
          </Fragment>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
