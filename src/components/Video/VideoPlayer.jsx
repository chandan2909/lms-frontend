import YouTube from 'react-youtube';



export default function VideoPlayer({ youtubeId, onEnd, onStateChange, onReady }) {
  const extractId = (urlOrId) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[7].length === 11) ? match[7] : urlOrId;
  };

  const videoId = extractId(youtubeId);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      controls: 1,
    },
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
      <YouTube 
        videoId={videoId} 
        opts={opts} 
        onEnd={onEnd}
        onReady={onReady}
        onStateChange={(e) => onStateChange(e.data)}
        onError={(e) => console.error("YouTube Player Error", e.data)}
        className="absolute top-0 left-0 w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}
