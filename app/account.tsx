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

/* ─────────────── InfoRow ─────────────── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

/* ─────────────── AccountPostCard ─────────────── */
function AccountPostCard({
  post,
  onToggleLike,
  onAddComment,
  onShare,
}: {
  post: Post;
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
            <Text style={styles.postVehicle}>{post.vehicle}</Text>
            <Text style={styles.postDot}>•</Text>
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
          <Text style={styles.actionText}>{post.comments.length}</Text>
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
          {post.comments.slice(-3).map((comment: any) => (
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

/* ─────────────── SCREEN ─────────────── */
export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useUserProfile();

  const [posts, setPosts] = useState<Post[]>([]);

  // sync posts from profile
  useEffect(() => {
    if (profile?.posts) setPosts(profile.posts);
  }, [profile?.posts]);

  useEffect(() => {
    const mockData = {
      user: {
        firstName: 'Khaled',
        lastName: 'Ali',
        email: 'khaled@gmail.com',
        phone: '01111111111',
        drivingExperience: 2,
      },
      vehicle: {
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        engineCapacity: 2500,
        mileage: 45000,
        transmission: 'Automatic',
        fuelType: 'Petrol',
      },
      stats: { followersCount: 10, followingCount: 5, postsCount: 3 },
      posts: [
        {
          id: '1',
          initials: 'KA',
          author: 'Khaled Ali',
          vehicle: 'Toyota Camry 2020',
          createdAtLabel: '5h ago',
          content: 'First trip 🚗',
          images: [],
          likes: 8,
          comments: [
            { id: 'c1', author: 'Sara M.', text: 'Nice!', createdAtLabel: '4h ago' },
          ],
          shares: 1,
          likedByMe: false,
        },
        {
          id: '2',
          initials: 'KA',
          author: 'Khaled Ali',
          vehicle: 'Toyota Camry 2020',
          createdAtLabel: '2d ago',
          content: 'Changed oil today ✅',
          images: [],
          likes: 4,
          comments: [],
          shares: 0,
          likedByMe: false,
        },
      ],
    };
    updateProfile(mockData);
  }, []);

  /* ── handlers ── */
  const handleToggleLike = (postId: string) => {
    setPosts(current =>
      current.map(p => {
        if (p.id !== postId) return p;
        const nextLiked = !p.likedByMe;
        return { ...p, likedByMe: nextLiked, likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1) };
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
          author: `${profile?.user?.firstName ?? ''} ${profile?.user?.lastName ?? ''}`.trim(),
          text: trimmed,
          createdAtLabel: 'Now',
        };
        return { ...p, comments: [...p.comments, newComment] };
      })
    );
  };

  const handleShare = (postId: string) => {
    setPosts(current =>
      current.map(p => p.id !== postId ? p : { ...p, shares: p.shares + 1 })
    );
  };

  const fullName    = `${profile?.user?.firstName || ''} ${profile?.user?.lastName || ''}`;
  const vehicleName = `${profile?.vehicle?.brand || ''} ${profile?.vehicle?.model || ''}`;

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
        <Text style={styles.sectionTitle}>My Posts</Text>
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
});