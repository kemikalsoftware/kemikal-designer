import React, { useState, useEffect } from "react";
import Button from "./Button";
import Edge from "./Edge";
import Status from "./Status";
import Tooltip from "./Tooltip";
import "./App.css";

function App() {
  const [svgDimensions, setSvgDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [zoom, setZoom] = useState(200);

  // TODO Make the AST editable from the text-container.
  const [ast, setAst] = useState({
    nodes: [
      {
        name: "untitled",
      },
    ],
  });

  const [connectedNode, setConnectedNode] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [invalidClick, setInvalidClick] = useState(false);
  const [mouseCoords, setMouseCoords] = useState(null);
  const [moveMode, setMoveMode] = useState(null);
  const [panCoords, setPanCoords] = useState({ x: 0, y: 0 });
  const [pressedCanvas, setPressedCanvas] = useState(false);
  const [pressedNode, setPressedNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState(["untitled"]);

  useEffect(() => {
    function handleWindowResize() {
      const svgContainer = document.getElementById("svg-container");

      setSvgDimensions({
        width: svgContainer.clientWidth,
        height: svgContainer.clientHeight,
      });
    }

    handleWindowResize();
    
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    function handleMouseUp() {
      setConnectedNode(null);
      setMouseCoords(null);
      setMoveMode(null);
      setPressedCanvas(false);
      setPressedNode(null);
    }
    
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const maxZoom = Math.sqrt(Math.pow(svgDimensions.width, 2) + Math.pow(svgDimensions.height, 2)) / 2;
  const minZoom = 18;

  const theta = Math.PI / ast.nodes.length;
  const magnitude = theta === Math.PI ? 0 : zoom / Math.sin(theta);

  const nodeRadius = zoom * 2/3;
  const nodeGeometry = {};

  for (let index = 0; index < ast.nodes.length; index += 1) {
    const angle = 2 * Math.PI * index / ast.nodes.length;
    nodeGeometry[ast.nodes[index].name] = {
      angle,
      x: magnitude * Math.sin(angle) + panCoords.x,
      y: magnitude * -Math.cos(angle) + panCoords.y,
    };
  }

  return (
    <>
      <div id="top-container">
        Kemikal Designer
      </div>
      <div id="svg-container">
        <svg
          id="svg-content"
          className={`
            ${moveMode === "connecting" ? " connecting" : undefined}
            ${moveMode === "panning" || (!moveMode && pressedCanvas) ? " panning" : undefined}
          `}
          width={svgDimensions.width}
          height={svgDimensions.height}
          viewBox={`-${svgDimensions.width / 2} -${svgDimensions.height / 2} ${svgDimensions.width} ${svgDimensions.height}`}
          onMouseDown={() => {
            setPressedCanvas(true);
          }}
          onMouseMove={(event) => {
            if (moveMode === "panning") {
              if (mouseCoords) {
                setPanCoords({
                  x: panCoords.x + (event.clientX - mouseCoords.x),
                  y: panCoords.y + (event.clientY - mouseCoords.y),
                });
              }
              setMouseCoords({
                x: event.clientX,
                y: event.clientY,
              });
            } else if (pressedCanvas) {
              if (!invalidClick) {
                setInvalidClick(true);
              }
              const modified = event.metaKey || event.ctrlKey;
              if (modified && moveMode !== "connecting") {
                setMoveMode("connecting");
                setSelectedNodes([pressedNode]);
              } else if (!modified && moveMode !== "panning") {
                setMoveMode("panning");
              }
            }
          }}
          onWheel={(event) => {
            // TODO Throttle these events.
            const nextZoom = zoom + event.deltaY;

            if (minZoom <= nextZoom && nextZoom <= maxZoom) {
              setZoom(nextZoom);
            }
          }}
        >
          {selectedNodes.length > 0 && (
            <>
              <Button
                x={-(window.innerWidth * 0.25) + 12}
                y={38 - (window.innerHeight * 0.5)}
                iconData={({ x, y, width, height }) => `
                  M ${x + 12} ${y + 12} 
                  L ${x + width - 12} ${y + height - 12}
                  M ${x + width - 12} ${y + 12} 
                  L ${x + 12} ${y + height - 12}
                `}
                onClick={() => {
                  setAst({
                    nodes: ast.nodes.filter(node => !selectedNodes.includes(node.name)),
                  });
                  setSelectedNodes([]);
                }}
              />
              <Status
                selectedNodes={selectedNodes}
              />
            </>
          )}
          {ast.nodes.map((node, index) => {
            const hovered = hoveredNode === node.name;
            const pressed = pressedNode === node.name;
            const selected = selectedNodes.includes(node.name);
            return (
              <circle
                key={node.name}
                className={`
                  svg-node
                  ${hovered ? " hovered" : ""}
                  ${pressed && !moveMode ? " pressed" : ""}
                  ${selected ? " selected" : ""}
                  ${moveMode === "connecting" ? " connecting" : ""}
                  ${moveMode === "panning" ? " panning" : ""}
                `}
                cx={nodeGeometry[node.name].x}
                cy={nodeGeometry[node.name].y}
                r={nodeRadius}
                fillOpacity={1 - (zoom / (maxZoom - minZoom))}
                strokeOpacity={1 - (zoom / (maxZoom - minZoom))}
                onClick={(event) => {
                  const modified = event.metaKey || event.ctrlKey;
                  if (invalidClick) {
                    // The mouse was moved, so don't count this as a click.
                    setInvalidClick(false);
                  } else if (selectedNodes.includes(node.name) && (modified || selectedNodes.length === 1)) {
                    // The node is selected, and either a modifier key is pressed or it's the only node, so remove it from the selection.
                    const nodeIndex = selectedNodes.findIndex(x => x === node.name);
                    setSelectedNodes([
                      ...selectedNodes.slice(0, nodeIndex),
                      ...selectedNodes.slice(nodeIndex + 1, selectedNodes.length),
                    ]);
                  } else if (modified) {
                    // A modifier key is pressed, and the node is not selected, so append it to the selection.
                    setSelectedNodes([...selectedNodes, node.name]);
                  } else {
                    // Otherwise, the node becomes the selection.
                    setSelectedNodes([node.name]);
                  }
                }}
                onMouseDown={() => {
                  setPressedNode(node.name);
                }}
                onMouseEnter={(event) => {
                  if (moveMode === "connecting" && pressedNode !== node.name) {
                    setConnectedNode(node.name);
                  }
                  setHoveredNode(node.name);
                  setHoveredCoords({
                    x: event.clientX - (window.innerWidth * 0.25),
                    y: event.clientY - (window.innerHeight * 0.5),
                  });
                }}
                onMouseLeave={() => {
                  if (moveMode === "connecting") {
                    setConnectedNode(null);
                  }
                  setHoveredNode(null);
                }}
                onMouseMove={(event) => {
                  setHoveredNode(node.name);
                  setHoveredCoords({
                    x: event.clientX - (window.innerWidth * 0.25),
                    y: event.clientY - (window.innerHeight * 0.5),
                  });
                }}
              />
            );
          })}
          {moveMode === "connecting" && connectedNode && pressedNode && (
            <Edge
              connectedNode={connectedNode}
              nodeGeometry={nodeGeometry}
              nodeRadius={nodeRadius}
              pressedNode={pressedNode}
            />
          )}
          {moveMode !== "panning" && hoveredCoords && hoveredNode && (
            <Tooltip
              hoveredCoords={hoveredCoords}
              hoveredNode={hoveredNode}
            />
          )}
          <Button
            x={(window.innerWidth * 0.25) - 50}
            y={38 - (window.innerHeight * 0.5)}
            iconData={({ x, y, width, height }) => `
              M ${x + (width / 2)} ${y + 10} 
              L ${x + (width / 2)} ${y + height - 10}
              M ${x + 10} ${y + (height / 2)} 
              L ${x + width - 10} ${y + (height / 2)}
            `}
            onClick={() => {
              let name;
              if (ast.nodes.some(node => node.name === "untitled")) {
                const lastIndex = ast.nodes
                  .filter(node => /untitled-[0-9]+\b/.test(node.name))
                  .map(node => Number(node.name.substring(9, node.name.length)))
                  .reduce((max, index) => (index > max ? index : max), 0);
                name = `untitled-${lastIndex + 1}`;
              } else {
                name = "untitled";
              }
              setAst({
                nodes: [
                  ...ast.nodes,
                  {
                    name,
                  },
                ],
              })
            }}
          />
        </svg>
      </div>
      <div id="text-container">
        <textarea
          id="text-content"
          value={ast.nodes
            .map(node => `class ${node.name}\n`)
            .join("\n")}
          onChange={() => {
            // TODO
          }}
        />
      </div>
    </>
  );
}

export default App;
