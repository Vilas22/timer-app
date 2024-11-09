import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useTimer } from '../hooks/UserTimer';
import { ProgressCircle } from 'react-native-svg-charts';

function Timer({ initialTime, onEnd, onRemove ,timerName}) {
  const { time, isRunning, progress, start, pause, reset, stopSound, formatTime } = useTimer(initialTime);
  const [hasAlertShown, setHasAlertShown] = useState(false);

  useEffect(() => {
    if (time === 0 && !hasAlertShown) {
      Alert.alert(
        "Timer Ended",
        `Timer with ${initialTime} seconds has ended.`,
        [
          {
            text: "OK",
            onPress: () => {
              stopSound();
              if (onEnd) onEnd();
              setHasAlertShown(true);
            },
          },
        ]
      );
    }
  }, [time, onEnd, initialTime, stopSound, hasAlertShown]);

  const getColor = () => {
    if (progress > 50) return '#4CAF50';
    if (progress > 25) return '#FFC107';
    return '#F44336';
  };

  const handleReset = () => {
    reset();
    setHasAlertShown(false);
  };

  return (
    <View style={styles.timerContainer}>
     
      <TouchableOpacity style={styles.crossContainer} onPress={onRemove}>
        <Text style={styles.crossText}>×</Text>
      </TouchableOpacity>

      <Text style={styles.timerName}>{timerName}</Text>

      {/* Timer Display */}
      <ProgressCircle
        style={styles.progressCircle}
        progress={progress / 100}
        progressColor={getColor()}
        strokeWidth={8}
      />
      <Text style={styles.timeText}>{formatTime()}</Text>
      
    
      <View style={styles.buttonRow}>
        <Button title={isRunning ? "Pause" : "Start"} onPress={isRunning ? pause : start} />
        <Button title="Reset" onPress={handleReset} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  crossContainer: {
    position: 'absolute',
    top: 0,
    right: 10,
    padding: 5,
  },
  crossText: {
    fontSize: 44,
    color: '#F44336',
    fontWeight: 'bold',
  },
  progressCircle: {
    height: 100,
    width: 100,
    marginBottom: 15,
  },
  timeText: {
    fontSize: 24,
    color: '#333',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    gap:18,
    marginTop: 10,
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
});

export default Timer;
