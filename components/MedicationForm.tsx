import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import medicationsList from "../assets/medications.json";
import { Alert } from "react-native";

interface Props {
  onAddMedication: (
    name: string,
    type: string,
    frequency: number,
    unit: string,
    patients: string[]
  ) => void;
}

const MedicationForm: React.FC<Props> = ({ onAddMedication }) => {
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("pastillas");
  const [frequency, setFrequency] = useState("8");
  const [unit, setUnit] = useState("hours");
  const [patients, setPatients] = useState<string[]>([]);
  const [patientName, setPatientName] = useState("");
  const [filteredMedications, setFilteredMedications] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    searchText: false,
    frequency: false,
    patientName: false,
  });
  const handleAddPatient = () => {
    if (patientName && patients.length < 5) {
      setPatients([...patients, patientName]);
      setPatientName("");
    }
  };

  const handleRemovePatient = (patientToRemove: string) => {
    if (!patientToRemove) {
      Alert.alert("El campo paciente está vacío");
      setErrors((errors) => ({ ...errors, patientName: true }));
      return;
    }
    setPatients(patients.filter((patient) => patient !== patientToRemove));
    setErrors((errors) => ({ ...errors, patientName: false }));
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length >= 3) {
      const filtered = medicationsList.filter((med) =>
        med.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMedications(filtered);
    } else {
      setFilteredMedications([]);
    }
  };

  const handleSelectMedication = (medication: string) => {
    setSearchText(medication);
    setFilteredMedications([]);
  };

  const handleAddMedication = () => {
    if (!searchText || !frequency) {
      setErrors({
        searchText: !searchText,
        frequency: !frequency,
        patientName: false,
      });
      Alert.alert("Por favor, complete los campos requeridos");
    } else {
      onAddMedication(searchText, type, parseFloat(frequency), unit, patients);
      setSearchText("");
      setType("pastillas");
      setFrequency("8");
      setUnit("hours");
      setPatients([]);
      setErrors({
        searchText: false,
        frequency: false,
        patientName: false,
      });
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Nombre de la medicación:</Text>
      <TextInput
        style={[styles.input, errors.searchText && styles.error]}
        value={searchText}
        onChangeText={handleSearch}
      />
      {filteredMedications.length > 0 && (
        <FlatList
          data={filteredMedications}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectMedication(item)}>
              <Text style={styles.suggestion}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      )}
      <Text style={styles.label}>Tipo:</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Pastillas" value="pastillas" />
        <Picker.Item label="Gotas" value="gotas" />
        <Picker.Item label="Inyección" value="inyeccion" />
      </Picker>
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Frecuencia:</Text>
          <TextInput
            style={[styles.input, errors.frequency && styles.error]}
            value={frequency}
            onChangeText={setFrequency}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Unidad:</Text>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            selectedValue={unit}
            onValueChange={(itemValue) => setUnit(itemValue)}
          >
            <Picker.Item label="Minutos" value="minutes" />
            <Picker.Item label="Horas" value="hours" />
          </Picker>
        </View>
      </View>
      <Text style={styles.label}>Nombre del paciente (opcional):</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, errors.patientName && styles.error]}
          value={patientName}
          onChangeText={setPatientName}
        />
        <TouchableOpacity style={styles.iconButton} onPress={handleAddPatient}>
          <FontAwesome name="plus" size={20} color="green" />
        </TouchableOpacity>
      </View>
      {patients.length > 0 && (
        <FlatList
          data={patients}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.patient}>{item}</Text>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleRemovePatient(item)}
              >
                <FontAwesome name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item}
        />
      )}
      <Button title="Agregar Medicación" onPress={handleAddMedication} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: "80%",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  error: {
    borderColor: "red",
  },
  iconButton: {
    padding: 10,
  },
  half: {
    width: "48%",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#333",
  },
  suggestion: {
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  patient: {
    padding: 8,
    backgroundColor: "#e6e6e6",
    marginVertical: 2,
  },
  picker: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    overflow: "hidden",
    minHeight: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  pickerItem: {
    padding: 10,
  },
});

export default MedicationForm;
