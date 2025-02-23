import Footer from "@/app/components/HomePage/Footer";
import Header from "@/app/components/HomePage/Header";
import DetailNews from "@/app/components/News/DetailNews";
import DetailNurse from "@/app/components/Nursing/DetailNurse";
import nurse from "@/dummy_data/dummy_nurse.json";

const DetailNursePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Tìm điều dưỡng dựa trên id từ dữ liệu tĩnh
  const detailNurse = nurse.find((nurse) => nurse.id === Number(id));

  if (!detailNurse) {
    return <p>Điều dưỡng không tồn tại.</p>;
  }

  // Hiển thị nếu tìm thấy
  return (
    <div>
      <DetailNurse nurse={detailNurse} />
    </div>
  );
};

export default DetailNursePage;
