export interface AdCreative {
  creative_id: string;
  creative_name: string;
  tags: string;
  country: string;
  ad_network: string;
  os: string;
  campaign: string;
  ad_group: string;
  ipm: number;
  ctr: number;
  spend: number;
  impressions: number;
  clicks: number;
  cpm: number;
  cost_per_click: number;
  cost_per_install: number;
  installs: number;
}

export interface FilterValue {
  operator: string;
  value: string | number | string[] | [number, number];
}

export interface FilterOption {
  id: string;
  category: string;
  field: keyof AdCreative;
  values: FilterValue[];
}

export interface FilterCategory {
  name: string;
  type: "text" | "number" | "select";
  field: keyof AdCreative;
  options?: string[];
  operators: string[];
}
