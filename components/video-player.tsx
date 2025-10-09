import { IMultimedia } from "@/lib/content-models";

type VideoPlayerProps = {
  video: IMultimedia;
  isPlaying?: any;
};

export const VideoPlayer = ({ video }: VideoPlayerProps) => {
  return (
    <>
      {/* <p className="text-lg font-semibold text-center">{video?.title}</p> */}
      <iframe
        width="100%"
        height="200"
        src={`https://www.youtube.com/embed/${video.videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen></iframe>
    </>
  );
};
