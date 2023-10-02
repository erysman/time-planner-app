import { Tabs } from "expo-router";
import { TabBar } from "../../core/navigation/TabBar";
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
          tabBarLabel: 'Daily Planner',
          tabBarIcon: (props) => {
            return <MaterialIcons name={"today"} {...props} />
          },
        }}
      />
      <Tabs.Screen
        name="weeklyPlanner"
        options={{
          title: "",
          tabBarLabel: 'Weekly Planner',
          tabBarIcon: (props) => {
            return <MaterialCommunityIcons name="calendar-week" {...props} />
          },
        }}
      />
    </Tabs>
  );
}
