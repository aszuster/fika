// Filtros y búsqueda del catálogo, para recuperarlos al volver a él. Vive en
// memoria del cliente: sobrevive a la navegación interna, no a una recarga.
// Solo se escribe desde el navegador, nunca durante el render en el servidor.
let catalogView = null;

export const getCatalogView = () => catalogView;

export const saveCatalogView = (view) => {
  catalogView = view;
};

export const clearCatalogView = () => {
  catalogView = null;
};
