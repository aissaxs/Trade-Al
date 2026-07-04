import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Header from './Header';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showBottomNav?: boolean;
  showMenu?: boolean;
  onMenuPress?: () => void;
}

export default function AppLayout({
  children,
  title,
  showHeader = true,
  showBottomNav = true,
  showMenu = true,
  onMenuPress,
}: AppLayoutProps) {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {showHeader && (
        <Header
          title={title}
          showMenu={showMenu}
          onMenuPress={() => setSidebarOpen(true)}
        />
      )}

      <View style={styles.content}>
        {children}
      </View>

      {showBottomNav && (
        <BottomNav
          activeTab="home"
          onTabChange={(tab) => console.log('Tab:', tab)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(screen) => console.log('Navigate:', screen)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
