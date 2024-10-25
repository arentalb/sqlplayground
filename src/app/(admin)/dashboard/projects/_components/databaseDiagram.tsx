import React, { FC, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Handle,
  MarkerType,
  Node,
  NodeProps,
  Position,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { generateNodesAndEdges } from "@/lib/databaseSchemaGenerator";
import { getDatabaseSchema } from "@/actions/database/project.action";
import { Loader } from "lucide-react";

let initialNodes: Node[] = [];
let initialEdges: Edge[] = [];

// Utility function to get the relationship type
// const getRelationshipType = (
//   sourceNode: Node | undefined,
//   targetNode: Node | undefined,
// ): string => {
//   if (!sourceNode || !targetNode) return "single";
//
//   // Logic to determine relationship type
//   if (
//     targetNode.data.columns.some((column: string) => column.endsWith("_fk"))
//   ) {
//     return "many";
//   }
//   return "single";
// };

initialEdges = initialEdges.map((edge) => {
  // const sourceNode = initialNodes.find((node) => node.id === edge.source);
  // const targetNode = initialNodes.find((node) => node.id === edge.target);

  // const relationshipType = getRelationshipType(sourceNode, targetNode);
  //
  // console.log(relationshipType);
  // let edgeColor = "black"; // Default color
  // if (relationshipType === "many") {
  //   edgeColor = "orange";
  // } else {
  //   edgeColor = "green";
  // }

  return {
    ...edge,
    // style: { stroke: edgeColor },
    markerStart: {
      type: MarkerType.Arrow,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,

      //   type:
      //         relationshipType === "many" ? MarkerType.ArrowClosed : MarkerType.Arrow,
      //       color: edgeColor,
    },
  };
});

const TableNode: FC<NodeProps> = ({ data }) => {
  const selfReferenceCounters: Record<string, number> = {};

  return (
    <div className="border bg-background text-primary rounded-sm min-w-32">
      <h4 className="px-4 py-2 border-b-2 border-b-gray-300">{data.label}</h4>
      <ul>
        {data.columns.map((column: string, index: number) => {
          const id = `${data.label.toLowerCase()}>${column}`;

          const selfReferencingEdge = initialEdges.find(
            (edge) =>
              edge.source === edge.target &&
              (edge.sourceHandle === id || edge.targetHandle === id),
          );

          if (!selfReferenceCounters[data.label]) {
            selfReferenceCounters[data.label] = 0;
          }

          if (selfReferencingEdge) {
            selfReferenceCounters[data.label]++;

            const renderTheSource = selfReferenceCounters[data.label] === 1;
            const renderTheTarget = selfReferenceCounters[data.label] === 2;

            return (
              <li key={column} className="relative">
                <p className="px-4 py-1">{column}</p>

                {renderTheSource && (
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={id}
                    style={{
                      top: `${index * 30 + 10}px`,
                      width: "8px",
                      height: "8px",
                      background: "#991b1b",
                    }}
                    draggable={false}
                  />
                )}

                {renderTheTarget && (
                  <Handle
                    type="target"
                    position={Position.Right}
                    id={id}
                    style={{
                      top: `${index * 5 + 10}px`,
                      width: "8px",
                      height: "8px",
                      background: "#4338ca",
                    }}
                    draggable={false}
                  />
                )}
              </li>
            );
          }

          const isSourceColumn = initialEdges.some(
            (edge) => edge.sourceHandle === id,
          );
          const isTargetColumn = initialEdges.some(
            (edge) => edge.targetHandle === id,
          );

          return (
            <li key={column} className="relative">
              <p className="px-4 py-1">{column}</p>

              {isSourceColumn && (
                <Handle
                  type="source"
                  position={Position.Right}
                  id={id}
                  style={{
                    top: `15px`, // reduce or adjust this value for better spacing
                    width: "8px",
                    height: "8px",
                    background: "#47e147",
                  }}
                  draggable={false}
                />
              )}

              {isTargetColumn && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={id}
                  style={{
                    top: `${index * 30 + 20}px`,
                    width: "8px",
                    height: "8px",
                    background: "#4338ca",
                  }}
                  draggable={false}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
const nodeTypes: Record<string, FC<NodeProps>> = { customTableNode: TableNode };

export const DatabaseDigram = ({ databaseName }: { databaseName: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  useEffect(() => {
    if (!databaseName) {
      setError("No project database name available");
      setIsLoading(false);
      return;
    }

    const fetchSchema = async () => {
      try {
        const data = await getDatabaseSchema(databaseName);
        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }

        const { nodes, edges } = generateNodesAndEdges(
          data.schemaData,
          data.foreignKeyData,
        );

        setNodes(nodes);
        setEdges(edges);
        initialNodes = nodes;
        initialEdges = edges;
      } catch (error) {
        setError("Error fetching schema");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchema();
  }, [databaseName, setNodes, setEdges]);

  return (
    <div className="relative h-full min-h-[400px] border border-gray-200 rounded-lg shadow-md w-full  ">
      {isLoading || error ? (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-xl z-10  ">
            {isLoading ? (
              <Loader className={"animate-spin w-8 h-8"} />
            ) : (
              "We could not render this schema at this time "
            )}
          </div>

          <ReactFlow>
            {/* ReactFlow components */}
            <Controls />
            <Background />
          </ReactFlow>
        </>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          snapToGrid={true}
        >
          {/* ReactFlow components */}
          <Controls />
          <Background />
        </ReactFlow>
      )}
    </div>
  );
};
