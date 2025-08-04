import React, { useRef, useState, useEffect } from "react";
import "./PainAssessmentSketch.css";
import image from "../../assets/body-scale-sketch.png";
import { MdSave, MdClear, MdUndo } from "react-icons/md";

function PainAssessmentSketch() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Fix for scaling issue
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = "round";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;

    ctxRef.current = ctx;

    const background = new Image();
    background.src = image;
    background.onload = () => {
      ctx.drawImage(background, 0, 0, rect.width, rect.height);
    };
  }, []);

  const getPointerPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    return { x, y };
  };

  const startDrawing = (e) => {
    const { x, y } = getPointerPosition(e);
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getPointerPosition(e);
    const newPoint = { x, y };
    const updatedPath = [...currentPath, newPoint];
    setCurrentPath(updatedPath);

    const ctx = ctxRef.current;
    ctx.beginPath();
    const prevPoint = updatedPath[updatedPath.length - 2];
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(newPoint.x, newPoint.y);
    ctx.stroke();
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
    const rect = canvas.getBoundingClientRect();

    const background = new Image();
    background.src = image;
    background.onload = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(background, 0, 0, rect.width, rect.height);
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
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
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
        

        {/* <button onClick={handleUndo} className="pain-sketch-button undo">Undo</button>
        <button onClick={handleClear} className="pain-sketch-button clear">Clear</button>
        <button onClick={handleSave} className="pain-sketch-button save">Save</button> */}
        

        <button onClick={handleUndo} className="pain-assessment-button undo">
          <MdUndo  style={{ color: 'white', fontSize: '38px' }} />
          Undo
        </button>
        <button onClick={handleClear} className="pain-assessment-button clear">
          <MdClear style={{ color: 'white', fontSize: '38px' }} />
          Clear
        </button>
        <button onClick={handleSave} className="pain-assessment-button save">
          <MdSave style={{ color: 'white', fontSize: '38px' }} />
          Save
        </button>
      </div>
    </div>
  );
}

export default PainAssessmentSketch;
