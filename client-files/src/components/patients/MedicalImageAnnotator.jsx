// import React, { useEffect, useRef, useState } from 'react';
// import Annotorious from '@recogito/annotorious';
// import '@recogito/annotorious/dist/annotorious.min.css';
// import Markup from '@pqina/markup';

// import dicomImage from '../assets/sample-dicom.jpg'; // Replace with actual DICOM loader later

// export default function MedicalImageAnnotator() {
//   const imageRef = useRef(null);
//   const markupContainerRef = useRef(null);
//   const [anno, setAnno] = useState(null);
//   const [markup, setMarkup] = useState(null);

//   // Initialize Annotorious for shape annotations
//   useEffect(() => {
//     if (imageRef.current) {
//       const annotorious = Annotorious.init({
//         image: imageRef.current,
//         widgets: ['COMMENT']
//       });
//       setAnno(annotorious);
//     }
//   }, []);

//   // Initialize PQINA Markup Editor for freehand and text annotations
//   useEffect(() => {
//     if (markupContainerRef.current) {
//       const markupEditor = new Markup(markupContainerRef.current, {
//         shapeStyle: {
//           stroke: 'red',
//           strokeWidth: 2,
//         },
//         textStyle: {
//           fontSize: 14,
//           fill: 'red'
//         }
//       });
//       setMarkup(markupEditor);
//     }
//   }, []);

//   const handleExportAnnotations = () => {
//     const annotoriousData = anno.getAnnotations();
//     const markupData = markup.getShapes();

//     const exportData = {
//       shapes: annotoriousData,
//       freehand: markupData
//     };

//     const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'annotations.json';
//     link.click();
//   };

//   const handleSaveImage = () => {
//     const canvas = document.createElement('canvas');
//     const image = imageRef.current;

//     canvas.width = image.naturalWidth;
//     canvas.height = image.naturalHeight;

//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(image, 0, 0);

//     // Draw Markup Layer
//     const markupCanvas = markup.canvas;
//     ctx.drawImage(markupCanvas, 0, 0, canvas.width, canvas.height);

//     const link = document.createElement('a');
//     link.href = canvas.toDataURL('image/png');
//     link.download = 'annotated-image.png';
//     link.click();
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-4">
//       <div className="relative">
//         <img ref={imageRef} src={dicomImage} alt="Medical Scan" className="max-w-full border rounded" />
//         <div ref={markupContainerRef} className="absolute inset-0 pointer-events-none"></div>
//       </div>

//       <div className="flex gap-4">
//         <button onClick={handleExportAnnotations} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
//           Export Annotations
//         </button>
//         <button onClick={handleSaveImage} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//           Save Image
//         </button>
//       </div>
//     </div>
//   );
// }
