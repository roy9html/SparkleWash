import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover pointer-events-none"
      >
        <source
          src="public/video/zubbies.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
    </div>
  );
};

export default Background;