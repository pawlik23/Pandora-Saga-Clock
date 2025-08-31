import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// 1h IG = 7m30s RL → 1 sekunda realna = 8 sekund w grze
const INGAME_SECONDS_PER_REAL_SECOND = 8;
const INGAME_DAY_SECONDS = 24 * 60 * 60;

export default function App() {
  const [time, setTime] = useState(getGameTime());
  const [untilNight, setUntilNight] = useState("");
  const [untilDay, setUntilDay] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const gameSeconds = getGameSeconds();
      setTime(formatGameTime(gameSeconds));

      const { toNight, toDay } = getDayNightCountdown(gameSeconds);
      setUntilNight(toNight);
      setUntilDay(toDay);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MMO Game Clock</Text>
      <Text style={styles.clock}>{time}</Text>
      <Text style={styles.subtitle}>1h IG = 7m30s RL (×8 szybciej)</Text>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.counter}>⏳ Do nocy: {untilNight}</Text>
        <Text style={styles.counter}>🌅 Do dnia: {untilDay}</Text>
      </View>
    </View>
  );
}

// ---- helpers ----
function getGameSeconds() {
  const now = Date.now();
  const deltaRealSec = Math.floor(now / 1000);
  const passedGameSec = deltaRealSec * INGAME_SECONDS_PER_REAL_SECOND;
  return passedGameSec % INGAME_DAY_SECONDS;
}

function formatGameTime(gameSeconds) {
  const hh = Math.floor(gameSeconds / 3600);
  const mm = Math.floor((gameSeconds % 3600) / 60);
  const ss = gameSeconds % 60;
  return [hh, mm, ss].map((n) => String(n).padStart(2, "0")).join(":");
}

function getDayNightCountdown(gameSeconds) {
  const nightStart = 11 * 3600;
  const nightEnd = 21 * 3600;

  let toNight, toDay;

  if (gameSeconds < nightStart) {
    toNight = nightStart - gameSeconds;
    toDay = nightEnd - gameSeconds;
  } else if (gameSeconds >= nightStart && gameSeconds < nightEnd) {
    toNight = (nightStart + 24 * 3600 - gameSeconds) % INGAME_DAY_SECONDS;
    toDay = nightEnd - gameSeconds;
  } else {
    toNight = (nightStart + 24 * 3600 - gameSeconds) % INGAME_DAY_SECONDS;
    toDay = (nightEnd + 24 * 3600 - gameSeconds) % INGAME_DAY_SECONDS;
  }

  return {
    toNight: formatDuration(toNight),
    toDay: formatDuration(toDay),
  };
}

function formatDuration(sec) {
  const hh = Math.floor(sec / 3600);
  const mm = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;
  return [hh, mm, ss].map((n) => String(n).padStart(2, "0")).join(":");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 20,
  },
  clock: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#00e0ff",
    fontFamily: "monospace",
  },
  subtitle: {
    marginTop: 10,
    color: "#aaa",
    fontSize: 14,
  },
  counter: {
    marginTop: 8,
    fontSize: 20,
    color: "#fff",
    fontFamily: "monospace",
  },
});
