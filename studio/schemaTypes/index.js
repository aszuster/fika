import { product } from "./product";
import { variant } from "./variant";
import { download } from "./download";
import { color, material, format, application } from "./taxonomies";
import { distributor } from "./distributor";
import { project, projectProduct } from "./project";
import { siteDownload } from "./siteDownload";

export const schemaTypes = [
  product,
  variant,
  download,
  project,
  projectProduct,
  distributor,
  siteDownload,
  color,
  material,
  format,
  application,
];
