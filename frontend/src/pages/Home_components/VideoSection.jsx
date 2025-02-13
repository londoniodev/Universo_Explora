import React from 'react';

const VideoSection = () => {
  // Reemplaza este enlace con el enlace compartido de tu video en Google Drive
  const videoUrl = "https://drive.google.com/file/d/1297HN_X2SpuVpMhE2A1sbuYTl7BNAn4c/preview";

  return (
    <div className="video-section">
      <h2>Reproducción de Video</h2>
      <div className="video-container">
        <iframe
          src={videoUrl}
          width="100%"
          height="400"
          allow="autoplay"
          title="Video de Google Drive"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoSection;