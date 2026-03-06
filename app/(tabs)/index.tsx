import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Task {
  id: string;
  title: string;
}

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [name, setName] = useState("Aya Abordo!");
  const [tempName, setTempName] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: task,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const completeTask = (id: string) => {
    const finished = tasks.find((t) => t.id === id);
    if (finished) {
      setTasks(tasks.filter((t) => t.id !== id));
      setCompletedTasks([...completedTasks, finished]);
    }
  };

  const undoTask = (id: string) => {
    const undone = completedTasks.find((t) => t.id === id);
    if (undone) {
      setCompletedTasks(completedTasks.filter((t) => t.id !== id));
      setTasks([...tasks, undone]);
    }
  };

  const deleteTask = (id: string, fromCompleted = false) => {
    if (fromCompleted) {
      setCompletedTasks(completedTasks.filter((t) => t.id !== id));
    } else {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const startEdit = (item: Task) => {
    setEditingId(item.id);
    setEditingText(item.title);
  };

  const saveEdit = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, title: editingText } : t))
    );
    setEditingId(null);
    setEditingText("");
  };

  const saveName = () => {
    if (tempName.trim() !== "") {
      setName(tempName);
      setTempName("");
    }
  };

  const totalTasks = tasks.length + completedTasks.length;
  const progress = completedTasks.length;
  const progressPercent = totalTasks === 0 ? 0 : progress / totalTasks;

  const theme = darkMode ? darkStyles : styles;

  return (
    <View style={theme.container}>
      
      {/* Dark Mode Toggle */}
      <TouchableOpacity
        style={theme.modeButton}
        onPress={() => setDarkMode(!darkMode)}
      >
        <Text style={{ fontSize: 22 }}>{darkMode ? "☀️" : "🌙"}</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={theme.header}>
        <View style={{ flex: 1 }}>

          <Text style={theme.greeting}>Hello, </Text>

          <Text style={theme.name}>{name}</Text>

          <View style={theme.nameEditContainer}>
            <TextInput
              value={tempName}
              onChangeText={setTempName}
              placeholder="Change name..."
              style={theme.nameInput}
            />

            <TouchableOpacity
              style={theme.saveButton}
              onPress={saveName}
            >
              <Text style={theme.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

        </View>

        <Image
          source={{
            uri: "https://i.pinimg.com/736x/ee/7c/54/ee7c548f082e95e7f0d9120526556f13.jpg",
          }}
          style={theme.profile}
        />
      </View>

      {/* Title */}
      <Text style={theme.mainTitle}>To-do List</Text>

      {/* Progress */}
      <Text style={theme.progress}>
        Progress: {progress} / {totalTasks} tasks completed
      </Text>

      <View style={theme.progressContainer}>
        <View
          style={[
            theme.progressFill,
            { width: `${progressPercent * 100}%` },
          ]}
        />
      </View>

      {/* Add Task */}
      <View style={theme.inputContainer}>
        <TextInput
          placeholder="Add a task..."
          placeholderTextColor={darkMode ? "#ccc" : "#666"}
          value={task}
          onChangeText={setTask}
          style={theme.input}
        />

        <TouchableOpacity style={theme.addButton} onPress={addTask}>
          <Text style={theme.addText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Task Counter */}
      <Text style={theme.counter}>
        {tasks.length} {tasks.length === 1 ? "task" : "tasks"} remaining
      </Text>

      {/* My Tasks */}
      <Text style={theme.sectionTitle}>My Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={theme.taskItem}>
            <View style={theme.taskLeft}>
              <TouchableOpacity
                style={theme.checkbox}
                onPress={() => completeTask(item.id)}
              >
                <Text style={theme.checkboxText}>☐</Text>
              </TouchableOpacity>

              {editingId === item.id ? (
                <TextInput
                  style={theme.editInput}
                  value={editingText}
                  onChangeText={setEditingText}
                  onSubmitEditing={() => saveEdit(item.id)}
                />
              ) : (
                <TouchableOpacity onPress={() => startEdit(item)}>
                  <Text style={theme.taskText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={theme.delete}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={theme.completedHeader}
        onPress={() => setShowCompleted(!showCompleted)}
      >
        <Text style={theme.sectionTitle}>
          {showCompleted ? "▼" : "▶"} Completed Tasks
        </Text>
      </TouchableOpacity>

      {showCompleted && (
  <FlatList
    data={completedTasks}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={theme.completedItem}>
        <TouchableOpacity onPress={() => undoTask(item.id)}>
          <Text style={theme.completedText}>☑ {item.title}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteTask(item.id, true)}>
          <Text style={theme.delete}>✕</Text>
        </TouchableOpacity>
      </View>
    )}
  />
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fdf2ff",
  },

  modeButton: {
    alignSelf: "flex-end",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 18,
    color: "#7e22ce",
  },

  name: {
    fontSize: 24,
    color: "#f9a8d4",
    fontWeight: "600",
  },

  mainTitle: {
  fontSize: 28,
  fontWeight: "bold",
  color: "#a855f7",
  textAlign: "center",
  marginTop: 20,
  marginBottom: 10,
},


  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

 nameInput: {
  borderWidth: 1,
  borderColor: "#f9a8d4",
  padding: 4,
  borderRadius: 6,
  width: 200,        
  fontSize: 13,
},

  saveButton: {
  backgroundColor: "#f9a8d4",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  marginLeft: 6,
},

  saveText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 12,
},

  profile: {
    width: 65,
    height: 65,
    borderRadius: 32,
  },

  counter: {
    fontSize: 16,
    color: "#7e22ce",
    marginBottom: 5,
  },

  progress: {
    fontSize: 16,
    color: "#6b21a8",
    textAlign: "center",
  },

  progressContainer: {
    height: 10,
    backgroundColor: "#fbcfe8",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#d8b4fe",
  },

  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fce7f3",
    padding: 12,
    borderRadius: 10,
  },

  addButton: {
    backgroundColor: "#d8b4fe",
    marginLeft: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 10,
  },

  addText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9333ea",
    marginBottom: 10,
  },

  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fbcfe8",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    marginRight: 10,
  },

  checkboxText: {
    fontSize: 18,
  },

  taskText: {
    fontSize: 16,
    color: "#4c1d95",
  },

  editInput: {
    borderBottomWidth: 1,
    minWidth: 150,
  },

  completedHeader: {
    marginTop: 20,
  },

  completedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e9d5ff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  completedText: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "#6b21a8",
  },

  delete: {
  fontSize: 20,
  color: "#a855f7",
  fontWeight: "bold",
},
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },

  modeButton: {
    alignSelf: "flex-end",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 18,
    color: "#e9d5ff",
  },

  name: {
    fontSize: 24,
    color: "#f9a8d4",
    fontWeight: "600",
  },

  mainTitle: {
  fontSize: 28,
  fontWeight: "bold",
  color: "#a855f7",
  textAlign: "center",
  marginTop: 20,
  marginBottom: 10,
},


  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  nameInput: {
  borderWidth: 1,
  borderColor: "#f9a8d4",
  padding: 4,
  borderRadius: 6,
  width: 200,       
  fontSize: 13,
  color: "white",
},

  saveButton: {
  backgroundColor: "#f9a8d4",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  marginLeft: 6,
},

  saveText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 12,
},

  profile: {
    width: 65,
    height: 65,
    borderRadius: 32,
  },

  counter: {
    fontSize: 16,
    color: "#d8b4fe",
    marginBottom: 5,
  },

  progress: {
    fontSize: 16,
    color: "#e9d5ff",
    textAlign: "center",
  },

  progressContainer: {
    height: 10,
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#f9a8d4",
  },

  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 10,
    color: "white",
  },

  addButton: {
    backgroundColor: "#a855f7",
    marginLeft: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 10,
  },

  addText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d8b4fe",
    marginBottom: 10,
  },

  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1f1f1f",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    marginRight: 10,
  },

  checkboxText: {
    fontSize: 18,
    color: "white",
  },

  taskText: {
    fontSize: 16,
    color: "white",
  },

  editInput: {
    borderBottomWidth: 1,
    minWidth: 150,
    color: "white",
    borderColor: "#d8b4fe",
  },

  completedHeader: {
    marginTop: 20,
  },

  completedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  completedText: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "#bbb",
  },

  delete: {
    fontSize: 20,
    color: "#a855f7",
    fontWeight: "bold",
  },
});
