"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  filterCategories,
  operatorLabels,
  getFieldForCategory,
} from "@/lib/filterCategories";
import type { FilterOption, AdCreative, FilterValue } from "@/types";

interface FilterComponentProps {
  onFilterChange: (filters: FilterOption[]) => void;
  data: AdCreative[];
}

type FilterOptionType = FilterOption;

export default function FilterComponent({
  onFilterChange,
  data,
}: FilterComponentProps) {
  const [activeTab, setActiveTab] = React.useState("Tags");
  const [filters, setFilters] = React.useState<FilterOptionType[]>([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );
  const [selectedOperator, setSelectedOperator] = React.useState<string>("");
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [filterValueEnd, setFilterValueEnd] = React.useState<string>("");
  const [conjunction, setConjunction] = React.useState<"AND" | "OR">("AND");

  const getUniqueValues = React.useCallback(
    (option: string) => {
      const field = getFieldForCategory(option) as keyof AdCreative;
      if (!field) return [];

      return Array.from(new Set(data.map((item) => item[field])))
        .filter(Boolean)
        .sort();
    },
    [activeTab, data]
  );

  const handleAddFilter = () => {
    setShowDropdown(true);
    setSelectedOption(null);
    setSelectedOperator("");
    setFilterValue("");
    setFilterValueEnd("");
  };

  const handleCategorySelect = (option: string) => {
    setSelectedOption(option);
    setSelectedOperator(filterCategories[activeTab].operators[0]);
    setFilterValue("");
    setFilterValueEnd("");
  };

  const handleApplyFilter = () => {
    if (!selectedOption || !selectedOperator || !filterValue) return;
    if (selectedOperator === "between" && !filterValueEnd) return;

    const field = getFieldForCategory(selectedOption) as keyof AdCreative;
    if (!field) return;

    let filterValueData: FilterValue["value"];

    if (activeTab === "Metrics") {
      if (selectedOperator === "between") {
        filterValueData = [Number(filterValue), Number(filterValueEnd)] as [
          number,
          number
        ];
      } else {
        filterValueData = Number(filterValue);
      }
    } else if (selectedOperator === "in") {
      filterValueData = [filterValue];
    } else {
      filterValueData = filterValue;
    }

    const newFilter: FilterOptionType = {
      id: `${Date.now()}`,
      category: activeTab,
      field,
      values: [
        {
          operator: selectedOperator,
          value: filterValueData,
        },
      ],
    };

    const updatedFilters = [...filters, newFilter];
    setFilters(updatedFilters);
    setShowDropdown(false);
    onFilterChange(updatedFilters);
  };

  const handleRemoveFilter = React.useCallback(
    (id: string) => {
      const updatedFilters = filters.filter((f) => f.id !== id);
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange]
  );

  const getOperatorInput = React.useCallback(
    (type: string, operator: string) => {
      if (type === "select" && selectedOption) {
        const uniqueValues = getUniqueValues(selectedOption);
        return (
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select value</option>
            {uniqueValues.map((value) => (
              <option key={String(value)} value={String(value)}>
                {String(value)}
              </option>
            ))}
          </select>
        );
      }

      if (type === "number") {
        return (
          <div className="space-y-2">
            {operator === "between" ? (
              <>
                <input
                  type="number"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Minimum value"
                  className="w-full p-2 border rounded-md"
                  step="0.01"
                />
                <input
                  type="number"
                  value={filterValueEnd}
                  onChange={(e) => setFilterValueEnd(e.target.value)}
                  placeholder="Maximum value"
                  className="w-full p-2 border rounded-md"
                  step="0.01"
                />
              </>
            ) : (
              <input
                type="number"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Enter value"
                className="w-full p-2 border rounded-md"
                step="0.01"
              />
            )}
          </div>
        );
      }

      return (
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Enter value"
          className="w-full p-2 border rounded-md"
        />
      );
    },
    [selectedOption, filterValue, filterValueEnd, getUniqueValues]
  );

  const formatFilterValue = (filter: FilterOption) => {
    const value = filter.values[0].value;
    if (Array.isArray(value)) {
      if (filter.category === "Metrics") {
        return `${value[0]} - ${value[1]}`;
      }
      return value.join(", ");
    }
    if (filter.category === "Metrics") {
      return typeof value === "number" ? value.toFixed(2) : value;
    }
    return value;
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={false}
        animate={{ height: "auto" }}
        className="bg-white rounded-lg shadow-sm"
      >
        {/* Rest of the JSX remains the same */}
        <button
          onClick={handleAddFilter}
          className="w-full px-4 py-3 flex items-center gap-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Filter</span>
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 border-t"
            >
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 mb-4 border-b">
                {Object.keys(filterCategories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={cn(
                      "pb-2 text-sm font-medium transition-colors",
                      activeTab === cat
                        ? "text-gray-900 border-b-2 border-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {!selectedOption ? (
                <div className="space-y-1">
                  {filterCategories[activeTab].options
                    ?.filter((opt) =>
                      opt.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((option) => (
                      <button
                        key={option}
                        onClick={() => handleCategorySelect(option)}
                        className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{activeTab}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{selectedOption}</span>
                    <button
                      onClick={() => setSelectedOption(null)}
                      className="ml-auto p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <select
                    value={selectedOperator}
                    onChange={(e) => setSelectedOperator(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {filterCategories[activeTab].operators.map((op) => (
                      <option key={op} value={op}>
                        {operatorLabels[op]}
                      </option>
                    ))}
                  </select>

                  {getOperatorInput(
                    filterCategories[activeTab].type,
                    selectedOperator
                  )}

                  <button
                    onClick={handleApplyFilter}
                    disabled={
                      !filterValue ||
                      (selectedOperator === "between" && !filterValueEnd)
                    }
                    className="w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {filters.length > 0 && (
          <div className="p-4 space-y-4">
            {filters.map((filter, index) => (
              <React.Fragment key={filter.id}>
                {index > 0 && (
                  <div className="flex justify-center gap-4 my-2">
                    <button
                      onClick={() => setConjunction("AND")}
                      className={cn(
                        "px-3 py-1 text-sm rounded-full",
                        conjunction === "AND"
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      AND
                    </button>
                    <button
                      onClick={() => setConjunction("OR")}
                      className={cn(
                        "px-3 py-1 text-sm rounded-full",
                        conjunction === "OR"
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      OR
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">
                    {filter.category}
                  </span>
                  <span className="text-sm">
                    {operatorLabels[filter.values[0].operator]}
                  </span>
                  <span className="font-medium">
                    {formatFilterValue(filter)}
                  </span>
                  <button
                    onClick={() => handleRemoveFilter(filter.id)}
                    className="ml-auto p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
