import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TRIPS_DATA } from '@/constants/trips-data';
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
  red: '#f85149',
};

function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h} h ${m} min`;
}

function scoreLabel(score: number) {
  if (score >= 90) return { text: 'Excellent', color: COLORS.green };
  if (score >= 80) return { text: 'Good', color: COLORS.green };
  return { text: 'Fair', color: COLORS.yellow };
}

function eventColor(level: 'low' | 'medium' | 'high') {
  if (level === 'high') return COLORS.red;
  if (level === 'medium') return COLORS.yellow;
  return COLORS.green;
}

export default function TripDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = TRIPS_DATA.find((item) => item.id === id);

  if (!trip) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Trip not found.</Text>
        <Pressable style={styles.backAction} onPress={() => router.back()}>
          <Text style={styles.backActionText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const scoreMeta = scoreLabel(trip.score);
  const maxBar = Math.max(...trip.speedProfile, 1);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          <Text style={styles.backText}>Back to Trips</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Trip Details</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreCardLabel}>Driving Score</Text>
          <Text style={styles.scoreCardValue}>{trip.score}</Text>
          <Text style={[styles.scoreCardStatus, { color: scoreMeta.color }]}>{scoreMeta.text}</Text>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard label="Distance" value={`${trip.distanceKm} km`} icon="location-outline" />
          <MetricCard label="Duration" value={formatDuration(trip.durationMin)} icon="time-outline" />
          <MetricCard label="Avg Speed" value={`${trip.avgSpeedKmh} km/h`} icon="speedometer-outline" />
          <MetricCard label="Max Speed" value={`${trip.maxSpeedKmh} km/h`} icon="trending-up-outline" />
        </View>

        <Text style={styles.sectionTitle}>Speed Profile</Text>
        <View style={styles.speedCard}>
          <View style={styles.barsRow}>
            {trip.speedProfile.map((bar, idx) => (
              <View
                key={`${trip.id}-bar-${idx}`}
                style={[
                  styles.bar,
                  {
                    height: Math.max(18, (bar / maxBar) * 110),
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Driving Events</Text>
        <View style={styles.eventsCard}>
          {trip.events.map((event) => (
            <View key={event.id} style={styles.eventRow}>
              <View style={[styles.dot, { backgroundColor: eventColor(event.severity) }]} />
              <Text style={styles.eventText}>{event.label}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNavbar activeTab="trips" />
    </View>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricLabelRow}>
        <Ionicons name={icon} size={16} color={COLORS.primary} />
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  errorText: { color: COLORS.text, fontSize: 16, marginBottom: 12 },
  backAction: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backActionText: { color: COLORS.text, fontWeight: '600' },
  header: { paddingHorizontal: 16, paddingVertical: 10 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { color: COLORS.text, fontSize: 15 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18 },
  title: { color: COLORS.text, fontSize: 34, fontWeight: '700', marginBottom: 12 },
  scoreCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 14,
  },
  scoreCardLabel: { color: '#dbeafe', fontSize: 14, marginBottom: 6 },
  scoreCardValue: { color: COLORS.text, fontSize: 54, fontWeight: '700', lineHeight: 58 },
  scoreCardStatus: { fontSize: 24, fontWeight: '700' },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 14,
  },
  metricCard: {
    width: '48.5%',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
  },
  metricLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricLabel: { color: COLORS.muted, fontSize: 13 },
  metricValue: { color: COLORS.text, fontSize: 30, fontWeight: '700', marginTop: 6, lineHeight: 34 },
  sectionTitle: { color: COLORS.text, fontSize: 26, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  speedCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120 },
  bar: { width: 28, borderRadius: 7, backgroundColor: COLORS.primary },
  eventsCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#253041',
    gap: 8,
  },
  dot: { width: 9, height: 9, borderRadius: 5 },
  eventText: { color: COLORS.text, fontSize: 14, flex: 1 },
  eventTime: { color: COLORS.muted, fontSize: 13 },
});
