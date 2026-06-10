import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  LogOut,
  MessageSquare,
  Pencil,
  Shield,
  Sun,
  User as UserIcon,
} from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeColors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

const USER = {
  initial: 'J',
  name: 'Jon Melo',
  jobTitle: 'Senior Engineer',
  company: 'Forte',
  timezone: 'Pacific Time · UTC-8',
};

const STATS = [
  { key: 'reps', label: 'Reps', value: 47 },
  { key: 'sessions', label: 'Sessions', value: 12 },
  { key: 'exercises', label: 'Exercises', value: 28 },
  { key: 'streak', label: 'Day streak', value: 5 },
];

const USAGE = { used: 5, total: 8 };

type RowItem = {
  key: string;
  label: string;
  Icon: typeof UserIcon;
  badge?: string;
  onPress?: () => void;
  destructive?: boolean;
  // Renders on the trailing edge in place of the chevron (e.g. a toggle).
  control?: React.ReactNode;
};

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const personal: RowItem[] = [
    { key: 'info', label: 'Personal info', Icon: UserIcon },
    { key: 'billing', label: 'Plan & billing', Icon: CreditCard, badge: 'Pro' },
  ];

  const preferences: RowItem[] = [
    {
      key: 'lightmode',
      label: 'Light Mode',
      Icon: Sun,
      onPress: toggleTheme,
      control: (
        <Switch
          value={!isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.elevated, true: colors.gold }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={colors.elevated}
        />
      ),
    },
    { key: 'notifications', label: 'Notifications', Icon: Bell },
    { key: 'privacy', label: 'Privacy & security', Icon: Shield },
  ];

  const support: RowItem[] = [
    { key: 'help', label: 'Help Center', Icon: HelpCircle },
    { key: 'feedback', label: 'Send Feedback', Icon: MessageSquare },
    { key: 'signout', label: 'Sign out', Icon: LogOut, onPress: signOut, destructive: true },
  ];

  const usagePct = Math.min(1, USAGE.used / USAGE.total);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.eyebrow}>ACCOUNT</Text>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.userCard}>
          <Pressable style={styles.editBtn}>
            <Pencil size={14} color={colors.gold} strokeWidth={2.4} />
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
          <View style={styles.userHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{USER.initial}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.userName}>{USER.name}</Text>
              <Text style={styles.userJob}>
                {USER.jobTitle} · {USER.company}
              </Text>
              <Text style={styles.userTimezone}>{USER.timezone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.key} style={styles.statPill}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.usageCard}>
          <View style={styles.usageRow}>
            <Text style={styles.usageLabel}>
              {USAGE.used} of {USAGE.total} sessions used
            </Text>
            <Text style={styles.usageRemaining}>
              {USAGE.total - USAGE.used} left
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${usagePct * 100}%` }]} />
          </View>
        </View>

        <Section label="PERSONAL" items={personal} />
        <Section label="PREFERENCES" items={preferences} />
        <Section label="SUPPORT" items={support} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ label, items }: { label: string; items: RowItem[] }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.listCard}>
        {items.map((item, i) => (
          <React.Fragment key={item.key}>
            {i > 0 && <View style={styles.divider} />}
            <Pressable style={styles.row} onPress={item.onPress}>
              <View
                style={[
                  styles.rowIcon,
                  item.destructive && styles.rowIconDestructive,
                ]}
              >
                <item.Icon
                  size={18}
                  color={item.destructive ? colors.goldMuted : colors.gold}
                  strokeWidth={2.2}
                />
              </View>
              <Text
                style={[
                  styles.rowLabel,
                  item.destructive && styles.rowLabelDestructive,
                ]}
              >
                {item.label}
              </Text>
              {item.control ? (
                item.control
              ) : (
                <>
                  {item.badge ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  ) : null}
                  {!item.destructive && (
                    <ChevronRight size={16} color={colors.fgMuted} strokeWidth={2} />
                  )}
                </>
              )}
            </Pressable>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
    gap: 20,
  },

  eyebrow: {
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 1.8,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: { color: colors.fg, fontSize: 28, fontWeight: '700' },

  userCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  editBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  editBtnText: { color: colors.gold, fontSize: 12, fontWeight: '700' },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.bg, fontSize: 26, fontWeight: '700' },
  userName: { color: colors.fg, fontSize: 20, fontWeight: '700' },
  userJob: { color: colors.fgMuted, fontSize: 13, marginTop: 2 },
  userTimezone: { color: colors.fgMuted, fontSize: 12, marginTop: 4 },

  statsRow: { flexDirection: 'row', gap: 10 },
  statPill: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: { color: colors.gold, fontSize: 20, fontWeight: '700' },
  statLabel: {
    color: colors.fgMuted,
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.3,
  },

  usageCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  usageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  usageLabel: { color: colors.fg, fontSize: 14, fontWeight: '600' },
  usageRemaining: { color: colors.fgMuted, fontSize: 12 },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.elevated,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 999,
  },

  section: { gap: 10 },
  sectionLabel: {
    color: colors.fgMuted,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconDestructive: { backgroundColor: 'transparent' },
  rowLabel: { flex: 1, color: colors.fg, fontSize: 15, fontWeight: '600' },
  rowLabelDestructive: { color: colors.goldMuted },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
  badgeText: { color: colors.bg, fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
});
