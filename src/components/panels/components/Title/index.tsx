import React, { useState, useEffect } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Index: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    // 页面加载后延迟显示标题，产生动画效果
    const timer = setTimeout(() => {
      setShowHeader(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="z-20 pointer-events-none">
      <div
        className={`w-full pointer-events-auto transition-all duration-500 ease-out ${
          showHeader
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-4"
        }`}
      >
        <div className="w-full px-4 py-3 text-white">
          <h1 className="text-xl sm:text-2xl font-bold text-center">{title}</h1>
          {subtitle && (
            <h2 className="text-xs sm:text-sm text-gray-300 text-center mt-1">
              {subtitle}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
