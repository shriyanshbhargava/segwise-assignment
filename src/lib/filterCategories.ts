import type { FilterCategory, AdCreative } from "../types";

export const filterCategories: Record<string, FilterCategory> = {
  Metrics: {
    name: "Metrics",
    type: "number",
    field: "spend",
    options: [
      "Spend",
      "IPM",
      "CTR",
      "CPC",
      "CPI",
      "CPM",
      "Impressions",
      "Clicks",
      "Installs",
    ],
    operators: ["equals", "greater than", "less than", "between"],
  },
  Tags: {
    name: "Tags",
    type: "select",
    field: "country",
    options: ["Country", "Ad Network", "Campaign", "Ad Group", "OS"],
    operators: ["is", "is not", "contains", "does not contain"],
  },
  Dimensions: {
    name: "Tags",
    type: "text",
    field: "tags",
    operators: ["contains", "does not contain", "is", "is not"],
  },
};

export const operatorLabels: Record<string, string> = {
  equals: "=",
  "greater than": ">",
  "less than": "<",
  between: "between",
  is: "is",
  "is not": "is not",
  contains: "contains",
  "does not contain": "does not contain",
};

export const getFieldForCategory = (option: string): keyof AdCreative => {
  switch (option) {
    case "Spend":
      return "spend";
    case "IPM":
      return "ipm";
    case "CTR":
      return "ctr";
    case "CPC":
      return "cost_per_click";
    case "CPI":
      return "cost_per_install";
    case "CPM":
      return "cpm";
    case "Impressions":
      return "impressions";
    case "Clicks":
      return "clicks";
    case "Installs":
      return "installs";
    case "Country":
      return "country";
    case "Ad Network":
      return "ad_network";
    case "Campaign":
      return "campaign";
    case "Ad Group":
      return "ad_group";
    case "OS":
      return "os";
    default:
      return "tags";
  }
};
