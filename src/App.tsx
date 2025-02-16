"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import type { AdCreative, FilterOption } from "@/types";
import DataTable from "@/components/DataTable";
import FilterButtonWithPopover from "./components/FilterButtonWithPopover";

export default function App() {
  const [data, setData] = useState<AdCreative[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/Segwise_Report.csv");
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results: { data: AdCreative[] }) => {
            const parsedData = results.data.map((row: any) => ({
              ...row,
              ipm: Number.parseFloat(row.ipm) || 0,
              ctr: Number.parseFloat(row.ctr) || 0,
              spend: Number.parseFloat(row.spend) || 0,
              impressions: Number.parseInt(row.impressions) || 0,
              clicks: Number.parseInt(row.clicks) || 0,
              cpm: Number.parseFloat(row.cpm) || 0,
              cost_per_click: Number.parseFloat(row.cost_per_click) || 0,
              cost_per_install: Number.parseFloat(row.cost_per_install) || 0,
              installs: Number.parseInt(row.installs) || 0,
            }));
            setData(parsedData);
            setLoading(false);
          },
          error: (error: Error) => {
            console.error("Error parsing CSV:", error);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters: FilterOption[]) => {
    setFilters(newFilters);
  };

  return (
    <div className=" mx-auto py-8">
      <div className="flex items-center justify-between m-8">
        <FilterButtonWithPopover
          filters={filters}
          onFilterChange={handleFilterChange}
          data={data}
        />
      </div>

      <div
        className="bg-white rounded-lg shadow-sm overflow-auto m-4"
        style={{ minHeight: "600px" }}
      >
        <DataTable data={data} loading={loading} filters={filters} />
      </div>
    </div>
  );
}
