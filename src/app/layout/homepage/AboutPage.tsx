import ImageAbout from "../../../../public/about-img.jpg";

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 pt-0 ">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full gap-10">
        <div className="w-full md:w-1/2">
          <img
            src={ImageAbout.src}
            alt="About Image"
            className="object-cover w-auto h-auto rounded-lg mt-4"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2 gap-5 text-center md:text-left">
          <p className="font-semibold text-4xl ">
            GIỚI THIỆU VỀ <span className="text-lime-500">CURANEST</span>
          </p>
          <p className="max-w-[500px] mx-auto md:mx-0 text-gray-500 mt-2 text-lg">
            Curanest là nền tảng kết nối gia đình có người già hoặc người bệnh
            với đội ngũ điều dưỡng chuyên nghiệp, mang lại dịch vụ chăm sóc tại
            nhà tiện lợi và đáng tin cậy. Với Curanest, người dùng có thể dễ
            dàng đặt lịch chăm sóc thông qua ứng dụng, giúp tiết kiệm thời gian
            và đảm bảo sự an tâm khi người thân được chăm sóc chu đáo ngay tại
            nhà.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
