import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Modal,
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
  surfaceLight: "#172b44",
  border: "rgba(255,255,255,0.07)",
  divider: "rgba(255,255,255,0.06)",
  text: "#f8fafc",
  muted: "#aebbd0",
  mutedDark: "#74849a",
  primary: "#3268f7",
  primarySoft: "#1e4fd6",
  input: "#0f1f34",
};

type BrandFilter = "All" | "Toyota" | "BMW" | "Honda" | "Kia" | "Ford";

type CommunityComment = {
  id: string;
  author: string;
  text: string;
  createdAtLabel: string;
};

type CommunityPost = {
  id: string;
  author: string;
  initials: string;
  vehicle: string;
  createdAtLabel: string;
  content: string;
  images: string[];
  likes: number;
  comments: CommunityComment[];
  shares: number;
  likedByMe: boolean;
};

const BRAND_FILTERS: BrandFilter[] = [
  "All",
  "Toyota",
  "BMW",
  "Honda",
  "Kia",
  "Ford",
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: "Ahmed K.",
    initials: "AK",
    vehicle: "Toyota Camry 2022",
    createdAtLabel: "2h ago",
    content:
      "Just changed my oil with Castrol 5W-30. Engine feels smoother already! Highly recommend changing every 5,000 km 🔧",
    images: [
      "https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=1200&q=80",
    ],
    likes: 24,
    comments: [
      {
        id: "comment-1",
        author: "Mona S.",
        text: "Very useful, thanks!",
        createdAtLabel: "1h ago",
      },
      {
        id: "comment-2",
        author: "Ali R.",
        text: "Did you change the filter too?",
        createdAtLabel: "40m ago",
      },
      {
        id: "comment-3",
        author: "Sara M.",
        text: "I use the same oil.",
        createdAtLabel: "20m ago",
      },
      {
        id: "comment-4",
        author: "Omar T.",
        text: "Great tip.",
        createdAtLabel: "10m ago",
      },
      {
        id: "comment-5",
        author: "Nour R.",
        text: "Will try it next service.",
        createdAtLabel: "5m ago",
      },
      {
        id: "comment-6",
        author: "Khaled A.",
        text: "How much did it cost?",
        createdAtLabel: "2m ago",
      },
    ],
    shares: 2,
    likedByMe: false,
  },
  {
    id: "post-2",
    author: "Sara M.",
    initials: "SM",
    vehicle: "BMW 320i 2021",
    createdAtLabel: "5h ago",
    content:
      "Anyone else hearing a squeaking noise when braking at low speed? Happened after the rain yesterday. Should I be worried? 😟",
    images: [],
    likes: 8,
    comments: [
      {
        id: "comment-7",
        author: "Ahmed K.",
        text: "Could be moisture on the pads.",
        createdAtLabel: "4h ago",
      },
      {
        id: "comment-8",
        author: "Youssef H.",
        text: "Check the brake pads soon.",
        createdAtLabel: "3h ago",
      },
      {
        id: "comment-9",
        author: "Nour R.",
        text: "It happened to me before.",
        createdAtLabel: "2h ago",
      },
      {
        id: "comment-10",
        author: "Omar T.",
        text: "If it continues, visit a mechanic.",
        createdAtLabel: "1h ago",
      },
      {
        id: "comment-11",
        author: "Ali R.",
        text: "Rain can make it temporary.",
        createdAtLabel: "30m ago",
      },
      {
        id: "comment-12",
        author: "Mona S.",
        text: "Better to inspect it.",
        createdAtLabel: "10m ago",
      },
      {
        id: "comment-13",
        author: "Khaled A.",
        text: "Same with my car.",
        createdAtLabel: "5m ago",
      },
      {
        id: "comment-14",
        author: "Hana M.",
        text: "Let us know what happens.",
        createdAtLabel: "1m ago",
      },
      {
        id: "comment-15",
        author: "Ziad F.",
        text: "Could be dust too.",
        createdAtLabel: "Now",
      },
      {
        id: "comment-16",
        author: "Farah N.",
        text: "Try cleaning the brakes.",
        createdAtLabel: "Now",
      },
      {
        id: "comment-17",
        author: "Mostafa A.",
        text: "Do not ignore brakes.",
        createdAtLabel: "Now",
      },
      {
        id: "comment-18",
        author: "Laila S.",
        text: "I agree with checking pads.",
        createdAtLabel: "Now",
      },
      {
        id: "comment-19",
        author: "Hossam G.",
        text: "Maybe rotor surface rust.",
        createdAtLabel: "Now",
      },
      {
        id: "comment-20",
        author: "Nada E.",
        text: "Mechanic can confirm quickly.",
        createdAtLabel: "Now",
      },
    ],
    shares: 1,
    likedByMe: false,
  },
  {
    id: "post-3",
    author: "Omar T.",
    initials: "OT",
    vehicle: "Honda Civic 2023",
    createdAtLabel: "Yesterday",
    content:
      "Thinking about switching tires before summer. Any recommendations for daily driving?",
    images: [
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    ],
    likes: 51,
    comments: [
      {
        id: "comment-21",
        author: "Sara M.",
        text: "Michelin is great but pricey.",
        createdAtLabel: "20h ago",
      },
      {
        id: "comment-22",
        author: "Ahmed K.",
        text: "Check Bridgestone too.",
        createdAtLabel: "12h ago",
      },
      {
        id: "comment-23",
        author: "Nour R.",
        text: "Depends on your budget.",
        createdAtLabel: "10h ago",
      },
    ],
    shares: 5,
    likedByMe: false,
  },
  {
    id: "post-4",
    author: "Nour R.",
    initials: "NR",
    vehicle: "Kia Sportage 2022",
    createdAtLabel: "2 days ago",
    content:
      "Dashboard warning disappeared after restarting the car. Should I still scan it?",
    images: [],
    likes: 17,
    comments: [
      {
        id: "comment-24",
        author: "Omar T.",
        text: "Yes, scan it to be safe.",
        createdAtLabel: "1d ago",
      },
      {
        id: "comment-25",
        author: "Ahmed K.",
        text: "Some faults are stored in memory.",
        createdAtLabel: "1d ago",
      },
    ],
    shares: 0,
    likedByMe: false,
  },
];

function getInitials(name: string) {
  const cleanName = name.trim();
  if (!cleanName) return "U";
  const parts = cleanName.split(/\s+/);
  return `${parts[0][0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

function getUserName(fullName?: string) {
  return fullName?.trim() || "You";
}

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useUserProfile();
  const [activeFilter, setActiveFilter] = useState<BrandFilter>("All");
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [composerVisible, setComposerVisible] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostBrand, setNewPostBrand] = useState<BrandFilter>("Toyota");

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") return posts;
    return posts.filter((post) =>
      post.vehicle.toLowerCase().includes(activeFilter.toLowerCase()),
    );
  }, [activeFilter, posts]);

  const handleToggleLike = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post;
        const nextLiked = !post.likedByMe;

        // TODO: Replace this local update with POST /community/posts/:id/reactions.
        return {
          ...post,
          likedByMe: nextLiked,
          likes: nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
        };
      }),
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post;

        // TODO: Replace this local update with POST /community/posts/:id/comments.
        const nextComment: CommunityComment = {
          id: `comment-${Date.now()}`,
          author: getUserName(`${profile.user?.firstName ?? ""} ${profile.user?.lastName ?? ""}`),
          text: trimmedText,
          createdAtLabel: "Now",
        };

        return { ...post, comments: [...post.comments, nextComment] };
      }),
    );
  };

  const handleSharePost = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) return post;

        // TODO: Replace this local update with POST /community/posts/:id/share.
        return { ...post, shares: post.shares + 1 };
      }),
    );
  };

  const handleCreatePost = () => {
    const trimmedText = newPostText.trim();
    if (!trimmedText) return;

    const userName = getUserName(`${profile.user?.firstName ?? ""} ${profile.user?.lastName ?? ""}`);
    const vehicleName = [profile.vehicle?.brand, profile.vehicle?.model]
      .filter(Boolean)
      .join(" ");

    // TODO: Replace this local update with POST /community/posts.
    const nextPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: userName,
      initials: getInitials(userName),
      vehicle: vehicleName || `${newPostBrand} Owner`,
      createdAtLabel: "Now",
      content: trimmedText,
      images: [],
      likes: 0,
      comments: [],
      shares: 0,
      likedByMe: false,
    };

    setPosts((currentPosts) => [nextPost, ...currentPosts]);
    setNewPostText("");
    setComposerVisible(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>

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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 108 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.createButton}
          onPress={() => setComposerVisible(true)}
        >
          <Ionicons name="add" size={28} color={COLORS.text} />
          <Text style={styles.createButtonText}>Create Post</Text>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {BRAND_FILTERS.map((brand) => {
            const active = brand === activeFilter;
            return (
              <Pressable
                key={brand}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setActiveFilter(brand)}
              >
                <Text
                  style={[styles.filterText, active && styles.filterTextActive]}
                >
                  {brand}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              onToggleLike={() => handleToggleLike(post.id)}
              onAddComment={(text) => handleAddComment(post.id, text)}
              onShare={() => handleSharePost(post.id)}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons
              name="chatbubbles-outline"
              size={34}
              color={COLORS.muted}
            />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>
              Be the first one to share a post for {activeFilter} owners.
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNavbar activeTab="community" />

      <Modal
        visible={composerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setComposerVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setComposerVisible(false)}
          />
          <View
            style={[
              styles.composerSheet,
              { paddingBottom: insets.bottom + 18 },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Create Post</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setComposerVisible(false)}
                hitSlop={10}
              >
                <Ionicons name="close" size={22} color={COLORS.text} />
              </Pressable>
            </View>

            <View style={styles.composerIdentityRow}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarTextSmall}>
                  {getInitials(getUserName(`${profile.user?.firstName ?? ""} ${profile.user?.lastName ?? ""}`))}
                </Text>
              </View>
              <View>
                <Text style={styles.composerName}>
                  {getUserName(`${profile.user?.firstName ?? ""} ${profile.user?.lastName ?? ""}`)}
                </Text>
                <Text style={styles.composerMeta}>Share with community</Text>
              </View>
            </View>

            <TextInput
              style={styles.composerInput}
              placeholder="Write your post..."
              placeholderTextColor={COLORS.mutedDark}
              value={newPostText}
              onChangeText={setNewPostText}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.brandLabel}>Car brand</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sheetFiltersRow}
            >
              {BRAND_FILTERS.filter((brand) => brand !== "All").map((brand) => {
                const active = brand === newPostBrand;
                return (
                  <Pressable
                    key={brand}
                    style={[
                      styles.sheetFilterPill,
                      active && styles.filterPillActive,
                    ]}
                    onPress={() => setNewPostBrand(brand)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {brand}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              style={[
                styles.publishButton,
                !newPostText.trim() && styles.publishButtonDisabled,
              ]}
              onPress={handleCreatePost}
              disabled={!newPostText.trim()}
            >
              <Text style={styles.publishButtonText}>Publish</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function CommunityPostCard({
  post,
  onToggleLike,
  onAddComment,
  onShare,
}: {
  post: CommunityPost;
  onToggleLike: () => void;
  onAddComment: (text: string) => void;
  onShare: () => void;
}) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText("");
    setCommentsVisible(true);
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.initials}</Text>
        </View>
        <View style={styles.postIdentity}>
          <Text style={styles.author}>{post.author}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.vehicle}>{post.vehicle}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.time}>{post.createdAtLabel}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.postText}>{post.content}</Text>

      {post.images.length > 0 && (
        <View
          style={[
            styles.imagesGrid,
            post.images.length > 1 && styles.imagesGridTwo,
          ]}
        >
          {post.images.slice(0, 2).map((imageUri) => (
            <Image
              key={imageUri}
              source={{ uri: imageUri }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      <View style={styles.actionsDivider} />

      <View style={styles.actionsRow}>
        <Pressable style={styles.actionButton} onPress={onToggleLike}>
          <Ionicons
            name={post.likedByMe ? "heart" : "heart-outline"}
            size={25}
            color={post.likedByMe ? COLORS.primary : COLORS.muted}
          />
          <Text
            style={[
              styles.actionText,
              post.likedByMe && styles.actionTextActive,
            ]}
          >
            {post.likes}
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => setCommentsVisible((visible) => !visible)}
        >
          <Ionicons name="chatbubble-outline" size={24} color={COLORS.muted} />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </Pressable>

        <Pressable style={styles.shareButton} onPress={onShare}>
          <Ionicons
            name="share-social-outline"
            size={24}
            color={COLORS.muted}
          />
          {post.shares > 0 && (
            <Text style={styles.shareCount}>{post.shares}</Text>
          )}
        </Pressable>
      </View>

      {commentsVisible && (
        <View style={styles.commentsWrap}>
          {post.comments.slice(-3).map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Text style={styles.commentAuthor}>{comment.author}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
              <Text style={styles.commentTime}>{comment.createdAtLabel}</Text>
            </View>
          ))}

          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              placeholderTextColor={COLORS.mutedDark}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <Pressable style={styles.sendButton} onPress={handleSendComment}>
              <Ionicons name="send" size={18} color={COLORS.text} />
            </Pressable>
          </View>
        </View>
      )}
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  createButton: {
    height: 60,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  createButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },
  filtersRow: {
    gap: 10,
    paddingBottom: 20,
  },
  filterPill: {
    minWidth: 68,
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.46)",
    alignItems: "center",
    justifyContent: "center",
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: "700",
  },
  filterTextActive: {
    color: COLORS.text,
  },
  postCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  postIdentity: {
    flex: 1,
  },
  author: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  vehicle: {
    color: "#5da0ff",
    fontSize: 14,
  },
  dot: {
    color: COLORS.mutedDark,
    fontSize: 14,
  },
  time: {
    color: COLORS.mutedDark,
    fontSize: 14,
  },
  postText: {
    color: COLORS.muted,
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 18,
  },
  imagesGrid: {
    width: "100%",
    height: 210,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  imagesGridTwo: {
    flexDirection: "row",
    gap: 8,
  },
  postImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.input,
    borderRadius: 12,
  },
  actionsDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 26,
  },
  actionText: {
    color: COLORS.muted,
    fontSize: 16,
  },
  actionTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  shareButton: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  shareCount: {
    color: COLORS.muted,
    fontSize: 14,
  },
  commentsWrap: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: 10,
  },
  commentItem: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 10,
  },
  commentAuthor: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },
  commentText: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  commentTime: {
    color: COLORS.mutedDark,
    fontSize: 11,
    marginTop: 4,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 92,
    borderRadius: 14,
    backgroundColor: COLORS.input,
    color: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.58)",
  },
  composerSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sheetTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.input,
    alignItems: "center",
    justifyContent: "center",
  },
  composerIdentityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  avatarSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTextSmall: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },
  composerName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },
  composerMeta: {
    color: COLORS.mutedDark,
    fontSize: 13,
    marginTop: 2,
  },
  composerInput: {
    minHeight: 120,
    borderRadius: 16,
    backgroundColor: COLORS.input,
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 14,
  },
  brandLabel: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  sheetFiltersRow: {
    gap: 10,
    paddingBottom: 16,
  },
  sheetFilterPill: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  publishButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  publishButtonDisabled: {
    opacity: 0.45,
  },
  publishButtonText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },
});