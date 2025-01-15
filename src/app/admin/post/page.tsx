"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PostFilter from "./PostFilter";
import { Switch } from "@/components/ui/switch";

export interface Post {
  id: number;
  title: string;
  content: string;
  status: "published" | "draft";
  createdAt: Date;
}

const initialPosts: Post[] = [
  {
    id: 1,
    title: "First Post",
    content: "This is the content of the first post.",
    status: "published",
    createdAt: new Date(2023, 10, 15),
  },
  {
    id: 2,
    title: "Second Post",
    content: "Content for the second post goes here.",
    status: "draft",
    createdAt: new Date(2023, 10, 20),
  },
];

function PostPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const router = useRouter(); // Initialize useRouter
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);

  const handleNewPost = () => {
    router.push("/admin/post/create-post"); // Route to create-post page
  };

  const handleEditPost = (post: Post) => {
    // You might want to pass the post ID in the URL for editing
    router.push(`/admin/post/edit/${post.id}`);
  };

  const handleDeletePost = (postId: number) => {
    // Replace with your actual delete logic (e.g., API call)
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý bài đăng</h1>
        <Button onClick={handleNewPost}>Tạo</Button>
      </div>
      <PostFilter posts={posts} setFilteredPosts={setFilteredPosts} />
      {/* Post Table */}
      <Table className="w-full border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead className="w-[150px]">Trạng thái</TableHead>
            <TableHead className="w-[200px]">Ngày tạo</TableHead>
            <TableHead className="text-right w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="hover:bg-gray-50">
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.status}</TableCell>
              <TableCell>
                {post.createdAt.toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditPost(post)}
                >
                  Sửa
                </Button>
                <Switch/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PostPage;