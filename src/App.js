import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [svgDimensions, setSvgDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    function handleWindowResize() {
      const svgContainer = document.getElementById("right-container");

      setSvgDimensions({
        width: svgContainer.clientWidth,
        height: svgContainer.clientHeight,
      });
    }

    handleWindowResize();
    
    window.addEventListener('resize', handleWindowResize, true);

    return () => {
      window.removeEventListener('resize', handleWindowResize, true);
    };
  });

  const maxZoom = Math.sqrt(Math.pow(svgDimensions.width, 2) + Math.pow(svgDimensions.height, 2)) / 2;
  const minZoom = 18;

  return (
    <>
      <div id="top-container">
        Kemikal Designer
      </div>
      <div id="left-container">
        <textarea id="text-content">

        </textarea>
      </div>
      <div id="right-container">
        <svg
          id="svg-container"
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
          <circle
            cx={0}
            cy={0}
            r={zoom}
            fillOpacity={1 - (zoom / (maxZoom - minZoom))}
          />
        </svg>
      </div>
    </>
  );
}

export default App;
