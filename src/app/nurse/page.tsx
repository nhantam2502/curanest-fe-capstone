'use client'
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react'
import { options } from '../api/auth/[...nextauth]/options';

const NursePage =  () => {
  const { data: session, status } = useSession();
    
    if (!session) {
      redirect("/api/auth/signin?callbackUrl=/nurse");
    }

  return (
    <div>{session.user.role}</div>
  )
}

export default NursePage