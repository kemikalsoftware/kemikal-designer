import React from "react";

const width = 300;
const height = 40;

const Status = ({
  selectedNode,
}) => {
  if (!selectedNode) {
    return null;
  }
  const x = 9 - (window.innerWidth * 0.25);
  const y = 36 - (window.innerHeight * 0.5);
  return (
    <>
      <rect
        className="svg-status"
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
          className="status"
        >
          Selection: <span className="status-value">{selectedNode}</span>
        </div>
      </foreignObject>
    </>
  );
};

export default Status;
