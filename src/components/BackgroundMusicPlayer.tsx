import {
  useActiveMusicId,
  useMusic,
  useNestActions,
  useAudioIsPaused,
} from "@/stores/useNestStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect, useRef } from "react";

export default function BackgroundMusicPlayer() {
  const activeMusicId = useActiveMusicId();
  const music = useMusic();
  const audioIsPaused = useAudioIsPaused();
  const { setAudioCurrentTime, setAudioIsPlaying, setAudioIsPaused } =
    useNestActions();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeMusic = music.find((m) => m.id === activeMusicId);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.5;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setAudioIsPlaying(true);
      setAudioIsPaused(false);
    };

    const handlePause = () => {
      setAudioIsPlaying(false);
    };

    const handleEnded = () => {
      setAudioCurrentTime(0);
      setAudioIsPlaying(false);
      setAudioIsPaused(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    if (activeMusic) {
      const audioUrl = convertFileSrc(activeMusic.filePath);

      if (audio.src !== audioUrl) {
        audio.src = audioUrl;
        audio.currentTime = 0;
        setAudioCurrentTime(0);
      }

      if (audioIsPaused) {
        audio.pause();
      } else {
        audio
          .play()
          .then(() => console.log("Audio playing successfully"))
          .catch((error) => console.error("Failed to play music:", error));
      }
    } else {
      audio.pause();
      audio.src = "";
      setAudioCurrentTime(0);
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [
    activeMusic,
    audioIsPaused,
    setAudioCurrentTime,
    setAudioIsPlaying,
    setAudioIsPaused,
  ]);

  return null;
}
