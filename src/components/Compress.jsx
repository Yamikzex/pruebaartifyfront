import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompressComponent = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

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
    navigate("/remove-background");
  };

  const handleStart = () => {
    navigate("/");
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    compressImage(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    compressImage(file);
  };

  const compressImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", 20); // Ajustar la calidad de compresión aquí

    try {
      const response = await axios.post("https://pruebaartify-backend-prueba.onrender.com/compress-image/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { compressed_file_path } = response.data;
      navigate("/compress-result", { state: { compressedFilePath: compressed_file_path } });
    } catch (error) {
      console.error("Error al comprimir la imagen", error);
      if (error.response && error.response.data) {
        console.error("Detalle del error:", error.response.data.error);
      }
    }
  };

  return (
    <div className="compress">
      <nav className="navbar4">
        <div className="container-2-4">
          <div className="logo-artify-4">
            <img
              className="logo-artify-4"
              src="logoArtify.png"
              alt="Logo Artify"
              onClick={handleStart}
            />
          </div>
          <div className="remover-fondo3">
            <span
              className="span-3"
              onClick={handleRemove}
            >
              Remover fondo
            </span>
          </div>
          <div className="cambiar-formato3">
            <span
              className="span-3"
              onClick={handleChange}
            >
              Cambiar formato
            </span>
          </div>
          <div className="comprimir3">
            <span
              className="span-3"
              onClick={handleCompress}
            >
              Comprimir
            </span>
          </div>
          <div className="todas-las-herramientas3">
            <span className="span-3" onClick={handleTools}>
              Todas las herramientas
            </span>
          </div>
          <img className="polygon-3" src="polygon_11_x2m.png" />
        </div>
        <img className="ellipse-3" src="ellipse_11_x2.png" />
      </nav>
      <div
        className={`container-3-3 ${isDragOver ? "drag-over" : ""}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="comprimir-peso-de-una-imagen">
          Comprimir el peso de
          <br /> una imagen
        </div>
        <div className="comprime-tu-imagen">
          Comprime tu imagen para que sea mucho
          <br /> más liviana
        </div>
        <div className="container-1-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="seleccionar-archivo2">
            Seleccionar archivo
          </label>
        </div>
        <span className="oarrastra-ysuelta-aqui2">
          o arrastra y suelta aquí
        </span>
      </div>
    </div>
  );
};

export default CompressComponent;
