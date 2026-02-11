const VideoSection = ({
  title,
  src,
  containerClassName = "",
  videoClassName = "w-full h-full object-cover object-center",
}) => {
  return (
    <div
      className={`overflow-hidden relative rounded-2xl h-full w-full ${containerClassName}`}
    >
      <h4 className="text-white mix-blend-difference absolute whitespace-nowrap top-0 left-2 image-section-header-h4 z-10">
        {title}
      </h4>
      {/* Aspect ratio wrapper prevents CLS */}
      <div className="relative w-full h-full">
        <video
          className={videoClassName}
          playsInline
          autoPlay
          muted
          loop
          src={src}
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
};

export default VideoSection;
