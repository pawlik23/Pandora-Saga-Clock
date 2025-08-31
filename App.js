
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [time, setTime] = useState('');
  const [toDay, setToDay] = useState('');
  const [toNight, setToNight] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const realNow = new Date();
      const gameMinutesTotal = (realNow.getTime() / (7.5 * 1000 / 60)) % (24 * 60);
      const gameHour = Math.floor(gameMinutesTotal / 60);
      const gameMinute = Math.floor(gameMinutesTotal % 60);
      const paddedMinute = String(gameMinute).padStart(2, '0');
      setTime(`${gameHour}:${paddedMinute}`);

      // noc 11:00 - 21:00 w grze
      let nightStart = 11 * 60;
      let nightEnd = 21 * 60;

      if (gameMinutesTotal < nightStart) {
        setToNight(`${Math.floor((nightStart - gameMinutesTotal)/60)}h ${Math.floor((nightStart - gameMinutesTotal)%60)}m`);
      } else {
        setToNight(`0h 0m`);
      }

      if (gameMinutesTotal < nightEnd) {
        setToDay(`${Math.floor((nightEnd - gameMinutesTotal)/60)}h ${Math.floor((nightEnd - gameMinutesTotal)%60)}m`);
      } else {
        setToDay(`0h 0m`);
      }

    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MMO Clock</Text>
      <Text style={styles.text}>Godzina w grze: {time}</Text>
      <Text style={styles.text}>Do nocy: {toNight}</Text>
      <Text style={styles.text}>Do dnia: {toDay}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#222' },
  header: { fontSize:28, marginBottom:20, color:'#fff' },
  text: { fontSize:20, marginBottom:10, color:'#fff' }
});
    