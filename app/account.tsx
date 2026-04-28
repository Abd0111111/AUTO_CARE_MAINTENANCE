import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, View,
  Pressable, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserProfile, Post } from '@/context/user-profile-context';
import { BottomNavbar } from '@/components/bottom-navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants/api';

const COLORS = {
  background: '#0d1117',
  surface:    '#161b22',
  border:     '#30363d',
  text:       '#e6edf3',
  muted:      '#8b949e',
  mutedDark:  '#4a5568',
  primary:    '#3b82f6',
  green:      '#22c55e',
};

/* ─────────────── helpers ─────────────── */
function toInitials(fullName?: string | null) {
  const name = (fullName ?? '').trim();
  if (!name) return 'U';
  const parts = name.split(/\s+/);
  return `${parts[0][0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
}

function valueOrFallback(value: string | number | null | undefined, fallback = 'Not set') {
  const text = value === null || value === undefined ? '' : String(value).trim();
  return text ? text : fallback;
}

function formatCreatedAt(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/* ─────────────── InfoRow ─────────────── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

/* ─────────────── API types matching the real response ─────────────── */
interface ApiPost {
  _id: string;
  id?: string;
  createdBy: string;
  content: string;
  status: string;
  attachments: any[];
  tags: any[];
  likes: string[];           // array of userId strings
  availability: string;
  allowComments: string;
  createdAt: string;
  updatedAt: string;
  comments?: ApiComment[];
}

interface ApiComment {
  _id?: string;
  id?: string;
  author: string;
  text: string;
  createdAt?: string;
}

/* ─────────────── normalized post used by the UI ─────────────── */
interface NormalizedPost {
  id: string;
  author: string;
  initials: string;
  vehicle: string;
  createdAtLabel: string;
  content: string;
  likes: number;
  likedByMe: boolean;
  shares: number;
  comments: {
    id: string;
    author: string;
    text: string;
    createdAtLabel: string;
  }[];
}

/* ─────────────── fetchProfile ─────────────── */
const fetchProfile = async () => {
  const token = await AsyncStorage.getItem('access_token');
  const userId = await AsyncStorage.getItem('userId');

  if (!userId) {
    throw new Error('UserId not found in storage');
  }

  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token?.replace(/"/g, '')}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to fetch profile');
  }

  return data?.data;
};

/* ─────────────── normalizePost ─────────────── */
function normalizePost(
  apiPost: ApiPost,
  currentUserId: string,
  authorName: string,
  vehicleName: string,
): NormalizedPost {
  return {
    id: apiPost._id ?? apiPost.id ?? '',
    author: authorName,
    initials: toInitials(authorName),
    vehicle: vehicleName,
    createdAtLabel: formatCreatedAt(apiPost.createdAt),
    content: apiPost.content ?? '',
    // likes is an array of userId strings in the API
    likes: Array.isArray(apiPost.likes) ? apiPost.likes.length : 0,
    likedByMe: Array.isArray(apiPost.likes)
      ? apiPost.likes.includes(currentUserId)
      : false,
    shares: 0,
    comments: (apiPost.comments ?? []).map(c => ({
      id: c._id ?? c.id ?? String(Math.random()),
      author: c.author ?? 'User',
      text: c.text ?? '',
      createdAtLabel: formatCreatedAt(c.createdAt),
    })),
  };
}

/* ─────────────── AccountPostCard ─────────────── */
function AccountPostCard({
  post,
  onToggleLike,
  onAddComment,
  onShare,
}: {
  post: NormalizedPost;
  onToggleLike: () => void;
  onAddComment: (text: string) => void;
  onShare: () => void;
}) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleSend = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
    setCommentsVisible(true);
  };

  const comments = post.comments ?? [];

  return (
    <View style={styles.postCard}>
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.postAvatar}>
          <Text style={styles.postAvatarText}>{post.initials}</Text>
        </View>
        <View>
          <Text style={styles.postAuthor}>{post.author}</Text>
          <View style={styles.postMetaRow}>
            {!!post.vehicle.trim() && (
              <>
                <Text style={styles.postVehicle}>{post.vehicle}</Text>
                <Text style={styles.postDot}>•</Text>
              </>
            )}
            <Text style={styles.postTime}>{post.createdAtLabel}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      <View style={styles.actionsDivider} />

      {/* Actions */}
      <View style={styles.actionsRow}>
        {/* Like */}
        <Pressable style={styles.actionButton} onPress={onToggleLike}>
          <Ionicons
            name={post.likedByMe ? 'heart' : 'heart-outline'}
            size={22}
            color={post.likedByMe ? COLORS.primary : COLORS.muted}
          />
          <Text style={[styles.actionText, post.likedByMe && styles.actionTextActive]}>
            {post.likes}
          </Text>
        </Pressable>

        {/* Comments */}
        <Pressable
          style={styles.actionButton}
          onPress={() => setCommentsVisible(v => !v)}
        >
          <Ionicons name="chatbubble-outline" size={21} color={COLORS.muted} />
          <Text style={styles.actionText}>{comments.length}</Text>
        </Pressable>

        {/* Share — pushed to right */}
        <Pressable style={styles.shareButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={21} color={COLORS.muted} />
          {post.shares > 0 && <Text style={styles.actionText}>{post.shares}</Text>}
        </Pressable>
      </View>

      {/* Comments section */}
      {commentsVisible && (
        <View style={styles.commentsWrap}>
          {comments.slice(-3).map(comment => (
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
            <Pressable style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={18} color={COLORS.text} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

/* ─────────────── handleLogout ─────────────── */
const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    router.replace('/sign-in');
  } catch (err) {
    console.log(err);
  }
};

/* ─────────────── SCREEN ─────────────── */
export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useUserProfile();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [posts, setPosts] = useState<NormalizedPost[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUserId = (await AsyncStorage.getItem('userId')) ?? '';
        const { user, vehicle, stats, posts: apiPosts } = await fetchProfile();

        updateProfile({
          user: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            drivingExperience: user?.drivingExperience ?? null,
          },
          vehicle,
          stats,
          posts: apiPosts || [],
        });

        const authorName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
        const vehicleName = `${vehicle?.brand || ''} ${vehicle?.model || ''}`.trim();

        const normalized: NormalizedPost[] = (apiPosts || []).map((p: ApiPost) =>
          normalizePost(p, currentUserId, authorName, vehicleName)
        );

        setPosts(normalized);
      } catch (err) {
        console.log('Profile Error:', err);
      }
    };

    loadProfile();
  }, []);

  /* ── handlers ── */
  const handleToggleLike = (postId: string) => {
    setPosts(current =>
      current.map(p => {
        if (p.id !== postId) return p;
        const nextLiked = !p.likedByMe;
        return {
          ...p,
          likedByMe: nextLiked,
          likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPosts(current =>
      current.map(p => {
        if (p.id !== postId) return p;
        const newComment = {
          id: `comment-${Date.now()}`,
          author: `${profile?.user?.firstName ?? ''} ${profile?.user?.lastName ?? ''}`.trim() || 'You',
          text: trimmed,
          createdAtLabel: 'Just now',
        };
        return { ...p, comments: [...(p.comments ?? []), newComment] };
      })
    );
  };

  const handleShare = (postId: string) => {
    setPosts(current =>
      current.map(p => p.id !== postId ? p : { ...p, shares: p.shares + 1 })
    );
  };

  const fullName    = `${profile?.user?.firstName || ''} ${profile?.user?.lastName || ''}`.trim();
  const vehicleName = `${profile?.vehicle?.brand || ''} ${profile?.vehicle?.model || ''}`.trim();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Account</Text>

        {/* USER */}
        <View style={styles.card}>
          <View style={styles.identityRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{toInitials(fullName)}</Text>
            </View>

            <View style={styles.identityText}>
              <Text style={styles.name}>{valueOrFallback(fullName, 'User')}</Text>
              <Text style={styles.meta}>{valueOrFallback(profile?.user?.email)}</Text>
              <Text style={styles.meta}>{valueOrFallback(profile?.user?.phone)}</Text>
            </View>

            <Pressable
              onPress={() => setShowLogoutConfirm(true)}
              style={styles.logoutButton}
            >
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{profile?.stats?.followersCount ?? 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{profile?.stats?.followingCount ?? 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{profile?.stats?.postsCount ?? 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
        </View>

        {/* VEHICLE */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <InfoRow label="Brand & Model" value={valueOrFallback(vehicleName)} />
          <InfoRow label="Year"          value={valueOrFallback(profile?.vehicle?.year)} />
          <InfoRow label="Engine"        value={valueOrFallback(profile?.vehicle?.engineCapacity ? `${profile.vehicle.engineCapacity} CC` : '')} />
          <InfoRow label="Mileage"       value={valueOrFallback(profile?.vehicle?.mileage ? `${profile.vehicle.mileage} km` : '')} />
          <InfoRow label="Transmission"  value={valueOrFallback(profile?.vehicle?.transmission)} />
          <InfoRow label="Fuel Type"     value={valueOrFallback(profile?.vehicle?.fuelType)} />
        </View>

        {/* POSTS */}
        <Text style={[styles.sectionTitle, { marginTop: 4 }]}>My Posts</Text>
        {posts.length ? (
          posts.map(post => (
            <AccountPostCard
              key={post.id}
              post={post}
              onToggleLike={() => handleToggleLike(post.id)}
              onAddComment={text => handleAddComment(post.id, text)}
              onShare={() => handleShare(post.id)}
            />
          ))
        ) : (
          <Text style={styles.meta}>No posts yet</Text>
        )}
      </ScrollView>

      {/* Logout modal */}
      {showLogoutConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#30363d' }]}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={{ color: '#fff' }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#ef4444' }]}
                onPress={async () => {
                  setShowLogoutConfirm(false);
                  await handleLogout();
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      <BottomNavbar activeTab="home" />
    </View>
  );
}

/* ─────────────── STYLES ─────────────── */
const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.background },
  header:      { paddingHorizontal: 16, paddingVertical: 8 },
  backButton:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText:    { color: COLORS.text, fontSize: 15 },
  scroll:      { flex: 1 },
  content:     { paddingHorizontal: 20 },
  title:       { color: COLORS.text, fontSize: 30, fontWeight: '700', marginBottom: 14 },

  card: {
    backgroundColor: COLORS.surface, borderWidth: 1,
    borderColor: COLORS.border, borderRadius: 16,
    padding: 14, marginBottom: 14,
  },

  identityRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar:       { width: 56, height: 56, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText:   { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  identityText: { flex: 1 },
  name:         { color: COLORS.text, fontSize: 24, fontWeight: '700' },
  meta:         { color: COLORS.muted, fontSize: 14, marginTop: 2 },

  sectionTitle: { color: COLORS.text, fontSize: 21, fontWeight: '700', marginBottom: 8 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, gap: 10 },
  label:   { color: COLORS.muted, fontSize: 15 },
  value:   { color: COLORS.text, fontSize: 15, fontWeight: '700', flexShrink: 1, textAlign: 'right' },

  statsRow:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  statBox:    { alignItems: 'center', flex: 1 },
  statNumber: { color: COLORS.text, fontSize: 20, fontWeight: '700' },
  statLabel:  { color: COLORS.muted, fontSize: 13, marginTop: 4 },

  // Post card
  postCard: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  postHeader:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  postAvatar:    { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  postAvatarText:{ color: '#fff', fontWeight: '700', fontSize: 15 },
  postAuthor:    { color: COLORS.text, fontWeight: '700', fontSize: 15 },
  postMetaRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  postVehicle:   { color: COLORS.primary, fontSize: 13 },
  postDot:       { color: COLORS.muted, fontSize: 13 },
  postTime:      { color: COLORS.muted, fontSize: 13 },
  postContent:   { color: COLORS.muted, fontSize: 15, lineHeight: 22, marginBottom: 12 },

  actionsDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: 10 },
  actionsRow:     { flexDirection: 'row', alignItems: 'center' },
  actionButton:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginRight: 16 },
  actionText:     { color: COLORS.muted, fontSize: 14 },
  actionTextActive:{ color: COLORS.primary },
  shareButton:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginLeft: 'auto' },

  // Comments
  commentsWrap: { marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  commentItem:  { marginBottom: 10 },
  commentAuthor:{ color: COLORS.text, fontWeight: '700', fontSize: 13 },
  commentText:  { color: COLORS.muted, fontSize: 13, marginTop: 2 },
  commentTime:  { color: COLORS.mutedDark, fontSize: 11, marginTop: 2 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  commentInput: {
    flex: 1, backgroundColor: COLORS.background,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    color: COLORS.text, fontSize: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sendButton: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    padding: 9, justifyContent: 'center', alignItems: 'center',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },

  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#161b22',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e6edf3',
    marginBottom: 8,
  },
  modalText: {
    color: '#8b949e',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});