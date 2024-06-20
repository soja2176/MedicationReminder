import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import MedicationForm from "../../components/MedicationForm";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [medications, setMedications] = useState<
    {
      id: number;
      name: string;
      type: string;
      frequency: number;
      unit: string;
      patients: string[];
    }[]
  >([]);

  useEffect(() => {
    const loadMedications = async () => {
      const storedMedications = await AsyncStorage.getItem("medications");
      if (storedMedications) {
        setMedications(JSON.parse(storedMedications));
      }
    };

    loadMedications();
  }, []);

  const scheduleNotification = async (
    name: string,
    frequency: number,
    unit: string,
    patients: string[]
  ) => {
    const seconds = unit === "hours" ? frequency * 3600 : frequency * 60;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medicación",
        body: `Es hora de tomar ${name}. Pacientes: ${patients.join(", ")}`,
      },
      trigger: {
        seconds,
        repeats: true,
      },
    });
  };

  const addMedication = async (
    name: string,
    type: string,
    frequency: number,
    unit: string,
    patients: string[]
  ) => {
    const newMedication = {
      id: Date.now(),
      name,
      type,
      frequency,
      unit,
      patients,
    };
    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    await AsyncStorage.setItem(
      "medications",
      JSON.stringify(updatedMedications)
    );
    scheduleNotification(name, frequency, unit, patients);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recordatorio de Medicación</Text>
      <MedicationForm onAddMedication={addMedication} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
