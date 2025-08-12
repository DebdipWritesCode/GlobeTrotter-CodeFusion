// src/pages/Community.tsx
import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import api from "@/api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Chat from "@/components/Chat";
import { Send, MessageSquare, Heart, HeartOff, Image, Trash2, Edit, Clock, User, X } from "lucide-react";

Modal.setAppElement("#root");

type CommentT = {
  _id?: string;
  userId: { _id?: string; name?: string } | string;
  comment: string;
  createdAt?: string;
};

type PostT = {
  _id: string;
  userId: { _id?: string; name?: string; avatar?: string } | string;
  tripId?: string | null;
  title?: string;
  content?: string;
  images?: string[];
  likes?: string[]; // array of userId
  comments?: CommentT[];
  createdAt?: string;
};

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) : "—";

const Community: React.FC = () => {
  const currentUser = useSelector((s: RootState) => s.auth);


  const [posts, setPosts] = useState<PostT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // modal / form
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // comments UI
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const commentRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  // chat drawer placeholder
  const [chatOpen, setChatOpen] = useState(false);

  // fetch posts
  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ success: boolean; posts: PostT[] }>("/community"); // GET /community
        if (!mounted) return;
        const sorted = (res.data.posts || []).slice().sort((a: PostT, b: PostT) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0));
        setPosts(sorted);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPosts();
    return () => {
      mounted = false;
    };
  }, []);

  // preview generation
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  // helpers
  const openModal = () => {
    setModalOpen(true);
    setTitle("");
    setContent("");
    setFiles([]);
    setPreviews([]);
  };
  const closeModal = () => setModalOpen(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files ? Array.from(e.target.files) : [];

    setFiles((prev) => [...prev, ...chosen].slice(0, 6)); // limit 6 images
  };

  const removePreview = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };


  const createPost = async () => {
    if (!title.trim() && !content.trim() && files.length === 0) {
      alert("Please add a title, content or at least one image.");
      return;
    }
    setSubmitting(true);

    try {
      // upload images first (if any)
      let uploaded: string[] = [];
      if (files.length > 0) {
        const form = new FormData();
        files.forEach((f) => form.append("files", f));
        // expects backend POST /uploads -> { urls: string[] }
        const upRes = await api.post<{ urls: string[] }>("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
        uploaded = upRes.data.urls || [];
      }

      const payload = {
        title: title.trim(),
        content: content.trim(),
        images: uploaded,
      };

      const res = await api.post<{ success: boolean; post: PostT }>("/community", payload);
      // optimistic: add to top
      setPosts((prev) => [res.data.post, ...prev]);
      closeModal();
    } catch (err) {
      console.error("createPost error", err);
      alert("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  // Like / Unlike
  const toggleLike = async (postId: string) => {
   
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const userId = currentUser?.user_id || "";
        const has = p.likes?.includes(userId);
        return { ...p, likes: has ? p.likes?.filter((l) => l !== userId) : [...(p.likes || []), userId] };
      })
    );

    try {
      await api.post(`/community/${postId}/like`);
    } catch (err) {
      console.error("toggleLike error", err);
     
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
          const userId = currentUser?.user_id || "";
          const has = p.likes?.includes(userId);
          return { ...p, likes: has ? p.likes?.filter((l) => l !== userId) : [...(p.likes || []), userId] };
        })
      );
    }
  };

  // Comment
  const submitComment = async (postId: string) => {
    const commentText = (commentInputs[postId] || "").trim();
    if (!commentText) return;
    const tempComment: CommentT = {
      _id: "tmp-" + Math.random().toString(36).slice(2),
      userId: { _id: currentUser?.user_id || undefined, name: currentUser?.name || "You" },
      comment: commentText,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, comments: [...(p.comments || []), tempComment] } : p)));
    setCommentInputs((s) => ({ ...s, [postId]: "" }));

    try {
      const res = await api.post<{ success: boolean; comments: CommentT[] }>(`/community/${postId}/comment`, { comment: commentText });
      // replace temp comment with server comment
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, comments: res.data.comments } : p))
      );
    } catch (err) {
      console.error("submitComment error", err);
      alert("Failed to post comment");
      // remove temp
      setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, comments: (p.comments || []).filter((c) => !c._id?.startsWith("tmp-")) } : p)));
    }
  };

  // Delete post (owner)
  const deletePost = async (postId: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/community/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("deletePost", err);
      alert("Failed to delete post");
    }
  };

  // Delete comment
  const deleteComment = async (postId: string, commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/community/${postId}/comments/${commentId}`);
      setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, comments: (p.comments || []).filter((c) => c._id !== commentId) } : p)));
    } catch (err) {
      console.error("deleteComment", err);
      alert("Failed to delete comment");
    }
  };

  // small UI components
  const EmptyState = () => (
    <div className="p-12 text-center text-gray-400">
      <MessageSquare className="mx-auto mb-4 w-10 h-10 text-gray-400" />
      <div className="text-lg font-semibold">No posts yet</div>
      <div className="mt-2">Be the first to share your travel story or ask a question.</div>
      <button onClick={openModal} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition text-white">
        <Send className="w-4 h-4" /> Create Post
      </button>
    </div>
  );

  return (
  <div className="min-h-screen bg-background text-foreground p-6">
      {/* Top bar with Chat button */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Community</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setChatOpen((s) => !s)}
            aria-label="Open chat"
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/30 hover:bg-accent/50 transition"
            title="Chat (Socket.io)"
          >
            <MessageSquare className="w-5 h-5 text-cyan-300" />
            <span className="hidden sm:inline text-sm text-gray-200">Chat</span>
            {/* unread badge placeholder */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full ring-2 ring-background" />
          </button>

          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm">New Post</span>
          </button>
        </div>
      </div>

      {/* Chat Drawer (placeholder) */}
      {/* {chatOpen && (
        <aside className="fixed right-4 bottom-20 w-80 h-96 bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-3 z-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-300" />
              <div className="font-semibold">Community Chat</div>
            </div>
            <button onClick={() => setChatOpen(false)} className="p-1 rounded hover:bg-white/5">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 border border-gray-800 rounded p-2 text-sm text-gray-300 overflow-y-auto">
          
            <div className="text-xs text-gray-500 mb-2">Chat will appear here when connected</div>
          </div>

          <div className="mt-2">
            <input placeholder="Type a message..." className="w-full p-2 rounded bg-white/3 border border-gray-800 text-sm outline-none" />
            <button className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-cyan-500 hover:bg-cyan-400">
              <CornerUpRight className="w-4 h-4" /> Send
            </button>
          </div>
        </aside>
      )} */}

      {chatOpen && <Chat onClose={() => setChatOpen(false)} />}

      <main className="max-w-5xl mx-auto">
        {/* Create quick composer */}
        <div className="mb-6">
          <div className="flex gap-3 items-start bg-card/80 border border-border/60 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground">
              {currentUser?.name?.[0] || <User className="w-4 h-4 text-foreground/80" />}
            </div>
            <div className="flex-1">
              <textarea
                rows={2}
                placeholder="Share something with the community..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 rounded-lg bg-background border border-input text-sm text-foreground placeholder-muted-foreground outline-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-accent/50 cursor-pointer">
                    <Image className="w-4 h-4 text-foreground/80" />
                    <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                    <span className="text-xs text-muted-foreground">Add images</span>
                  </label>
                  <button onClick={openModal} className="px-3 py-1 rounded bg-primary hover:bg-primary/90 text-primary-foreground text-sm">Open Composer</button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:inline">Posting as {currentUser?.name ?? "you"}</span>
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                    onClick={createPost}
                  >
                    <Send className="w-4 h-4" /> Post
                  </button>
                </div>
              </div>

              {/* preview thumbnails */}
              {previews.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {previews.map((p, i) => (
                    <div key={p} className="relative w-20 h-14 rounded overflow-hidden border border-border/60">
                      <img src={p} alt={`preview-${i}`} className="w-full h-full object-cover" />
                      <button onClick={() => removePreview(i)} className="absolute top-1 right-1 bg-background/70 rounded p-0.5">
                        <X className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <section className="space-y-6">
          {loading && (
            <div className="space-y-2">
              <div className="h-20 bg-white/2 rounded-md animate-pulse" />
              <div className="h-20 bg-white/2 rounded-md animate-pulse" />
            </div>
          )}

          {error && <div className="text-destructive p-4 bg-card/80 border border-border/60 rounded">{error}</div>}

          {!loading && posts.length === 0 && <EmptyState />}

          {!loading &&
            posts.map((post) => {
              const userId = typeof post.userId === "string" ? post.userId : (post.userId?._id || "");
              const isOwner = !!(currentUser && currentUser.user_id === userId);
              const likedByMe = !!(post.likes || []).includes(currentUser?.user_id || "");

              return (
                <article key={post._id} className="bg-card/80 border border-border/60 rounded-xl p-4">
                  <header className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                      {(
                        typeof post.userId !== "string" && post.userId?.name ? post.userId.name[0] : null
                      ) || <User className="w-5 h-5 text-foreground/80" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-foreground">
                            {typeof post.userId !== "string" ? post.userId?.name || "Anonymous" : "Anonymous"}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isOwner && (
                            <>
                              <button title="Edit" className="p-1 hover:bg-accent/50 rounded" aria-label="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                title="Delete"
                                onClick={() => deletePost(post._id)}
                                className="p-1 hover:bg-accent/50 rounded text-destructive"
                                aria-label="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {post.title && <h3 className="mt-3 font-semibold text-lg text-foreground">{post.title}</h3>}
                      {post.content && <p className="mt-2 text-foreground/90">{post.content}</p>}

                      {/* images grid */}
                      {post.images && post.images.length > 0 && (
                        <div className={`mt-3 grid gap-2 ${post.images.length === 1 ? "grid-cols-1" : post.images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                          {post.images.map((img, i) => (
                            <img key={i} src={img} alt={`post-img-${i}`} className="w-full h-40 object-cover rounded-md border border-border/60" />
                          ))}
                        </div>
                      )}

                      {/* actions */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleLike(post._id)}
                            className="inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-accent/50 transition"
                            aria-pressed={likedByMe}
                          >
                            {likedByMe ? <Heart className="w-5 h-5 text-destructive" /> : <HeartOff className="w-5 h-5 text-foreground/80" />}
                            <span className="text-sm text-muted-foreground">{post.likes?.length || 0}</span>
                          </button>

                          <div className="inline-flex items-center gap-2 px-2 py-1 rounded text-sm text-muted-foreground">
                            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/></svg>
                            <span>{post.comments?.length || 0}</span>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">{/* placeholder for other meta */}</div>
                      </div>

                      {/* comments list */}
                      <div className="mt-3 space-y-2">
                        {(post.comments || []).map((c) => {
                          const cid = c._id || Math.random().toString(36).slice(2);
                          const commentUser: { name?: string; _id?: string } =
                            typeof c.userId === "string" ? { name: "User" } : c.userId || {};
                          const isCommentOwner = !!(
                            currentUser && commentUser?._id && commentUser._id === currentUser.user_id
                          );

                          return (
                            <div key={cid} className="flex items-start gap-3 bg-accent/20 p-2 rounded">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                                {commentUser?.name?.[0] || <User className="w-3 h-3" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <div className="text-sm font-semibold text-foreground">{commentUser?.name || "User"}</div>
                                    <div className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</div>
                                  </div>
                                  {isCommentOwner && (
                                    <button onClick={() => deleteComment(post._id, c._id!)} className="p-1 hover:bg-accent/50 rounded text-destructive" aria-label="Delete comment">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                <div className="mt-1 text-sm text-foreground/90">{c.comment}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* add comment */}
                      <div className="mt-3 flex gap-2">
                        <textarea
                          ref={(el) => {
                            commentRefs.current[post._id] = el;
                          }}
                          value={commentInputs[post._id] || ""}
                          onChange={(e) => setCommentInputs((s) => ({ ...s, [post._id]: e.target.value }))}
                          className="flex-1 p-2 bg-background border border-input rounded-md text-sm text-foreground placeholder-muted-foreground outline-none"
                          placeholder="Write a comment..."
                          rows={1}
                        />
                        <button
                          onClick={() => submitComment(post._id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded bg-primary hover:bg-primary/90 transition text-primary-foreground"
                          aria-label="Post comment"
                        >
                          <Send className="w-4 h-4" /> <span className="hidden sm:inline text-sm">Comment</span>
                        </button>
                      </div>
                    </div>
                  </header>
                </article>
              );
            })}
        </section>
      </main>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className="max-w-3xl w-full mx-auto mt-20 bg-card p-6 rounded-xl shadow-xl outline-none border border-border/60 text-foreground"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Create a Post</h2>
          <button onClick={closeModal} className="p-1 rounded hover:bg-accent/50"><X className="w-4 h-4" /></button>
        </div>

        <label className="text-sm text-muted-foreground block mb-2">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title (optional)" className="w-full p-3 rounded-lg bg-background border border-input text-foreground mb-3" />

        <label className="text-sm text-muted-foreground block mb-2">Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Write up your experience, ask questions, share tips..." className="w-full p-3 rounded-lg bg-background border border-input text-foreground mb-3" />

        <div className="flex items-center gap-3 mb-3">
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded bg-accent/30 cursor-pointer hover:bg-accent/50">
            <Image className="w-5 h-5" />
            <span className="text-sm text-foreground/80">Upload images</span>
            <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
          </label>

          <div className="text-sm text-muted-foreground">Max 6 images — JPG/PNG</div>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {previews.map((p, i) => (
              <div key={p} className="relative w-full h-28 rounded overflow-hidden border border-border/60">
                <img src={p} alt={`preview-${i}`} className="w-full h-full object-cover" />
                <button onClick={() => removePreview(i)} className="absolute -top-2 -right-2 bg-background/70 p-1 rounded-full">
                  <X className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-2">
          <button onClick={closeModal} className="px-4 py-2 rounded bg-muted hover:bg-accent">Cancel</button>
          <button onClick={createPost} disabled={submitting} className="px-4 py-2 rounded bg-primary hover:bg-primary/90 text-primary-foreground">
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Community;
