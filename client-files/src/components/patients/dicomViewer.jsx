import React, { useRef, useEffect, useState } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import Hammer from "hammerjs";
import "./dicomViewer.css";

// Setup external dependencies
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// Initialize cornerstoneTools
cornerstoneTools.init();

export default function DicomUploader() {
  const elementRef = useRef(null);
  const [imageId, setImageId] = useState(null);
  const [activeTool, setActiveTool] = useState("Length");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileImageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      setImageId(fileImageId);
      setSelectedFileName(file.name);
    }
  };

  const setTool = (toolName) => {
    cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
    setActiveTool(toolName);
  };

  const handleUndo = () => {
    const element = elementRef.current;
    const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
    const toolState = toolStateManager.saveToolState();
    const activeToolName = activeTool;
    const state = toolState?.[imageId]?.[activeToolName];

    if (state && state.data && state.data.length > 0) {
      state.data.pop(); // Remove last annotation
      toolStateManager.restoreToolState(toolState);
      cornerstone.updateImage(element);
    }
  };

  const handleDeleteSelected = () => {
    const element = elementRef.current;
    const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
    const toolState = toolStateManager.saveToolState();
    const toolData = toolState?.[imageId]?.[activeTool];

    if (toolData?.data) {
      // Remove annotation that is marked active
      const updatedData = toolData.data.filter(item => !item.active);
      toolState[imageId][activeTool].data = updatedData;
      toolStateManager.restoreToolState(toolState);
      cornerstone.updateImage(element);
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!imageId) return;

    cornerstone.enable(element);

    const loadImage = async () => {
      try {
        const image = await cornerstone.loadImage(imageId);
        cornerstone.displayImage(element, image);

        // Register tools
        cornerstoneTools.addTool(cornerstoneTools.PanTool);
        cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
        cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
        cornerstoneTools.addTool(cornerstoneTools.LengthTool);
        cornerstoneTools.addTool(cornerstoneTools.EllipticalRoiTool);
        cornerstoneTools.addTool(cornerstoneTools.RectangleRoiTool);
        cornerstoneTools.addTool(cornerstoneTools.AngleTool);
        cornerstoneTools.addTool(cornerstoneTools.FreehandRoiTool);

        // Activate default tool
        setTool(activeTool);
      } catch (err) {
        console.error("Error loading DICOM image:", err);
      }
    };

    loadImage();

    return () => {
      cornerstone.disable(element);
    };
  }, [imageId]);

  return (
    <div className="dicom-container">
      <div className="upload-section">
        <label htmlFor="dicom-file" className="upload-button">
          📂 Choose DICOM File
        </label>
        <input
          type="file"
          id="dicom-file"
          accept=".dcm"
          onChange={handleFileChange}
          className="file-input-hidden"
        />
        {selectedFileName && <p className="file-name">Selected: {selectedFileName}</p>}
      </div>

      <div className="tool-buttons">
        <button className={activeTool === "Pan" ? "active" : ""} onClick={() => setTool("Pan")}>🖐️ Pan</button>
        <button className={activeTool === "Zoom" ? "active" : ""} onClick={() => setTool("Zoom")}>🔍 Zoom</button>
        <button className={activeTool === "Wwwc" ? "active" : ""} onClick={() => setTool("Wwwc")}>🎛 W/L</button>
        <button className={activeTool === "Length" ? "active" : ""} onClick={() => setTool("Length")}>📏 Ruler</button>
        <button className={activeTool === "RectangleRoi" ? "active" : ""} onClick={() => setTool("RectangleRoi")}>◼️ Rect ROI</button>
        <button className={activeTool === "EllipticalRoi" ? "active" : ""} onClick={() => setTool("EllipticalRoi")}>⚪️ Ellipt ROI</button>
        <button className={activeTool === "Angle" ? "active" : ""} onClick={() => setTool("Angle")}>📐 Angle</button>
        <button className={activeTool === "FreehandRoi" ? "active" : ""} onClick={() => setTool("FreehandRoi")}>✍️ Freehand ROI</button>

        {/* Undo and Delete Buttons */}
        <button onClick={handleUndo}>↩️ Undo</button>
        {/* <button onClick={handleDeleteSelected}>❌ Delete Selected</button> */}
      </div>

      <div ref={elementRef} className="dicom-viewer"></div>
    </div>
  );
}
