import Footer from "@/app/components/HomePage/Footer";
import Header from "@/app/components/HomePage/Header";
import DetailNews from "@/app/components/News/DetailNews";
import blogPosts from "@/dummy_data/dummy_news.json";

const DetailNewsPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Tìm bài viết dựa trên id từ dữ liệu tĩnh
  const post = blogPosts.find((post) => post.id === Number(id));

  if (!post) {
    return <p>Bài viết không tồn tại.</p>;
  }

  // Hiển thị bài viết nếu tìm thấy
  return (
    <div>
      <DetailNews post={post} />
    </div>
  );
};

export default DetailNewsPage;
