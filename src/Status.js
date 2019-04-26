import React from "react";

const Status = ({
  selectedNodes,
}) => {
  if (selectedNodes.length === 0) {
    return null;
  }
  const x = 10 - (window.innerWidth * 0.25);
  const y = 80 - (window.innerHeight * 0.5);
  return (
    <>
      <rect
        className="svg-status"
        x={x}
        y={y}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <foreignObject
        x={x}
        y={y}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        {selectedNodes.map(selectedNode => (
          <div
            key={selectedNode}
            className="status"
          >
            <span className="status-value">
              {selectedNode}
            </span>
          </div>
        ))}
      </foreignObject>
    </>
  );
};

export default Status;
