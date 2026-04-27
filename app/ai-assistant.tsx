import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNavbar } from "@/components/bottom-navbar";
import { useUserProfile } from "@/context/user-profile-context";

const COLORS = {
  background: "#09182d",
  surface: "#13243a",
  surfaceDark: "#102036",
  border: "rgba(255,255,255,0.08)",
  divider: "rgba(255,255,255,0.07)",
  text: "#f8fafc",
  muted: "#b8c3d6",
  mutedDark: "#8492a8",
  primary: "#3268f7",
  primarySoft: "#4f8cff",
  input: "#0f1f34",
};

type AssistantTab = "ai" | "support";
type ChatRole = "assistant" | "user" | "support";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAtLabel: string;
};

const QUICK_QUESTIONS = [
  "Is my driving safe?",
  "Is fuel consumption normal?",
  "When is my next service?",
  "How to improve my score?",
];

const INITIAL_AI_MESSAGES: ChatMessage[] = [
  {
    id: "ai-welcome",
    role: "assistant",
    text: "Hello! I'm your CarAI Assistant. Ask me anything about your car's performance, maintenance, or driving habits.",
    createdAtLabel: "10:30 AM",
  },
];

const INITIAL_SUPPORT_MESSAGES: ChatMessage[] = [];

const SUPPORT_REPLY_NOTE = "Support Team • Usually replies within a few hours";


function getCurrentTimeLabel() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function createMockAssistantReply(question: string, vehicleName: string) {
  const normalizedQuestion = question.toLowerCase();
  const carLabel = vehicleName || "your car";

  if (normalizedQuestion.includes("driving safe")) {
    return `I can analyze your driving safety once live trip data is connected. For ${carLabel}, keep speed steady, avoid sudden braking, and check the driving score after each trip.`;
  }

  if (normalizedQuestion.includes("fuel")) {
    return `Fuel consumption can be checked after connecting odometer, trip distance, and fuel data. If ${carLabel} is consuming more than usual, inspect tire pressure, air filter, and driving acceleration habits.`;
  }

  if (normalizedQuestion.includes("service")) {
    return `Your next service will be calculated from the maintenance baseline and current odometer. I will use the backend data to show the exact date and mileage when it is connected.`;
  }

  if (normalizedQuestion.includes("score")) {
    return "To improve your score, accelerate smoothly, brake earlier, keep a stable speed, and reduce harsh turns. After AI integration, I can give personalized recommendations from your trips.";
  }

  return "I got your question. After connecting the AI endpoint, this message will be replaced with the real assistant response based on your car data and trip history.";
}

export default function AIAssistantScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const { profile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<AssistantTab>("ai");
  const [aiMessages, setAiMessages] =
    useState<ChatMessage[]>(INITIAL_AI_MESSAGES);
  const [supportMessages, setSupportMessages] = useState<ChatMessage[]>(
    INITIAL_SUPPORT_MESSAGES,
  );
  const [inputText, setInputText] = useState("");

  const vehicleName = useMemo(
    () => [profile?.vehicle?.brand, profile?.vehicle?.model].filter(Boolean).join(" "),
    [profile?.vehicle?.model, profile?.vehicle?.brand],
  );

  const messages = activeTab === "ai" ? aiMessages : supportMessages;
  const inputPlaceholder =
    activeTab === "ai" ? "Ask about your car..." : "Type your message...";

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  };

  const handleSendMessage = (messageText = inputText) => {
    const trimmedText = messageText.trim();
    if (!trimmedText) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmedText,
      createdAtLabel: getCurrentTimeLabel(),
    };

    if (activeTab === "ai") {
      // TODO: Replace this mock response with POST /ai/chat or your AI endpoint.
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: createMockAssistantReply(trimmedText, vehicleName),
        createdAtLabel: "Now",
      };
      setAiMessages((currentMessages) => [
        ...currentMessages,
        userMessage,
        assistantMessage,
      ]);
    } else {
      // TODO: Replace this local update with POST /support/conversations/:id/messages.
      // Keep this tab free from mock replies so it is ready for the real backend chat.
      setSupportMessages((currentMessages) => [
        ...currentMessages,
        userMessage,
      ]);
    }

    setInputText("");
    scrollToBottom();
  };

  const handleQuickQuestion = (question: string) => {
    setActiveTab("ai");
    handleSendMessage(question);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>

        <View style={styles.headerActions}>
          <Pressable style={styles.headerIcon} hitSlop={10}>
            <Ionicons
              name="notifications-outline"
              size={25}
              color={COLORS.text}
            />
          </Pressable>
          <Pressable
            style={styles.headerIcon}
            hitSlop={10}
            onPress={() => router.push("/account")}
          >
            <Ionicons name="person-outline" size={25} color={COLORS.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.divider} />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        <View style={styles.content}>
          <View style={styles.segmentWrap}>
            <Pressable
              style={[
                styles.segmentButton,
                activeTab === "ai" && styles.segmentButtonActive,
              ]}
              onPress={() => setActiveTab("ai")}
            >
              <Ionicons
                name="sparkles-outline"
                size={22}
                color={activeTab === "ai" ? COLORS.text : COLORS.muted}
              />
              <Text
                style={[
                  styles.segmentText,
                  activeTab === "ai" && styles.segmentTextActive,
                ]}
              >
                AI Assistant
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.segmentButton,
                activeTab === "support" && styles.segmentButtonActive,
              ]}
              onPress={() => setActiveTab("support")}
            >
              <Ionicons
                name="headset-outline"
                size={22}
                color={activeTab === "support" ? COLORS.text : COLORS.muted}
              />
              <Text
                style={[
                  styles.segmentText,
                  activeTab === "support" && styles.segmentTextActive,
                ]}
              >
                Customer Support
              </Text>
            </Pressable>
          </View>

          {activeTab === "support" && (
            <View style={styles.supportStatusRow}>
              <View style={styles.supportStatusDot} />
              <Text style={styles.supportStatusText}>{SUPPORT_REPLY_NOTE}</Text>
            </View>
          )}

          <ScrollView
            ref={scrollRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToBottom}
          >
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </ScrollView>

          {activeTab === "ai" && (
            <View style={styles.quickQuestionsWrap}>
              <Text style={styles.quickQuestionsTitle}>Quick questions:</Text>
              <View style={styles.quickQuestionsGrid}>
                {QUICK_QUESTIONS.map((question) => (
                  <Pressable
                    key={question}
                    style={styles.quickQuestionButton}
                    onPress={() => handleQuickQuestion(question)}
                  >
                    <Text style={styles.quickQuestionText}>{question}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View
            style={[
              styles.inputRow,
              { marginBottom: Math.max(insets.bottom, 10) },
            ]}
          >
            {activeTab === "support" && (
              <Pressable style={styles.attachButton} hitSlop={10}>
                <Ionicons
                  name="attach-outline"
                  size={25}
                  color={COLORS.muted}
                />
              </Pressable>
            )}
            <TextInput
              style={styles.messageInput}
              placeholder={inputPlaceholder}
              placeholderTextColor={COLORS.mutedDark}
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="center"
              returnKeyType="send"
              onSubmitEditing={() => handleSendMessage()}
            />
            <Pressable
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="paper-plane-outline"
                size={24}
                color={COLORS.muted}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <BottomNavbar activeTab="ai" />
    </View>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const label = isAssistant
    ? "AI Assistant"
    : message.role === "support"
      ? "Customer Support"
      : "You";
  const iconName: keyof typeof Ionicons.glyphMap = isAssistant
    ? "sparkles-outline"
    : message.role === "support"
      ? "headset-outline"
      : "person-outline";

  return (
    <View style={[styles.messageBubble, isUser && styles.userMessageBubble]}>
      {!isUser && (
        <View style={styles.messageLabelRow}>
          <Ionicons name={iconName} size={21} color={COLORS.primarySoft} />
          <Text style={styles.messageLabel}>{label}</Text>
        </View>
      )}

      <Text style={[styles.messageText, isUser && styles.userMessageText]}>
        {message.text}
      </Text>
      <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>
        {message.createdAtLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 22,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  keyboardArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  segmentWrap: {
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    padding: 6,
    gap: 6,
    marginBottom: 22,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    color: COLORS.muted,
    fontSize: 16,
    fontWeight: "800",
  },
  segmentTextActive: {
    color: COLORS.text,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 18,
    gap: 12,
  },
  supportStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -4,
    marginBottom: 18,
  },
  supportStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#facc15",
  },
  supportStatusText: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 22,
  },
  messageBubble: {
    width: "86%",
    alignSelf: "flex-start",
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userMessageBubble: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    paddingVertical: 14,
  },
  messageLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  messageLabel: {
    color: COLORS.primarySoft,
    fontSize: 15,
    fontWeight: "800",
  },
  messageText: {
    color: COLORS.muted,
    fontSize: 17,
    lineHeight: 28,
  },
  userMessageText: {
    color: COLORS.text,
  },
  messageTime: {
    color: COLORS.mutedDark,
    fontSize: 14,
    marginTop: 12,
  },
  userMessageTime: {
    color: "rgba(255,255,255,0.78)",
  },
  quickQuestionsWrap: {
    paddingTop: 8,
    paddingBottom: 14,
  },
  quickQuestionsTitle: {
    color: COLORS.text,
    fontSize: 17,
    marginBottom: 12,
  },
  quickQuestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickQuestionButton: {
    width: "48%",
    minHeight: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: COLORS.surfaceDark,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  quickQuestionText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  inputRow: {
    minHeight: 62,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: COLORS.input,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 8,
    gap: 8,
  },
  attachButton: {
    width: 34,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  messageInput: {
    flex: 1,
    maxHeight: 100,
    color: COLORS.text,
    fontSize: 18,
    paddingVertical: 12,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
});
