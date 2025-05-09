"use client";
import { ArrowRight, Video } from "lucide-react";
import React from "react";
import ServiceList from "../Service/ServiceList";
import NursingList from "../Nursing/NursingList";
import FaqList from "../FAQ/FaqList";
import Feedbacks from "./Feedbacks";
import NewsSection from "../News/NewsSection";
import DownloadAppSection from "./DowloadSection";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="overflow-x-hidden hero_section">
      {/* Section 1 */}
      <section className="hero_section">
        <div className="mx-auto max-w-[1900px] px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
            <div className="relative h-80 overflow-hidden rounded-lg sm:h-96 lg:order-last lg:h-full">
              <img
                src="./slider-img.jpg"
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                className="absolute inset-0 h-full w-full object-cover rounded-3xl"
                width={1200}
                height={1200}
                alt=""
              />
            </div>

            <div className="lg:py-32">
              <h2
                data-aos="fade-right"
                className="text-4xl font-be-vietnam-pro font-bold sm:text-5xl text-headingColor"
              >
                Tìm và Đặt
                <span className="text-[#71DDD7]"> Lịch hẹn </span>
                với
                <span className="text-[#71DDD7]"> Điều dưỡng </span>
                bạn tin tưởng
              </h2>

              <p data-aos="fade-right" className="mt-6 text-xl text-textColor">
                Curanest là nền tảng đặt lịch điều dưỡng tại nhà, kết nối gia
                đình có người già hoặc người bệnh với dịch vụ chăm sóc chuyên
                nghiệp, tiện lợi và đáng tin cậy.
              </p>

              <button
                data-aos="fade-right"
                data-aos-delay="50"
                data-aos-duration="1200"
                data-aos-easing="ease-in-out"
                className="btn mt-12 text-[20px]"
                onClick={() => {
                  router.push("/auth/signIn");
                }}
              >
                Trải nghiệm ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section id="about">
        <div className="mx-auto max-w-[1900px] px-6 sm:px-8 lg:px-10 mt-20">
          <div className="lg:w-[800px] mx-auto">
            <h2 className="heading text-center">
              Cung cấp dịch vụ y tế tại nhà tốt nhất
            </h2>
            <p className="text_para text-center">
              Chăm sóc chất lượng cao ngay tại nhà. Hệ thống chăm sóc sức khỏe
              của chúng tôi cung cấp dịch vụ điều dưỡng chuyên nghiệp, tận tâm
              và phù hợp với nhu cầu của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-16">
            {/* icon 1 */}
            <div
              className="py-[30px] px-5"
              data-aos="fade-left"
              data-aos-duration="1200"
              data-aos-easing="ease-in-out-back"
            >
              <div className="flex items-start justify-center">
                <img src="./icon01.png" alt="icon1" className="w-60 h-60" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Đội ngũ điều dưỡng chuyên nghiệp
                </h2>

                <p className="text-[20px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Đội ngũ điều dưỡng chuyên nghiệp, được tuyển chọn kỹ càng, cam
                  kết mang đến dịch vụ chăm sóc sức khỏe tận tâm và chất lượng{" "}
                </p>

                {/* <Link
                  href=""
                  className="w-[44px] h-[44px] rounded-full 
                border border-solid border-[#181A1E] mt-[30px] mx-auto 
                flex items-center justify-center group hover:bg-[#FEF0D7]
                hover:border-none"
                >
                  <ArrowRight className="group-hover:text-[#181A1E] w-6 h-5" />
                </Link> */}
              </div>
            </div>

            {/* icon 2 */}
            <div
              className="py-[30px] px-5"
              data-aos="fade-left"
              data-aos-duration="1400"
              data-aos-easing="ease-in-out-back"
            >
              <div className="flex items-center justify-center">
                <img src="./checkList.png" alt="icon2" className="w-60 h-60" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Tuỳ chỉnh gói dịch vụ theo nhu cầu
                </h2>

                <p className="text-[20px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Chúng tôi cung cấp nhiều gói dịch vụ chăm sóc sức khỏe khác
                  nhau, giúp bạn dễ dàng lựa chọn và điều chỉnh theo nhu cầu
                  riêng của mình.
                </p>

                {/* <Link
                  href=""
                  className="w-[44px] h-[44px] rounded-full 
                border border-solid border-[#181A1E] mt-[30px] mx-auto 
                flex items-center justify-center group hover:bg-[#FEF0D7]
                hover:border-none"
                >
                  <ArrowRight className="group-hover:text-[#181A1E] w-6 h-5" />
                </Link> */}
              </div>
            </div>

            {/* icon 3 */}
            <div
              className="py-[30px] px-5"
              data-aos="fade-left"
              data-aos-duration="1600"
              data-aos-easing="ease-in-out-back"
            >
              <div className="flex items-center justify-center">
                <img src="./icon03.png" alt="icon3" className="w-60 h-60" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Đặt lịch hẹn nhanh chóng và đơn giản
                </h2>

                <p className="text-[20px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Chỉ với vài bước, bạn có thể lựa chọn điều dưỡng phù hợp và
                  thời gian thuận tiện nhất cho nhu cầu chăm sóc của mình.
                </p>

                {/* <Link
                  href=""
                  className="w-[44px] h-[44px] rounded-full 
                border border-solid border-[#181A1E] mt-[30px] mx-auto 
                flex items-center justify-center group hover:bg-[#FEF0D7]
                hover:border-none"
                >
                  <ArrowRight className="group-hover:text-[#181A1E] w-6 h-5" />
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section*/}
      {/* <About /> */}

      {/* Services Section*/}
      <section id="services">
        <div className="mx-auto max-w-[1900px] px-6 sm:px-8 lg:px-10 mt-10">
          <div className="xl:w-[530px] mx-auto">
            <h2 className="heading text-center">Dịch Vụ Điều Dưỡng</h2>
            <p className="text_para text-center">
              Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe chuyên nghiệp,
              tận tâm với đội ngũ điều dưỡng giàu kinh nghiệm.
            </p>
          </div>

          <ServiceList />
        </div>
      </section>

      {/* Feature Section*/}
      <section>
        <div className="mx-auto max-w-screen-xl px-4  sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between flex-col lg:flex-row gap-16">
            {/* Feature Content */}
            <div
              data-aos="fade-top"
              data-aos-duration="1600"
              className="xl:w-[800px]"
            >
              <h2 className="heading">
                Nhận được nhiều sự lựa chọn khi đặt lịch
              </h2>

              <ul className="pl-4">
                <li className="text_para">
                  1. Chủ động lựa chọn điều dưỡng yêu thích và sắp xếp lịch hẹn
                  dễ dàng theo ý muốn
                </li>

                <li className="text_para">
                  2. Hệ thống sẽ gán điều dưỡng phù hợp nhất, đáp ứng nhu cầu và
                  khung thời gian của bạn
                </li>
              </ul>

              <button
                data-aos="fade-right"
                data-aos-delay="50"
                data-aos-duration="1200"
                data-aos-easing="ease-in-out"
                className="btn mt-[38px] text-[20px]"
                onClick={() => {
                  router.push("/auth/signIn");
                }}
              >
                Trải nghiệm ngay
              </button>
            </div>

            {/* Feature Image */}
            <div
              data-aos="fade-down"
              data-aos-duration="1600"
              data-aos-easing="ease-in-out-back"
              className="relative z-10 xl:w-[900px] flex justify-end mt-5 lg:mt-0"
            >
              <img className="w-4/5" src="./feature-img.png" alt="" />

              <div className="w-[250px] rounded-xl bg-white absolute bottom-16 left-8 z-20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[6px] lg:gap-3">
                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[600]">
                      Tue, 24
                    </p>

                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor font-[400]">
                      10:00AM
                    </p>
                  </div>

                  <span
                    className="w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center 
        bg-yellowColor py-1 px-[6px] lg:py-2 lg:px-[9px]"
                  >
                    <Video />
                  </span>
                </div>

                <div
                  className="w-[65px] lg:w-[96px] bg-[#CCF0F3] py-1 px-2 lg:py-[4px] lg:px-[8px]
      text-[8px] leading-[8px] lg:text-[12px] lg:leading-4 text-irisBlueColor font-[500] mt-2 lg:mt-3"
                >
                  Consultation
                </div>

                <div className="flex items-center gap-[60px] lg:gap-[10px] mt-1 lg:mt-[10px]">
                  <img src="./avatar-icon.png" alt="" />
                  <h4 className="text-[10px] leading-3 lg:text-[16px] lg:leading-[20px] font-700 text-headingColor">
                    Wayne Collins
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our great nursing Section*/}
      <section id="nursing">
        <div className="mx-auto max-w-[1700px] px-6 sm:px-6 lg:px-10 mt-10">
          <div className="xl:w-[650px] mx-auto">
            <h2 className="heading text-center">
              Đội ngũ điều dưỡng chuyên nghiệp
            </h2>
            <p className="text_para text-center">
              Đội ngũ điều dưỡng chuyên nghiệp, được tuyển chọn kỹ càng, cam kết
              mang đến dịch vụ chăm sóc sức khỏe tận tâm và chất lượng
            </p>
          </div>

          <NursingList serviceId="01957acd-db4f-7740-9771-c38a6e062368" />
        </div>
      </section>

      {/* FAQ Section*/}
      <section id="faq">
        <div className="mx-auto max-w-screen-xl px-4  sm:px-6  lg:px-8 mt-20">
          <div className="flex justify-between gap-[50px] lg:gap-0">
            <div className="w-1/2 hidden md:block">
              <img src="./faq-img.png" alt="" />
            </div>

            <div className="w-full md:w-1/2">
              <h2 className="heading">Các câu hỏi thường gặp</h2>
              <FaqList />
            </div>
          </div>
        </div>
      </section>

      {/* <DownloadAppSection /> */}

      {/* Feedbacks Section*/}
      <section id="feedback">
        <div className="mx-auto max-w-[1900px] px-6 sm:px-8 lg:px-10 mb-8 mt-20">
          <h2 className="heading text-center">
            Phản hồi từ khách hàng của chúng tôi
          </h2>
          <p className="text_para text-center">
            Dịch vụ chăm sóc tận tâm, chuyên nghiệp. Hệ thống điều dưỡng tại nhà
            của chúng tôi mang đến sự chăm sóc sức khỏe tận tình và đáng tin
            cậy.
          </p>
        </div>
        <Feedbacks />
      </section>

      {/* News Section*/}
      <NewsSection />
    </div>
  );
};

export default Hero;
