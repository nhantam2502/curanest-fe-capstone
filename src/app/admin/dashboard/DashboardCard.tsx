import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  const data = [
    { title: "Data 1", value: 1250, description: "Mô tả 1" },
    { title: "Data 2", value: "$54,000", description: "Mô tả 2" },
    { title: "Data 3", value: 320, description: "Mô tả 3" },
  ];
  
  export default function DashboardCards() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }