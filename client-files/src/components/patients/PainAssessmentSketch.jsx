import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Ellipse, Line, Transformer } from 'react-konva';
import useImage from 'use-image';
import './PainAssessmentSketch.css';
import image from '../../assets/body-scale-sketch.png';

const URLImage = ({ src }) => {
  const [loadedImage] = useImage(src);
  return <KonvaImage image={loadedImage} width={628} height={450} listening={false} />;
};

const PainAssessmentSketch = ({ data, onDataChange }) => {
  const [ellipses, setEllipses] = useState([]);
  const [lines, setLines] = useState([]);
  const [newEllipse, setNewEllipse] = useState(null);
  const [newLine, setNewLine] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState('ellipse');
  const [selectedShapeName, setSelectedShapeName] = useState(null);
  const [lineThickness, setLineThickness] = useState(2);
  const stageRef = useRef(null);
  const trRef = useRef(null);

  useEffect(() => {
    if (data?.sketch_overlays) {
      try {
        const parsed = JSON.parse(data.sketch_overlays);
        setEllipses(parsed.ellipses || []);
        setLines(parsed.lines || []);
      } catch (err) {
        console.error('Error parsing saved sketch data:', err);
      }
    }
  }, [data]);

  useEffect(() => {
    const stage = stageRef.current;
    const selectedNode = stage.findOne(`.${selectedShapeName}`);
    if (selectedNode) {
      trRef.current.nodes([selectedNode]);
      trRef.current.getLayer().batchDraw();
    } else {
      trRef.current.nodes([]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedShapeName, ellipses]);

  const simplifyPoints = (points) => {
    if (points.length <= 4) return points;
    const simplified = [points[0], points[1]];
    for (let i = 2; i < points.length; i += 2) {
      const prevX = simplified[simplified.length - 2];
      const prevY = simplified[simplified.length - 1];
      const currX = points[i];
      const currY = points[i + 1];
      if (Math.hypot(currX - prevX, currY - prevY) > 1.5) {
        simplified.push(currX, currY);
      }
    }
    return simplified;
  };

  const handleMouseDown = (e) => {
    if (drawMode === 'ellipse') {
      if (e.target === e.target.getStage()) {
        setSelectedShapeName(null);
        const { x, y } = e.target.getStage().getPointerPosition();
        setNewEllipse({ x, y, radiusX: 0, radiusY: 0, name: `ellipse-${ellipses.length}` });
        setIsDrawing(true);
      }
    } else if (drawMode === 'free') {
      const pos = e.target.getStage().getPointerPosition();
      setNewLine([pos.x, pos.y]);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = e.target.getStage().getPointerPosition();

    if (drawMode === 'ellipse' && newEllipse) {
      const radiusX = Math.abs(x - newEllipse.x);
      const radiusY = Math.abs(y - newEllipse.y);
      setNewEllipse({ ...newEllipse, radiusX, radiusY });
    } else if (drawMode === 'free') {
      setNewLine((prevLine) => [...prevLine, x, y]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    if (drawMode === 'ellipse' && newEllipse) {
      setEllipses([...ellipses, newEllipse]);
      setNewEllipse(null);
    } else if (drawMode === 'free' && newLine.length > 0) {
      const smoothLine = simplifyPoints(newLine);
      setLines([...lines, { points: smoothLine, strokeWidth: lineThickness }]);
      setNewLine([]);
    }
    setIsDrawing(false);
  };

  const handleSelect = (name) => {
    setSelectedShapeName(name);
  };

  const handleDelete = () => {
    if (selectedShapeName !== null) {
      const updatedEllipses = ellipses.filter((ellipse) => ellipse.name !== selectedShapeName);
      setEllipses(updatedEllipses);
      setSelectedShapeName(null);
    }
  };

  const handleUndo = () => {
    if (lines.length > 0) {
      const updatedLines = lines.slice(0, -1);
      setLines(updatedLines);
    }
  };

  const handleClear = () => {
    setEllipses([]);
    setLines([]);
    setSelectedShapeName(null);
  };

  const saveToDatabase = () => {
  const overlayData = JSON.stringify({ ellipses, lines });
  onDataChange({ sketch_overlays: overlayData }); // ✅ passes as object with key
};

  return (
    <div className="pain-sketch-container">
      <Stage
        width={628}
        height={450}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
        className="pain-sketch-stage"
      >
        <Layer>
          <URLImage src={image} />
          {ellipses.map((ellipse) => (
            <Ellipse
              key={ellipse.name}
              name={ellipse.name}
              x={ellipse.x}
              y={ellipse.y}
              radiusX={ellipse.radiusX}
              radiusY={ellipse.radiusY}
              fillRadialGradientStartPoint={{ x: 0, y: 0 }}
              fillRadialGradientEndPoint={{ x: 0, y: 0 }}
              fillRadialGradientStartRadius={0}
              fillRadialGradientEndRadius={Math.max(ellipse.radiusX, ellipse.radiusY)}
              fillRadialGradientColorStops={[0, 'rgba(255,0,0,0.5)', 1, 'rgba(255,0,0,0.2)']}
              stroke="red"
              strokeWidth={2}
              draggable
              onClick={() => handleSelect(ellipse.name)}
              onTap={() => handleSelect(ellipse.name)}
              onDragEnd={(e) => {
                const updatedEllipses = ellipses.map((el) =>
                  el.name === ellipse.name ? { ...el, x: e.target.x(), y: e.target.y() } : el
                );
                setEllipses(updatedEllipses);
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                node.scaleX(1);
                node.scaleY(1);
                const updatedEllipses = ellipses.map((el) =>
                  el.name === ellipse.name
                    ? {
                        ...el,
                        radiusX: el.radiusX * scaleX,
                        radiusY: el.radiusY * scaleY,
                      }
                    : el
                );
                setEllipses(updatedEllipses);
              }}
            />
          ))}
          {newEllipse && (
            <Ellipse
              x={newEllipse.x}
              y={newEllipse.y}
              radiusX={newEllipse.radiusX}
              radiusY={newEllipse.radiusY}
              fillRadialGradientStartPoint={{ x: 0, y: 0 }}
              fillRadialGradientEndPoint={{ x: 0, y: 0 }}
              fillRadialGradientStartRadius={0}
              fillRadialGradientEndRadius={Math.max(newEllipse.radiusX, newEllipse.radiusY)}
              fillRadialGradientColorStops={[0, 'rgba(255,0,0,0.5)', 1, 'rgba(255,0,0,0.2)']}
              stroke="red"
              strokeWidth={2}
            />
          )}
          {lines.map((line, i) => (
            <Line key={i} points={line.points} stroke="red" strokeWidth={line.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" />
          ))}
          {newLine.length > 0 && (
            <Line points={newLine} stroke="red" strokeWidth={lineThickness} tension={0.5} lineCap="round" lineJoin="round" />
          )}
          <Transformer ref={trRef} />
        </Layer>
      </Stage>
      <div className="pain-sketch-controls">
        <div className="mode-toggle">
          <span>Ellipse</span>
          <div className="toggle-switch" onClick={() => setDrawMode(drawMode === 'ellipse' ? 'free' : 'ellipse')}>
            <div className={`slider ${drawMode === 'free' ? 'slider-right' : ''}`}></div>
          </div>
          <span>Free Draw</span>
        </div>
        <div className='pain-sketch-controls-variable'>
          {drawMode === 'ellipse' && (
            <button onClick={handleDelete} className="pain-sketch-button">
              Delete Selected
            </button>
          )}
          {drawMode === 'free' && (
            <div className="line-thickness-control">
              <label>Line Thickness : {lineThickness}</label>
              <div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={lineThickness}
                  onChange={(e) => setLineThickness(Number(e.target.value))}
                />
              </div>
              <button onClick={handleUndo} className="pain-sketch-button">
                Undo Last Line
              </button>
            </div>
          )}
        </div>
        <button onClick={handleClear} className="pain-sketch-button clear">
          Clear All
        </button>
        <button onClick={saveToDatabase} className="pain-sketch-button save">
          Save
        </button>
      </div>
    </div>
  );
};


export default PainAssessmentSketch;