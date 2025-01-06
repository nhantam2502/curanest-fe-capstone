import React from "react";
import FaqItem from "./FaqItem";

const faqs = [
  {
    question: "Dịch vụ điều dưỡng tại nhà bao gồm những gì?",
    content:
      "Dịch vụ điều dưỡng tại nhà của chúng tôi bao gồm chăm sóc sức khỏe cơ bản, hỗ trợ phục hồi sau phẫu thuật, chăm sóc người già, và theo dõi sức khỏe định kỳ. Đội ngũ điều dưỡng tận tâm sẽ đến tận nơi để hỗ trợ bạn.",
  },
  {
    question: "Nếu tôi cần hỗ trợ khẩn cấp thì sao?",
    content:
      "Trong trường hợp cần hỗ trợ khẩn cấp, bạn có thể liên hệ trực tiếp qua số hotline của chúng tôi. Chúng tôi sẽ cố gắng sắp xếp điều dưỡng đến nhanh nhất hoặc hướng dẫn bạn đến cơ sở y tế gần nhất.",
  },
  {
    question: "Tôi có thể chọn điều dưỡng theo ý muốn không?",
    content:
      "Bạn hoàn toàn có thể chọn điều dưỡng theo ý muốn dựa trên danh sách của chúng tôi. Chúng tôi sẽ cung cấp thông tin để bạn lựa chọn người phù hợp nhất với nhu cầu của mình.",
  },
  {
    question: "Điều dưỡng có hỗ trợ 24/7 không?",
    content:
      "Hiện tại, chúng tôi chưa hỗ trợ dịch vụ điều dưỡng 24/7. Tuy nhiên, bạn có thể đặt lịch hẹn trong khung giờ làm việc từ 8:00 sáng đến 8:00 tối để được phục vụ.",
  },
  {
    question: "Làm thế nào để đặt lịch điều dưỡng?",
    content:
      "Bạn chỉ cần truy cập vào ứng dụng hoặc trang web của chúng tôi, chọn dịch vụ, thời gian, và điều dưỡng mà bạn mong muốn. Quá trình đặt lịch rất đơn giản và nhanh chóng.",
  },
  {
    question: "Chi phí cho dịch vụ điều dưỡng tại nhà là bao nhiêu?",
    content:
      "Chi phí dịch vụ phụ thuộc vào loại hình chăm sóc bạn cần và thời gian yêu cầu. Bạn có thể tham khảo giá chi tiết trên trang web khi đặt lịch hoặc liên hệ với chúng tôi để được tư vấn cụ thể.",
  },
  
];

const FaqList = () => {
  return (
    <ul className="mt-[38px]">
      {faqs.map((item, index) => (
        <FaqItem item={item} index={index} key={index} />
      ))}
    </ul>
  );
};

export default FaqList;
