import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, Plus, Loader2, AlertCircle } from "lucide-react";
import {
  deletePost,
  toggleStatus,
  selectPosts,
  selectPostsLoading,
  selectPostsError,
} from "@/features/posts/postsSlice";
import PostForm from "./PostForm";

/** Responsive posts table with inline CRUD actions dispatched to Redux */
export default function PostTable() {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (post) => {
    setEditing(post);
    setFormOpen(true);
  };

  return (
    <section
      id="posts"
      className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-5">
        <div>
          <h2 className="text-base font-semibold">Posts</h2>
          <p className="text-sm text-muted-foreground">Create, edit and publish your content</p>
        </div>
        <button
          onClick={openAdd}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Post
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading posts…
        </div>
      )}

      {!loading && error && (
        <div className="m-5 flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Platform</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    No posts yet. Click “Add Post” to create one.
                  </td>
                </tr>
              )}
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{post.id}</td>
                  <td className="px-5 py-3 font-medium">{post.title}</td>
                  <td className="max-w-xs px-5 py-3 text-muted-foreground">
                    <span className="line-clamp-2">{post.description}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {post.platform}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {/* Clicking the badge dispatches toggleStatus */}
                    <button
                      onClick={() => dispatch(toggleStatus(post.id))}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${
                        post.status === "Published"
                          ? "bg-success/15 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {post.status}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{post.createdAt}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(post)}
                        className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Edit ${post.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => dispatch(deletePost(post.id))}
                        className="rounded-md border border-border p-2 text-destructive transition-colors hover:bg-destructive/10"
                        aria-label={`Delete ${post.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && <PostForm post={editing} onClose={() => setFormOpen(false)} />}
    </section>
  );
}
