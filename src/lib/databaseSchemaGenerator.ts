import { Edge, Node } from "reactflow";

export type TableColumn = {
  table_schema: string;
  table_name: string;
  column_name: string;
  data_type: string;
  key_type: string;
};
export type ForeignKeyConstraint = {
  constraint_name: string;
  local_table: string;
  local_column: string;
  referenced_table: string;
  referenced_column: string;
};

export type DatabaseSchema = {
  table_schema: string;
  table_name: string;
  column_name: string;
  data_type: string;
  key_type: string;
  constraint_name: string | null;
  referenced_table: string | null;
  referenced_column: string | null;
};
export const createTableSchemas = (
  columns: TableColumn[],
  foreignKeys: ForeignKeyConstraint[],
): DatabaseSchema[] => {
  const tableSchemas: DatabaseSchema[] = [];

  columns.forEach((column) => {
    const foreignKey = foreignKeys.find(
      (fk) =>
        fk.local_table === column.table_name &&
        fk.local_column === column.column_name,
    );

    tableSchemas.push({
      table_schema: column.table_schema,
      table_name: column.table_name,
      column_name: column.column_name,
      data_type: column.data_type,
      key_type: column.key_type,
      constraint_name: foreignKey ? foreignKey.constraint_name : null,
      referenced_table: foreignKey ? foreignKey.referenced_table : null,
      referenced_column: foreignKey ? foreignKey.referenced_column : null,
    });
  });

  console.log(tableSchemas);
  return tableSchemas;
};
let tableSchemas: DatabaseSchema[] = [];

//export type Node = {
//   id: string; // Unique ID for the node, usually the table name.
//   type: string; // Type of the node, e.g., 'customTableNode'.
//   data: {
//     label: string; // Display label for the table node.
//     columns: string[]; // List of columns for the table.
//   };
//   position: { x: number; y: number }; // Position of the node on the canvas.
// };
//
// export type Edge = {
//   id: string; // Unique ID for the edge, typically derived from source and target table/column names.
//   source: string; // Source node (table) from which the relationship starts.
//   target: string; // Target node (table) to which the relationship points.
//   sourceHandle: string; // Handle for source table and column.
//   targetHandle: string; // Handle for target table and column.
//   type: string; // Type of edge, e.g., 'smoothstep'.
// };

export const generateNodesAndEdges = (
  TableColumn: TableColumn[] | undefined,
  ForeignKeyConstraint: ForeignKeyConstraint[] | undefined,
): { nodes: Node[]; edges: Edge[] } => {
  if (!TableColumn || !ForeignKeyConstraint) {
    return { nodes: [], edges: [] };
  }
  tableSchemas = createTableSchemas(TableColumn, ForeignKeyConstraint);
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const tablePositions: Record<string, { x: number; y: number }> = {};

  const tableSpacingX = 200;
  const tableSpacingY = 200;
  const tablesPerRow = 3;

  let positionX = 0;
  let positionY = 0;

  const tableColumnsMap: Record<string, string[]> = {};
  tableSchemas.forEach((schema) => {
    const { table_name, column_name } = schema;

    if (!tableColumnsMap[table_name]) {
      tableColumnsMap[table_name] = [];

      tablePositions[table_name] = { x: positionX, y: positionY };

      positionX += tableSpacingX;
      if (positionX >= tablesPerRow * tableSpacingX) {
        positionX = 0;
        positionY += tableSpacingY;
      }
    }

    tableColumnsMap[table_name].push(column_name);
  });

  const totalTables = Object.keys(tableColumnsMap).length;
  const totalRows = Math.ceil(totalTables / tablesPerRow);

  const totalWidth = tablesPerRow * tableSpacingX;
  const totalHeight = totalRows * tableSpacingY;

  const canvasWidth = 800;
  const canvasHeight = 800;

  const offsetX = (canvasWidth - totalWidth) / 2;
  const offsetY = (canvasHeight - totalHeight) / 2;

  Object.keys(tableColumnsMap).forEach((table_name) => {
    const originalPosition = tablePositions[table_name];

    nodes.push({
      id: table_name,
      type: "customTableNode",
      data: {
        label: table_name,
        columns: tableColumnsMap[table_name],
      },
      position: {
        x: originalPosition.x + offsetX,
        y: originalPosition.y + offsetY,
      },
    });
  });

  tableSchemas.forEach((schema) => {
    const { table_name, column_name, referenced_table, referenced_column } =
      schema;

    if (schema.constraint_name && referenced_table && referenced_column) {
      edges.push({
        id: `${schema.constraint_name}`,
        source: table_name,
        target: referenced_table,
        sourceHandle: `${table_name}>${column_name}`,
        targetHandle: `${referenced_table}>${referenced_column}`,
        type: "smoothstep",
      });
    }
  });

  return { nodes, edges };
};
