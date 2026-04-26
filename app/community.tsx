import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
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
  danger: "#ef4444",
};

type BrandFilter = "All" | "Toyota" | "BMW" | "Honda" | "Kia" | "Ford";
type Availability = "public" | "friends" | "onlyme";
type AllowComments = "allow" | "disable";

type CommunityReply = {
  id: string;
  author: string;
  authorId: string;
  text: string;
  createdAtLabel: string;
};

type CommunityComment = {
  id: string;
  author: string;
  authorId: string;
  text: string;
  createdAtLabel: string;
  replies: CommunityReply[];
};

type CommunityPost = {
  id: string;
  author: string;
  authorId: string;
  initials: string;
  vehicle: string;
  createdAtLabel: string;
  content: string;
  tags: string[];
  allowComments: AllowComments;
  availability: Availability;
  images: string[];
  likes: number;
  comments: CommunityComment[];
  shares: number;
  likedByMe: boolean;
  followedAuthor: boolean;
};

const BRAND_FILTERS: BrandFilter[] = ["All","Toyota","BMW","Honda","Kia","Ford"];
const MY_USER_ID = "me";

const AVAIL_OPTIONS: { value: Availability; label: string; icon: string }[] = [
  { value: "public",  label: "Public",   icon: "globe-outline" },
  { value: "friends", label: "Friends",  icon: "people-outline" },
  { value: "onlyme",  label: "Only Me",  icon: "lock-closed-outline" },
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: "Ahmed K.",
    authorId: "user-1",
    initials: "AK",
    vehicle: "Toyota Camry 2022",
    createdAtLabel: "2h ago",
    content: "Just changed my oil with Castrol 5W-30. Engine feels smoother already! Highly recommend changing every 5,000 km 🔧",
    tags: ["maintenance", "oil"],
    allowComments: "allow",
    availability: "public",
    images: ["https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=1200&q=80"],
    likes: 24,
    comments: [
      { id: "c1", author: "Mona S.", authorId: "user-2", text: "Very useful, thanks!", createdAtLabel: "1h ago", replies: [] },
      { id: "c2", author: "Ali R.",  authorId: "user-3", text: "Did you change the filter too?", createdAtLabel: "40m ago", replies: [] },
    ],
    shares: 2,
    likedByMe: false,
    followedAuthor: false,
  },
  {
    id: "post-2",
    author: "Sara M.",
    authorId: "user-2",
    initials: "SM",
    vehicle: "BMW 320i 2021",
    createdAtLabel: "5h ago",
    content: "Anyone else hearing a squeaking noise when braking at low speed? Happened after the rain yesterday. Should I be worried? 😟",
    tags: ["brakes", "question"],
    allowComments: "allow",
    availability: "public",
    images: [],
    likes: 8,
    comments: [
      { id: "c7", author: "Ahmed K.",  authorId: "user-1", text: "Could be moisture on the pads.", createdAtLabel: "4h ago", replies: [] },
      { id: "c8", author: "Youssef H.", authorId: "user-4", text: "Check the brake pads soon.", createdAtLabel: "3h ago", replies: [] },
    ],
    shares: 1,
    likedByMe: false,
    followedAuthor: false,
  },
  {
    id: "post-3",
    author: "Omar T.",
    authorId: "user-3",
    initials: "OT",
    vehicle: "Honda Civic 2023",
    createdAtLabel: "Yesterday",
    content: "Thinking about switching tires before summer. Any recommendations for daily driving?",
    tags: ["tires", "summer"],
    allowComments: "allow",
    availability: "friends",
    images: [
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    ],
    likes: 51,
    comments: [
      { id: "c21", author: "Sara M.", authorId: "user-2", text: "Michelin is great but pricey.", createdAtLabel: "20h ago", replies: [] },
    ],
    shares: 5,
    likedByMe: false,
    followedAuthor: false,
  },
  {
    id: "post-4",
    author: "Nour R.",
    authorId: "user-4",
    initials: "NR",
    vehicle: "Kia Sportage 2022",
    createdAtLabel: "2 days ago",
    content: "Dashboard warning disappeared after restarting the car. Should I still scan it?",
    tags: ["dashboard", "warning"],
    allowComments: "allow",
    availability: "public",
    images: [],
    likes: 17,
    comments: [
      { id: "c24", author: "Omar T.",  authorId: "user-3", text: "Yes, scan it to be safe.", createdAtLabel: "1d ago", replies: [] },
      { id: "c25", author: "Ahmed K.", authorId: "user-1", text: "Some faults are stored in memory.", createdAtLabel: "1d ago", replies: [] },
    ],
    shares: 0,
    likedByMe: false,
    followedAuthor: false,
  },
];

function getInitials(name: string) {
  const n = name.trim();
  if (!n) return "U";
  const p = n.split(/\s+/);
  return `${p[0][0] ?? ""}${p[1]?.[0] ?? ""}`.toUpperCase();
}
function getUserName(full?: string) { return full?.trim() || "You"; }

/* ════════════════════════════════════════
   SCREEN
════════════════════════════════════════ */
export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useUserProfile();

  const [activeFilter, setActiveFilter] = useState<BrandFilter>("All");
  const [posts, setPosts]               = useState<CommunityPost[]>(INITIAL_POSTS);

  // composer
  const [composerVisible, setComposerVisible] = useState(false);
  const [newPostText, setNewPostText]         = useState("");
  const [newPostBrand, setNewPostBrand]       = useState<BrandFilter>("Toyota");
  const [newPostTags, setNewPostTags]         = useState("");
  const [newPostAllowComments, setNewPostAllowComments] = useState<AllowComments>("allow");
  const [newPostAvailability, setNewPostAvailability]   = useState<Availability>("public");

  // edit post
  const [editPostId, setEditPostId]   = useState<string | null>(null);
  const [editPostText, setEditPostText] = useState("");

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") return posts;
    return posts.filter((p) => p.vehicle.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [activeFilter, posts]);

  /* ── post handlers ── */
  const handleToggleLike   = (id: string) => setPosts((cur) => cur.map((p) => p.id !== id ? p : { ...p, likedByMe: !p.likedByMe, likes: !p.likedByMe ? p.likes + 1 : Math.max(0, p.likes - 1) }));
  const handleToggleFollow = (id: string) => setPosts((cur) => cur.map((p) => p.id !== id ? p : { ...p, followedAuthor: !p.followedAuthor }));
  const handleShare        = (id: string) => setPosts((cur) => cur.map((p) => p.id !== id ? p : { ...p, shares: p.shares + 1 }));

  const handleDeletePost = (id: string) =>
    Alert.alert("Delete Post", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setPosts((cur) => cur.filter((p) => p.id !== id)) },
    ]);

  const handleOpenEditPost = (post: CommunityPost) => { setEditPostId(post.id); setEditPostText(post.content); };
  const handleSaveEditPost = () => {
    if (!editPostId || !editPostText.trim()) return;
    setPosts((cur) => cur.map((p) => p.id !== editPostId ? p : { ...p, content: editPostText.trim() }));
    setEditPostId(null); setEditPostText("");
  };

  /* ── comment handlers ── */
  const handleAddComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const author = getUserName(`${profile.user?.firstName ?? ""} ${profile.user?.lastName ?? ""}`);
    setPosts((cur) => cur.map((p) => p.id !== postId ? p : {
      ...p,
      comments: [...p.comments, { id: `c-${Date.now()}`, author, authorId: MY_USER_ID, text: text.trim(), createdAtLabel: "Now", replies: [] }],
    }));
  };
  const handleEditComment = (postId: string, cId: string, text: string) =>
    setPosts((cur) => cur.map((p) => p.id !== postId ? p : { ...p, comments: p.comments.map((c) => c.id !== cId ? c : { ...c, text }) }));
  const handleDeleteComment = (postId: string, cId: string) =>
    setPosts((cur) => cur.map((p) => p.id !== postId ? p : { ...p, comments: p.comments.filter((c) => c.id !== cId) }));

  /* ── reply handlers ── */
  const handleAddReply = (postId: string, cId: string, text: string) => {
    if (!text.trim()) return;
    const author = getUserName(`${profile.user?.firstName ?? ""} ${profile.user?.lastName ?? ""}`);
    setPosts((cur) => cur.map((p) => p.id !== postId ? p : {
      ...p,
      comments: p.comments.map((c) => c.id !== cId ? c : {
        ...c,
        replies: [...c.replies, { id: `r-${Date.now()}`, author, authorId: MY_USER_ID, text: text.trim(), createdAtLabel: "Now" }],
      }),
    }));
  };
  const handleEditReply = (postId: string, cId: string, rId: string, text: string) =>
    setPosts((cur) => cur.map((p) => p.id !== postId ? p : {
      ...p,
      comments: p.comments.map((c) => c.id !== cId ? c : { ...c, replies: c.replies.map((r) => r.id !== rId ? r : { ...r, text }) }),
    }));
  const handleDeleteReply = (postId: string, cId: string, rId: string) =>
    setPosts((cur) => cur.map((p) => p.id !== postId ? p : {
      ...p,
      comments: p.comments.map((c) => c.id !== cId ? c : { ...c, replies: c.replies.filter((r) => r.id !== rId) }),
    }));

  /* ── create post ── */
  const handleCreatePost = () => {
    const trimmed = newPostText.trim();
    if (!trimmed) return;
    const author = getUserName(`${profile.user?.firstName ?? ""} ${profile.user?.lastName ?? ""}`);
    const vehicle = [profile.vehicle?.brand, profile.vehicle?.model].filter(Boolean).join(" ");
    const tags = newPostTags.split(",").map((t) => t.trim()).filter(Boolean);
    setPosts((cur) => [{
      id: `post-${Date.now()}`, author, authorId: MY_USER_ID,
      initials: getInitials(author),
      vehicle: vehicle || `${newPostBrand} Owner`,
      createdAtLabel: "Now", content: trimmed,
      tags, allowComments: newPostAllowComments, availability: newPostAvailability,
      images: [], likes: 0, comments: [], shares: 0, likedByMe: false, followedAuthor: false,
    }, ...cur]);
    setNewPostText(""); setNewPostTags("");
    setNewPostAllowComments("allow"); setNewPostAvailability("public");
    setComposerVisible(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerIcon} hitSlop={10}>
            <Ionicons name="notifications-outline" size={25} color={COLORS.text} />
          </Pressable>
          <Pressable style={styles.headerIcon} hitSlop={10} onPress={() => router.push("/account")}>
            <Ionicons name="person-outline" size={25} color={COLORS.text} />
          </Pressable>
        </View>
      </View>
      <View style={styles.divider} />

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 108 }]} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.createButton} onPress={() => setComposerVisible(true)}>
          <Ionicons name="add" size={28} color={COLORS.text} />
          <Text style={styles.createButtonText}>Create Post</Text>
        </Pressable>

        {/* filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {BRAND_FILTERS.map((brand) => (
            <Pressable key={brand} style={[styles.filterPill, brand === activeFilter && styles.filterPillActive]} onPress={() => setActiveFilter(brand)}>
              <Text style={[styles.filterText, brand === activeFilter && styles.filterTextActive]}>{brand}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {filteredPosts.length > 0 ? filteredPosts.map((post) => (
          <CommunityPostCard
            key={post.id} post={post} myUserId={MY_USER_ID}
            onToggleLike={()           => handleToggleLike(post.id)}
            onToggleFollow={()         => handleToggleFollow(post.id)}
            onAddComment={(t)          => handleAddComment(post.id, t)}
            onEditComment={(cId, t)    => handleEditComment(post.id, cId, t)}
            onDeleteComment={(cId)     => handleDeleteComment(post.id, cId)}
            onAddReply={(cId, t)       => handleAddReply(post.id, cId, t)}
            onEditReply={(cId, rId, t) => handleEditReply(post.id, cId, rId, t)}
            onDeleteReply={(cId, rId)  => handleDeleteReply(post.id, cId, rId)}
            onShare={()                => handleShare(post.id)}
            onEdit={()                 => handleOpenEditPost(post)}
            onDelete={()               => handleDeletePost(post.id)}
          />
        )) : (
          <View style={styles.emptyCard}>
            <Ionicons name="chatbubbles-outline" size={34} color={COLORS.muted} />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>Be the first one to share a post for {activeFilter} owners.</Text>
          </View>
        )}
      </ScrollView>

      <BottomNavbar activeTab="community" />

      {/* ── CREATE POST MODAL ── */}
      <Modal visible={composerVisible} transparent animationType="slide" onRequestClose={() => setComposerVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setComposerVisible(false)} />
          <View style={[styles.composerSheet, { paddingBottom: insets.bottom + 18 }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Create Post</Text>
              <Pressable style={styles.closeButton} onPress={() => setComposerVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </Pressable>
            </View>
            <View style={styles.composerIdentityRow}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarTextSmall}>{getInitials(getUserName(`${profile.user?.firstName ?? ""} ${profile.user?.lastName ?? ""}`))}</Text>
              </View>
              <View>
                <Text style={styles.composerName}>{getUserName(`${profile.user?.firstName ?? ""} ${profile.user?.lastName ?? ""}`)}</Text>
                <Text style={styles.composerMeta}>Share with community</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* content */}
              <TextInput style={styles.composerInput} placeholder="Write your post..." placeholderTextColor={COLORS.mutedDark} value={newPostText} onChangeText={setNewPostText} multiline textAlignVertical="top" />

              {/* tags */}
              <Text style={styles.sheetLabel}>Tags (comma separated)</Text>
              <TextInput style={styles.tagsInput} placeholder="e.g. oil, maintenance, tips" placeholderTextColor={COLORS.mutedDark} value={newPostTags} onChangeText={setNewPostTags} />

              {/* comments toggle */}
              <Text style={styles.sheetLabel}>Comments</Text>
              <View style={styles.toggleRow}>
                {(["allow", "disable"] as AllowComments[]).map((opt) => (
                  <Pressable key={opt} style={[styles.togglePill, newPostAllowComments === opt && styles.togglePillActive]} onPress={() => setNewPostAllowComments(opt)}>
                    <Ionicons name={opt === "allow" ? "chatbubble-outline" : "chatbubble-ellipses-outline"} size={13} color={newPostAllowComments === opt ? COLORS.text : COLORS.muted} />
                    <Text style={[styles.toggleText, newPostAllowComments === opt && styles.toggleTextActive]}>{opt === "allow" ? "Allow" : "Disable"}</Text>
                  </Pressable>
                ))}
              </View>

              {/* visibility */}
              <Text style={styles.sheetLabel}>Visibility</Text>
              <View style={styles.toggleRow}>
                {AVAIL_OPTIONS.map((opt) => (
                  <Pressable key={opt.value} style={[styles.togglePill, newPostAvailability === opt.value && styles.togglePillActive]} onPress={() => setNewPostAvailability(opt.value)}>
                    <Ionicons name={opt.icon as any} size={13} color={newPostAvailability === opt.value ? COLORS.text : COLORS.muted} />
                    <Text style={[styles.toggleText, newPostAvailability === opt.value && styles.toggleTextActive]}>{opt.label}</Text>
                  </Pressable>
                ))}
              </View>

              {/* car brand */}
              <Text style={styles.sheetLabel}>Car brand</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sheetFiltersRow}>
                {BRAND_FILTERS.filter((b) => b !== "All").map((brand) => (
                  <Pressable key={brand} style={[styles.sheetFilterPill, brand === newPostBrand && styles.filterPillActive]} onPress={() => setNewPostBrand(brand)}>
                    <Text style={[styles.filterText, brand === newPostBrand && styles.filterTextActive]}>{brand}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Pressable style={[styles.publishButton, !newPostText.trim() && styles.publishButtonDisabled]} onPress={handleCreatePost} disabled={!newPostText.trim()}>
                <Text style={styles.publishButtonText}>Publish</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── EDIT POST MODAL ── */}
      <Modal visible={!!editPostId} transparent animationType="slide" onRequestClose={() => setEditPostId(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setEditPostId(null)} />
          <View style={[styles.composerSheet, { paddingBottom: insets.bottom + 18 }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Edit Post</Text>
              <Pressable style={styles.closeButton} onPress={() => setEditPostId(null)} hitSlop={10}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </Pressable>
            </View>
            <TextInput style={styles.composerInput} value={editPostText} onChangeText={setEditPostText} multiline textAlignVertical="top" placeholderTextColor={COLORS.mutedDark} />
            <Pressable style={[styles.publishButton, !editPostText.trim() && styles.publishButtonDisabled]} onPress={handleSaveEditPost} disabled={!editPostText.trim()}>
              <Text style={styles.publishButtonText}>Save Changes</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

/* ════════════════════════════════════════
   POST CARD
════════════════════════════════════════ */
function CommunityPostCard({
  post, myUserId,
  onToggleLike, onToggleFollow,
  onAddComment, onEditComment, onDeleteComment,
  onAddReply, onEditReply, onDeleteReply,
  onShare, onEdit, onDelete,
}: {
  post: CommunityPost; myUserId: string;
  onToggleLike: () => void; onToggleFollow: () => void;
  onAddComment: (t: string) => void;
  onEditComment: (cId: string, t: string) => void;
  onDeleteComment: (cId: string) => void;
  onAddReply: (cId: string, t: string) => void;
  onEditReply: (cId: string, rId: string, t: string) => void;
  onDeleteReply: (cId: string, rId: string) => void;
  onShare: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const isMyPost = post.authorId === myUserId;

  const availIcon = post.availability === "public" ? "globe-outline" : post.availability === "friends" ? "people-outline" : "lock-closed-outline";

  const handlePostOptions = () =>
    Alert.alert("Post Options", undefined, [
      { text: "Edit",   onPress: onEdit },
      { text: "Delete", style: "destructive", onPress: onDelete },
      { text: "Cancel", style: "cancel" },
    ]);

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText(""); setCommentsVisible(true);
  };

  return (
    <View style={styles.postCard}>
      {/* header */}
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.initials}</Text>
        </View>
        <View style={styles.postIdentity}>
          <View style={styles.authorRow}>
            <Text style={styles.author}>{post.author}</Text>
            {!isMyPost && (
              <Pressable style={[styles.followBtn, post.followedAuthor && styles.followBtnActive]} onPress={onToggleFollow}>
                <Ionicons name={post.followedAuthor ? "checkmark" : "person-add-outline"} size={12} color={post.followedAuthor ? COLORS.text : COLORS.primary} />
                <Text style={[styles.followText, post.followedAuthor && styles.followTextActive]}>
                  {post.followedAuthor ? "Following" : "Follow"}
                </Text>
              </Pressable>
            )}
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.vehicle}>{post.vehicle}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.time}>{post.createdAtLabel}</Text>
            <Text style={styles.dot}>•</Text>
            <Ionicons name={availIcon as any} size={12} color={COLORS.mutedDark} />
          </View>
        </View>
        {isMyPost && (
          <Pressable onPress={handlePostOptions} hitSlop={10} style={{ padding: 4 }}>
            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.muted} />
          </Pressable>
        )}
      </View>

      {/* content */}
      <Text style={styles.postText}>{post.content}</Text>

      {/* tags */}
      {post.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {post.tags.map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* images */}
      {post.images.length > 0 && (
        <View style={[styles.imagesGrid, post.images.length > 1 && styles.imagesGridTwo]}>
          {post.images.slice(0, 2).map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.postImage} resizeMode="cover" />
          ))}
        </View>
      )}

      <View style={styles.actionsDivider} />

      {/* actions */}
      <View style={styles.actionsRow}>
        <Pressable style={styles.actionButton} onPress={onToggleLike}>
          <Ionicons name={post.likedByMe ? "heart" : "heart-outline"} size={25} color={post.likedByMe ? COLORS.primary : COLORS.muted} />
          <Text style={[styles.actionText, post.likedByMe && styles.actionTextActive]}>{post.likes}</Text>
        </Pressable>

        {post.allowComments === "allow" && (
          <Pressable style={styles.actionButton} onPress={() => setCommentsVisible((v) => !v)}>
            <Ionicons name="chatbubble-outline" size={24} color={COLORS.muted} />
            <Text style={styles.actionText}>{post.comments.length}</Text>
          </Pressable>
        )}

        <Pressable style={styles.shareButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={24} color={COLORS.muted} />
          {post.shares > 0 && <Text style={styles.shareCount}>{post.shares}</Text>}
        </Pressable>
      </View>

      {/* comments section */}
      {commentsVisible && post.allowComments === "allow" && (
        <View style={styles.commentsWrap}>
          {post.comments.map((comment) => (
            <CommentItem
              key={comment.id} comment={comment} myUserId={myUserId}
              onEdit={(t)         => onEditComment(comment.id, t)}
              onDelete={()        => onDeleteComment(comment.id)}
              onAddReply={(t)     => onAddReply(comment.id, t)}
              onEditReply={(rId, t) => onEditReply(comment.id, rId, t)}
              onDeleteReply={(rId)  => onDeleteReply(comment.id, rId)}
            />
          ))}
          <View style={styles.commentInputRow}>
            <TextInput style={styles.commentInput} placeholder="Write a comment..." placeholderTextColor={COLORS.mutedDark} value={commentText} onChangeText={setCommentText} multiline />
            <Pressable style={styles.sendButton} onPress={handleSendComment}>
              <Ionicons name="send" size={18} color={COLORS.text} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

/* ════════════════════════════════════════
   COMMENT ITEM
════════════════════════════════════════ */
function CommentItem({
  comment, myUserId, onEdit, onDelete, onAddReply, onEditReply, onDeleteReply,
}: {
  comment: CommunityComment; myUserId: string;
  onEdit: (t: string) => void; onDelete: () => void;
  onAddReply: (t: string) => void;
  onEditReply: (rId: string, t: string) => void;
  onDeleteReply: (rId: string) => void;
}) {
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing]     = useState(false);
  const [editText, setEditText]   = useState(comment.text);
  const isMyComment = comment.authorId === myUserId;

  const handleOptions = () =>
    Alert.alert("Comment", undefined, [
      { text: "Edit",   onPress: () => { setEditText(comment.text); setEditing(true); } },
      { text: "Delete", style: "destructive", onPress: onDelete },
      { text: "Cancel", style: "cancel" },
    ]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onAddReply(replyText);
    setReplyText(""); setRepliesVisible(true);
  };

  return (
    <View style={styles.commentItem}>
      {editing ? (
        <View>
          <TextInput style={styles.editInput} value={editText} onChangeText={setEditText} multiline placeholderTextColor={COLORS.mutedDark} />
          <View style={styles.editActions}>
            <Pressable onPress={() => setEditing(false)}><Text style={styles.cancelEditText}>Cancel</Text></Pressable>
            <Pressable style={styles.saveEditBtn} onPress={() => { onEdit(editText); setEditing(false); }}>
              <Text style={styles.saveEditText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{comment.author}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={styles.commentTime}>{comment.createdAtLabel}</Text>
              {isMyComment && (
                <Pressable onPress={handleOptions} hitSlop={8}>
                  <Ionicons name="ellipsis-horizontal" size={16} color={COLORS.mutedDark} />
                </Pressable>
              )}
            </View>
          </View>
          <Text style={styles.commentText}>{comment.text}</Text>

          {/* reply trigger */}
          <Pressable style={styles.replyTrigger} onPress={() => setRepliesVisible((v) => !v)}>
            <Ionicons name="return-down-forward-outline" size={13} color={COLORS.primary} />
            <Text style={styles.replyTriggerText}>
              {repliesVisible ? "Hide replies" : `Reply${comment.replies.length > 0 ? ` (${comment.replies.length})` : ""}`}
            </Text>
          </Pressable>
        </>
      )}

      {/* replies */}
      {repliesVisible && (
        <View style={styles.repliesWrap}>
          {comment.replies.map((reply) => (
            <ReplyItem
              key={reply.id} reply={reply} myUserId={myUserId}
              onEdit={(t) => onEditReply(reply.id, t)}
              onDelete={() => onDeleteReply(reply.id)}
            />
          ))}
          <View style={styles.commentInputRow}>
            <TextInput style={styles.commentInput} placeholder="Write a reply..." placeholderTextColor={COLORS.mutedDark} value={replyText} onChangeText={setReplyText} multiline />
            <Pressable style={styles.sendButton} onPress={handleSendReply}>
              <Ionicons name="send" size={16} color={COLORS.text} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

/* ════════════════════════════════════════
   REPLY ITEM
════════════════════════════════════════ */
function ReplyItem({ reply, myUserId, onEdit, onDelete }: {
  reply: CommunityReply; myUserId: string;
  onEdit: (t: string) => void; onDelete: () => void;
}) {
  const [editing, setEditing]   = useState(false);
  const [editText, setEditText] = useState(reply.text);
  const isMyReply = reply.authorId === myUserId;

  const handleOptions = () =>
    Alert.alert("Reply", undefined, [
      { text: "Edit",   onPress: () => { setEditText(reply.text); setEditing(true); } },
      { text: "Delete", style: "destructive", onPress: onDelete },
      { text: "Cancel", style: "cancel" },
    ]);

  return (
    <View style={styles.replyItem}>
      {editing ? (
        <View>
          <TextInput style={styles.editInput} value={editText} onChangeText={setEditText} multiline placeholderTextColor={COLORS.mutedDark} />
          <View style={styles.editActions}>
            <Pressable onPress={() => setEditing(false)}><Text style={styles.cancelEditText}>Cancel</Text></Pressable>
            <Pressable style={styles.saveEditBtn} onPress={() => { onEdit(editText); setEditing(false); }}>
              <Text style={styles.saveEditText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{reply.author}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={styles.commentTime}>{reply.createdAtLabel}</Text>
              {isMyReply && (
                <Pressable onPress={handleOptions} hitSlop={8}>
                  <Ionicons name="ellipsis-horizontal" size={14} color={COLORS.mutedDark} />
                </Pressable>
              )}
            </View>
          </View>
          <Text style={styles.commentText}>{reply.text}</Text>
        </>
      )}
    </View>
  );
}

/* ════════════════════════════════════════
   STYLES
════════════════════════════════════════ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 22, paddingBottom: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: COLORS.text, fontSize: 24, fontWeight: "800" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 16 },
  headerIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  divider: { height: 1, backgroundColor: COLORS.divider },
  scroll: { flex: 1 },
  content: { paddingTop: 20, paddingHorizontal: 20 },

  createButton: { height: 60, borderRadius: 17, backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 },
  createButtonText: { color: COLORS.text, fontSize: 17, fontWeight: "700" },

  filtersRow: { gap: 10, paddingBottom: 20 },
  filterPill: { minWidth: 68, height: 46, borderRadius: 23, paddingHorizontal: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.46)", alignItems: "center", justifyContent: "center" },
  filterPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.muted, fontSize: 15, fontWeight: "700" },
  filterTextActive: { color: COLORS.text },

  // post card
  postCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 18, marginBottom: 16 },
  postHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: COLORS.text, fontSize: 18, fontWeight: "800" },
  postIdentity: { flex: 1 },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  author: { color: COLORS.text, fontSize: 16, fontWeight: "800" },

  followBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary },
  followBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  followText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },
  followTextActive: { color: COLORS.text },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" },
  vehicle: { color: "#5da0ff", fontSize: 14 },
  dot: { color: COLORS.mutedDark, fontSize: 14 },
  time: { color: COLORS.mutedDark, fontSize: 14 },

  postText: { color: COLORS.muted, fontSize: 17, lineHeight: 28, marginBottom: 12 },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  tagPill: { backgroundColor: COLORS.surfaceLight, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },

  imagesGrid: { width: "100%", height: 210, borderRadius: 12, overflow: "hidden", marginBottom: 16 },
  imagesGridTwo: { flexDirection: "row", gap: 8 },
  postImage: { flex: 1, width: "100%", height: "100%", backgroundColor: COLORS.input, borderRadius: 12 },

  actionsDivider: { height: 1, backgroundColor: COLORS.divider, marginBottom: 14 },
  actionsRow: { flexDirection: "row", alignItems: "center" },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 8, marginRight: 26 },
  actionText: { color: COLORS.muted, fontSize: 16 },
  actionTextActive: { color: COLORS.primary, fontWeight: "700" },
  shareButton: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 5 },
  shareCount: { color: COLORS.muted, fontSize: 14 },

  // comments
  commentsWrap: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.divider, gap: 10 },
  commentItem: { backgroundColor: COLORS.surfaceLight, borderRadius: 12, padding: 10, gap: 6 },
  commentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  commentAuthor: { color: COLORS.text, fontSize: 13, fontWeight: "700" },
  commentText: { color: COLORS.muted, fontSize: 14, lineHeight: 20 },
  commentTime: { color: COLORS.mutedDark, fontSize: 11 },

  replyTrigger: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  replyTriggerText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },

  repliesWrap: { marginTop: 8, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: COLORS.primary, gap: 8 },
  replyItem: { backgroundColor: COLORS.input, borderRadius: 10, padding: 8, gap: 4 },

  editInput: { backgroundColor: COLORS.input, borderRadius: 10, padding: 10, color: COLORS.text, fontSize: 14, minHeight: 60, marginBottom: 8 },
  editActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancelEditText: { color: COLORS.muted, fontSize: 13, fontWeight: "700", paddingVertical: 6 },
  saveEditBtn: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 6 },
  saveEditText: { color: COLORS.text, fontSize: 13, fontWeight: "700" },

  commentInputRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginTop: 4 },
  commentInput: { flex: 1, minHeight: 42, maxHeight: 92, borderRadius: 14, backgroundColor: COLORS.input, color: COLORS.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  sendButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },

  emptyCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 22, alignItems: "center", gap: 8 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: "800" },
  emptyText: { color: COLORS.muted, fontSize: 14, textAlign: "center", lineHeight: 20 },

  // modals
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.58)" },
  composerSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingTop: 18, borderWidth: 1, borderColor: COLORS.border, maxHeight: "90%" },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  sheetTitle: { color: COLORS.text, fontSize: 22, fontWeight: "800" },
  closeButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.input, alignItems: "center", justifyContent: "center" },
  composerIdentityRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  avatarSmall: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  avatarTextSmall: { color: COLORS.text, fontSize: 14, fontWeight: "800" },
  composerName: { color: COLORS.text, fontSize: 15, fontWeight: "800" },
  composerMeta: { color: COLORS.mutedDark, fontSize: 13, marginTop: 2 },
  composerInput: { minHeight: 120, borderRadius: 16, backgroundColor: COLORS.input, color: COLORS.text, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, lineHeight: 23, marginBottom: 14 },

  sheetLabel: { color: COLORS.muted, fontSize: 14, fontWeight: "700", marginBottom: 10 },
  tagsInput: { height: 44, borderRadius: 12, backgroundColor: COLORS.input, color: COLORS.text, paddingHorizontal: 12, fontSize: 14, marginBottom: 14 },
  toggleRow: { flexDirection: "row", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  togglePill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  togglePillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  toggleText: { color: COLORS.muted, fontSize: 13, fontWeight: "700" },
  toggleTextActive: { color: COLORS.text },

  sheetFiltersRow: { gap: 10, paddingBottom: 16 },
  sheetFilterPill: { height: 40, borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", alignItems: "center", justifyContent: "center" },
  publishButton: { height: 54, borderRadius: 17, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  publishButtonDisabled: { opacity: 0.45 },
  publishButtonText: { color: COLORS.text, fontSize: 17, fontWeight: "800" },
});