import { Menu, RefreshCw, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, selectPostsLoading } from "@/features/posts/postsSlice";

/** Top navigation bar with a refresh action wired straight to Redux */
export default function Navbar({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectPostsLoading);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
      <button
        onClick={onToggleSidebar}
        className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold tracking-tight md:text-lg">
          Redux Toolkit Post Manager
        </h1>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Centralized state with slices, selectors and thunks
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => dispatch(fetchPosts())}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
        <button
          className="rounded-lg border border-border bg-background p-2 text-muted-foreground hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          RT
        </div>
      </div>
    </header>
  );
}
