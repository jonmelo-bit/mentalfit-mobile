import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Mic,
  Moon,
  Phone,
  Plus,
  Sun,
} from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeColors } from '../../theme/colors';

const COACH = { initial: 'M', name: 'Maya Reyes' };

type Bubble = {
  key: string;
  from: 'coach' | 'member';
  text: string;
};

const CONVERSATION: Bubble[] = [
  {
    key: 'm1',
    from: 'coach',
    text: "Morning Jon — saw you hit your breath rep streak. How's the body feeling?",
  },
  {
    key: 'm2',
    from: 'member',
    text: 'Pretty good. Sleep was rough but I still got 4 hours of focus in.',
  },
  {
    key: 'm3',
    from: 'coach',
    text:
      "Solid. Want to swap tomorrow's focus block for a mobility rep instead? You earned the reset.",
  },
  {
    key: 'm4',
    from: 'member',
    text: "Yeah, let's do that. Same time?",
  },
  {
    key: 'm5',
    from: 'coach',
    text: "Same time. I'll send the calendar over in a sec.",
  },
];

export default function ChatScreen() {
  const [draft, setDraft] = useState('');
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} hitSlop={8}>
            <ArrowLeft size={22} color={colors.fg} strokeWidth={2.2} />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{COACH.initial}</Text>
            </View>
            <View>
              <Text style={styles.headerName}>{COACH.name}</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active now</Text>
              </View>
            </View>
          </View>

          <View style={styles.headerActions}>
            <Pressable style={styles.headerBtn} hitSlop={8}>
              <Phone size={20} color={colors.gold} strokeWidth={2.2} />
            </Pressable>
            <Pressable
              style={styles.lightToggle}
              hitSlop={8}
              onPress={toggleTheme}
            >
              {isDark ? (
                <Sun size={16} color={colors.gold} strokeWidth={2.2} />
              ) : (
                <Moon size={16} color={colors.gold} strokeWidth={2.2} />
              )}
              <Text style={styles.lightToggleText}>
                {isDark ? 'Light' : 'Dark'}
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dateSeparator}>
            <View style={styles.dateLine} />
            <Text style={styles.dateText}>Today · 10:24 AM</Text>
            <View style={styles.dateLine} />
          </View>

          {CONVERSATION.map((m) =>
            m.from === 'coach' ? (
              <View key={m.key} style={styles.coachBubble}>
                <Text style={styles.coachBubbleText}>{m.text}</Text>
              </View>
            ) : (
              <View key={m.key} style={styles.memberBubble}>
                <Text style={styles.memberBubbleText}>{m.text}</Text>
              </View>
            ),
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <Pressable style={styles.plusBtn} hitSlop={8}>
            <Plus size={20} color={colors.bg} strokeWidth={2.6} />
          </Pressable>
          <View style={styles.inputWrap}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={`Message ${COACH.name.split(' ')[0]}...`}
              placeholderTextColor={colors.fgMuted}
              style={styles.input}
              multiline
            />
            <Pressable style={styles.micBtn} hitSlop={8}>
              <Mic size={18} color={colors.gold} strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ACTIVE_GREEN = '#5EC26A';

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { color: colors.bg, fontSize: 15, fontWeight: '700' },
  headerName: { color: colors.fg, fontSize: 15, fontWeight: '700' },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACTIVE_GREEN,
  },
  statusText: { color: colors.fgMuted, fontSize: 11 },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lightToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  lightToggleText: { color: colors.gold, fontSize: 12, fontWeight: '700' },

  messages: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 6,
  },
  dateLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dateText: {
    color: colors.fgMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  coachBubble: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 6,
  },
  coachBubbleText: { color: colors.fg, fontSize: 15, lineHeight: 20 },
  memberBubble: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    backgroundColor: colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 6,
  },
  memberBubbleText: { color: colors.bg, fontSize: 15, lineHeight: 20, fontWeight: '500' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  plusBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: 14,
    paddingRight: 6,
    minHeight: 38,
  },
  input: {
    flex: 1,
    color: colors.fg,
    fontSize: 15,
    paddingVertical: 8,
    maxHeight: 120,
  },
  micBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginBottom: 4,
  },
});
