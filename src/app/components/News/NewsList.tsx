"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState } from "react";
import NewsCard from "./NewsCard ";
import blogPosts from "@/dummy_data/dummy_news.json";

const NewsList = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Input value
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>(""); // Active search term

  const topics = Array.from(new Set(blogPosts.map((post) => post.topic)));

  // Lọc bài viết dựa trên chủ đề và từ khóa tìm kiếm đã submit
  const filteredPosts = blogPosts.filter((post) => {
    const matchesTopic = selectedTopic ? post.topic === selectedTopic : true;
    const matchesSearch = activeSearchQuery
      ? post.title.includes(activeSearchQuery) ||
        post.content.includes(activeSearchQuery) ||
        post.topic.includes(activeSearchQuery)
      : true;

    return matchesTopic && matchesSearch;
  });

  // Xử lý tìm kiếm khi nhấn submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Cập nhật activeSearchQuery để kích hoạt tìm kiếm
    setActiveSearchQuery(searchQuery);
    
    // Scroll đến phần kết quả
    const newsSection = document.getElementById("news");
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Xóa input search
  const clearSearchInput = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
  };

  // Xóa bộ lọc
  const clearFilters = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setSelectedTopic(null);
  };

  return (
    <>
      {/* Search topic */}
      <div className="relative bg-[url('/hero-bg.png')] bg-no-repeat bg-center bg-cover bg-fixed">
        <section>
          <div className="mx-auto max-w-[1900px] px-6 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
              {/* left side */}
              <div className="lg:py-40 lg:pb-2">
                <h2 className="font-bold text-5xl text-headingColor tracking-wide mb-4">
                  Tìm kiếm
                  <span className="text-[#64D1CB]"> Tin Tức</span>
                </h2>

                <h2 className="text-gray-400 text-2xl mb-8">
                  Cập nhật những tin tức liên quan đến sức khoe và y tế mới nhất
                </h2>

                <form onSubmit={handleSearch} className="flex w-full mt-6 max-w-xl items-center space-x-4">
                  <div className="relative flex-1">
                    <Input
                      className="h-14 text-lg flex items-center justify-center rounded-[50px] pr-12"
                      type="text"
                      placeholder="Tìm kiếm theo tiêu đề, nội dung..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearchInput}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  <Button
                    className="bg-[#71DDD7] py-3 px-8 text-white text-lg font-semibold h-14 flex items-center justify-center rounded-[50px] hover:bg-[#71DDD7]"
                    type="submit"
                  >
                    <Search /> Tìm kiếm
                  </Button>
                </form>
              </div>

              {/* right side */}
              <div className="relative lg:h-full">
                <h2 className="font-bold text-5xl text-headingColor tracking-wide mb-4">
                  Chủ đề
                  <span className="text-[#64D1CB]"> Tin Tức</span>
                </h2>

                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      className={`px-4 py-2 rounded-[50px] text-lg border-2 ${
                        selectedTopic === topic
                          ? "bg-[#e5ab47] hover:bg-[#e5ab47] text-white font-semibold"
                          : "bg-transparent text-gray-700 border-gray-300"
                      } hover:bg-[#e5ab47] hover:text-white hover:font-semibold transition-colors`}
                      onClick={() =>
                        setSelectedTopic(selectedTopic === topic ? null : topic)
                      }
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Display news */}
        <section id="news">
          <div className="mx-auto max-w-[1700px] px-6 sm:px-6 lg:px-10">
            {/* <div className="xl:w-[470px] mx-auto text-center">
              <h2 className="text-5xl font-semibold text-gray-800">
                {selectedTopic ? `${selectedTopic}` : activeSearchQuery ? `Kết quả tìm kiếm: "${activeSearchQuery}"` : "Tin mới nhất"}
              </h2>
            </div> */}
             <div className="xl:w-[470px] mx-auto text-center">
              <h2 className="text-5xl font-semibold text-gray-800">
                {selectedTopic ? `${selectedTopic}` : "Tin mới nhất"}
              </h2>
            </div>

            <div className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-10 mt-16">
              <div className="flex flex-col items-center">
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full place-items-center">
                    {filteredPosts.map((post) => (
                      <div key={post.id} className="w-full max-w-[480px]">
                        <Link href={`/guest/news/${post.id}`}>
                          <NewsCard post={post} />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                      Không tìm thấy kết quả
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Thử tìm kiếm với từ khóa khác hoặc chọn chủ đề khác
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-[#71DDD7] text-white px-6 py-2 rounded-[50px] hover:bg-[#64D1CB] transition-colors"
                    >
                      Xem tất cả tin tức
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NewsList;