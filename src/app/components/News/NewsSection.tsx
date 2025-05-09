import React from "react";
import NewsCard from "./NewsCard ";
import Link from "next/link";

const NewsSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Mẹo Duy Trì Sức Khỏe Tim Mạch Trong Thói Quen Hằng Ngày",
      content:
        "Khám phá những cách đơn giản nhưng hiệu quả để giữ cho trái tim của bạn khỏe mạnh thông qua chế độ ăn uống, tập thể dục và thay đổi lối sống mà bạn có thể dễ dàng áp dụng vào cuộc sống hàng ngày.",
      imageUrl: "/loginLeft.jpg",
      topic: "Sức Khỏe Tim Mạch",
      created_at: "Ngày 15 tháng 3, 2024",
      author: {
        name: "Bác sĩ Sarah Johnson",
        avatar: "/avatar-sarah.jpg",
      },
    },
    {
      id: 2,
      title: "Tìm Hiểu Sức Khỏe Tâm Thần: Phá Vỡ Định Kiến",
      content:
        "Sức khỏe tâm thần quan trọng không kém gì sức khỏe thể chất. Tìm hiểu về các vấn đề sức khỏe tâm thần phổ biến, dấu hiệu của chúng và cách tìm kiếm sự giúp đỡ khi cần.",
      imageUrl: "https://hcdc.vn/public/img/02bf8460bf0d6384849ca010eda38cf8e9dbc4c7/images/dangbai1/images/dinh-kien-ve-suc-khoe-tam-than--nhung-rao-can-vo-hinh/images/9ea0a35dfd3c45621c2d.jpg",
      topic: "Sức Khỏe Tâm Thần",
      created_at: "Ngày 15 tháng 3, 2024",
      author: {
        name: "Bác sĩ Michael Chen",
        avatar: "/avatar-michael.jpg",
      },
    },
    {
      id: 3,
      title: "Khoa Học Về Giấc Ngủ: Tại Sao Giấc Ngủ Chất Lượng Quan Trọng",
      content:
        "Khám phá những nghiên cứu mới nhất về khoa học giấc ngủ và tìm hiểu các mẹo thực tế để cải thiện chất lượng giấc ngủ, nâng cao sức khỏe và hạnh phúc tổng thể.",
      imageUrl: "https://tamanhhospital.vn/wp-content/uploads/2024/06/ban-chat-giac-ngu.jpg",
      topic: "Sức Khỏe Toàn Diện",
      created_at: "Ngày 15 tháng 3, 2024",
      author: {
        name: "Bác sĩ Emma Wilson",
        avatar: "/avatar-emma.jpg",
      },
    },
  ];

  return (
    <section id="news" className="mb-20 mt-10">
      <div className="mx-auto max-w-[1700px] px-6 sm:px-6 lg:px-10">
        <div className="xl:w-[550px] mx-auto text-center">
          <h2 className="heading">Tin tức mới nhất về sức khoẻ</h2>
          <p className="text_para">
            Cập nhật những tin tức mới nhất về sức khỏe, mẹo vặt và lời khuyên
            từ chuyên gia
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
