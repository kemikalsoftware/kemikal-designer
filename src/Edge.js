import React from "react";

function Edge({
  connectedNode,
  nodeGeometry,
  nodeRadius,
  pressedNode,
}) {
  const x = nodeGeometry[pressedNode].x - nodeGeometry[connectedNode].x;
  const y = nodeGeometry[pressedNode].y - nodeGeometry[connectedNode].y;
  const alpha = Math.atan(Math.abs(x) / Math.abs(y));
  return (
    <>
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 3 3"
          refX="2"
          refY="1.5" 
          markerUnits="strokeWidth"
          markerWidth="3"
          markerHeight="3"
          orient="auto"
        >
          <path
            className="svg-edge-arrowhead"
            d="M 0 0 L 3 1.5 L 0 3 z"
          />
        </marker>
      </defs>
      <line
        className="svg-edge"
        markerEnd="url(#arrowhead)"
        x1={nodeGeometry[pressedNode].x + nodeRadius * Math.sin(alpha) * -Math.sign(x)}
        y1={nodeGeometry[pressedNode].y + nodeRadius * Math.cos(alpha) * -Math.sign(y)}
        x2={nodeGeometry[connectedNode].x + (nodeRadius + 7) * Math.sin(alpha) * Math.sign(x)}
        y2={nodeGeometry[connectedNode].y + (nodeRadius + 7) * Math.cos(alpha) * Math.sign(y)}
      />
    </>
  );
}

export default Edge;
