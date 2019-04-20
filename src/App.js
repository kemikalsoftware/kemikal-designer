import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [svgDimensions, setSvgDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [zoom, setZoom] = useState(100);

  const [ast, setAst] = useState({
    nodes: [
      {
        name: "untitled",
      },
    ],
  });

  const [hoveredNode, setHoveredNode] = useState(null);
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
            return (
              <circle
                key={node.name}
                className={`svg-node${hoveredNode === node.name ? " hovered" : ""}${selectedNode === node.name ? " selected" : ""}`}
                cx={0}
                cy={0}
                r={zoom}
                fillOpacity={1 - (zoom / (maxZoom - minZoom))}
                onClick={() => {
                  if (selectedNode === node.name) {
                    setSelectedNode(null);
                  } else {
                    setSelectedNode(node.name);
                  }
                }}
                onMouseEnter={() => {
                  setHoveredNode(node.name);
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                }}
              />
            );
          })}
        </svg>
      </div>
    </>
  );
}

export default App;
