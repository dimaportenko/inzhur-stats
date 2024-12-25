import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

interface TableControlsProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (value: "asc" | "desc") => void;
  fondOptions: string[];
}

export function TableControls({
  filterValue,
  setFilterValue,
  sortDirection,
  setSortDirection,
  fondOptions,
}: TableControlsProps) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <Select onValueChange={setFilterValue} value={filterValue}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by Фонд" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {fondOptions.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() =>
          setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
        }
      >
        Sort by Date {sortDirection === "asc" ? "↑" : "↓"}
      </Button>
    </div>
  );
} 