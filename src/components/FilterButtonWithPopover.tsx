import React from "react";
import { Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterComponent from "./FilterComponent";

interface FilterButtonWithPopoverProps {
  filters?: any[]; 
  onFilterChange: (filters: any[]) => void; 
  data?: any[];
}

const FilterButtonWithPopover: React.FC<FilterButtonWithPopoverProps> = ({
  filters = [],
  onFilterChange,
  data = [],
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 px-4 py-2 bg-white hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {filters.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 bg-[#E5F5D9] text-gray-900 rounded-full"
            >
              {filters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="start">
        <FilterComponent onFilterChange={onFilterChange} data={data} />
      </PopoverContent>
    </Popover>
  );
};

export default FilterButtonWithPopover;
