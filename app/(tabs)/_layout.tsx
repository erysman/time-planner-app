import { Tabs } from "expo-router";
import { TabBar } from "../../src/core/navigation/TabBar";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { DailyPlannerContextProvider } from "../../src/features/dailyPlanner/logic/UseDailyPlannerContext";
import { DatePickerTabHeader } from "../../src/core/navigation/Header";

export default function TabLayout() {
  return (
    <DailyPlannerContextProvider>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        backBehavior={"none"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="projects"
          options={{
            title: "",
            tabBarLabel: "Projects List",
            tabBarIcon: (props) => {
              return <MaterialIcons name={"list-alt"} {...props} />;
            },
          }}
        />

        <Tabs.Screen
          name="dailyPlanner"
          options={{
            title: "",
            tabBarLabel: "Daily Plan",
            // headerShown: false,
            // header: (props) => <DatePickerTabHeader {...props}/>, 
            tabBarIcon: (props) => {
              return <MaterialIcons name={"today"} {...props} />;
            },
          }}
        />
        <Tabs.Screen
          name="weeklyPlanner"
          options={{
            title: "",
            tabBarLabel: "Weekly Plan",
            tabBarIcon: (props) => {
              return <MaterialCommunityIcons name="calendar-week" {...props} />;
            },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "",
            tabBarLabel: "Settings",
            tabBarIcon: (props) => {
              return <MaterialIcons name="settings" {...props} />;
            },
          }}
        />
      </Tabs>
    </DailyPlannerContextProvider>
  );
}
