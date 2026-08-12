import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { addPost, updatePost } from "@/features/posts/postsSlice";
import { selectPlatforms } from "@/features/platforms/platformSlice";

/** Modal form used for both Add and Edit flows (post === null means add) */
export default function PostForm({ post, onClose }) {
  const dispatch = useDispatch();
  const platforms = useSelector(selectPlatforms);

  const [values, setValues] = useState({
    title: post?.title ?? "",
    description: post?.description ?? "",
    platform: post?.platform ?? platforms[0] ?? "",
    status: post?.status ?? "Draft",
  });
  const [errors, setErrors] = useState({});

  const setField = (field, value) => setValues((prev) => ({ ...prev, [field]: value }));

  /** Simple required-field + min-length validation */
  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = "Title is required";
    else if (values.title.trim().length < 3) next.title = "Title must be at least 3 characters";
    if (!values.description.trim()) next.description = "Description is required";
    if (!values.platform) next.platform = "Platform is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    if (post) dispatch(updatePost({ id: post.id, ...values }));
    else dispatch(addPost(values));

    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-shadow focus:border-ring focus:ring-2 focus:ring-ring/30";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-modal)]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{post ? "Edit Post" : "Add Post"}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className={inputClass}
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Redux Toolkit Guide"
            />
            {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className={inputClass}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Short summary of the post"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="platform">
                Platform
              </label>
              <select
                id="platform"
                className={inputClass}
                value={values.platform}
                onChange={(e) => setField("platform", e.target.value)}
              >
                <option value="">Select platform</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
              {errors.platform && (
                <p className="mt-1 text-xs text-destructive">{errors.platform}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className={inputClass}
                value={values.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {post ? "Save Changes" : "Add Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
