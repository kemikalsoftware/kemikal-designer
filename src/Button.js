import React, { useState, useEffect } from "react";

const width = 38;
const height = 38;

const Button = ({
  iconData,
  onClick,
  x,
  y,
}) => {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    function handleMouseUp() {
      setPressed(false);
    }
    
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <g
      onMouseDown={() => {
        setPressed(true);
      }}
      onMouseUp={() => {
        setPressed(false);
      }}
    >
      <rect
        className={`svg-button${pressed ? " pressed" : ""}`}
        x={x}
        y={y}
        rx={3}
        ry={3}
        width={width}
        height={height}
      />
      <line
        className="svg-button-shadow"
        x1={pressed ? x : x + width}
        y1={y}
        x2={pressed ? x : x + width}
        y2={y + height}
      />
      <line
        className="svg-button-shadow"
        x1={x}
        y1={pressed ? y : y + height}
        x2={x + width}
        y2={pressed ? y : y + height}
      />
      <path
        className="svg-button-icon"
        d={iconData({ x, y, width, height })}
        transform={pressed ? `translate(2 2)` : undefined}
      />
    </g>
  );
};

export default Button;
