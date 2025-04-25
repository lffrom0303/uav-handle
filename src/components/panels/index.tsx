import React, { useState, useCallback, useEffect } from "react";
import {
  Title,
  // UavProfile,
  // PlayerProfile,
  // Params,
  // Gradienter,
  // Compass,
  // Altimeter,
} from "./components";

const Panels: React.FC = () => {
  const [isPanelsVisible, setIsPanelsVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    if (isFirstMount) {
      // 延迟一帧执行展开动画，确保初始状态的收起效果已渲染
      requestAnimationFrame(() => {
        setIsPanelsVisible(true);
        setIsFirstMount(false);
      });
    }
  }, [isFirstMount]);

  const togglePanels = useCallback(() => {
    setIsPanelsVisible((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      setIsPanelsVisible(false);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setIsPanelsVisible(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col justify-between gap-5 z-10 pointer-events-none">
      <div className="flex bg-black/80 shadow-lg items-center justify-between px-5 py-3 pointer-events-none">
        <div
          className={`transition-all duration-500 ease-in-out transform pointer-events-none ${
            isPanelsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full"
          }`}
        >
          <Title title="无人机飞行系统" subtitle="UAV Flight Control System" />
        </div>
        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={togglePanels}
            className="px-4 py-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700/80 transition-colors"
          >
            {isPanelsVisible ? "收起面板" : "展开面板"}
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700/80 transition-colors"
          >
            {isFullscreen ? "退出全屏" : "全屏"}
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-between h-full p-5 pointer-events-none">
        <div
          className={`flex flex-col gap-5 justify-between h-full pointer-events-auto transition-all duration-500 ease-in-out transform ${
            isPanelsVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full"
          }`}
        >
          {/*<UavProfile />*/}
          {/*<Params />*/}
          {/*<PlayerProfile />*/}
        </div>
        <div
          className={`flex flex-col gap-5 justify-between h-full pointer-events-auto transition-all duration-500 ease-in-out transform ${
            isPanelsVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full"
          }`}
        >
          {/*<Gradienter />*/}
          {/*<Compass />*/}
          {/*<Altimeter />*/}
        </div>
      </div>
    </div>
  );
};

export default Panels;
