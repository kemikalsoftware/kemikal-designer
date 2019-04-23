import React from "react";

const width = 300;
const height = 40;

const Tooltip = ({
  hoveredCoords,
  hoveredNode,
}) => {
  if (!(hoveredCoords && hoveredNode)) {
    return null;
  }
  const x = hoveredCoords.x;
  const y = hoveredCoords.y;
  return (
    <>
      <rect
        className="svg-tooltip"
        x={x}
        y={y}
        width={width}
        height={height}
      />
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
      >
        <div
          className="tooltip"
        >
          {hoveredNode}
        </div>
      </foreignObject>
    </>
  );
};

export default Tooltip;
