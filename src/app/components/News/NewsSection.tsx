import React from "react";
import NewsCard from "./NewsCard ";
import Link from "next/link";

const NewsSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Maintaining Heart Health in Your Daily Routine",
      excerpt:
        "Discover simple yet effective ways to keep your heart healthy through diet, exercise, and lifestyle changes that you can easily incorporate into your daily life.",
      imageUrl: "/loginLeft.jpg",
      category: "Heart Health",
      date: "Mar 15, 2024",
      author: {
        name: "Dr. Sarah Johnson",
        avatar: "/avatar-sarah.jpg",
      },
      likes: 245,
    },
    {
      id: 2,
      title: "Understanding Mental Health: Breaking the Stigma",
      excerpt:
        "Mental health is just as important as physical health. Learn about common mental health issues, their signs, and how to seek help when needed.",
      imageUrl: "/loginLeft.jpg",
      category: "Mental Health",
      date: "Mar 12, 2024",
      author: {
        name: "Dr. Michael Chen",
        avatar: "/avatar-michael.jpg",
      },
      likes: 189,
    },
    {
      id: 3,
      title: "The Science of Sleep: Why Quality Rest Matters",
      excerpt:
        "Explore the latest research on sleep science and learn practical tips for improving your sleep quality to boost overall health and well-being.",
      imageUrl: "/loginLeft.jpg",
      category: "Wellness",
      date: "Mar 10, 2024",
      author: {
        name: "Dr. Emma Wilson",
        avatar: "/avatar-emma.jpg",
      },
      likes: 312,
    },
  ];

  return (
    <section id="news" className="mb-20">
      <div className="mx-auto max-w-[1700px] px-6 sm:px-6 lg:px-10">
        <div className="xl:w-[470px] mx-auto text-center">
          <h2 className="heading">Latest Health Insights</h2>
          <p className="text_para">
            Stay informed with the latest health news, tips, and expert advice
            from our medical professionals
          </p>
        </div>

        <div className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-10 mt-16">
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full place-items-center">
              {blogPosts.map((post) => (
                <div key={post.id} className="w-full max-w-[480px]">
                  <Link href={`/guest/news/${post.id}`}>
                    <NewsCard post={post} />
                  </Link>{" "}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
