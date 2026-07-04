import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MenuDrawerParamList } from '../types/navigation.types';
import { useTheme } from '../context/ThemeContext';

import Sidebar from '../components/layout/Sidebar';

// Menu Screens
import LearnScreen from '../screens/menu/learn/LearnScreen';
import CapitalScreen from '../screens/menu/capital/CapitalScreen';
import MarketScreen from '../screens/menu/market/MarketScreen';
import SignalsScreen from '../screens/menu/signals/SignalsScreen';
import NewsScreen from '../screens/menu/news/NewsScreen';
import FavoritesScreen from '../screens/menu/favorites/FavoritesScreen';
import NotificationsScreen from '../screens/menu/notifications/NotificationsScreen';
import ProfileScreen from '../screens/menu/profile/ProfileScreen';
import SettingsScreen from '../screens/menu/settings/SettingsScreen';
import PlusScreen from '../screens/plus/PlusScreen';

const Drawer = createDrawerNavigator<MenuDrawerParamList>();

export default function MenuNavigator() {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.colors.background,
          width: '85%',
        },
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.7)',
        swipeEnabled: true,
        swipeEdgeWidth: 100,
      }}
    >
      <Drawer.Screen name="Learn" component={LearnScreen} />
      <Drawer.Screen name="Capital" component={CapitalScreen} />
      <Drawer.Screen name="Market" component={MarketScreen} />
      <Drawer.Screen name="Signals" component={SignalsScreen} />
      <Drawer.Screen name="News" component={NewsScreen} />
      <Drawer.Screen name="Favorites" component={FavoritesScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Plus" component={PlusScreen} />
    </Drawer.Navigator>
  );
}
