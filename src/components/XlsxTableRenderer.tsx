import React, { useState, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableData {
  headers: string[];
  rows: string[][];
}

const columns = {
  FOND: "Фонд",
  DATE: "Дата",
  OPERATION: "Тип операції",
  DEBET: "Дебет",
  CREDIT: "Кредит",
} as const;

export default function XlsxTableRenderer() {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [filterValue, setFilterValue] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          setTableData({
            headers: jsonData[0] as string[],
            rows: jsonData.slice(1) as string[][],
          });
        };
        reader.readAsArrayBuffer(file);
      }
    },
    []
  );

  const fondOptions = useMemo(() => {
    if (!tableData) return [];
    const fondIndex = tableData.headers.indexOf(columns.FOND);
    if (fondIndex === -1) return [];
    const options = new Set(tableData.rows.map((row) => row[fondIndex]));
    return Array.from(options).filter(Boolean);
  }, [tableData]);

  const filteredRows = useMemo(() => {
    if (!tableData || filterValue === "all") return tableData?.rows;
    const fondIndex = tableData.headers.indexOf(columns.FOND);
    if (fondIndex === -1) return tableData.rows;
    return tableData.rows.filter((row) => row[fondIndex] === filterValue);
  }, [tableData, filterValue]);

  const sortedAndFilteredRows = useMemo(() => {
    let rows = filteredRows;
    if (!rows) return rows;

    const dateIndex = tableData?.headers.indexOf(columns.DATE);
    if (dateIndex === -1) return rows;

    return [...rows].sort((a, b) => {
      const dateA = a[dateIndex].split('.').reverse().join('-');
      const dateB = b[dateIndex].split('.').reverse().join('-');
      return sortDirection === 'asc' 
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    });
  }, [filteredRows, tableData?.headers, sortDirection]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-300"
        >
          <svg
            className="w-6 h-6 mr-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-600">
            Choose XLSX file
          </span>
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
      {tableData && (
        <>
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
            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border rounded-md"
            >
              Sort by Date {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableData.headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredRows?.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
