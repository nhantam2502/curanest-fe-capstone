"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const NursePage = () => {
  const { data: session } = useSession();
  // console.log("session", session);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/nurse");
  }

  return (
    <>
      <div>{session.user.role}</div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </>
  );
};

export default NursePage;
