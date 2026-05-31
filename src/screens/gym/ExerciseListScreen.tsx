import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useExercises, type Exercise } from '../../hooks/useExercises';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ExerciseList'>;
type ListRoute = RouteProp<RootStackParamList, 'ExerciseList'>;

const UNCATEGORIZED = 'Other';

type Section = { category: string; items: Exercise[] };

export default function ExerciseListScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<ListRoute>();
  const categoryFilter = params?.category ?? null;
  const { exercises, loading, error } = useExercises();

  // When a category filter is set, narrow to it; otherwise show everything.
  const filtered = useMemo<Exercise[]>(() => {
    if (!categoryFilter) return exercises;
    const target = categoryFilter.trim().toLowerCase();
    return exercises.filter((ex) => ex.category?.trim().toLowerCase() === target);
  }, [exercises, categoryFilter]);

  // Group exercises by category, sorted; uncategorized falls into "Other".
  const sections = useMemo<Section[]>(() => {
    const groups = new Map<string, Exercise[]>();
    for (const ex of filtered) {
      const category = ex.category?.trim() || UNCATEGORIZED;
      const bucket = groups.get(category);
      if (bucket) bucket.push(ex);
      else groups.set(category, [ex]);
    }
    return Array.from(groups, ([category, items]) => ({ category, items })).sort(
      (a, b) => a.category.localeCompare(b.category)
    );
  }, [filtered]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={24} color={colors.fg} strokeWidth={2.2} />
        </Pressable>
        <View style={styles.flex}>
          <Text style={styles.eyebrow}>THE GYM</Text>
          <Text style={styles.title}>{categoryFilter ?? 'All Exercises'}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={colors.gold} />
        </View>
      ) : error ? (
        <View style={styles.centerFill}>
          <Text style={styles.emptyText}>Could not load exercises.</Text>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.centerFill}>
          <Text style={styles.emptyText}>
            {categoryFilter
              ? `No exercises in ${categoryFilter} yet.`
              : 'No exercises available yet.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section) => (
            <View key={section.category} style={styles.section}>
              {categoryFilter ? null : (
                <Text style={styles.sectionLabel}>
                  {section.category.toUpperCase()}
                </Text>
              )}
              <View style={styles.cardGroup}>
                {section.items.map((ex) => (
                  <Pressable
                    key={ex.id}
                    style={styles.exerciseCard}
                    onPress={() =>
                      navigation.navigate('ExerciseDetail', { exercise: ex })
                    }
                  >
                    <View style={styles.flex}>
                      <Text style={styles.exerciseName}>{ex.name}</Text>
                      {ex.category ? (
                        <Text style={styles.exerciseCategory}>{ex.category}</Text>
                      ) : null}
                      {ex.description ? (
                        <Text style={styles.exerciseDescription} numberOfLines={2}>
                          {ex.description}
                        </Text>
                      ) : null}
                    </View>
                    <ChevronRight
                      size={18}
                      color={colors.fgMuted}
                      strokeWidth={2}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.fgMuted, fontSize: 14 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 1.8,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: { color: colors.fg, fontSize: 26, fontWeight: '700' },

  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 48,
    gap: 24,
  },
  section: { gap: 10 },
  sectionLabel: {
    color: colors.fgMuted,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  cardGroup: { gap: 10 },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseName: { color: colors.fg, fontSize: 16, fontWeight: '700' },
  exerciseCategory: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  exerciseDescription: {
    color: colors.fgMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
});
