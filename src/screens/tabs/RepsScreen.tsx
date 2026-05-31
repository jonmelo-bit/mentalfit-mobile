import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Activity,
  Building2,
  CalendarDays,
  ChevronRight,
  Gauge,
  Move,
  Play,
  Scale,
  Search,
  Timer,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { useExercises } from '../../hooks/useExercises';
import type { RootStackParamList } from '../../navigation/types';

// The fixed set of categories shown in "Browse by category". Counts are
// derived from real data; tiles render even when a category has 0 exercises.
const CATEGORIES: { name: string; Icon: typeof Gauge }[] = [
  { name: 'Capacity', Icon: Gauge },
  { name: 'Composition', Icon: Scale },
  { name: 'Flexibility', Icon: Move },
  { name: 'Endurance', Icon: Activity },
  { name: 'PACE', Icon: Timer },
];

export default function RepsScreen() {
  const [query, setQuery] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { exercises, loading, error } = useExercises();

  // "Today's recommended" is simply the first exercise from the table.
  const featured = exercises[0] ?? null;

  // Count exercises per category (case-insensitive match on the fixed names).
  const countsByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ex of exercises) {
      const name = ex.category?.trim().toLowerCase();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return counts;
  }, [exercises]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.eyebrow}>TRAIN</Text>
          <Text style={styles.title}>Your Reps</Text>
        </View>

        <View style={styles.actionStack}>
          <Pressable style={[styles.actionCard, styles.actionCardDefault]}>
            <View style={[styles.actionIcon, styles.actionIconDefault]}>
              <CalendarDays size={20} color={colors.gold} strokeWidth={2.2} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.actionTitle}>Book Session</Text>
              <Text style={styles.actionSubtitle}>With your Coach</Text>
            </View>
            <ChevronRight size={18} color={colors.fgMuted} strokeWidth={2} />
          </Pressable>

          <Pressable
            style={[styles.actionCard, styles.actionCardPrimary]}
            onPress={() => navigation.navigate('ExerciseList')}
          >
            <View style={[styles.actionIcon, styles.actionIconPrimary]}>
              <Building2 size={20} color={colors.gold} strokeWidth={2.2} />
            </View>
            <View style={styles.flex}>
              <Text style={[styles.actionTitle, styles.actionTitlePrimary]}>
                Enter Gym
              </Text>
              <Text style={[styles.actionSubtitle, styles.actionSubtitlePrimary]}>
                Start Exercise
              </Text>
            </View>
            <ChevronRight size={18} color={colors.bg} strokeWidth={2.2} />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <Search size={18} color={colors.fgMuted} strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Exercises, Sessions..."
            placeholderTextColor={colors.fgMuted}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TODAY'S RECOMMENDED</Text>
          <View style={styles.featuredCard}>
            {featured ? (
              <>
                {featured.category ? (
                  <View style={styles.featuredMetaRow}>
                    <View style={styles.featuredPill}>
                      <Text style={styles.featuredPillText}>
                        {featured.category}
                      </Text>
                    </View>
                  </View>
                ) : null}
                <Text style={styles.featuredName}>{featured.name}</Text>
                {featured.description ? (
                  <Text style={styles.featuredDescription} numberOfLines={2}>
                    {featured.description}
                  </Text>
                ) : null}
                <Pressable
                  style={styles.featuredCta}
                  onPress={() =>
                    navigation.navigate('ExerciseDetail', { exercise: featured })
                  }
                >
                  <Play
                    size={14}
                    color={colors.bg}
                    strokeWidth={2.6}
                    fill={colors.bg}
                  />
                  <Text style={styles.featuredCtaText}>Do it now</Text>
                </Pressable>
              </>
            ) : (
              <Text style={styles.emptyText}>
                {loading
                  ? 'Loading exercises…'
                  : error
                    ? 'Could not load exercises.'
                    : 'No exercises available yet.'}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>BROWSE BY CATEGORY</Text>
          <View style={styles.grid}>
            {CATEGORIES.map((cat) => {
              const count = countsByCategory.get(cat.name.toLowerCase()) ?? 0;
              return (
                <Pressable
                  key={cat.name}
                  style={styles.categoryCard}
                  onPress={() =>
                    navigation.navigate('ExerciseList', { category: cat.name })
                  }
                >
                  <View style={styles.categoryIcon}>
                    <cat.Icon size={20} color={colors.gold} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryCount}>
                    {count} {count === 1 ? 'exercise' : 'exercises'}
                  </Text>
                </Pressable>
              );
            })}
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

  actionStack: { gap: 10 },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionCardDefault: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  actionCardPrimary: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconDefault: { backgroundColor: colors.elevated },
  actionIconPrimary: { backgroundColor: 'rgba(26, 35, 24, 0.18)' },
  actionTitle: { color: colors.fg, fontSize: 16, fontWeight: '700' },
  actionTitlePrimary: { color: colors.bg },
  actionSubtitle: { color: colors.fgMuted, fontSize: 13, marginTop: 2 },
  actionSubtitlePrimary: { color: 'rgba(26, 35, 24, 0.7)' },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.fg,
    fontSize: 15,
  },

  section: { gap: 10 },
  sectionLabel: {
    color: colors.fgMuted,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
  },

  featuredCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featuredPillText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  featuredName: { color: colors.fg, fontSize: 20, fontWeight: '700' },
  featuredDescription: { color: colors.fgMuted, fontSize: 14, lineHeight: 20 },
  emptyText: { color: colors.fgMuted, fontSize: 14 },
  featuredCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.gold,
    marginTop: 4,
  },
  featuredCtaText: { color: colors.bg, fontSize: 14, fontWeight: '700' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    minHeight: 120,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: { color: colors.fg, fontSize: 15, fontWeight: '700' },
  categoryCount: { color: colors.fgMuted, fontSize: 12 },
});
