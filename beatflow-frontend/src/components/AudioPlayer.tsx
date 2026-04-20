import { useEffect, useRef } from "react";
import { usePlayerStore } from "../app/playerStore";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrackUrl = usePlayerStore((s) => s.currentTrackUrl);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const volume = usePlayerStore((s) => s.volume);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const pause = usePlayerStore((s) => s.pause);
  const playNext = usePlayerStore((s) => s.playNext);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrackUrl) {
      return;
    }

    const currentSrc = audio.getAttribute("src");
    if (currentSrc !== currentTrackUrl) {
      audio.src = currentTrackUrl;
      audio.load();
    }

    if (isPlaying) {
      void audio.play().catch(() => {
        pause();
      });
    }
  }, [currentTrackUrl, isPlaying, pause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      void audio.play().catch(() => {
        pause();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, pause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (Math.abs(audio.currentTime - currentTime) > 0.5) {
      audio.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const setUiProgress = () => {
      setProgress(
        audio.currentTime,
        Number.isFinite(audio.duration) ? audio.duration : 0,
      );
    }

    const handleLoadedMetadata = () => {
      setUiProgress();
    };

    const handleTimeUpdate = () => {
      setUiProgress();
    };

    const handleEnded = () => {
      void playNext();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [setProgress, playNext]);

  const EMPTY_VTT = "data:text/vtt;charset=utf-8,WEBVTT%0A%0A";

  return (
    <audio ref={audioRef} preload="metadata" style={{ display: "none" }}>
      <track
        kind="captions"
        src={EMPTY_VTT}
        srcLang="en"
        label="Empty captions"
        default
      />
    </audio>
  );
}
