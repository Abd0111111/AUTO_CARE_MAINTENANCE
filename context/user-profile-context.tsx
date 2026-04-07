import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type UserProfileData = {
  fullName: string;
  email: string;
  phone: string;
  drivingExperience: string;
  vehicleBrand: string;
  modelName: string;
  manufacturingYear: string;
  engineCapacity: string;
  odometerMileage: string;
  transmission: string;
  fuelType: string;
  lastOilChange: string;
  lastTireChange: string;
  lastBatteryYear: string;
};

const INITIAL_PROFILE: UserProfileData = {
  fullName: '',
  email: '',
  phone: '',
  drivingExperience: '',
  vehicleBrand: '',
  modelName: '',
  manufacturingYear: '',
  engineCapacity: '',
  odometerMileage: '',
  transmission: '',
  fuelType: '',
  lastOilChange: '',
  lastTireChange: '',
  lastBatteryYear: '',
};

type UserProfileContextType = {
  profile: UserProfileData;
  updateProfile: (patch: Partial<UserProfileData>) => void;
};

const UserProfileContext = createContext<UserProfileContextType | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfileData>(INITIAL_PROFILE);

  const value = useMemo(
    () => ({
      profile,
      updateProfile: (patch: Partial<UserProfileData>) => {
        setProfile((prev) => ({ ...prev, ...patch }));
      },
    }),
    [profile]
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }

  return context;
}
