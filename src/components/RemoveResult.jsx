import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import ZoomSlider from "./ZoomSlider";

const RemoveResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl } = location.state || {};
  const [zoom, setZoom] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [cropMode, setCropMode] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filteredImageUrl, setFilteredImageUrl] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const cropperRef = useRef(null);

  const handleZoomChange = (newZoomLevel) => {
    setZoom(newZoomLevel);
  };

  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setImageOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  if (!imageUrl) {
    return <div>No hay imagen para mostrar.</div>;
  }

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedImageUrl = croppedCanvas.toDataURL('image/png');
      downloadFile(croppedImageUrl, selectedBackground); // Pasar el fondo seleccionado
      setCropMode(false);
    }
  };

  const downloadFile = (url, background) => {
    let downloadUrl = `http://localhost:8000/download/?file_path=${encodeURIComponent(filteredImageUrl || imageUrl)}`;
    if (background) {
      downloadUrl += `&background=${encodeURIComponent(background)}`;
    }
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute('download', 'image.png'); // Cambia 'image.png' al nombre de archivo deseado
    document.body.appendChild(link);  
    link.click();
    document.body.removeChild(link);
  };

  const toggleBackground = (backgroundUrl) => {
    setSelectedBackground((prev) => (prev === backgroundUrl ? null : backgroundUrl));
  };

  const openInCanva = () => {
    setShowModal(true);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - imageOffset.x, y: e.clientY - imageOffset.y });
  };

  const applyFilter = async (filter) => {
    try {
        const formData = new FormData();
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        formData.append('file', blob, 'image.png');
        formData.append('filter_name', filter);

        const res = await fetch('http://localhost:8000/apply-filter/', {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();
        if (res.ok) {
            setFilteredImageUrl(`http://localhost:8000/download/?file_path=${encodeURIComponent(result.filtered_file_path)}`);
            setSelectedFilter(filter);
        } else {
            console.error('Error applying filter:', result.error);
        }
    } catch (error) {
        console.error('Error applying filter:', error);
    }
  };

  return (
    <div className="remove-background-result">
      <nav className="navbar5">
        <div className="container-2-5">
          <div className="logo-artify-5">
            <img className="logo-artify-5" src="logoArtify.png" alt="Logo Artify" onClick={() => navigate("/")}/>
          </div>
          <div className="remover-fondo5">
            <span className="span-5" onClick={() => navigate("/remove-background")}>Remover fondo</span>
          </div>
          <div className="cambiar-formato5">
            <span className="span-5" onClick={() => navigate("/change-format")}>Cambiar formato</span>
          </div>
          <div className="comprimir5">
            <span className="span-5" onClick={() => navigate("/compress")}>Comprimir</span>
          </div>
          <div className="todas-las-herramientas5">
            <span className="span-5" onClick={() => navigate("/tools")}>Todas las herramientas</span>
          </div>
          <img className="polygon-5" src="polygon_11_x2m.png" alt="Polygon" />
        </div>
        <img className="ellipse-5" src="ellipse_11_x2.png" alt="Ellipse" />
      </nav>
      <div className="container-6-5">
        <div className="rectangle-9-5" style={{ position: 'relative' }}>
          {selectedBackground && (
            <img
              src={selectedBackground}
              alt="Background"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
            />
          )}
          {cropMode ? (
            <Cropper
              src={`http://localhost:8000/download/?file_path=${encodeURIComponent(imageUrl)}`}
              style={{ height: 400, width: '100%', position: 'relative', zIndex: 1 }}
              initialAspectRatio={1}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
            />
          ) : (
            <img
              className="imagenR"
              src={filteredImageUrl || `http://localhost:8000/download/?file_path=${encodeURIComponent(imageUrl)}`}
              alt="Processed Image"
              style={{ transform: `scale(${zoom}) translate(${imageOffset.x / zoom}px, ${imageOffset.y / zoom}px)` }}
              onMouseDown={handleMouseDown}
              draggable="false"
            />
          )}
        </div>
        <div className="menu">
          <div className="container-3-5">
            <div className="containermasm">
              <img className="mas" src="menos.png" alt="Zoom Out"/>
              <ZoomSlider onZoomChange={handleZoomChange} />
              <img className="menos" src="RecorteIcono2.png" alt="Zoom In"/>
            </div>
            <div className="containerwao" onClick={() => setCropMode((prev) => !prev)}>
              <img className="recorte-icono-1" src="RecorteIcono1.png" alt="Crop Icon"/>
              <span className="recortar">Recortar</span>
            </div>
            {cropMode && (
              <div className="containerwao" onClick={handleCrop}>
                <span className="recortar2">Aplicar recorte y descargar</span>
              </div>
            )}
            <div className="container-4-5">
              <img className="recorte-icono-2" src="RecorteIcono2.png" alt="Add Background Icon"/>
              <span className="aadir-fondo">Añadir fondo</span>
            </div>
            <div className="container-5-5" onClick={() => setShowFilters((prev) => !prev)}>
              <img className="recorte-icono-4" src="RecorteIcono4.png" alt="Add Filter Icon"/>
              <span className="aadir-filtro">Añadir filtro</span>
              {showFilters && (
                <div className="filter-options">
                  {["BLUR", "CONTOUR", "DETAIL", "EDGE_ENHANCE", "SHARPEN", "SMOOTH", "BRIGHTNESS", "CONTRAST"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => applyFilter(filter)}
                      className={selectedFilter === filter ? 'selected' : ''}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="container-2-5-5" onClick={openInCanva}>
              <img className="recorte-icono-3" src="RecorteIcono3.png" alt="Open in Canva Icon"/>
              <span className="abrir-en-canva">Abrir en Canva</span>
            </div>
            <div className="container-1-5" onClick={() => downloadFile(filteredImageUrl || imageUrl, selectedBackground)}>
              <span className="descargar-5">Descargar</span>
            </div>
            
          </div>
        </div>
      </div>
      <div className="imagenesop">
        {['Image1.png', 'Image2.jpg', 'Image3.png', 'Image4.png'].map((img, index) => (
          <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
            <img
              className={`image-${index + 1}`}
              src={img}
              alt={`Example Image ${index + 1}`}
              onClick={() => toggleBackground(img)}
              style={{ cursor: 'pointer', display: 'block' }}
            />
            {selectedBackground === img && (
              <div className="selected-overlay">
                <img src="Delete.png" alt="Delete Icon" />
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2 className="h2-1">Instrucciones para abrir en Canva</h2>
            <ol className="ol-1">
              <li className="li-D">Haz clic en "Descargar" para descargar la imagen.</li>
              <li className="li-C">Ve a <a href="https://www.canva.com" target="_blank" rel="noopener noreferrer">Canva</a>.</li>
              <li className="li-S">Sube la imagen descargada a tu diseño en Canva.</li>
              <div className="container-1-5-1" onClick={() => downloadFile(filteredImageUrl || imageUrl, selectedBackground)}>
                <span className="descargar-5-1">Descargar imagen</span>
              </div>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveResult;
