// Menú del Studio: productos, proyectos, distribuidores y descargas arriba, y las opciones de
// filtros agrupadas aparte, para que no se mezclen con el catálogo.
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
      S.documentTypeListItem("project")
        .title("Proyectos")
        .child(
          S.documentTypeList("project")
            .title("Proyectos")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.documentTypeListItem("distributor")
        .title("Distribuidores")
        .child(
          S.documentTypeList("distributor")
            .title("Distribuidores")
            .defaultOrdering([
              { field: "province", direction: "asc" },
              { field: "city", direction: "asc" },
              { field: "name", direction: "asc" },
            ]),
        ),
      S.documentTypeListItem("siteDownload")
        .title("Descargas")
        .child(
          S.documentTypeList("siteDownload")
            .title("Descargas")
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
