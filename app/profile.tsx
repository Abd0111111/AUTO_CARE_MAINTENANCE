import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavbar } from '@/components/bottom-navbar';

const COLORS = {
  background: '#09182d',
  card: '#102440',
  cardSoft: '#0f223b',
  border: 'rgba(125, 167, 255, 0.15)',
  text: '#e8f1ff',
  muted: '#9ab2d4',
  success: '#33d17a',
  warning: '#f5c84c',
  danger: '#ff5f7a',
  blue: '#4a90ff',
};

const dashboardData = {
  maintenanceAlert: 'Oil change recommended within 500 km. Your engine performance is declining.',
  healthScore: 92,
  healthTrend: 'Improving',
  healthDescription: 'All systems normal. Battery voltage stable.',
  fuelL100km: 7.8,
  fuelTrend: 'Improving',
  fuelDescription: '8% better than last month. Smooth driving pays off.',
  maintenanceRisk: 'Low',
  maintenanceTrend: 'Stable',
  maintenanceDescription: 'All maintenance on schedule. Oil change due soon.',
  monthlyCost: 285,
  costTrend: 'Declining',
  costDescription: 'Reduced by $42. Less city driving this month.',
  drivingStreakDays: 14,
  longestStreakDays: 28,
  weeklyKm: 342,
  monthlyAvgScore: 87,
  nextServiceDays: 18,
};

function TrendRow({
  label,
  tone,
}: {
  label: string;
  tone: 'success' | 'warning' | 'danger';
}) {
  const color =
    tone === 'success' ? COLORS.success : tone === 'warning' ? COLORS.warning : COLORS.danger;

  const icon = tone === 'success' ? 'trending-up' : tone === 'warning' ? 'remove' : 'trending-down';

  return (
    <View style={styles.trendRow}>
      <Ionicons name={icon} size={15} color={color} />
      <Text style={[styles.trendText, { color }]}>{label}</Text>
    </View>
  );
}

function MetricCard({
  title,
  value,
  unit,
  icon,
  trendLabel,
  trendTone,
  description,
}: {
  title: string;
  value: string;
  unit?: string;
  icon: keyof typeof Ionicons.glyphMap;
  trendLabel: string;
  trendTone: 'success' | 'warning' | 'danger';
  description: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        <Ionicons name={icon} size={16} color={COLORS.blue} />
      </View>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        {unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}
      </View>
      <TrendRow label={trendLabel} tone={trendTone} />
      <Text style={styles.metricDescription}>{description}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerIconButton}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </Pressable>
            <Pressable style={styles.headerIconButton}>
              <Ionicons name="person-outline" size={20} color={COLORS.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.alertCard}>
          <View style={styles.alertTitleRow}>
            <Ionicons name="warning-outline" size={18} color={COLORS.warning} />
            <Text style={styles.alertTitle}>Maintenance Alert</Text>
          </View>
          <Text style={styles.alertBody}>{dashboardData.maintenanceAlert}</Text>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            title="Health Score"
            value={`${dashboardData.healthScore}`}
            unit="/100"
            icon="pulse-outline"
            trendLabel={dashboardData.healthTrend}
            trendTone="success"
            description={dashboardData.healthDescription}
          />
          <MetricCard
            title="Fuel Efficiency"
            value={`${dashboardData.fuelL100km}`}
            unit="L/100km"
            icon="water-outline"
            trendLabel={dashboardData.fuelTrend}
            trendTone="success"
            description={dashboardData.fuelDescription}
          />
          <MetricCard
            title="Maintenance Risk"
            value={dashboardData.maintenanceRisk}
            icon="build-outline"
            trendLabel={dashboardData.maintenanceTrend}
            trendTone="warning"
            description={dashboardData.maintenanceDescription}
          />
          <MetricCard
            title="Monthly Cost"
            value={`${dashboardData.monthlyCost} $`}
            icon="cash-outline"
            trendLabel={dashboardData.costTrend}
            trendTone="danger"
            description={dashboardData.costDescription}
          />
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakTopRow}>
            <View>
              <Text style={styles.streakLabel}>Driving Streak</Text>
              <Text style={styles.streakValue}>
                {dashboardData.drivingStreakDays} <Text style={styles.streakUnit}>days safe</Text>
              </Text>
            </View>
            <View style={styles.streakIconWrap}>
              <Ionicons name="locate" size={18} color="#3ce87f" />
            </View>
          </View>

          <View style={styles.chartLineWrap}>
            <View style={styles.chartLine} />
          </View>

          <Text style={styles.streakDescription}>
            Your longest streak is {dashboardData.longestStreakDays} days. Keep up the great work!
          </Text>
        </View>

        <View style={styles.bottomStatsRow}>
          <View style={styles.bottomStatCard}>
            <Text style={styles.bottomStatTitle}>This Week</Text>
            <Text style={styles.bottomStatValue}>{dashboardData.weeklyKm}</Text>
            <Text style={styles.bottomStatUnit}>km driven</Text>
          </View>
          <View style={styles.bottomStatCard}>
            <Text style={styles.bottomStatTitle}>Avg Score</Text>
            <Text style={styles.bottomStatValue}>{dashboardData.monthlyAvgScore}</Text>
            <Text style={styles.bottomStatUnit}>this month</Text>
          </View>
          <View style={styles.bottomStatCard}>
            <Text style={styles.bottomStatTitle}>Next Service</Text>
            <Text style={styles.bottomStatValue}>{dashboardData.nextServiceDays}</Text>
            <Text style={styles.bottomStatUnit}>days</Text>
          </View>
        </View>
      </ScrollView>
      <BottomNavbar activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -1,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#ff425a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  alertCard: {
    backgroundColor: 'rgba(250, 193, 73, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(250, 193, 73, 0.22)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  alertTitle: {
    color: '#f8cf5f',
    fontSize: 17,
    fontWeight: '700',
  },
  alertBody: {
    color: '#e6e1d2',
    lineHeight: 20,
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48.5%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    minHeight: 168,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  metricValue: {
    color: COLORS.text,
    fontSize: 37,
    fontWeight: '700',
  },
  metricUnit: {
    color: COLORS.muted,
    fontSize: 17,
    marginBottom: 6,
    fontWeight: '600',
  },
  trendRow: {
    marginTop: 4,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendText: {
    fontSize: 16,
    fontWeight: '700',
  },
  metricDescription: {
    color: '#d2def2',
    fontSize: 14,
    lineHeight: 20,
  },
  streakCard: {
    marginTop: 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardSoft,
    padding: 14,
  },
  streakTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakLabel: {
    color: COLORS.muted,
    fontSize: 14,
  },
  streakValue: {
    color: COLORS.text,
    fontSize: 46,
    fontWeight: '700',
  },
  streakUnit: {
    color: '#d8e6ff',
    fontSize: 20,
    fontWeight: '500',
  },
  streakIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(60, 232, 127, 0.15)',
  },
  chartLineWrap: {
    height: 42,
    justifyContent: 'center',
  },
  chartLine: {
    height: 2,
    backgroundColor: '#53a0ff',
    borderRadius: 4,
  },
  streakDescription: {
    color: '#d2def2',
    fontSize: 14,
    lineHeight: 21,
  },
  bottomStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bottomStatCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  bottomStatTitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  bottomStatValue: {
    color: COLORS.text,
    fontSize: 31,
    fontWeight: '700',
  },
  bottomStatUnit: {
    color: '#cad9f2',
    fontSize: 13,
  },
});
