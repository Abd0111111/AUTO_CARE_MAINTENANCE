export type TripEvent = {
  id: string;
  label: string;
  severity: 'low' | 'medium' | 'high';
  time: string;
};

export type Trip = {
  id: string;
  startedAtLabel: string;
  distanceKm: number;
  durationMin: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  score: number;
  speedProfile: number[];
  events: TripEvent[];
};

export const TRIPS_DATA: Trip[] = [
  {
    id: 'trip-1',
    startedAtLabel: 'Today, 9:30 AM',
    distanceKm: 24.5,
    durationMin: 35,
    avgSpeedKmh: 42,
    maxSpeedKmh: 85,
    score: 92,
    speedProfile: [6, 8, 10, 12, 9, 7, 9],
    events: [
      { id: 'e1', label: 'Harsh brake', severity: 'low', time: '09:48 AM' },
      { id: 'e2', label: 'Smooth cornering', severity: 'low', time: '09:54 AM' },
    ],
  },
  {
    id: 'trip-2',
    startedAtLabel: 'Yesterday, 5:45 PM',
    distanceKm: 18.2,
    durationMin: 28,
    avgSpeedKmh: 39,
    maxSpeedKmh: 78,
    score: 85,
    speedProfile: [5, 7, 9, 9, 8, 7, 6],
    events: [{ id: 'e3', label: 'Fast acceleration', severity: 'medium', time: '05:52 PM' }],
  },
  {
    id: 'trip-3',
    startedAtLabel: 'Feb 10, 2:15 PM',
    distanceKm: 52.8,
    durationMin: 72,
    avgSpeedKmh: 44,
    maxSpeedKmh: 110,
    score: 88,
    speedProfile: [4, 6, 8, 11, 10, 9, 7],
    events: [
      { id: 'e4', label: 'Speed above limit', severity: 'high', time: '02:43 PM' },
      { id: 'e5', label: 'Stable cruise', severity: 'low', time: '03:02 PM' },
    ],
  },
  {
    id: 'trip-4',
    startedAtLabel: 'Feb 9, 8:20 AM',
    distanceKm: 15.3,
    durationMin: 22,
    avgSpeedKmh: 42,
    maxSpeedKmh: 82,
    score: 78,
    speedProfile: [5, 6, 8, 7, 8, 6, 5],
    events: [{ id: 'e6', label: 'Sudden lane change', severity: 'medium', time: '08:35 AM' }],
  },
];
