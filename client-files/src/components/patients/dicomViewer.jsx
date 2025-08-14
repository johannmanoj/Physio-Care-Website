import React, { useRef, useEffect, useState } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import Hammer from "hammerjs";
import axios from "axios";
import "./DicomViewer.css";

const API_URL = import.meta.env.VITE_API_URL


cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;


cornerstoneTools.init();

export default function DicomViewer({ data, onDataChange, dicomUrl, initialAnnotations }) {
  const elementRef = useRef(null);
  const [imageId, setImageId] = useState(null);
  const [activeTool, setActiveTool] = useState("Length");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  // Load local file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileImageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      setImageId(fileImageId);
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  // Set active tool
  const setTool = (toolName) => {
    cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
    setActiveTool(toolName);
  };

  // Undo last drawn annotation
  const handleUndo = () => {
    const element = elementRef.current;
    const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
    const toolState = toolStateManager.saveToolState();
    const state = toolState?.[imageId]?.[activeTool];

    if (state?.data?.length) {
      state.data.pop();
      toolStateManager.restoreToolState(toolState);
      cornerstone.updateImage(element);
    }
  };

  // Delete selected annotation
  const handleDeleteSelected = () => {
    const element = elementRef.current;
    const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
    const toolState = toolStateManager.saveToolState();
    const toolData = toolState?.[imageId]?.[activeTool];

    if (toolData?.data) {
      toolState[imageId][activeTool].data = toolData.data.filter(item => !item.active);
      toolStateManager.restoreToolState(toolState);
      cornerstone.updateImage(element);
    }
  };

  // Save file + annotations to server
  const handleSaveToServer = async () => {
    if (!selectedFile && !dicomUrl) {
      alert("Please load a file first.");
      return;
    }

    const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
    const toolState = toolStateManager.saveToolState();

    const formData = new FormData();
    if (selectedFile) {
      formData.append("dicom_file", selectedFile);
    }
    formData.append("patient_id", data.patient_id);
    formData.append("annotation_json", JSON.stringify(toolState));

    try {
      await axios.post(
        `${API_URL}/api/files/save-discom-file`,
        formData
      );
      alert("File & annotations saved successfully!");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error uploading file");
    }
  };

  // Load image whenever imageId or dicomUrl changes
  useEffect(() => {
    const element = elementRef.current;

    const loadImage = async (id) => {
      try {
        cornerstone.enable(element);
        const image = await cornerstone.loadImage(id);
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

        // Restore saved annotations if provided
        if (initialAnnotations) {
          cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState(initialAnnotations);
          cornerstone.updateImage(element);
        }

        // Activate default tool
        setTool(activeTool);
      } catch (err) {
        console.error("Error loading DICOM image:", err);
      }
    };

    if (dicomUrl) {
      const remoteId = `wadouri:${dicomUrl}`;
      setImageId(remoteId);
      loadImage(remoteId);
    } else if (imageId) {
      loadImage(imageId);
    }

    return () => {
      cornerstone.disable(element);
    };
  }, [imageId, dicomUrl, initialAnnotations]);

  return (
    <div className="dicom-container">
      {!dicomUrl && (
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
      )}

      <div className="tool-buttons">
        <button className={activeTool === "Pan" ? "active" : ""} onClick={() => setTool("Pan")}>🖐️ Pan</button>
        <button className={activeTool === "Zoom" ? "active" : ""} onClick={() => setTool("Zoom")}>🔍 Zoom</button>
        <button className={activeTool === "Wwwc" ? "active" : ""} onClick={() => setTool("Wwwc")}>🎛 W/L</button>
        <button className={activeTool === "Length" ? "active" : ""} onClick={() => setTool("Length")}>📏 Ruler</button>
        <button className={activeTool === "RectangleRoi" ? "active" : ""} onClick={() => setTool("RectangleRoi")}>◼️ Rect ROI</button>
        <button className={activeTool === "EllipticalRoi" ? "active" : ""} onClick={() => setTool("EllipticalRoi")}>⚪️ Ellipt ROI</button>
        <button className={activeTool === "Angle" ? "active" : ""} onClick={() => setTool("Angle")}>📐 Angle</button>
        <button className={activeTool === "FreehandRoi" ? "active" : ""} onClick={() => setTool("FreehandRoi")}>✍️ Freehand ROI</button>
        <button onClick={handleUndo}>↩️ Undo</button>
        <button onClick={handleDeleteSelected}>❌ Delete Selected</button>
        <button onClick={handleSaveToServer}>💾 Save</button>
      </div>

      <div ref={elementRef} className="dicom-viewer"></div>
    </div>
  );
}
