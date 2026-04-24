import { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  background: "#09182d",
  surface: "#13243a",
  border: "rgba(255,255,255,0.08)",
  text: "#f8fafc",
  muted: "#b8c3d6",
  primary: "#3268f7",
};

export default function VerifyOtpScreen() {
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text[0];

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // move forward
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // move backward
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

const handleVerify = () => {
  const otpCode = otp.join("");

  if (otpCode.length !== 6) {
    Alert.alert("Error", "Enter 6 digits first");
    return;
  }

  console.log("OTP Entered:", otpCode);

  Alert.alert("Success", "OTP Verified (TEST MODE)");

  router.replace("/vehicle-setup");
};

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {email}
      </Text>

      {/* OTP Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
                inputs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.box}
          />
        ))}
      </View>

      {/* Button */}
      <Pressable style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 22,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 30,
  },
  subtitle: {
    color: COLORS.muted,
    marginTop: 10,
    marginBottom: 30,
    fontSize: 16,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  box: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});