// app/[locale]/ContactSuccessBanner.tsx
"use client";

import { useEffect, useState } from "react";

export default function ContactSuccessBanner({
  message,
  duration = 5000, // ms
}: {
  message: string;
  duration?: number;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const id = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(id);
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <div className="rounded-md border border-green-500 bg-green-50 px-4 py-2 text-sm text-green-800 dark:border-green-600 dark:bg-green-900/40 dark:text-green-100">
      {message}
    </div>
  );
}
