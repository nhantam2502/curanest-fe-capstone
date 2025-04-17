"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import NurseScheduleCalendar from "./appointments/page";

const NursePage = () => {
  const { data: session } = useSession();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/nurse");
  }

  return (
    <>
      {/* <div>{session.user.role}</div> */}

<NurseScheduleCalendar/>
      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
    </>
  );
};

export default NursePage;
