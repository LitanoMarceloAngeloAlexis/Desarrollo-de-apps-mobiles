import React, { useState, useEffect } from "react";

import { View, Text, TextInput, Button, FlatList } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const data = await AsyncStorage.getItem("tasks");
      if (data) setTasks(JSON.parse(data));
    };
    cargar();
  }, []);


  useEffect(() => {
    AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { id: Date.now().toString(), text: task }]);
    setTask("");
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter a task"
        value={task}
        onChangeText={setTask}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Button title="Add" onPress={addTask} />

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
        <Text style={{padding: 10, backgroundColor: "#eee", marginVertical: 5 }}>
          { item.text}
        </Text>
      )}
      keyExtractor = {(item) => item.id}
      />
      </View >
  )
}