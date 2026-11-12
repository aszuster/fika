// Menú del Studio: productos arriba y las opciones de filtros agrupadas
// aparte, para que no se mezclen con el catálogo.
export const structure = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.documentTypeListItem("product")
        .title("Productos")
        .child(
          S.documentTypeList("product")
            .title("Productos")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Filtros")
        .child(
          S.list()
            .title("Filtros")
            .items(
              [
                ["color", "Colores"],
                ["material", "Materiales"],
                ["format", "Formatos"],
                ["application", "Aplicaciones"],
              ].map(([type, title]) =>
                S.documentTypeListItem(type)
                  .title(title)
                  .child(
                    S.documentTypeList(type)
                      .title(title)
                      .defaultOrdering([{ field: "order", direction: "asc" }]),
                  ),
              ),
            ),
        ),
    ]);
