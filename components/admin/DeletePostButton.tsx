// Delete button for the admin dashboard.
// It's a Client Component because it needs the browser confirm() dialog.

"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/actions";

export function DeletePostButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;

    startTransition(async () => {
      await deletePost(id);
    });
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Deleting…" : "Delete"}
    </Button>
  );
}
