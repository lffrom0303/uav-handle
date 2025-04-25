import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { useFlight } from "./useFlight.ts";

export const useMap = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewer = useRef<Cesium.Viewer | null>(null);
  const { loadFlight } = useFlight(cesiumViewer);
  //初始化cesium - 使用更低质量的地形进行优化
  const initViewer = () => {
    if (cesiumViewer.current || !viewerRef.current) return;
    console.log("cesium初始化");
    try {
      const viewer = new Cesium.Viewer(viewerRef.current, {
        infoBox: false,
        selectionIndicator: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        homeButton: false,
        sceneModePicker: false,
        timeline: false,
        shadows: true,
        shouldAnimate: true,
        terrainProvider: undefined,
      });

      cesiumViewer.current = viewer;

      // 设置场景参数以优化性能
      const scene = viewer.scene;
      scene.fog.enabled = false; // 关闭雾效果
      scene.globe.depthTestAgainstTerrain = false; // 初始不进行深度测试
      scene.globe.maximumScreenSpaceError = 2; // 增加误差容忍度，减少细节

      // 清除版权信息
      const creditContainer = viewer.cesiumWidget
        .creditContainer as HTMLElement;
      creditContainer.style.display = "none";

      // 移除加载指示器
      const loadingIndicator = document.getElementById("cesium-loading");
      if (loadingIndicator && loadingIndicator.parentNode) {
        loadingIndicator.parentNode.removeChild(loadingIndicator);
      }
      console.log("cesium初始化完成");
      loadFlight(`${import.meta.env.VITE_API_DOMAIN}/models/uav.glb`);
    } catch (error) {
      console.error("Cesium 初始化失败:", error);
    }
  };
  const destroyViewer = () => {
    if (cesiumViewer.current) {
      cesiumViewer.current.destroy();
      cesiumViewer.current = null;
    }
  };
  useEffect(() => {
    initViewer();
    return () => {
      destroyViewer();
    };
  }, []);

  return {
    viewerRef,
  };
};
