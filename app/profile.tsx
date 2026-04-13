import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserProfile } from '@/context/user-profile-context';
import { BottomNavbar } from '@/components/bottom-navbar';

const COLORS = {
  background: '#0d1117',
  surface: '#161b22',
  border: '#30363d',
  text: '#e6edf3',
  muted: '#8b949e',
  primary: '#3b82f6',
  green: '#22c55e',
};

function toInitials(fullName: string) {
  const name = fullName.trim();
  if (!name) return 'U';
  const parts = name.split(/\s+/);
  return `${parts[0][0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
}

function valueOrFallback(value: string, fallback = 'Not set') {
  return value?.trim() ? value : fallback;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useUserProfile();

  const vehicleName = [profile.vehicleBrand, profile.modelName].filter(Boolean).join(' ');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>My Account</Text>

        <View style={styles.card}>
          <View style={styles.identityRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{toInitials(profile.fullName)}</Text>
            </View>
            <View style={styles.identityText}>
              <Text style={styles.name}>{valueOrFallback(profile.fullName, 'User')}</Text>
              <Text style={styles.meta}>{valueOrFallback(profile.email)}</Text>
              <Text style={styles.meta}>{valueOrFallback(profile.phone)}</Text>
            </View>
          </View>
          <View style={styles.tagsRow}>
            <Text style={styles.tag}>Driver</Text>
            <Text style={styles.tagGreen}>{valueOrFallback(profile.drivingExperience)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <InfoRow label="Brand & Model" value={valueOrFallback(vehicleName)} />
          <InfoRow label="Year" value={valueOrFallback(profile.manufacturingYear)} />
          <InfoRow label="Engine" value={valueOrFallback(profile.engineCapacity ? `${profile.engineCapacity} CC` : '')} />
          <InfoRow label="Odometer" value={valueOrFallback(profile.odometerMileage ? `${profile.odometerMileage} km` : '')} />
          <InfoRow label="Transmission" value={valueOrFallback(profile.transmission)} />
          <InfoRow label="Fuel Type" value={valueOrFallback(profile.fuelType)} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Maintenance Baseline</Text>
          <InfoRow label="Last Oil Change" value={valueOrFallback(profile.lastOilChange ? `${profile.lastOilChange} km` : '')} />
          <InfoRow label="Last Tire Change" value={valueOrFallback(profile.lastTireChange ? `${profile.lastTireChange} km` : '')} />
          <InfoRow label="Last Battery Change" value={valueOrFallback(profile.lastBatteryYear)} />
        </View>
      </ScrollView>
      <BottomNavbar activeTab="home" />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    color: COLORS.text,
    fontSize: 15,
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 14,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
  },
  identityText: { flex: 1 },
  name: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
  },
  meta: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 2,
  },
  tagsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  tag: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tagGreen: {
    color: COLORS.green,
    fontWeight: '600',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    gap: 10,
  },
  label: {
    color: COLORS.muted,
    fontSize: 15,
  },
  value: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
});
