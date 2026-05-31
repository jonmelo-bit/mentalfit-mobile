import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Building2,
  CalendarDays,
  ChevronRight,
  Dumbbell,
  Heart,
  TrendingUp,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { useMemberProfile } from '../../hooks/useMemberProfile';
import type { RootStackParamList } from '../../navigation/types';

const MENTAL_FITNESS = { score: 82, trend: '+4' };
const TOP_VALUES = ['Discipline', 'Presence'];
const REPS = { upcoming: 2, past: 15, recent: 12 };
const RECENT_ACTIVITY = {
  title: '15-min breath rep',
  detail: 'Completed earlier today',
  timeAgo: '2h ago',
};

function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { member, repsCount, sessionsCount, loading } = useMemberProfile();

  const firstName = member?.first_name?.trim() || '';
  const greetingName = firstName || 'there';
  const avatarInitial = firstName ? firstName[0].toUpperCase() : '';

  // Show a dash until the count loads rather than a misleading 0.
  const repsDisplay = repsCount ?? '—';
  const sessionsDisplay = sessionsCount ?? '—';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <Text style={styles.dateText}>{formatToday()}</Text>
            <Text style={styles.greetingText}>
              {loading && !member ? 'Good morning' : `Good morning, ${greetingName}`}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>THIS WEEK</Text>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Dumbbell size={18} color={colors.gold} strokeWidth={2.2} />
              <Text style={styles.heroNumber}>{repsDisplay}</Text>
              <Text style={styles.heroNumberLabel}>Reps</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <CalendarDays size={18} color={colors.gold} strokeWidth={2.2} />
              <Text style={styles.heroNumber}>{sessionsDisplay}</Text>
              <Text style={styles.heroNumberLabel}>Sessions</Text>
            </View>
          </View>
          <View style={styles.heroCtaRow}>
            <Pressable style={[styles.cta, styles.ctaPrimary]}>
              <CalendarDays size={16} color={colors.bg} strokeWidth={2.4} />
              <Text style={styles.ctaPrimaryText} numberOfLines={1}>
                Sessions
              </Text>
            </Pressable>
            <Pressable
              style={[styles.cta, styles.ctaSecondary]}
              onPress={() => navigation.navigate('ExerciseList')}
            >
              <Building2 size={16} color={colors.gold} strokeWidth={2.4} />
              <Text style={styles.ctaSecondaryText}>Enter Gym</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Heart size={14} color={colors.gold} strokeWidth={2.2} />
              <Text style={styles.statCardLabel}>Mental Fitness</Text>
            </View>
            <Text style={styles.statCardValue}>{MENTAL_FITNESS.score}</Text>
            <View style={styles.statCardTrend}>
              <TrendingUp size={12} color={colors.gold} strokeWidth={2.4} />
              <Text style={styles.statCardTrendText}>
                {MENTAL_FITNESS.trend} this week
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Text style={styles.statCardLabel}>Top Values</Text>
            </View>
            <View style={styles.valuePills}>
              {TOP_VALUES.map((v) => (
                <View key={v} style={styles.valuePill}>
                  <Text style={styles.valuePillText}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>REPS</Text>
          <View style={styles.repsBreakdown}>
            <RepsRow label="Upcoming Sessions" count={REPS.upcoming} />
            <View style={styles.divider} />
            <RepsRow label="Past Sessions" count={REPS.past} />
            <View style={styles.divider} />
            <RepsRow label="Recent Reps" count={REPS.recent} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RECENT</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Dumbbell size={18} color={colors.gold} strokeWidth={2.2} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.activityTitle}>{RECENT_ACTIVITY.title}</Text>
              <Text style={styles.activityDetail}>{RECENT_ACTIVITY.detail}</Text>
            </View>
            <Text style={styles.activityTime}>{RECENT_ACTIVITY.timeAgo}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RepsRow({ label, count }: { label: string; count: number }) {
  return (
    <View style={styles.repsRow}>
      <Text style={styles.repsLabel}>{label}</Text>
      <View style={styles.repsRowRight}>
        <Text style={styles.repsCount}>{count}</Text>
        <ChevronRight size={16} color={colors.fgMuted} strokeWidth={2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
    gap: 20,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: { color: colors.fgMuted, fontSize: 13, marginBottom: 4 },
  greetingText: { color: colors.fg, fontSize: 22, fontWeight: '600' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.bg, fontSize: 18, fontWeight: '700' },

  hero: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
  },
  heroLabel: {
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  heroStatsRow: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { flex: 1, gap: 4 },
  heroNumber: { color: colors.fg, fontSize: 32, fontWeight: '700' },
  heroNumberLabel: { color: colors.fgMuted, fontSize: 13 },
  heroDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  heroCtaRow: { flexDirection: 'row', gap: 10 },
  cta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  ctaPrimary: { backgroundColor: colors.gold },
  ctaPrimaryText: { color: colors.bg, fontWeight: '700', fontSize: 14 },
  ctaSecondary: { borderWidth: 1, borderColor: colors.gold },
  ctaSecondaryText: { color: colors.gold, fontWeight: '700', fontSize: 14 },

  statRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 110,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statCardLabel: {
    color: colors.fgMuted,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  statCardValue: { color: colors.fg, fontSize: 30, fontWeight: '700' },
  statCardTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  statCardTrendText: { color: colors.fgMuted, fontSize: 12 },
  valuePills: { gap: 6, marginTop: 4 },
  valuePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.elevated,
    alignSelf: 'flex-start',
  },
  valuePillText: { color: colors.fg, fontSize: 13, fontWeight: '600' },

  section: { gap: 10 },
  sectionLabel: {
    color: colors.fgMuted,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
  },

  repsBreakdown: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  repsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  repsLabel: { color: colors.fg, fontSize: 15, fontWeight: '500' },
  repsRowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  repsCount: { color: colors.gold, fontSize: 16, fontWeight: '700' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },

  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: { color: colors.fg, fontSize: 15, fontWeight: '600' },
  activityDetail: { color: colors.fgMuted, fontSize: 12, marginTop: 2 },
  activityTime: { color: colors.fgMuted, fontSize: 12 },
});
