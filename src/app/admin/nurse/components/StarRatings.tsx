import { Star } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have this utility

interface StarRatingProps {
  rating: number; // Rating out of 5
  maxRating?: number;
  size?: number; // Size of the stars (e.g., 16 for h-4 w-4)
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  className,
}) => {
  const fullStars = Math.floor(rating);
  // Basic implementation: no half stars for simplicity
  // const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            "transition-colors",
            i < fullStars
              ? "fill-yellow-400 text-yellow-400" // Filled star color
              : "fill-muted text-muted-foreground" // Empty star color (grayish)
          )}
          aria-hidden="true" // Hide decorative stars from screen readers
        />
      ))}
      {/* Optional: Screen reader text */}
      <span className="sr-only">{`${rating} out of ${maxRating} stars`}</span>
    </div>
  );
};