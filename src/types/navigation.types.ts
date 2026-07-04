import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTP: { email: string };
};

export type MainTabParamList = {
  Home: undefined;
  AIChat: undefined;
};

export type MenuDrawerParamList = {
  Learn: undefined;
  Capital: undefined;
  Market: undefined;
  Signals: undefined;
  News: undefined;
  Favorites: undefined;
  Notifications: undefined;
  Profile: undefined;
  Settings: undefined;
  Plus: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Menu: undefined;
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type MenuNavigationProp = DrawerNavigationProp<MenuDrawerParamList>;
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
