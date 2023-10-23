import { Tabs } from "expo-router";
import { TabBar } from "../../src/core/navigation/TabBar";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";


export default function TabLayout() {

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      backBehavior={"none"}
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="(tasks)"
        options={{
          title: "",
          tabBarLabel: 'Tasks List',
          tabBarIcon: (props) => {
            return <MaterialIcons name={"list-alt"} {...props} />
          },
        }}
      />
      <Tabs.Screen
        name="dailyPlanner"
        options={{
          title: "",
          tabBarLabel: 'Daily Plan',
          tabBarIcon: (props) => {
            return <MaterialIcons name={"today"} {...props} />
          },
        }}
      />
      <Tabs.Screen
        name="weeklyPlanner"
        options={{
          title: "",
          tabBarLabel: 'Weekly Plan',
          tabBarIcon: (props) => {
            return <MaterialCommunityIcons name="calendar-week" {...props} />
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarLabel: 'Settings',
          tabBarIcon: (props) => {
            return <MaterialIcons name="settings" {...props} />
          },
        }}
      />
    </Tabs>
  );
}
