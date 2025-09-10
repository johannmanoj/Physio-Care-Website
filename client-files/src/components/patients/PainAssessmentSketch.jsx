import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Ellipse, Line, Transformer } from 'react-konva';
import useImage from 'use-image';
import './PainAssessmentSketch.css';
import image from '../../assets/body-scale-sketch.png';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const URLImage = ({ src }) => {
  const [loadedImage] = useImage(src);
  return <KonvaImage image={loadedImage} width={628} height={450} listening={false} />;
};

const PainAssessmentSketch = ({ data, onDataChange, setShowSketchModal }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState('ellipse');
  const [selectedShapeName, setSelectedShapeName] = useState(null);
  const [lineThickness, setLineThickness] = useState(2);
  const stageRef = useRef(null);
  const trRef = useRef(null);

  const [buttonView, setButtonView] = useState("save")

  const [titleList, setTitleList] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');

  const [selectedImage, setSelectedImage] = useState()

  const [lineStart, setLineStart] = useState(null);

  const [ellipses, setEllipses] = useState([]);
  const [newEllipse, setNewEllipse] = useState(null);
  const [freeLines, setFreeLines] = useState([]);
  const [newFreeLine, setNewFreeLine] = useState([]);
  const [straightLines, setStraightLines] = useState([]);
  const [newStraightLine, setNewStraightLine] = useState([]);

  const [isNewSketch, setIsNewSketch] = useState(true); // true = new sketch, false = loaded sketch



  // modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSketch, setSaveSketch] = useState({
    classification: 'pain_sketch',
    patient_id: '',
    title: '',
    original_file: '',
    annotations: {},
  });
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch list of titles once
  useEffect(() => {
    axios
      .post(`${API_URL}/api/images/get-images-title-list`, {
        classification: 'pain_sketch',
        patient_id: data?.patient_id,
      })
      .then((response) => {
        setTitleList(response.data?.data || []);
      })
      .catch((error) => {
        console.error('Error fetching title list:', error);
      });
  }, [API_URL, data?.patient_id]);

  // Load stored sketch data coming via `data.sketch_overlays` on mount/prop change
  useEffect(() => {
    if (data?.sketch_overlays) {
      try {
        const incoming = data.sketch_overlays;
        const parsed = typeof incoming === 'string' ? JSON.parse(incoming) : incoming;

        // Ellipses
        const normalizedEllipses = (parsed.ellipses || []).map((el, idx) => ({
          x: el.x,
          y: el.y,
          radiusX: el.radiusX,
          radiusY: el.radiusY,
          name: el.name || `ellipse-${idx}`,
        }));

        // Freehand lines
        const normalizedFreeLines = (parsed.freeLines || []).map((ln) => ({
          points: Array.isArray(ln.points) ? ln.points.map((n) => Number(n)) : [],
          strokeWidth: ln.strokeWidth ?? 2,
        }));

        // Straight/fade lines
        const normalizedStraightLines = (parsed.straightLines || []).map((ln) => ({
          points: Array.isArray(ln.points) ? ln.points.map((n) => Number(n)) : [],
          strokeWidth: ln.strokeWidth ?? 2,
        }));

        setSelectedShapeName(null);
        setEllipses(normalizedEllipses);
        setFreeLines(normalizedFreeLines);
        setStraightLines(normalizedStraightLines);

        // Detach transformer from any previous node
        requestAnimationFrame(() => {
          if (trRef.current) {
            trRef.current.nodes([]);
            trRef.current.getLayer()?.batchDraw();
          }
        });
      } catch (err) {
        console.error('Error parsing saved sketch data:', err);
      }
    }
  }, [data?.sketch_overlays]);


  // Keep Transformer attached to selected ellipse
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !trRef.current) return;
    const selectedNode =
      selectedShapeName ? stage.findOne(`.${selectedShapeName}`) : null;

    if (selectedNode) {
      trRef.current.nodes([selectedNode]);
      trRef.current.getLayer().batchDraw();
    } else {
      trRef.current.nodes([]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedShapeName, ellipses]);


  const fetchSketches = async () => {
    try {
      axios
        .post(`${API_URL}/api/images/get-images-title-list`, {
          classification: 'pain_sketch',
          patient_id: data?.patient_id,
        })
        .then((response) => {
          setTitleList(response.data?.data || []);
        })
        .catch((error) => {
          console.error('Error fetching title list:', error);
        });
    } catch (err) {
      console.error("Error fetching sketches:", err);
    }
  };

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
    const pos = e.target.getStage().getPointerPosition();

    if (drawMode === "ellipse") {
      if (e.target === e.target.getStage()) {
        setSelectedShapeName(null);
        setNewEllipse({
          x: pos.x,
          y: pos.y,
          radiusX: 0,
          radiusY: 0,
          name: `ellipse-${ellipses.length}`,
        });
        setIsDrawing(true);
      }
    } else if (drawMode === "free") {
      setNewFreeLine([pos.x, pos.y]);
      setIsDrawing(true);
    } else if (drawMode === "line") {
      setNewStraightLine([pos.x, pos.y, pos.x, pos.y]); // start & temporary end
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = e.target.getStage().getPointerPosition();

    if (drawMode === "ellipse" && newEllipse) {
      setNewEllipse({ ...newEllipse, radiusX: Math.abs(x - newEllipse.x), radiusY: Math.abs(y - newEllipse.y) });
    } else if (drawMode === "free" && newFreeLine.length > 0) {
      setNewFreeLine((prev) => [...prev, x, y]);
    } else if (drawMode === "line" && newStraightLine.length > 0) {
      setNewStraightLine([newStraightLine[0], newStraightLine[1], x, y]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    if (drawMode === "ellipse" && newEllipse) {
      setEllipses((prev) => [...prev, newEllipse]);
      setNewEllipse(null);
    } else if (drawMode === "free" && newFreeLine.length > 0) {
      const smoothLine = simplifyPoints(newFreeLine);
      setFreeLines((prev) => [...prev, { points: smoothLine, strokeWidth: lineThickness }]);
      setNewFreeLine([]);
    } else if (drawMode === "line" && newStraightLine.length > 0) {
      setStraightLines((prev) => [...prev, { points: newStraightLine, strokeWidth: lineThickness }]);
      setNewStraightLine([]);
    }

    setIsDrawing(false);
  };



  const handleSelect = (name) => {
    setSelectedShapeName(name);
  };

  const handleDelete = () => {
    if (selectedShapeName !== null) {
      const updatedEllipses = ellipses.filter(
        (ellipse) => ellipse.name !== selectedShapeName
      );
      setEllipses(updatedEllipses);
      setSelectedShapeName(null);
    }
  };

  const handleUndo = () => {
    if (drawMode === 'free' && freeLines.length > 0) {
      setFreeLines((prev) => prev.slice(0, -1));
    } else if (drawMode === 'ellipse' && ellipses.length > 0) {
      setEllipses((prev) => prev.slice(0, -1));
      setSelectedShapeName(null);
    } else if (drawMode === 'line' && straightLines.length > 0) {
      setStraightLines((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setEllipses([]);
    setFreeLines([]);
    setNewFreeLine([]);
    setStraightLines([]);
    setNewStraightLine([]);
    setSelectedShapeName(null);
  };


  const handleSaveSketch = () => {
    const annotations = {
      ellipses,
      freeLines,   // freehand lines
      straightLines // straight/fade lines
    };

    axios
      .post(`${API_URL}/api/images/add-image-record`, {
        ...saveSketch,
        patient_id: data?.patient_id,
        classification: 'pain_sketch',
        annotations: JSON.stringify(annotations),
      })
      .then(() => {
        setShowSaveModal(false);
        setSaveSketch({
          classification: 'pain_sketch',
          patient_id: '',
          title: '',
          original_file: '',
          annotations: {},
        });
        handleClear();
      })
      .catch((error) => {
        console.error('Error saving sketch:', error);
      });
  };

  const handleUpdateSketch = () => {
    const annotations = {
      ellipses,
      freeLines,
      straightLines
    };

    axios
      .post(`${API_URL}/api/images/update-images-details`, {
        id: selectedImage.id,
        annotations: JSON.stringify(annotations),
        title: selectedImage.title
      })
      .then(() => {
        setShowEditModal(false);
        handleClear();
        setButtonView("save");
      })
      .catch((error) => {
        console.error('Error updating sketch:', error);
      });
  };





  const handleLoadSketch = () => {
    if (!selectedTitle) return;
    axios
      .post(`${API_URL}/api/images/get-images-details`, {
        classification: 'pain_sketch',
        patient_id: data?.patient_id,
        title: selectedTitle,
      })
      .then((response) => {
        const rec = response?.data?.data?.[0];
        const incoming = rec?.annotations;

        if (!incoming) {
          setShowLoadModal(false);
          return;
        }

        try {
          const parsed =
            typeof incoming === 'string' ? JSON.parse(incoming) : incoming;

          // Ellipses
          const normalizedEllipses = (parsed.ellipses || []).map((el, idx) => ({
            x: el.x,
            y: el.y,
            radiusX: el.radiusX,
            radiusY: el.radiusY,
            name: el.name || `ellipse-${idx}`,
          }));

          // Freehand lines
          const normalizedFreeLines = (parsed.freeLines || []).map((ln) => ({
            points: Array.isArray(ln.points) ? ln.points.map(Number) : [],
            strokeWidth: ln.strokeWidth ?? 2,
          }));

          // Straight lines
          const normalizedStraightLines = (parsed.straightLines || []).map((ln) => ({
            points: Array.isArray(ln.points) ? ln.points.map(Number) : [],
            strokeWidth: ln.strokeWidth ?? 2,
          }));

          setSelectedShapeName(null);
          setEllipses(normalizedEllipses);
          setFreeLines(normalizedFreeLines);
          setStraightLines(normalizedStraightLines);
          setSelectedImage(rec);

          // Transformer reset
          requestAnimationFrame(() => {
            if (trRef.current) {
              trRef.current.nodes([]);
              trRef.current.getLayer()?.batchDraw();
            }
          });

          setShowLoadModal(false);
          setButtonView("update");
          setIsNewSketch(false); // loaded sketch → Save disabled, Update enabled
        } catch (err) {
          console.error('Error parsing loaded sketch data:', err);
        }
      })
      .catch((error) => {
        console.error('Error loading sketch:', error);
      });
  };





  const handleNewSketch = () => {
    handleClear();
    setButtonView("save");
    setIsNewSketch(true); // new sketch → Save enabled, Update disabled
    setSelectedImage(null);
  };



  const openLoadPopup = () => {
    fetchSketches();  // 🔥 refresh list before showing popup
    setShowLoadModal(true)
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
              fillRadialGradientColorStops={[
                0,
                'rgba(255,0,0,0.5)',
                1,
                'rgba(255,0,0,0.2)',
              ]}
              stroke="red"
              strokeWidth={2}
              draggable
              onClick={() => handleSelect(ellipse.name)}
              onTap={() => handleSelect(ellipse.name)}
              onDragEnd={(e) => {
                const updated = ellipses.map((el) =>
                  el.name === ellipse.name
                    ? { ...el, x: e.target.x(), y: e.target.y() }
                    : el
                );
                setEllipses(updated);
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                node.scaleX(1);
                node.scaleY(1);
                const updated = ellipses.map((el) =>
                  el.name === ellipse.name
                    ? {
                      ...el,
                      radiusX: Math.max(1, el.radiusX * scaleX),
                      radiusY: Math.max(1, el.radiusY * scaleY),
                    }
                    : el
                );
                setEllipses(updated);
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
              fillRadialGradientColorStops={[
                0,
                'rgba(255,0,0,0.5)',
                1,
                'rgba(255,0,0,0.2)',
              ]}
              stroke="red"
              strokeWidth={2}
            />
          )}


          {/* Freehand lines (solid red) */}
          {freeLines.map((line, i) => (
            <Line
              key={`free-${i}`}
              points={line.points}
              stroke="red"
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {newFreeLine.length > 0 && (
            <Line
              points={newFreeLine}
              stroke="red"
              strokeWidth={lineThickness}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {/* Straight lines (fading red) */}
          {straightLines.map((line, i) => (
            <Line
              key={`line-${i}`}
              points={line.points}
              strokeLinearGradientStartPoint={{ x: line.points[0], y: line.points[1] }}
              strokeLinearGradientEndPoint={{ x: line.points[2], y: line.points[3] }}
              strokeLinearGradientColorStops={[0, "rgba(255,0,0,1)", 1, "rgba(255,0,0,0)"]}
              strokeWidth={line.strokeWidth}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {newStraightLine.length > 0 && (
            <Line
              points={newStraightLine}
              strokeLinearGradientStartPoint={{ x: newStraightLine[0], y: newStraightLine[1] }}
              strokeLinearGradientEndPoint={{ x: newStraightLine[2], y: newStraightLine[3] }}
              strokeLinearGradientColorStops={[0, "rgba(255,0,0,1)", 1, "rgba(255,0,0,0)"]}
              strokeWidth={lineThickness}
              lineCap="round"
              lineJoin="round"
            />
          )}



          <Transformer ref={trRef} />
        </Layer>
      </Stage>

      <div className="pain-sketch-controls">

        {/* Drawing Tools */}
        <div className="control-group">
          <h4>Drawing Tools</h4>
          <div className="tool-selector">
            <button
              className={`tool-btn ${drawMode === 'ellipse' ? 'active' : ''}`}
              onClick={() => setDrawMode('ellipse')}
            >
              ⭕ Ellipse
            </button>
            <button
              className={`tool-btn ${drawMode === 'line' ? 'active' : ''}`}
              onClick={() => setDrawMode('line')}
            >
              ➖ Line
            </button>
            <button
              className={`tool-btn ${drawMode === 'free' ? 'active' : ''}`}
              onClick={() => setDrawMode('free')}
            >
              ✏️ Draw
            </button>
          </div>
        </div>

        {/* Line Thickness */}
        <div className="control-group">
          <h4>Options</h4>
          <div className="line-thickness-control">
            <label>Line Thickness</label>
            <input
              type="range"
              min="1"
              max="10"
              value={lineThickness}
              onChange={(e) => setLineThickness(Number(e.target.value))}
            />
          </div>

          <button className="sketch-button-single danger" onClick={handleDelete}>
            🗑️ Delete Selected
          </button>
          <button className="sketch-button-single" onClick={handleUndo}>
            ↩️ Undo
          </button>
        </div>

        {/* Session Controls */}
        <div className="control-group">
          <h4>Session</h4>
          <div className='sketch-button-row'>
            {/* <button className="sketch-button primary" onClick={handleSaveSketch}>💾 Save</button> */}
            <button
              className="sketch-button primary"
              onClick={() => setShowSaveModal(true)}
              disabled={!isNewSketch}
              title={!isNewSketch ? "Cannot save a loaded sketch" : ""}
            >
              💾 Save
            </button>

            <button
              className="sketch-button primary"
              onClick={() => setShowEditModal(true)}
              disabled={isNewSketch}
              title={isNewSketch ? "No sketch loaded to update" : ""}
            >
              🔄 Update
            </button>
            {/* <button className="sketch-button primary" onClick={() => setShowSaveModal(true)}>💾 Save</button> */}
            {/* <button className="sketch-button primary" onClick={() => setShowEditModal(true)}>🔄 Update</button> */}
          </div>
          <div className='sketch-button-row'>
            {/* <button className="sketch-button secondary" onClick={handleNewSketch}>➕ New</button> */}
            <button className="sketch-button secondary" onClick={handleNewSketch}>➕ New</button>
            <button className="sketch-button secondary" onClick={() => openLoadPopup()}>📂 Load</button>
          </div>


          <button className="sketch-button-single" onClick={() => setShowSketchModal(false)}>❌ Close</button>
        </div>

        {/* Pain Scale */}
        {/* <div className="control-group">
          <h4>Pain Scale</h4>
          <div className="pain-scale">
            <span>🙂 0</span>
            <div className="pain-bar"></div>
            <span>10 😣</span>
          </div>
        </div> */}

      </div>

      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Save Sketch</h2>
            <input
              type="text"
              placeholder="Title"
              value={saveSketch.title}
              onChange={(e) =>
                setSaveSketch((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
            <div className="modal-buttons">
              <button className="view-button" onClick={handleSaveSketch}>
                Save
              </button>
              <button className="cancel-button" onClick={() => setShowSaveModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Load Sketch</h2>
            <select value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)}>
              <option value="">Select Title</option>
              {titleList.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button className="view-button" onClick={handleLoadSketch}>
                Load
              </button>
              <button className="cancel-button" onClick={() => setShowLoadModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Update Sketch</h2>
            <input
              type="title"
              label='Title'
              placeholder="title"
              value={selectedImage.title}
              onChange={(e) => setSelectedImage({ ...selectedImage, title: e.target.value })}
            />

            <div className="modal-buttons">
              <button className="view-button" onClick={handleUpdateSketch}>Update</button>
              <button className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PainAssessmentSketch;
