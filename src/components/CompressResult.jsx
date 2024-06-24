import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CompressResult = () => {
  const location = useLocation();
  const { compressedFilePath } = location.state || {};
  const [imageSize, setImageSize] = useState(null);
  const navigate = useNavigate(); // Asegúrate de que useNavigate esté importado correctamente

  const handleRemove = () => {
    navigate("/remove-background");
  };

  const handleChange = () => {
    navigate("/change-format");
  };

  const handleCompress = () => {
    navigate("/compress");
  };

  const handleTools = () => {
    navigate("/tools");
  };

  const handleStart = () => {
    navigate("/");
  };

  useEffect(() => {
    // Función para obtener el tamaño de la imagen
    const fetchImageSize = async () => {
      if (compressedFilePath) {
        try {
          const response = await fetch(`http://localhost:8000/${compressedFilePath}`);
          const blob = await response.blob();
          setImageSize((blob.size / 1024).toFixed(2)); // Convertir a KB y establecer el tamaño
        } catch (error) {
          console.error("Error al obtener el tamaño de la imagen comprimida:", error);
        }
      }
    };

    fetchImageSize();
  }, [compressedFilePath]);

  const handleDownload = async () => {
    if (compressedFilePath) {
      try {
        const response = await fetch(`https://pruebaartify-backend-prueba.onrender.com/docs#/default/download_file_download__get?file_path=${encodeURIComponent(compressedFilePath)}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', compressedFilePath.split('/').pop());
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
  };
  

  return (
    <div className="compress-result">
      <nav className="navbar7">
        <div className="container-2-7">
          <div className="logo-artify-7">
            <img
              className="logo-artify-7"
              src="logoArtify.png"
              alt="Logo Artify" onClick={() => navigate("/")}
            />
          </div>
          <div className="remover-fondo7" onClick={handleRemove}>
            <span className="span-7">Remover fondo</span>
          </div>
          <div className="cambiar-formato7" onClick={handleChange}>
            <span className="span-7">Cambiar formato</span>
          </div>
          <div className="comprimir7" onClick={handleCompress}>
            <span className="span-7">Comprimir</span>
          </div>
          <div className="todas-las-herramientas7" onClick={handleTools}>
            <span className="span-7">Todas las herramientas</span>
          </div>
          <img className="polygon-7" src="polygon_11_x2m.png" alt="Polygon" />
        </div>
        <img className="ellipse-7" src="ellipse_11_x2.png" alt="Ellipse" />
      </nav>
      <div className="fin">
        <div className="la-imagen-se-acomprimido-con-exito">
          ¡La imagen se ha comprimido<br/> con éxito!
        </div>
        <div className="container-Descargar1" onClick={handleDownload}>
          <span className="Descargar-7">Descargar</span>
        </div>
        {imageSize && <span className="kb">{imageSize} KB</span>}
      </div>
    </div>
  );
};

export default CompressResult;
