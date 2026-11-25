import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.documentTypeListItem("sitePhoto").title("Site photos"),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== "siteSettings" && item.getId() !== "sitePhoto"
      ),
    ]);
