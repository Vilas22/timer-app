import { useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';

export function useTimer(initialTime) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [sound, setSound] = useState(null);
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
        setProgress(((time - 1) / initialTime) * 100);
      }, 1000);
    } else if (time === 0 && !hasAlerted) {
      setIsRunning(false);
      setHasAlerted(true);
      playSound();
    }
    return () => clearInterval(interval);
  }, [isRunning, time, hasAlerted]);

  const playSound = useCallback(async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/mixkit-classic-alarm-995.wav')
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  const stopSound = useCallback(async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  }, [sound]);

  const start = () => {
    setIsRunning(true);
    setHasAlerted(false);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setTime(initialTime);
    setProgress(100);
    setIsRunning(false);
    setHasAlerted(false);
    stopSound();
  };

  const formatTime = () => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return { time, isRunning, progress, start, pause, reset, stopSound, formatTime };
}
