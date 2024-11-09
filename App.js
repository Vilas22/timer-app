import React, { useState } from 'react';
import { View, Button, TextInput, FlatList, Alert, StyleSheet, Dimensions, StatusBar} from 'react-native';
import Timer from './components/Timer';

export default function App() {
  const [timers, setTimers] = useState([]);
  const [inputTime, setInputTime] = useState('');
  const [timerName, setTimerName] = useState('');

  const addTimer = () => {
    if (timers.length >= 5) {
      Alert.alert("Limit reached", "You can only add up to 5 timers.");
      return;
    }
    const initialTime = parseInt(inputTime);
    if (isNaN(initialTime) || initialTime <= 0) {
      Alert.alert("Invalid time", "Please enter a valid countdown time.");
      return;
    }
    setTimers([...timers, { id: Date.now(), initialTime, name: timerName || 'Timer' }]);
    setInputTime('');
    setTimerName('');
  };

  const removeTimer = (id) => {
    setTimers(timers.filter((timer) => timer.id !== id));
  };

  return (
    <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <TextInput
        placeholder="Enter timer name"
        value={timerName}
        onChangeText={setTimerName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter countdown time in seconds"
        value={inputTime}
        onChangeText={setInputTime}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add Timer" onPress={addTimer} />
      </View>
      <FlatList
        data={timers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Timer
            initialTime={item.initialTime}
            timerName={item.name}
            onRemove={() => removeTimer(item.id)}
          />
        )}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');
const isSmallScreen = width < 360;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: isSmallScreen ? 10 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7ff', 
  },
  input: { 
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ffffff',
    padding: 12,
    marginVertical: isSmallScreen ? 10 : 20,
    width: '90%',
    fontSize: isSmallScreen ? 14 : 16,
    textAlign: 'center',
    borderRadius: 8,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    elevation: 4, 
  },
  buttonContainer: {
    width: '40%',
    marginVertical: isSmallScreen ? 10 : 20,
    backgroundColor: '#007acc',
    borderRadius: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  flatListContainer: {
    width: '100%',
    paddingBottom: 50,
    alignItems: 'center',
    paddingTop: 20,
    borderRadius: 12, 
  },
});
