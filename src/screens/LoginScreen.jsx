import { LinearGradient } from "expo-linear-gradient";
import { Eye, EyeOff, Lock, Mail, TrendingDown, User } from "lucide-react-native";
import { useState } from "react";
import {
  Alert, KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONTS, SHADOW, SPACING } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim())
      return Alert.alert("Error", "Please fill in all fields.");
    if (!isLogin && !name.trim())
      return Alert.alert("Error", "Please enter your name.");
    if (password.length < 6)
      return Alert.alert("Error", "Password must be at least 6 characters.");

    setLoading(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await signup(email.trim(), password, name.trim());
      }
    } catch (err) {
      const msg =
        err.code === "auth/user-not-found" ? "No account found with this email." :
        err.code === "auth/wrong-password" ? "Incorrect password." :
        err.code === "auth/email-already-in-use" ? "An account already exists with this email." :
        err.code === "auth/invalid-email" ? "Invalid email address." :
        "Something went wrong. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.gradient}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconWrap}>
                <TrendingDown size={36} color={COLORS.gold} strokeWidth={2} />
              </View>
              <Text style={styles.appName}>HabitCost</Text>
              <Text style={styles.tagline}>See what your habits really cost</Text>
            </View>

            {/* Card */}
            <View style={[styles.card, SHADOW.large]}>
              <Text style={styles.title}>
                {isLogin ? "Welcome back" : "Create account ✨"}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin ? "Sign in to your account" : "Start tracking your habits"}
              </Text>

              {/* Name — only for signup */}
              {!isLogin && (
                <View style={styles.inputWrap}>
                  <User size={16} color={COLORS.gray} strokeWidth={2} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your first name"
                    placeholderTextColor={COLORS.gray}
                    autoCapitalize="words"
                  />
                </View>
              )}

              {/* Email */}
              <View style={styles.inputWrap}>
                <Mail size={16} color={COLORS.gray} strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor={COLORS.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View style={styles.inputWrap}>
                <Lock size={16} color={COLORS.gray} strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor={COLORS.gray}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword
                    ? <EyeOff size={16} color={COLORS.gray} strokeWidth={2} />
                    : <Eye size={16} color={COLORS.gray} strokeWidth={2} />}
                </TouchableOpacity>
              </View>

              {/* Submit */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                </Text>
              </TouchableOpacity>

              {/* Toggle */}
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggle}>
                <Text style={styles.toggleText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <Text style={styles.toggleLink}>{isLogin ? "Sign Up" : "Sign In"}</Text>
                </Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  gradient: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: SPACING.lg },
  header: { alignItems: "center", marginBottom: SPACING.xl },
  iconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center", justifyContent: "center",
    marginBottom: SPACING.md,
  },
  appName: { fontSize: 32, fontWeight: "800", color: COLORS.white, marginBottom: 8 },
  tagline: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  card: { backgroundColor: COLORS.white, borderRadius: 24, padding: SPACING.lg },
  title: { fontSize: FONTS.sizes.xl, fontWeight: "700", color: COLORS.dark, marginBottom: 4 },
  subtitle: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, marginBottom: SPACING.lg },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.light, borderRadius: 12,
    paddingHorizontal: SPACING.md, marginBottom: SPACING.sm, gap: 10,
  },
  input: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.dark, paddingVertical: 14 },
  button: {
    backgroundColor: COLORS.accent, borderRadius: 30,
    padding: SPACING.md, alignItems: "center", marginTop: SPACING.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: FONTS.sizes.md },
  toggle: { alignItems: "center", marginTop: SPACING.md },
  toggleText: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray },
  toggleLink: { color: COLORS.accent, fontWeight: "700" },
});
