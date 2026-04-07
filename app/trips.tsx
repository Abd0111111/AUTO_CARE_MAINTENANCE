import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TRIPS_DATA, Trip } from '@/constants/trips-data';
import { BottomNavbar } from '@/components/bottom-navbar';

const COLORS = {
  background: '#0d1117',
  surface: '#161b22',
  border: '#30363d',
  text: '#e6edf3',
  muted: '#8b949e',
  primary: '#3b82f6',
  green: '#22c55e',
  yellow: '#f59e0b',
};

function scoreLabel(score: number) {
  if (score >= 90) return { text: 'Excellent', color: COLORS.green };
  if (score >= 80) return { text: 'Good', color: COLORS.green };
  return { text: 'Fair', color: COLORS.yellow };
}

function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h} h ${m} min`;
}

export default function TripsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Trip History</Text>
        <Pressable style={styles.profileButton} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={20} color={COLORS.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.totalLabel}>Total Trips</Text>
            <Text style={styles.totalValue}>{TRIPS_DATA.length}</Text>
          </View>
          <Pressable style={styles.clearButton}>
            <Ionicons name="trash-outline" size={16} color={COLORS.text} />
            <Text style={styles.clearText}>Clear History</Text>
          </Pressable>
        </View>

        {TRIPS_DATA.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </ScrollView>
      <BottomNavbar activeTab="trips" />
    </View>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const scoreMeta = scoreLabel(trip.score);

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/trip-details/[id]',
          params: { id: trip.id },
        })
      }>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{trip.startedAtLabel}</Text>
        <View style={styles.scoreWrap}>
          <Text style={styles.scoreText}>{trip.score}</Text>
          <Text style={[styles.scoreLabel, { color: scoreMeta.color }]}>{scoreMeta.text}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.metric}>{trip.distanceKm} km</Text>
        <Text style={styles.metric}>{formatDuration(trip.durationMin)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.mutedMetric}>Avg {trip.avgSpeedKmh} km/h</Text>
        <Text style={styles.mutedMetric}>Max {trip.maxSpeedKmh} km/h</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  title: { color: COLORS.text, fontSize: 30, fontWeight: '700' },
  profileButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: { color: COLORS.muted, fontSize: 14 },
  totalValue: { color: COLORS.text, fontSize: 34, fontWeight: '700', marginTop: 4 },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  clearText: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dateText: { color: COLORS.muted, fontSize: 15 },
  scoreWrap: { alignItems: 'flex-end' },
  scoreText: { color: COLORS.text, fontSize: 36, fontWeight: '700', lineHeight: 38 },
  scoreLabel: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 14, marginTop: 5 },
  metric: { color: COLORS.text, fontSize: 24, fontWeight: '700' },
  mutedMetric: { color: COLORS.muted, fontSize: 22, fontWeight: '600' },
});
