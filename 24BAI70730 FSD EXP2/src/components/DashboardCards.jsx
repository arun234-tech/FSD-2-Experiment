import { FileText, Layers, Clock, CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectPosts, selectLastUpdated } from "@/features/posts/postsSlice";
import { selectPlatforms } from "@/features/platforms/platformSlice";

/** Summary metric cards, all values derived from the Redux store */
export default function DashboardCards() {
  const posts = useSelector(selectPosts);
  const platforms = useSelector(selectPlatforms);
  const lastUpdated = useSelector(selectLastUpdated);
  const published = posts.filter((p) => p.status === "Published").length;

  const cards = [
    { label: "Total Posts", value: posts.length, icon: FileText },
    { label: "Total Platforms", value: platforms.length, icon: Layers },
    { label: "Published", value: published, icon: CheckCircle2 },
    { label: "Last Updated", value: lastUpdated ?? "—", icon: Clock },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      ))}
    </div>
  );
}
