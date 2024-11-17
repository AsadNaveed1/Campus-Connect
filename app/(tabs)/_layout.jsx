import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const { colors } = useTheme();

  const renderTabBarButton = (props) => (
    <Pressable {...props} android_ripple={null}>
      {props.children}
    </Pressable>
  );

  const renderTabBarIcon = (name, focused, color) => (
    <Ionicons name={focused ? name : `${name}-outline`} size={24} color={color} />
  );

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarPosition: 'bottom',
        animation: 'shift',
        tabBarActiveTintColor: colors.primary,
        tabBarShowLabel: false,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => renderTabBarIcon('home', focused, color),
          tabBarButton: renderTabBarButton,
        }}
      />
      <Tabs.Screen
        name="societies"
        options={{
          title: 'Societies',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => renderTabBarIcon('people', focused, color),
          tabBarButton: renderTabBarButton,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => renderTabBarIcon('calendar-clear', focused, color),
          tabBarButton: renderTabBarButton,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => renderTabBarIcon('person-circle', focused, color),
          tabBarButton: renderTabBarButton,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 60,
    bottom: 24,
    width: '90%',
    marginHorizontal: '5%',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    elevation: 10,
  },
  tabBarIcon: {
    marginTop: 10,
  },
});