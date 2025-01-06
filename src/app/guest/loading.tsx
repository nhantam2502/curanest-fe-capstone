import { Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#FEFEFE] to-[#FEF0D7]">
      <div className="flex flex-col items-center space-y-4 p-8 rounded-lg">
        {/* Logo */}
        <span className="text-3xl font-bold text-[#64D1CB] mb-6">CURANEST</span>
        
        {/* Loading spinner with pulsing effect */}
        <div className="relative">
          {/* Outer ring with pulse effect */}
          <div className="absolute -inset-4 rounded-full bg-[#A8E0E9] opacity-30 animate-pulse"></div>
          
          {/* Inner spinner */}
          <Loader2 
            className="h-12 w-12 animate-spin text-[#64D1CB]"
            aria-label="Loading..."
          />
        </div>
        
        {/* Loading text with fade animation */}
        <div className="text-[#64D1CB] text-sm font-medium mt-4 animate-fade-in">
          Đang tải...
        </div>
        
        {/* Optional loading progress dots */}
        <div className="flex space-x-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-[#64D1CB] animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-[#64D1CB] animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-[#64D1CB] animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

// Thêm keyframes cho animation fade-in
const styles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-fade-in {
    animation: fade-in 1s ease-in-out;
  }
`;

// Thêm styles vào head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default LoadingPage;