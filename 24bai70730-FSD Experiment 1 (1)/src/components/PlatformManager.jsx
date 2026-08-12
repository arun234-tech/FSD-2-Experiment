import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, X } from "lucide-react";
import { addPlatform, removePlatform, selectPlatforms } from "@/features/platforms/platformSlice";

/** Platform slice demo: add / remove entries from a second reducer */
export default function PlatformManager() {
  const dispatch = useDispatch();
  const platforms = useSelector(selectPlatforms);
  const [name, setName] = useState("");

  const handleAdd = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    dispatch(addPlatform(name));
    setName("");
  };

  return (
    <section
      id="platforms"
      className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
    >
      <h2 className="text-base font-semibold">Platforms</h2>
      <p className="text-sm text-muted-foreground">Managed by a dedicated Redux slice</p>

      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New platform name"
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <ul className="mt-4 flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <li
            key={platform}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 py-1 pl-3 pr-1.5 text-sm"
          >
            {platform}
            <button
              onClick={() => dispatch(removePlatform(platform))}
              className="rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Remove ${platform}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
