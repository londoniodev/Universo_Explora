import React from 'react';

const VideoSection = () => {
  // Reemplaza este enlace con el enlace directo a tu video en Google Drive
  const videoUrl = "https://drive.google.com/file/d/1297HN_X2SpuVpMhE2A1sbuYTl7BNAn4c/view?usp=drive_link";

  return (
    <div className="video-section">
      <h2>Reproducción de Video</h2>
      <div className="video-container">
        <video width="100%" height="auto" controls>
          <source src={videoUrl} type="video/mp4" />
          Tu navegador no soporta la reproducción de videos.
        </video>
      </div>
    </div>
  );
};

export default VideoSection;