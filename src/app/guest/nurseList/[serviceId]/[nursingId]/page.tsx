import DetailNurse from "@/app/components/Nursing/DetailNurse";
import nurse from "@/dummy_data/dummy_nurse.json";

const DetailNursePage = ({ params }: { params: { serviceId: string; nursingId: string } }) => {
  const { nursingId } = params;

  const detailNurse = nurse.find((n) => n.id === Number(nursingId));

  if (!detailNurse) {
    return <p>Điều dưỡng không tồn tại.</p>;
  }

  return (
    <div>
      <DetailNurse nurse={detailNurse} />
    </div>
  );
};
export default DetailNursePage;
