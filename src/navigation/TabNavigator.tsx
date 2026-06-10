import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { Dumbbell, Users, Home, MessageCircle, User } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { darkColors, type ThemeColors } from '../theme/colors';
import RepsScreen from '../screens/tabs/RepsScreen';
import CoachScreen from '../screens/tabs/CoachScreen';
import HomeScreen from '../screens/tabs/HomeScreen';
import ChatScreen from '../screens/tabs/ChatScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';

const Tab = createBottomTabNavigator();

type TabDef = {
  name: 'Reps' | 'Coach' | 'Home' | 'Chat' | 'Profile';
  component: React.ComponentType<any>;
  icon: typeof Home;
  center: boolean;
};

const TABS: TabDef[] = [
  { name: 'Reps', component: RepsScreen, icon: Dumbbell, center: false },
  { name: 'Coach', component: CoachScreen, icon: Users, center: false },
  { name: 'Home', component: HomeScreen, icon: Home, center: true },
  { name: 'Chat', component: ChatScreen, icon: MessageCircle, center: false },
  { name: 'Profile', component: ProfileScreen, icon: User, center: false },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.row}>
        {state.routes.map((route, idx) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          const Icon = tab.icon;
          const isActive = state.index === idx;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isActive && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (tab.center) {
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityLabel={tab.name}
                accessibilityState={isActive ? { selected: true } : {}}
                onPress={onPress}
                activeOpacity={0.85}
                style={styles.centerWrap}
              >
                <View
                  style={[
                    styles.centerCircle,
                    isActive ? styles.centerCircleActive : styles.centerCircleInactive,
                  ]}
                >
                  <Icon
                    size={26}
                    color={isActive ? colors.navBg : colors.navFg}
                    strokeWidth={2.2}
                  />
                </View>
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={tab.name}
              accessibilityState={isActive ? { selected: true } : {}}
              onPress={onPress}
              activeOpacity={0.85}
              style={styles.item}
            >
              <Icon
                size={22}
                color={isActive ? colors.gold : darkColors.fgMuted}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TABS.map((t) => (
        <Tab.Screen key={t.name} name={t.name} component={t.component} />
      ))}
    </Tab.Navigator>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  bar: {
    backgroundColor: colors.navBg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: darkColors.border,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    marginTop: -32,
  },
  centerCircle: {
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  centerCircleActive: {
    backgroundColor: colors.gold,
  },
  centerCircleInactive: {
    backgroundColor: darkColors.elevated,
    borderWidth: 1,
    borderColor: darkColors.borderStrong,
  },
  label: {
    color: colors.navFg,
    fontSize: 10,
    letterSpacing: 0.3,
    fontWeight: '400',
  },
  labelActive: {
    fontWeight: '700',
  },
});
