import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DashboardCards from "@/components/DashboardCards";
import PostTable from "@/components/PostTable";
import PlatformManager from "@/components/PlatformManager";
import { fetchPosts, selectPosts } from "@/features/posts/postsSlice";

/** Dashboard page: composes the layout, loads posts via the mock API thunk */
export default function Dashboard() {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("dashboard");

  // Load sample posts once on mount through createAsyncThunk
  useEffect(() => {
    if (posts.length === 0) dispatch(fetchPosts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleNavigate = (section) => {
    setActive(section);
    setSidebarOpen(false);
    if (section !== "dashboard") {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        active={active}
        onNavigate={handleNavigate}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 space-y-6 p-4 md:p-6">
          <DashboardCards />
          <PostTable />
          <PlatformManager />
        </main>
      </div>
    </div>
  );
}
