import React, { useRef, useState, useEffect } from "react";
import "./PainAssessmentSketch.css";
import image from "../../assets/body-sketch.png";

function PainAssessmentSketch() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "red";  
    ctx.lineWidth = 3;
    ctxRef.current = ctx;

    const background = new Image();
    background.src = image;
    background.onload = () => {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    setCurrentPath([{ x: offsetX, y: offsetY }]);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };
    const updatedPath = [...currentPath, newPoint];
    setCurrentPath(updatedPath);

    ctxRef.current.beginPath();
    const prevPoint = updatedPath[updatedPath.length - 2];
    ctxRef.current.moveTo(prevPoint.x, prevPoint.y);
    ctxRef.current.lineTo(newPoint.x, newPoint.y);
    ctxRef.current.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setPaths([...paths, currentPath]);
    setCurrentPath([]);
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const background = new Image();
    background.src = image;
    background.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      paths.forEach((path) => {
        ctx.beginPath();
        path.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      });
    };
  };

  const handleUndo = () => {
    const updatedPaths = [...paths];
    updatedPaths.pop();
    setPaths(updatedPaths);
  };

  const handleClear = () => {
    setPaths([]);
  };

  const handleSave = () => {
  const canvas = canvasRef.current;
  const image = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = image;
  link.download = "pain-assessment.png";
  link.click();
};

  useEffect(() => {
    redraw();
  }, [paths]);

  return (
    <div className="pain-sketch-container">
      <canvas
        ref={canvasRef}
        className="pain-sketch-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      />
      <div className="pain-sketch-buttons">
        <button onClick={handleUndo} className="pain-sketch-button undo">
          Undo
        </button>
        <button onClick={handleClear} className="pain-sketch-button clear">
          Clear
        </button>
        <button onClick={handleSave} className="pain-sketch-button save">
          Save
        </button>
      </div>
    </div>
  );
}

export default PainAssessmentSketch;
