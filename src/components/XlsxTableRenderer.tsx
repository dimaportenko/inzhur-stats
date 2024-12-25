import React, { useState, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadFile } from "@/components/UploadFile";
import { TableControls } from "@/components/TableControls";

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
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
    const rows = filteredRows;
    if (!rows || !tableData) return rows;

    const dateIndex = tableData?.headers.indexOf(columns.DATE);
    if (dateIndex === -1) return rows;

    return [...rows].sort((a, b) => {
      const dateA = a[dateIndex].split(".").reverse().join("-");
      const dateB = b[dateIndex].split(".").reverse().join("-");
      return sortDirection === "asc"
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    });
  }, [filteredRows, tableData, sortDirection]);

  return (
    <div className="container mx-auto p-4">
      <UploadFile onFileUpload={handleFileUpload} />
      {tableData && (
        <>
          <TableControls
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            fondOptions={fondOptions}
          />

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
