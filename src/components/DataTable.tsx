"use client";

import * as React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { FilterOption, AdCreative } from "@/types";

interface DataTableProps {
  data: AdCreative[];
  loading: boolean;
  filters: FilterOption[];
}

export default function DataTable({ data, loading, filters }: DataTableProps) {
  const [filteredData, setFilteredData] = React.useState<AdCreative[]>(data);

  React.useEffect(() => {
    let result = data;

    if (filters.length > 0) {
      result = data.filter((item) => {
        return filters.every((filter) => {
          const value = item[filter.field];
          const filterValue = filter.values[0];

          switch (filterValue.operator) {
            case "equals":
              return value === Number(filterValue.value);
            case "greater than":
              return (value as number) > Number(filterValue.value);
            case "less than":
              return (value as number) < Number(filterValue.value);
            case "is":
              return value === filterValue.value;
            case "is not":
              return value !== filterValue.value;
            case "contains":
              return String(value)
                .toLowerCase()
                .includes(String(filterValue.value).toLowerCase());
            case "does not contain":
              return !String(value)
                .toLowerCase()
                .includes(String(filterValue.value).toLowerCase());
            default:
              return true;
          }
        });
      });
    }

    setFilteredData(result);
  }, [data, filters]);

  const getUniqueValues = (key: keyof AdCreative) => {
    return Array.from(new Set(data.map((item) => item[key]))).map((value) => ({
      text: String(value),
      value: String(value),
    }));
  };

  const columns: ColumnsType<AdCreative> = [
    {
      title: "Creative ID",
      dataIndex: "creative_id",
      key: "creative_id",
      width: 160,
      sorter: (a, b) =>
        (a.creative_id || "").localeCompare(b.creative_id || ""),
      filters: getUniqueValues("creative_id"),
      onFilter: (value, record) =>
        record.creative_id.includes(String(value)),
    },
    {
      title: "Creative Name",
      dataIndex: "creative_name",
      key: "creative_name",
      width: 150,
      sorter: (a, b) =>
        (a.creative_name || "").localeCompare(
          b.creative_name || "",
          undefined,
          { sensitivity: "accent" }
        ),
      filters: getUniqueValues("creative_name"),
      onFilter: (value, record) => record.creative_name.includes(String(value)),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 80,
      sorter: (a, b) =>
        (a.country || "").localeCompare(b.country || "", undefined, {
          sensitivity: "accent",
        }),
      filters: getUniqueValues("country"),
      onFilter: (value, record) => record.country.includes(String(value)),
    },
    {
      title: "Ad Network",
      dataIndex: "ad_network",
      key: "ad_network",
      width: 120,
      sorter: (a, b) =>
        (a.ad_network || "").localeCompare(b.ad_network || "", undefined, {
          sensitivity: "accent",
        }),
      filters: getUniqueValues("ad_network"),
      onFilter: (value, record) => record.ad_network.includes(String(value)),
    },
    {
      title: "Campaign",
      dataIndex: "campaign",
      key: "campaign",
      width: 250,
      sorter: (a, b) => (a.campaign || "").localeCompare(b.campaign || ""),
      filters: getUniqueValues("campaign"),
      onFilter: (value, record) => record.campaign.includes(String(value)),
    },
    {
      title: "Ad Group",
      dataIndex: "ad_group",
      key: "ad_group",
      width: 200,
      sorter: (a, b) => (a.ad_group || "").localeCompare(b.ad_group || ""),
    },
    {
      title: "IPM",
      dataIndex: "ipm",
      key: "ipm",
      sorter: (a, b) => a.ipm - b.ipm,
      render: (value) => value.toFixed(2),
    },
    {
      title: "CTR",
      dataIndex: "ctr",
      key: "ctr",
      sorter: (a, b) => a.ctr - b.ctr,
      render: (value) => (value * 100).toFixed(2) + "%",
    },
    {
      title: "Spend",
      dataIndex: "spend",
      key: "spend",
      sorter: (a, b) => a.spend - b.spend,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: "Impressions",
      dataIndex: "impressions",
      key: "impressions",
      sorter: (a, b) => a.impressions - b.impressions,
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      sorter: (a, b) => a.clicks - b.clicks,
    },
    {
      title: "CPM",
      dataIndex: "cpm",
      key: "cpm",
      sorter: (a, b) => a.cpm - b.cpm,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: "CPC",
      dataIndex: "cost_per_click",
      key: "cost_per_click",
      sorter: (a, b) => a.cost_per_click - b.cost_per_click,
      render: (value) => `$${value.toFixed(3)}`,
    },
    {
      title: "CPI",
      dataIndex: "cost_per_install",
      key: "cost_per_install",
      sorter: (a, b) => a.cost_per_install - b.cost_per_install,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: "Installs",
      dataIndex: "installs",
      key: "installs",
      sorter: (a, b) => a.installs - b.installs,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="creative_id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1800 }}
      className="min-w-full"
    />
  );
}