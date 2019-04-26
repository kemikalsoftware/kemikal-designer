import React, { useState, useEffect } from "react";
import Status from "./Status";
import Tooltip from "./Tooltip";
import Button from "./Button";
import "./App.css";

function App() {
  const [svgDimensions, setSvgDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [zoom, setZoom] = useState(100);

  // TODO Make the AST editable from the text-container.
  const [ast, setAst] = useState({
    nodes: [
      {
        name: "untitled",
      },
    ],
  });

  const [hoveredCoords, setHoveredCoords] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [pressedNode, setPressedNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState("untitled");

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
      setPressedNode(null);
    }
    
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const maxZoom = Math.sqrt(Math.pow(svgDimensions.width, 2) + Math.pow(svgDimensions.height, 2)) / 2;
  const minZoom = 18;

  return (
    <>
      <div id="top-container">
        Kemikal Designer
      </div>
      <div id="svg-container">
        <svg
          id="svg-content"
          width={svgDimensions.width}
          height={svgDimensions.height}
          viewBox={`-${svgDimensions.width / 2} -${svgDimensions.height / 2} ${svgDimensions.width} ${svgDimensions.height}`}
          onWheel={(event) => {
            // TODO Throttle these events.
            const nextZoom = zoom + event.deltaY;

            if (minZoom <= nextZoom && nextZoom <= maxZoom) {
              setZoom(nextZoom);
            }
          }}
        >
          {ast.nodes.map((node, index) => {
            const theta = Math.PI / ast.nodes.length;
            const magnitude = theta === Math.PI ? 0 : zoom / Math.sin(theta);
            const phi = 2 * Math.PI * index / ast.nodes.length;
            const x = magnitude * Math.sin(phi);
            const y = magnitude * Math.cos(phi);

            const hovered = hoveredNode === node.name;
            const pressed = pressedNode === node.name;
            const selected = selectedNode === node.name;
            return (
              <circle
                key={node.name}
                className={`svg-node${hovered ? " hovered" : ""}${pressed ? " pressed" : ""}${selected ? " selected" : ""}`}
                cx={x}
                cy={y}
                r={zoom}
                fillOpacity={1 - (zoom / (maxZoom - minZoom))}
                strokeOpacity={1 - (zoom / (maxZoom - minZoom))}
                onClick={() => {
                  if (selectedNode === node.name) {
                    setSelectedNode(null);
                  } else {
                    setSelectedNode(node.name);
                  }
                }}
                onMouseDown={() => {
                  setPressedNode(node.name);
                }}
                onMouseEnter={(event) => {
                  setHoveredCoords({
                    x: event.clientX - (window.innerWidth * 0.25),
                    y: event.clientY - (window.innerHeight * 0.5),
                  });
                  setHoveredNode(node.name);
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                }}
                onMouseMove={(event) => {
                  setHoveredCoords({
                    x: event.clientX - (window.innerWidth * 0.25),
                    y: event.clientY - (window.innerHeight * 0.5),
                  });
                  setHoveredNode(node.name);
                }}
              />
            );
          })}
          <Status
            selectedNode={selectedNode}
          />
          <Tooltip
            hoveredCoords={hoveredCoords}
            hoveredNode={hoveredNode}
          />
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
