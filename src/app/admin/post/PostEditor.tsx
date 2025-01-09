"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Post } from "./page";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export interface PostEditorProps {
  post: Post | null;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setStatus(post.status);
    } else {
      setTitle("");
      setContent("");
      setStatus("draft");
    }
  }, [post]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const handleSave = () => {
    const newPost: Post = post?.id
      ? {
          id: post.id,
          title,
          content,
          status,
          createdAt: new Date(),
        }
      : {
          id: 0, // or any default value that makes sense for your application
          title,
          content,
          status,
          createdAt: new Date(),
        };
    onSave(newPost);
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2 font-semibold">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block mb-2 font-semibold">
          Content
        </label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          className="bg-white border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block mb-2 font-semibold">
          Status
        </label>
        <Select
          onValueChange={(value: "published" | "draft") => setStatus(value)}
          defaultValue={status}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default PostEditor;
