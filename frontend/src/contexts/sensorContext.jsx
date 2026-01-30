import { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
  const [sensors, setSensors] = useState({
    heartRate: 90,
    bloodPressure: "",
    oxygenSaturation: 0,
    bodyTemperature: 0,
    stressLevel: 0,
    hydration: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sensorRef = ref(db, "/");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        setSensors(snapshot.val());
        console.log("Sensor data updated:", snapshot.val());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SensorContext.Provider value={{ sensors, loading }}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensors = () => useContext(SensorContext);