import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  ArrowUp,
  Moon,
  Plus,
  Sun,
} from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { ThemeColors } from '../../theme/colors';

// Coach identity is not yet modeled in the DB, so the displayed name/avatar stay
// hardcoded. The coach's user id (used as the receiver when sending) is derived
// from the loaded conversation instead — see `coachId` below.
const COACH = { initial: 'M', name: 'Maya Reyes' };

const MESSAGE_FIELDS = 'id, sender_id, receiver_id, content, created_at';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string | null;
};

export default function ChatScreen() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { colors, isDark, toggleTheme } = useTheme();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const scrollRef = useRef<ScrollView>(null);

  // The other party in the thread is the coach. RLS restricts the rows to
  // messages this member sent or received, so any counterpart id is the coach.
  const coachId = useMemo(() => {
    const fromCoach = messages.find((m) => m.sender_id !== userId);
    if (fromCoach) return fromCoach.sender_id;
    const toCoach = messages.find((m) => m.receiver_id !== userId);
    return toCoach ? toCoach.receiver_id : null;
  }, [messages, userId]);

  // Load the conversation on mount (and whenever the signed-in user changes).
  useEffect(() => {
    let active = true;
    (async () => {
      if (!userId) {
        setMessages([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await supabase
        .from('messages')
        .select(MESSAGE_FIELDS)
        .order('created_at', { ascending: true });
      if (!active) return;
      setMessages((data as Message[] | null) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  // Realtime: append new messages involving this member as they arrive.
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`messages:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const row = payload.new as Message;
          if (row.sender_id !== userId && row.receiver_id !== userId) return;
          setMessages((prev) =>
            prev.some((m) => m.id === row.id) ? prev : [...prev, row],
          );
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const canSend = draft.trim().length > 0 && !!userId && !!coachId && !sending;

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || !userId || !coachId || sending) return;
    setSending(true);
    setDraft('');
    const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id: userId, receiver_id: coachId, content: text })
      .select(MESSAGE_FIELDS)
      .single();
    setSending(false);
    if (error) {
      setDraft(text); // restore the draft so the message isn't lost
      return;
    }
    if (data) {
      const row = data as Message;
      setMessages((prev) =>
        prev.some((m) => m.id === row.id) ? prev : [...prev, row],
      );
    }
  }, [draft, userId, coachId, sending]);

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
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {!loading && messages.length === 0 ? (
            <Text style={styles.emptyText}>
              No messages yet. Say hi to {COACH.name.split(' ')[0]}.
            </Text>
          ) : null}

          {messages.map((m) =>
            m.sender_id === userId ? (
              <View key={m.id} style={styles.memberBubble}>
                <Text style={styles.memberBubbleText}>{m.content}</Text>
              </View>
            ) : (
              <View key={m.id} style={styles.coachBubble}>
                <Text style={styles.coachBubbleText}>{m.content}</Text>
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
              onSubmitEditing={handleSend}
            />
            <Pressable
              style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
              hitSlop={8}
              onPress={handleSend}
              disabled={!canSend}
            >
              <ArrowUp size={18} color={colors.bg} strokeWidth={2.6} />
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
  emptyText: {
    color: colors.fgMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
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
  sendBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginBottom: 4,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
