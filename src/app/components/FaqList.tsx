import React from "react";
import FaqItem from "./FaqItem";

const faqs = [
  {
    question: "What is your medical care?",
    content:
      "One Medical was founded on a better model of care one designed around patients needs that provides a higher level of quality and service affordably. We do this through innovative design, excellent customer service, and the efficient use of technology.",
  },
  {
    question: "What happens if I need to go a hospital?",
    content:
      "One Medical was founded on a better model of care one designed around patients needs that provides a higher level of quality and service affordably. We do this through innovative design, excellent customer service, and the efficient use of technology.",
  },
  {
    question: "What happens if I need to go a hospital?",
    content:
      "One Medical was founded on a better model of care one designed around patients needs that provides a higher level of quality and service affordably. We do this through innovative design, excellent customer service, and the efficient use of technology.",
  },
  {
    question: "Can I visit your medical office?",
    content:
      "One Medical was founded on a better model of care one designed around patients needs that provides a higher level of quality and service affordably. We do this through innovative design, excellent customer service, and the efficient use of technology.",
  },
  {
    question: "Does you provide urgent care?",
    content:
      "One Medical was founded on a better model of care one designed around patients needs that provides a higher level of quality and service affordably. We do this through innovative design, excellent customer service, and the efficient use of technology.",
  },
];

const FaqList = () => {
  return (
    <ul className="mt-[38px]">
      {faqs.map((item, index) => (
        <FaqItem item={item} key={index} />
      ))}
    </ul>
  );
};

export default FaqList;
