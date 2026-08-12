import { LayoutDashboard, FileText, Layers, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearPosts, selectPosts } from "@/features/posts/postsSlice";
import { selectPlatforms } from "@/features/platforms/platformSlice";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, section: "dashboard" },
  { label: "Posts", icon: FileText, section: "posts" },
  { label: "Platforms", icon: Layers, section: "platforms" },
];

/** Left sidebar: navigation + a destructive Redux action (clearPosts) */
export default function Sidebar({ open, onClose, active, onNavigate }) {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const platforms = useSelector(selectPlatforms);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            RT
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Post Manager</p>
            <p className="text-xs text-muted-foreground">Redux Toolkit Demo</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 hover:bg-sidebar-accent lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ label, icon: Icon, section }) => (
            <button
              key={section}
              onClick={() => onNavigate(section)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active === section
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {section === "posts" && (
                <span className="ml-auto text-xs opacity-80">{posts.length}</span>
              )}
              {section === "platforms" && (
                <span className="ml-auto text-xs opacity-80">{platforms.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => dispatch(clearPosts())}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Clear all posts
          </button>
        </div>
      </aside>
    </>
  );
}
