# 1step-MEOai
1STEP by MEOAI — A next-generation AI automation and productivity engine built with Expo Router. Instant actions, intelligent workflows, and real-time assistance designed to simplify life and business.
const fs = require("fs");
const path = require("path");

function write(file, content) {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, content.trimStart(), "utf8");
}

/* ---------------- ROOT FILES ---------------- */

write("package.json", `
{
  "name": "1step-meoai",
  "version": "1.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.17",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.3",
    "@react-native-async-storage/async-storage": "1.23.1"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  }
}
`);

write("app.json", `
{
  "expo": {
    "name": "1STEP - MEOai",
    "slug": "1step-meoai",
    "plugins": ["expo-router"],
    "jsEngine": "hermes"
  }
}
`);

write("babel.config.js", `
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["expo-router/babel"]
  };
};
`);

write("tsconfig.json", `
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
`);

/* ---------------- LIB ---------------- */

write("lib/ai.ts", `
export function parseCommand(input: string) {
  const t = input.toLowerCase().trim();

  if (t.startsWith("add task")) {
    return { type: "CREATE_TASK", title: input.replace("add task", "").trim() };
  }
  if (t.startsWith("done")) {
    return { type: "DONE", id: t.split(" ")[1] };
  }
  if (t.startsWith("delete")) {
    return { type: "DELETE", id: t.split(" ")[1] };
  }
  if (t.startsWith("note")) {
    return { type: "NOTE", text: input.replace("note", "").trim() };
  }

  return { type: "UNKNOWN" };
}
`);

write("lib/storage.ts", `
import AsyncStorage from "@react-native-async-storage/async-storage";

export const save = async (k: string, v: any) =>
  AsyncStorage.setItem(k, JSON.stringify(v));

export const load = async (k: string, d: any) => {
  const r = await AsyncStorage.getItem(k);
  return r ? JSON.parse(r) : d;
};
`);

/* ---------------- COMPONENTS ---------------- */

write("components/CommandInput.tsx", `
import { View, TextInput, Pressable, Text } from "react-native";
import { useState } from "react";

export default function CommandInput({ onRun }) {
  const [v, setV] = useState("");
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <TextInput
        value={v}
        onChangeText={setV}
        placeholder="Type command..."
        style={{ flex: 1, borderWidth: 1, padding: 12, color: "white" }}
        placeholderTextColor="#777"
      />
      <Pressable
        onPress={() => {
          onRun(v);
          setV("");
        }}
        style={{ padding: 12, backgroundColor: "#222" }}
      >
        <Text style={{ color: "white" }}>Run</Text>
      </Pressable>
    </View>
  );
}
`);

write("components/TaskCard.tsx", `
import { View, Text, Pressable } from "react-native";

export default function TaskCard({ task, onDone, onDelete }) {
  return (
    <View style={{ padding: 12, borderWidth: 1, marginBottom: 8 }}>
      <Text style={{ color: "white" }}>{task.title}</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable onPress={() => onDone(task.id)}>
          <Text style={{ color: "green" }}>Done</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(task.id)}>
          <Text style={{ color: "red" }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}
`);

/* ---------------- APP ---------------- */

write("app/_layout.tsx", `
import { Stack } from "expo-router";

export default function Layout() {
  return <Stack />;
}
`);

write("app/index.tsx", `
import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, color: "white" }}>1STEP – MEOai</Text>
      <Link href="/actions">
        <Pressable><Text style={{ color: "cyan" }}>Actions</Text></Pressable>
      </Link>
      <Link href="/tasks">
        <Pressable><Text style={{ color: "cyan" }}>Tasks</Text></Pressable>
      </Link>
    </View>
  );
}
`);

write("app/actions.tsx", `
import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import CommandInput from "../components/CommandInput";
import TaskCard from "../components/TaskCard";
import { parseCommand } from "../lib/ai";
import { load, save } from "../lib/storage";

export default function Actions() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    load("tasks", []).then(setTasks);
  }, []);

  useEffect(() => {
    save("tasks", tasks);
  }, [tasks]);

  function run(cmd) {
    const a = parseCommand(cmd);
    if (a.type === "CREATE_TASK") {
      setTasks([{ id: Date.now().toString(), title: a.title }, ...tasks]);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <CommandInput onRun={run} />
      {tasks.map(t => (
        <TaskCard
          key={t.id}
          task={t}
          onDone={() => {}}
          onDelete={() => {}}
        />
      ))}
    </View>
  );
}
`);

write("app/tasks.tsx", `
import { View, Text } from "react-native";

export default function Tasks() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ color: "white" }}>Tasks Screen</Text>
    </View>
  );
}
`);

console.log("✅ 1STEP – MEOai generated successfully");