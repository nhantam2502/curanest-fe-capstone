"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "@/app/admin/post/create-post/PostEditor"; // Import your PostEditor component
import { Post } from "../page"; // Import the Post interface

function CreatePostPage() {
  const router = useRouter();

  const handleSavePost = (newPost: Post) => {
    // Implement your logic to save the new post to your database or API
    console.log("Saving post:", newPost);

    // After saving, you might want to redirect back to the post list
    router.push("/admin/post");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <PostEditor onSave={handleSavePost} onCancel={() => router.back()} post={null} />
    </div>
  );
}

export default CreatePostPage;