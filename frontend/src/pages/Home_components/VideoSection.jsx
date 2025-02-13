import React from 'react';

const VideoSection = () => {
  // Enlace de vista previa de Google Drive
  const videoUrl = "https://drive.google.com/file/d/1nanrW_FdnMM2DYvFZ6ic1W7AZ3aHoWSC/preview";

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