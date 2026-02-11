// styles
import "../../styles/touchScreenComponent.css";
// videos
import video from "/videos/designShowcase (1).mp4";
import video2 from "/videos/scrollTriggerVideo (1).mp4";
import video3 from "/videos/textAnimation (1).mp4";
// react
import { useRef, useState, useEffect } from "react";
// gsap
import gsap from "gsap";
import { Flip } from "gsap/all";
// fallbacks
import designShowcaseFallback from "/images/designShowcaseFallback.png";
import scrollTriggerFallback from "/images/scrollTriggerFallback.png";
import textAnimationFallback from "/images/textAnimationFallback.png";
// helper
import { lockScroll, unlockScroll } from "../../utils/screenLocker";
// config
import videoShowcaseConfig from "../../config/videoShowcase.config";

const VideoShowcase = () => {
  const [isHoveringFirstVideo, setIsHoveringFirstVideo] = useState(false);
  const [isHoveringSecondVideo, setIsHoveringSecondVideo] = useState(false);
  const [isHoveringThirdVideo, setIsHoveringThirdVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);

  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const textRef3 = useRef(null);

  const containerRef = useRef(null);

  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);

  const videoContainerRef1 = useRef(null);
  const videoContainerRef2 = useRef(null);
  const videoContainerRef3 = useRef(null);

  const videoPlaceholderRef1 = useRef(null);
  const videoPlaceholderRef2 = useRef(null);
  const videoPlaceholderRef3 = useRef(null);

  const videoPlayerContainerRef = useRef(null);

  // Initialize videos on mount
  useEffect(() => {
    const videos = [videoRef1, videoRef2, videoRef3];
    videos.forEach((ref) => {
      if (ref.current) {
        ref.current.load();
        ref.current.style.opacity = "1";
        ref.current.style.visibility = "visible";
      }
    });
  }, []);

  const animateIn = (ref) => {
    if (!ref?.current) return;
    const element = ref.current;
    const { animateIn: config } = videoShowcaseConfig.textAnimation;

    gsap.killTweensOf(element);
    gsap.fromTo(
      element,
      { width: 0, opacity: 0 },
      {
        width: config.width,
        opacity: 1,
        ease: config.ease,
        transformOrigin: "right center",
        duration: config.duration,
        overwrite: true,
      },
    );
  };

  const animateOut = (ref) => {
    if (!ref?.current) return;
    const element = ref.current;
    const { animateOut: config } = videoShowcaseConfig.textAnimation;

    gsap.killTweensOf(element);
    gsap.to(element, {
      width: 0,
      opacity: 0,
      ease: config.ease,
      transformOrigin: "right center",
      duration: config.duration,
      overwrite: true,
    });
  };

  useEffect(() => {
    if (isHoveringFirstVideo) animateIn(textRef1);
    else animateOut(textRef1);

    if (isHoveringSecondVideo) animateIn(textRef2);
    else animateOut(textRef2);

    if (isHoveringThirdVideo) animateIn(textRef3);
    else animateOut(textRef3);
  }, [isHoveringFirstVideo, isHoveringSecondVideo, isHoveringThirdVideo]);

  const handleVideoClick = (videoIndex) => {
    if (isPlaying) return;

    const videoContainerRef = [
      videoContainerRef1,
      videoContainerRef2,
      videoContainerRef3,
    ][videoIndex - 1];
    const videoRef = [videoRef1, videoRef2, videoRef3][videoIndex - 1];

    const state = Flip.getState(videoContainerRef.current);

    videoPlayerContainerRef.current
      .querySelector(".playing-video-placement")
      .appendChild(videoContainerRef.current);

    const { flipAnimation, backdrop, controlButtons } = videoShowcaseConfig;

    Flip.from(state, {
      duration: flipAnimation.duration,
      ease: flipAnimation.ease,
      absolute: true,
      simple: true,
      onComplete: () => {
        if (videoRef.current) {
          videoRef.current.play();
          setIsVideoPaused(false);
        }
      },
    });

    gsap.to(".backdrop", {
      opacity: 1,
      duration: backdrop.fadeIn.duration,
      ease: backdrop.fadeIn.ease,
    });

    gsap.to([".exit-btn", ".replay-btn", ".stop-start-btn"], {
      opacity: 1,
      scale: 1,
      duration: controlButtons.fadeIn.duration,
      ease: controlButtons.fadeIn.ease,
      stagger: controlButtons.fadeIn.stagger,
    });

    lockScroll();
    setIsPlaying(true);
    setCurrentPlayingVideo(videoIndex);
  };

  const handleExit = () => {
    if (!isPlaying || currentPlayingVideo === null) return;

    const videoContainerRef = [
      videoContainerRef1,
      videoContainerRef2,
      videoContainerRef3,
    ][currentPlayingVideo - 1];
    const videoRef = [videoRef1, videoRef2, videoRef3][currentPlayingVideo - 1];
    const videoPlaceholderRef = [
      videoPlaceholderRef1,
      videoPlaceholderRef2,
      videoPlaceholderRef3,
    ][currentPlayingVideo - 1];

    const state = Flip.getState(videoContainerRef.current);

    videoPlaceholderRef.current.appendChild(videoContainerRef.current);

    const { flipAnimation, backdrop, controlButtons } = videoShowcaseConfig;

    Flip.from(state, {
      duration: flipAnimation.duration,
      ease: flipAnimation.ease,
      absolute: true,
      simple: true,
      onComplete: () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      },
    });

    gsap.to(".backdrop", {
      opacity: 0,
      duration: backdrop.fadeOut.duration,
      ease: backdrop.fadeOut.ease,
    });

    gsap.to([".exit-btn", ".replay-btn", ".stop-start-btn"], {
      opacity: 0,
      scale: 0,
      duration: controlButtons.fadeOut.duration,
      ease: controlButtons.fadeOut.ease,
    });

    unlockScroll();
    setIsPlaying(false);
    setIsVideoPaused(false);
    setCurrentPlayingVideo(null);
  };

  const handleReplay = () => {
    if (currentPlayingVideo === null) return;
    const videoRef = [videoRef1, videoRef2, videoRef3][currentPlayingVideo - 1];
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoPaused(false);
    }
  };

  const handleStopStart = () => {
    if (currentPlayingVideo === null) return;
    const videoRef = [videoRef1, videoRef2, videoRef3][currentPlayingVideo - 1];
    if (videoRef.current) {
      if (isVideoPaused) {
        videoRef.current.play();
        setIsVideoPaused(false);
      } else {
        videoRef.current.pause();
        setIsVideoPaused(true);
      }
    }
  };

  const handleEnter = (index) => {
    if (index === 1) setIsHoveringFirstVideo(true);
    if (index === 2) setIsHoveringSecondVideo(true);
    if (index === 3) setIsHoveringThirdVideo(true);

    if (index !== 1) setIsHoveringFirstVideo(false);
    if (index !== 2) setIsHoveringSecondVideo(false);
    if (index !== 3) setIsHoveringThirdVideo(false);
  };

  const handleLeave = (index) => {
    if (index === 1) setIsHoveringFirstVideo(false);
    if (index === 2) setIsHoveringSecondVideo(false);
    if (index === 3) setIsHoveringThirdVideo(false);
  };

  useEffect(() => {
    return () => {
      [textRef1, textRef2, textRef3].forEach((r) => {
        if (r?.current) gsap.killTweensOf(r.current);
      });
      unlockScroll();
    };
  }, []);

  return (
    <section ref={containerRef} className="video-showcase-section">
      <div
        onMouseEnter={() => handleEnter(1)}
        onMouseLeave={() => handleLeave(1)}
        className="div1"
      >
        <div ref={videoPlaceholderRef1} className="video-placeholder">
          <div
            ref={videoContainerRef1}
            onClick={() => handleVideoClick(1)}
            className="original-container"
          >
            <video
              poster={designShowcaseFallback}
              ref={videoRef1}
              src={video}
              muted
              preload="auto"
              playsInline
            />
          </div>
        </div>

        <div
          ref={textRef1}
          className="click-to-play-text"
          style={{ width: 0, opacity: 0 }}
        >
          Click to play
        </div>

        <div onClick={() => handleVideoClick(1)} className="play-btn">
          <img src="/svg/play-button-dark.svg" alt="" />
        </div>
      </div>

      <div className="div2 video-description">
        <div>
          <div className="shrink-0">1</div>
          <h3 className="repel-header">Custom Cursor</h3>
        </div>
        <p className="repel-description">
          When the video is not hovered, a custom cursor appears. Clicking exits
          the video.
        </p>
      </div>

      <div
        onMouseEnter={() => handleEnter(2)}
        onMouseLeave={() => handleLeave(2)}
        className="div3"
      >
        <div ref={videoPlaceholderRef2} className="video-placeholder">
          <div
            ref={videoContainerRef2}
            onClick={() => handleVideoClick(2)}
            className="original-container"
          >
            <video
              poster={scrollTriggerFallback}
              ref={videoRef2}
              src={video2}
              muted
              preload="auto"
              playsInline
            />
          </div>
        </div>

        <div
          ref={textRef2}
          className="click-to-play-text"
          style={{ width: 0, opacity: 0 }}
        >
          Click to play
        </div>

        <div onClick={() => handleVideoClick(2)} className="play-btn">
          <img src="/svg/play-button-dark.svg" alt="" />
        </div>
      </div>

      <div className="div4 video-description">
        <div>
          <div className="shrink-0">2</div>
          <h3 className="repel-header">Scroll Triggered Canvas</h3>
        </div>
        <p className="repel-description">
          The section gets pinned on scroll and a square shape fills the screen
          with a smooth animation.
        </p>
      </div>

      <div
        onMouseEnter={() => handleEnter(3)}
        onMouseLeave={() => handleLeave(3)}
        className="div5"
      >
        <div ref={videoPlaceholderRef3} className="video-placeholder">
          <div
            ref={videoContainerRef3}
            onClick={() => handleVideoClick(3)}
            className="original-container"
          >
            <video
              poster={textAnimationFallback}
              ref={videoRef3}
              src={video3}
              muted
              preload="auto"
              playsInline
            />
          </div>
        </div>

        <div
          ref={textRef3}
          className="click-to-play-text"
          style={{ width: 0, opacity: 0 }}
        >
          Click to play
        </div>

        <div onClick={() => handleVideoClick(3)} className="play-btn-light">
          <img src="/svg/play-button-light.svg" alt="" />
        </div>
      </div>

      <div className="div6 video-description">
        <div>
          <div className="shrink-0">3</div>
          <h3 className="repel-header">Unique Hover Animation</h3>
        </div>
        <p className="repel-description">
          Hovering a link shows the path it takes, with the image animating in
          via a clip-path.
        </p>
      </div>

      <div ref={videoPlayerContainerRef} className="video-player-container">
        <div
          onClick={handleExit}
          className="backdrop"
          style={{ pointerEvents: isPlaying ? "auto" : "none" }}
        />
        <div className="playing-video-placement" />
        <button
          onClick={handleExit}
          className="exit-btn"
          style={{ pointerEvents: isPlaying ? "auto" : "none" }}
        >
          <img src="/svg/exit-button.svg" alt="" />
        </button>
        <button
          onClick={handleReplay}
          className="replay-btn"
          style={{ pointerEvents: isPlaying ? "auto" : "none" }}
        >
          <img src="/svg/replay-button.svg" alt="" />
        </button>
        <button
          className="stop-start-btn"
          onClick={handleStopStart}
          style={{ pointerEvents: isPlaying ? "auto" : "none" }}
        >
          {isVideoPaused ? (
            <img src="/svg/play-button.svg" alt="" />
          ) : (
            <img src="/svg/stop-button.svg" alt="" />
          )}
        </button>
      </div>
    </section>
  );
};

export default VideoShowcase;
