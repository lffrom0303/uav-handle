import { RefObject, useState, useEffect } from "react";
import * as Cesium from "cesium";
export const params = {
  lat: 29.83,
  lng: 119.86,
  altitude: 500,
  heading: 4.7,
  pitch: 0,
  roll: 0,
  correction: 1,
  speed: 700,
};
export const useFlight = (cesiumViewer: RefObject<Cesium.Viewer | null>) => {
  const [uav, setUav] = useState<Cesium.Entity | null>(null);

  const [, setAnimationFrameId] = useState<number | null>(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const DIRECTION = {
    UP: "w",
    DOWN: "s",
    LEFT: "a",
    RIGHT: "d",
    SPEED_UP: "q",
    SPEED_DOWN: "e",
  };
  const keyboardMap = {
    [DIRECTION.UP]: false,
    [DIRECTION.DOWN]: false,
    [DIRECTION.LEFT]: false,
    [DIRECTION.RIGHT]: false,
    [DIRECTION.SPEED_UP]: false,
    [DIRECTION.SPEED_DOWN]: false,
  };
  const loadFlight = (url: string) => {
    onLoadModel(url);
  };
  //开启飞行参数调整
  const onAdjustParams = () => {
    let changed = false; // 用来跟踪是否有参数变化

    // 检查是否有方向键被按下
    const anyDirectionKeyPressed =
      keyboardMap[DIRECTION.UP] ||
      keyboardMap[DIRECTION.DOWN] ||
      keyboardMap[DIRECTION.LEFT] ||
      keyboardMap[DIRECTION.RIGHT];

    // 处理键盘输入
    if (keyboardMap[DIRECTION.SPEED_UP]) {
      if (params.speed <= 10000) {
        params.speed += 100;
        changed = true;
      }
    }

    if (keyboardMap[DIRECTION.SPEED_DOWN]) {
      if (params.speed >= 500) {
        params.speed -= 100;
        changed = true;
      }
    }

    //机体爬升
    if (keyboardMap[DIRECTION.UP] && params.pitch <= 0.3) {
      params.pitch += 0.005;
      changed = true;
      if (params.pitch > 0) {
        const { pitch } = params;
        const temp = (params.speed / 60 / 60 / 60) * 110;
        //1经纬度约等于110km
        params.altitude += temp * Math.sin(pitch);
      }
    }

    //机体俯冲
    if (keyboardMap[DIRECTION.DOWN] && params.pitch >= -0.3) {
      params.pitch -= 0.006;
      changed = true;
      if (params.pitch < 0) {
        const { pitch } = params;
        //1经纬度约等于110km
        const temp = (params.speed / 60 / 60 / 60) * 110;
        params.altitude += temp * Math.sin(pitch);
      }
    }

    //机体左转
    if (keyboardMap[DIRECTION.LEFT]) {
      params.heading -= 0.005;
      changed = true;
      if (params.roll > -0.785) {
        params.roll -= 0.005;
      }
    }

    //机体右转
    if (keyboardMap[DIRECTION.RIGHT]) {
      params.heading += 0.005;
      changed = true;
      if (params.roll < 0.785) {
        params.roll += 0.005;
      }
    }

    const { heading, pitch, roll } = params;
    const { abs, cos } = Math;

    // 计算修正系数
    params.correction = abs(cos(heading) * cos(pitch));

    if (abs(heading) < 0.001) params.heading = 0;
    if (abs(roll) < 0.001) params.roll = 0;
    if (abs(pitch) < 0.001) params.pitch = 0;

    // 处理自动回正逻辑 - 仅在没有方向键按下时执行
    if (!anyDirectionKeyPressed) {
      //roll回正
      if (params.roll > 0) {
        params.roll -= 0.003;
        changed = true;
      }
      if (params.roll < 0) {
        params.roll += 0.003;
        changed = true;
      }

      //pitch回正
      if (params.pitch < 0) {
        params.pitch += 0.005;
        changed = true;
      }
      if (params.pitch > 0) {
        params.pitch -= 0.003;
        changed = true;
      }
    }

    // 如果有参数变化，需要标记更新
    if (changed) {
      setNeedsUpdate(true);
    }
  };
  //开启飞行姿态调整
  const onAdjustAttitude = () => {
    if (!uav || !cesiumViewer) return;
    // 即使没有键盘输入，也要确保无人机按当前速度和方向继续运动
    const temp = params.speed / 60 / 60 / 60 / 110;
    params.lng += temp * Math.cos(params.heading);
    params.lat -= temp * Math.sin(params.heading);
    const { lng, lat, altitude, heading, pitch, roll } = params;

    // 如果俯仰角不为零，需要调整高度
    if (Math.abs(pitch) > 0.001) {
      params.altitude += temp * Math.sin(pitch) * 110 * 1000 * 10;
    }

    try {
      const position = Cesium.Cartesian3.fromDegrees(lng, lat, altitude);
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
      // 批量更新实体属性以减少重绘
      if (uav) {
        // 使用正确的 Cesium Property 类型
        uav.position = new Cesium.ConstantPositionProperty(position);
        uav.orientation = new Cesium.ConstantProperty(orientation);
      }
    } catch (error) {
      console.error("更新无人机姿态失败:", error);
    }
  };
  // 分离渲染器启动逻辑，以便能够停止渲染
  const startRenderer = () => {
    const renderer = () => {
      // 始终调用姿态调整函数以确保飞行的连续性
      onAdjustAttitude();

      // 检查是否有按键按下
      const anyKeyPressed = Object.values(keyboardMap).some(
        (pressed) => pressed
      );

      // 检查是否需要进行回正操作 - 即使没有按键按下也要执行
      const needsCorrection =
        !anyKeyPressed &&
        (Math.abs(params.roll) > 0.001 || Math.abs(params.pitch) > 0.001);

      // 当有按键按下、需要更新或需要回正时执行参数调整
      if (anyKeyPressed || needsUpdate || needsCorrection) {
        onAdjustParams();
        setNeedsUpdate(false);
      }

      // 保存 animation frame ID 以便清理
      setAnimationFrameId(requestAnimationFrame(renderer));
    };
    setAnimationFrameId(requestAnimationFrame(renderer));
  };
  //开启按键监听
  const onAddKeyboardListener = () => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (Object.keys(keyboardMap).includes(e.key)) {
        keyboardMap[e.key] = true;
        setNeedsUpdate(true); // 标记需要更新
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (Object.keys(keyboardMap).includes(e.key)) {
        keyboardMap[e.key] = false;
        setNeedsUpdate(true); // 标记需要更新
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // 返回清理函数，在组件卸载时使用
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  };

  //加载无人机模型
  const onLoadModel = (url: string) => {
    if (!cesiumViewer.current) return;
    try {
      const position = Cesium.Cartesian3.fromDegrees(120, 30, 2000);
      const entity = cesiumViewer.current.entities.add({
        name: "uav",
        position,
        model: {
          uri: url,
          runAnimations: true,
        },
      });
      cesiumViewer.current.trackedEntity = entity;
      setUav(entity);
      console.log("加载模型成功", entity);
    } catch (error) {
      console.error("模型加载失败:", error);
    }
  };

  // 监听 uav 状态变化
  useEffect(() => {
    if (uav) {
      console.log("uav 状态已更新", uav);
      onAddKeyboardListener();
      startRenderer();
    }
  }, [uav]);

  return {
    loadFlight,
  };
};
