import { useActiveMusicId, useMusic } from "@/stores/useNestStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect, useRef } from "react";

export default function BackgroundMusicPlayer() {
  const activeMusicId = useActiveMusicId();
  const music = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeMusic = music.find((m) => m.id === activeMusicId);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.5;
    }

    const audio = audioRef.current!;

    if (activeMusic) {
      const audioUrl = convertFileSrc(activeMusic.filePath);
      audio.src = audioUrl;
      audio
        .play()
        .then(() => console.log("Audio playing successfully"))
        .catch((error) => console.error("Failed to play music:", error));
    } else {
      audio.pause();
      audio.src = "";
    }

    return () => {
      audio.pause();
    };
  }, [activeMusic]);

  return null;
}
