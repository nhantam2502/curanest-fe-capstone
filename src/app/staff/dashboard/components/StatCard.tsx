// components/dashboard/StatCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon, Loader2 } from "lucide-react"; // Import Loader2 for loading spinner

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  isLoading?: boolean; // Added isLoading prop
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  isLoading, // Destructure isLoading
}: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow"> {/* Added some subtle styling */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground"> {/* Matched style from page example */}
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-emerald-500" /> {/* Matched style from page example */}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[28px] flex items-center"> {/* Ensure consistent height during loading */}
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="text-2xl font-bold text-gray-800">{value}</div> // Matched style from page example
        )}
        {description && !isLoading && ( // Only show description if not loading
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}