"use client"

import React, { useState } from 'react';
import PostEditor from './PostEditor';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface Post {
  id: number;
  title: string;
  content: string;
  status: 'published' | 'draft';
  createdAt: Date;
}

// Dummy data for the table (replace with your actual data fetching)
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

function Page() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleNewPost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDeletePost = (postId: number) => {
    // Replace with your actual delete logic (e.g., API call)
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleSavePost = (newPost: Post) => {
    if (editingPost) {
      // Update existing post
      setPosts(
        posts.map((post) => (post.id === editingPost.id ? newPost : post))
      );
    } else {
      // Add new post
      setPosts([...posts, { ...newPost, id: Date.now() }]); // Generate a unique ID (replace with your ID generation logic)
    }
    setShowEditor(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Post Manager</h1>
        <Button onClick={handleNewPost}>New Post</Button>
      </div>

      {/* Post Table */}
      <Table className="w-full border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[200px]">Created At</TableHead>
            <TableHead className="text-right w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{post.id}</TableCell>
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
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showEditor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <PostEditor
              post={editingPost}
              onSave={handleSavePost}
              onCancel={() => setShowEditor(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;