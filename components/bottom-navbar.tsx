import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TabKey = 'home' | 'trips' | 'track' | 'car' | 'ai';

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap; route?: '/profile' | '/trips' }[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', route: '/profile' },
  { key: 'trips', label: 'Trips', icon: 'location-outline', route: '/trips' },
  { key: 'track', label: 'Track', icon: 'radio-outline' },
  { key: 'car', label: 'Car', icon: 'car-outline' },
  { key: 'ai', label: 'AI', icon: 'chatbox-ellipses-outline' },
];

export function BottomNavbar({ activeTab }: { activeTab: TabKey }) {
  return (
    <View style={styles.wrap}>
      {TABS.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            style={[styles.item, active && styles.itemActive]}
            onPress={() => {
              if (tab.route) router.push(tab.route);
            }}>
            <Ionicons name={tab.icon} size={18} color={active ? '#e6edf3' : '#8b949e'} />
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#30363d',
    backgroundColor: '#101620',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 12,
  },
  item: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  itemActive: {
    backgroundColor: '#3b82f6',
  },
  label: {
    color: '#8b949e',
    fontSize: 12,
    fontWeight: '500',
  },
  labelActive: {
    color: '#e6edf3',
    fontWeight: '600',
  },
});
