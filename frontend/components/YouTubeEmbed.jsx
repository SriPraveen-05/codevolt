import React from "react";


const YouTubeEmbed = ({ videoId }) => {
  if (!videoId) {
    return <p className="text-red-500">Invalid YouTube Video ID</p>; // Debugging message
  }

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
      <iframe
        width="100%"
        height="315" // ✅ Set fixed height for iframe
        src={`https://www.youtube.com/embed/${"9RMoWlhb3X4"}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
