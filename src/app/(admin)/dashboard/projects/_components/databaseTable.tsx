"use client";
import React from "react";
import useDatabaseStore from "@/stores/databaseStore";
import { extractTableData } from "@/lib/utils";

export default function DatabaseTable() {
  const { terminalResult } = useDatabaseStore();

  const converted = extractTableData(terminalResult || "");

  const { columns, rows } = converted;

  return (
    <>
      {columns.length > 0 ? (
        <div className="mt-4 ">
          <div>
            <p>Number of found rows: {rows.length}</p>
          </div>
          {/* Scrollable container for table body */}
          <div className="overflow-x-auto w-full no-scrollbar">
            <div className="relative max-h-96 overflow-y-auto no-scrollbar">
              {/* Apply table-fixed to make columns shrink */}
              <table className="min-w-full table-fixed border-collapse border border-gray-300">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 px-4 py-2 text-left truncate"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="border border-gray-300 px-4 py-2 truncate"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">
          No data to display. Run a query to see the result.
        </p>
      )}
    </>
  );
}
