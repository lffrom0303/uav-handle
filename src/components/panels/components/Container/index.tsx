import React, { ReactNode } from "react";

interface PanelProps {
  title?: string;
  height?: number;
  children: ReactNode;
}

const Index: React.FC<PanelProps> = ({ title, height, children }) => {
  return (
    <div
      className="flex-1 bg-black/70 rounded-lg p-3 text-white w-[380px] shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl"
      style={{ height: height ? `${height}px` : "auto" }}
    >
      <div className="flex flex-col">
        {title && <h3 className="text-lg font-medium">{title}</h3>}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};

export default Index;
