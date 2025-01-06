import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  const data = [
    { title: "Total Users", value: 1250, description: "Active users" },
    { title: "Revenue", value: "$54,000", description: "This month" },
    { title: "Orders", value: 320, description: "Pending orders" },
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