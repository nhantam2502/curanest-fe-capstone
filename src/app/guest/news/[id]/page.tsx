import DetailNews from "@/app/components/News/DetailNews";

const DetailNewsPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;  

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

  const post = blogPosts.find(post => post.id.toString() === id); // Find the blog post by id

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div>
      <DetailNews post={post} />
    </div>
  );
};

export default DetailNewsPage;
