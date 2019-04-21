import React, { useState, useEffect } from "react";
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
    
    window.addEventListener("resize", handleWindowResize, true);

    return () => {
      window.removeEventListener("resize", handleWindowResize, true);
    };
  });

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
            // TODO - Throttle these events
            const nextZoom = zoom + event.deltaY;

            if (minZoom <= nextZoom && nextZoom <= maxZoom) {
              setZoom(nextZoom);
            }
          }}
        >
          {ast.nodes.map(node => {
            const hovered = hoveredNode === node.name;
            const pressed = pressedNode === node.name;
            const selected = selectedNode === node.name;
            return (
              <circle
                key={node.name}
                className={`svg-node${hovered ? " hovered" : ""}${pressed ? " pressed" : ""}${selected ? " selected" : ""}`}
                cx={0}
                cy={0}
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
                onMouseUp={() => {
                  setPressedNode(null);
                }}
                onMouseMove={(event) => {
                  setHoveredCoords({
                    x: event.clientX - (window.innerWidth * 0.25),
                    y: event.clientY - (window.innerHeight * 0.5),
                  });
                  setHoveredNode(node.name);
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                }}
              />
            );
          })}
          {selectedNode && (
            <>
              <rect
                className="svg-status"
                x={9 - (window.innerWidth * 0.25)}
                y={36 - (window.innerHeight * 0.5)}
                width={300}
                height={40}
              />
              <foreignObject
                x={9 - (window.innerWidth * 0.25)}
                y={36 - (window.innerHeight * 0.5)}
                width={300}
                height={40}
              >
                <div
                  className="status"
                >
                  Selection: <span className="status-value">{selectedNode}</span>
                </div>
              </foreignObject>  
            </>
          )}
          {hoveredCoords && hoveredNode && (
            <>
              <rect
                className="svg-tooltip"
                x={hoveredCoords.x}
                y={hoveredCoords.y}
                width={300}
                height={40}
              />
              <foreignObject
                x={hoveredCoords.x}
                y={hoveredCoords.y}
                width={300}
                height={40}
              >
                <div
                  className="tooltip"
                >
                  {hoveredNode}
                </div>
              </foreignObject>  
            </>
          )}
        </svg>
      </div>
      <div
        id="text-container"
      >
        {ast.nodes.map(node => {
          return (
            <div key={node.name}>
              class {node.name}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
