import type { ComponentSchema } from "./types";
export const <block_name>: ComponentSchema = {
  name: "<block_name>",
  display_name: "<Display Name>",
  is_root: false,          // true for content types only
  is_nestable: true,
  component_group_name: "<10 Elements | 02 Layout | 05 Editorial | 07 Media>",
  schema: {
    // content fields
    heading: { type: "text", translatable: true },
    body: { type: "richtext", translatable: true },
    image: { type: "asset", filetypes: ["images"] },
    link: { type: "multilink" },
    // semantic options only
    tone: { type: "option", options: [["default","default"],["muted","muted"],["accent","accent"],["inverse","inverse"]].map(([n,v])=>({name:n,value:v})), default_value: "default" },
    spacing: { type: "option", options: ["none","sm","md","lg"].map(v=>({name:v,value:v})), default_value: "md" },
    layout: { type: "option", options: ["stack","split","grid"].map(v=>({name:v,value:v})), default_value: "stack" },
    variant: { type: "option", options: ["<variant-a>","<variant-b>"].map(v=>({name:v,value:v})) },
    width: { type: "option", options: ["sm","md","lg","full"].map(v=>({name:v,value:v})), default_value: "lg" },
    // children
    items: { type: "bloks", restrict_components: true, component_whitelist: ["text","image","button_group"] },
  },
};
