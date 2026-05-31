import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Play } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ExerciseDetail'>;
type DetailRoute = RouteProp<RootStackParamList, 'ExerciseDetail'>;

export default function ExerciseDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<DetailRoute>();
  const { exercise } = params;
  const { session } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleStartRep = async () => {
    const memberId = session?.user?.id;
    if (!memberId) {
      Alert.alert('Not signed in', 'Please sign in again to record this rep.');
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    const { error } = await supabase.from('exercise_completions').insert({
      member_id: memberId,
      exercise_id: exercise.id,
      completed_date: new Date().toISOString(),
    });
    setSubmitting(false);

    if (error) {
      Alert.alert('Could not record rep', error.message);
      return;
    }

    Alert.alert('Rep complete!', 'Nice work — this rep has been logged.', [
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  };

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
        <Text style={styles.eyebrow}>THE GYM</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {exercise.category ? (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{exercise.category}</Text>
          </View>
        ) : null}
        <Text style={styles.name}>{exercise.name}</Text>
        {exercise.description ? (
          <Text style={styles.description}>{exercise.description}</Text>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.startBtn, submitting && styles.startBtnDisabled]}
          onPress={handleStartRep}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityLabel="Start rep"
        >
          {submitting ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <>
              <Play size={18} color={colors.bg} strokeWidth={2.6} fill={colors.bg} />
              <Text style={styles.startBtnText}>Start Rep</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
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
  },

  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 14,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  name: { color: colors.fg, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  description: { color: colors.fgMuted, fontSize: 16, lineHeight: 24 },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
  startBtnDisabled: { opacity: 0.6 },
  startBtnText: { color: colors.bg, fontSize: 17, fontWeight: '700' },
});
