"use client";
import React from "react";
import useDatabaseStore from "@/stores/databaseStore";
import { extractTableData } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DatabaseTable() {
  const { terminalResult } = useDatabaseStore();

  const converted = extractTableData(terminalResult || "");

  const { columns, rows } = converted;

  return (
    <div className={"h-full w-full relative"}>
      {columns.length > 0 ? (
        <div className="  h-full w-full overflow-x-auto no-scrollbar border rounded-sm">
          <Table className="min-w-full table-auto border-collapse ">
            <TableHeader
              className={" sticky top-0 dark:bg-gray-800 bg-gray-100"}
            >
              <TableRow className={" "}>
                <TableHead className="w-16">#</TableHead>{" "}
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className="px-4 min-w-[150px] max-w-[300px] whitespace-nowrap"
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="font-medium w-16">
                    {rowIndex + 1}
                  </TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      className="font-medium whitespace-nowrap px-4 min-w-[150px] max-w-[300px] overflow-hidden text-ellipsis"
                      key={cellIndex}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className=" text-gray-500">
          No data to display. Run a query to see the result.
        </p>
      )}
    </div>
  );
}
