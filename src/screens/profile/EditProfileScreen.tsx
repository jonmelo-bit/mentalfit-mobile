import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { ThemeColors } from '../../theme/colors';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

// Editable fields, in display order. Email is loaded but rendered read-only.
const EDIT_FIELDS = 'first_name, last_name, email, phone_number';

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

const EMPTY_FORM: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
};

export default function EditProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Pre-populate the form from the member's current row.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('members')
        .select(EDIT_FIELDS)
        .eq('id', userId)
        .maybeSingle();
      if (!active) return;
      if (error) {
        Alert.alert('Could not load profile', error.message);
        setLoading(false);
        return;
      }
      if (data) {
        const row = data as Partial<FormState>;
        setForm({
          first_name: row.first_name ?? '',
          last_name: row.last_name ?? '',
          email: row.email ?? '',
          phone_number: row.phone_number ?? '',
        });
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  const setField = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Empty strings are stored as null so the column stays clean.
  const orNull = (v: string) => {
    const t = v.trim();
    return t.length ? t : null;
  };

  const handleSave = async () => {
    if (!userId || saving) return;
    setSaving(true);
    const { error } = await supabase
      .from('members')
      .update({
        first_name: orNull(form.first_name),
        last_name: orNull(form.last_name),
        phone_number: orNull(form.phone_number),
        // email is intentionally not updated — it's read-only here.
      })
      .eq('id', userId);
    setSaving(false);
    if (error) {
      Alert.alert('Could not save', error.message);
      return;
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <View style={styles.header}>
          <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Pressable hitSlop={8} onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveText, saving && styles.saveTextDisabled]}>
              {saving ? 'Saving…' : 'Save'}
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.gold} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Field
              label="First name"
              value={form.first_name}
              onChangeText={setField('first_name')}
              placeholder="First name"
              autoCapitalize="words"
              colors={colors}
              styles={styles}
            />
            <Field
              label="Last name"
              value={form.last_name}
              onChangeText={setField('last_name')}
              placeholder="Last name"
              autoCapitalize="words"
              colors={colors}
              styles={styles}
            />
            <Field
              label="Email"
              value={form.email}
              editable={false}
              placeholder="Email"
              colors={colors}
              styles={styles}
              hint="Email can't be changed here."
            />
            <Field
              label="Phone number"
              value={form.phone_number}
              onChangeText={setField('phone_number')}
              placeholder="Phone number"
              keyboardType="phone-pad"
              colors={colors}
              styles={styles}
            />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  editable?: boolean;
  hint?: string;
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
  keyboardType?: 'default' | 'phone-pad';
  colors: ThemeColors;
  styles: ReturnType<typeof makeStyles>;
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  hint,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  colors,
  styles,
}: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.fgMuted}
        editable={editable}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        autoCorrect={false}
      />
      {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    flex: { flex: 1 },
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerTitle: { color: colors.fg, fontSize: 16, fontWeight: '700' },
    cancelText: { color: colors.fgMuted, fontSize: 15, fontWeight: '600' },
    saveText: { color: colors.gold, fontSize: 15, fontWeight: '700' },
    saveTextDisabled: { opacity: 0.4 },

    body: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 48,
      gap: 18,
    },
    fieldGroup: { gap: 6 },
    fieldLabel: {
      color: colors.fgMuted,
      fontSize: 12,
      letterSpacing: 0.4,
      fontWeight: '700',
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: colors.fg,
      fontSize: 15,
    },
    inputDisabled: {
      backgroundColor: colors.elevated,
      color: colors.fgMuted,
    },
    fieldHint: { color: colors.fgMuted, fontSize: 11 },
  });
