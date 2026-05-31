import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CalendarDays,
  ChevronRight,
  MessageCircle,
  Star,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';

const COACH = {
  initial: 'M',
  name: 'Maya Reyes',
  specialty: 'Performance Psychology',
  rating: 4.9,
  sessions: 142,
  quote:
    '"Strength is built in the reps you don\'t feel like doing. Show up — I\'ll meet you there."',
};

type Session = {
  key: string;
  day: string;
  date: string;
  title: string;
  time: string;
  duration: string;
};

const UPCOMING: Session[] = [
  {
    key: 's1',
    day: 'TUE',
    date: '03',
    title: 'Pre-game focus rep',
    time: '8:30 AM',
    duration: '45 min',
  },
  {
    key: 's2',
    day: 'FRI',
    date: '06',
    title: 'Weekly check-in',
    time: '4:00 PM',
    duration: '30 min',
  },
];

type DirectoryCoach = {
  key: string;
  initial: string;
  name: string;
  specialty: string;
};

const DIRECTORY: DirectoryCoach[] = [
  { key: 'd1', initial: 'A', name: 'Andre Hill', specialty: 'Resilience' },
  { key: 'd2', initial: 'S', name: 'Sana Patel', specialty: 'Breath & Recovery' },
];

export default function CoachScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.eyebrow}>COACH DETAILS</Text>
          <Text style={styles.title}>My Coach</Text>
        </View>

        <View style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{COACH.initial}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.coachName}>{COACH.name}</Text>
              <Text style={styles.coachSpecialty}>{COACH.specialty}</Text>
              <View style={styles.coachMetaRow}>
                <View style={styles.metaItem}>
                  <Star size={12} color={colors.gold} fill={colors.gold} strokeWidth={2} />
                  <Text style={styles.metaText}>{COACH.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>{COACH.sessions} sessions</Text>
              </View>
            </View>
          </View>

          <Text style={styles.quote}>{COACH.quote}</Text>

          <View style={styles.ctaRow}>
            <Pressable style={[styles.cta, styles.ctaSecondary]}>
              <MessageCircle size={16} color={colors.gold} strokeWidth={2.4} />
              <Text style={styles.ctaSecondaryText}>Message</Text>
            </Pressable>
            <Pressable style={[styles.cta, styles.ctaPrimary]}>
              <CalendarDays size={16} color={colors.bg} strokeWidth={2.4} />
              <Text style={styles.ctaPrimaryText} numberOfLines={1}>
                Sessions
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>UPCOMING SESSIONS</Text>
          <View style={styles.listCard}>
            {UPCOMING.map((s, i) => (
              <React.Fragment key={s.key}>
                {i > 0 && <View style={styles.divider} />}
                <View style={styles.sessionRow}>
                  <View style={styles.dateChip}>
                    <Text style={styles.dateChipDay}>{s.day}</Text>
                    <Text style={styles.dateChipDate}>{s.date}</Text>
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.sessionTitle}>{s.title}</Text>
                    <Text style={styles.sessionMeta}>
                      {s.time} · {s.duration}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={colors.fgMuted} strokeWidth={2} />
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>COACH DIRECTORY</Text>
          <View style={styles.listCard}>
            {DIRECTORY.map((c, i) => (
              <React.Fragment key={c.key}>
                {i > 0 && <View style={styles.divider} />}
                <View style={styles.directoryRow}>
                  <View style={styles.directoryAvatar}>
                    <Text style={styles.directoryAvatarText}>{c.initial}</Text>
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.directoryName}>{c.name}</Text>
                    <Text style={styles.directorySpecialty}>{c.specialty}</Text>
                  </View>
                  <Pressable style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>View</Text>
                  </Pressable>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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

  eyebrow: {
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 1.8,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: { color: colors.fg, fontSize: 28, fontWeight: '700' },

  coachCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 16,
  },
  coachHeader: {
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
  coachName: { color: colors.fg, fontSize: 20, fontWeight: '700' },
  coachSpecialty: { color: colors.fgMuted, fontSize: 13, marginTop: 2 },
  coachMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: colors.fg, fontSize: 13, fontWeight: '600' },
  metaDot: { color: colors.fgMuted, fontSize: 13 },
  quote: {
    color: colors.fgMuted,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  ctaRow: { flexDirection: 'row', gap: 10 },
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

  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateChip: {
    width: 48,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dateChipDay: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  dateChipDate: {
    color: colors.fg,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 1,
  },
  sessionTitle: { color: colors.fg, fontSize: 15, fontWeight: '600' },
  sessionMeta: { color: colors.fgMuted, fontSize: 12, marginTop: 2 },

  directoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  directoryAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directoryAvatarText: { color: colors.gold, fontSize: 16, fontWeight: '700' },
  directoryName: { color: colors.fg, fontSize: 15, fontWeight: '600' },
  directorySpecialty: { color: colors.fgMuted, fontSize: 12, marginTop: 2 },
  viewBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  viewBtnText: { color: colors.fg, fontSize: 13, fontWeight: '700' },
});
