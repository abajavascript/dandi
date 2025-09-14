"use client";

import { useSession } from "next-auth/react";

export default function SessionDebug() {
  const { data: session, status } = useSession();

  if (process.env.NODE_ENV !== "development") {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm overflow-auto max-h-60 opacity-80 hover:opacity-100 transition-opacity z-50">
      <h4 className="font-bold text-green-400 mb-2">🔍 Session Debug</h4>
      <div className="space-y-1">
        <p>
          <strong>Status:</strong>{" "}
          <span className="text-yellow-300">{status}</span>
        </p>
        {session && (
          <>
            <p>
              <strong>User ID:</strong>{" "}
              <span className="text-blue-300">{session.user?.id}</span>
            </p>
            <p>
              <strong>Name:</strong>{" "}
              <span className="text-blue-300">{session.user?.name}</span>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <span className="text-blue-300">{session.user?.email}</span>
            </p>
            <p>
              <strong>Image URL:</strong>
            </p>
            <p className="text-green-300 break-all text-xs">
              {session.user?.image ? session.user.image : "❌ No image URL"}
            </p>
          </>
        )}
        {!session && status !== "loading" && (
          <p className="text-red-300">Not authenticated</p>
        )}
      </div>
    </div>
  );
}
