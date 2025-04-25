import React, { useMemo } from "react";
import Container from "../Container";
import { params } from "@/hooks";

const ParamsPanel: React.FC = () => {
  const sources = useMemo(
    () => [
      { label: "高度", value: params.altitude.toFixed(2), unit: "米" },
      { label: "经度", value: params.lat.toFixed(2), unit: "" },
      { label: "纬度", value: params.lng.toFixed(2), unit: "" },
      {
        label: "俯仰角",
        value: (params.pitch * (180 / Math.PI)).toFixed(2),
        unit: "度",
      },
      {
        label: "偏航角",
        value: (params.heading * (180 / Math.PI)).toFixed(2),
        unit: "度",
      },
      {
        label: "滚转角",
        value: (params.roll * (180 / Math.PI)).toFixed(2),
        unit: "弧度",
      },
      { label: "速度", value: params.speed.toFixed(2), unit: "km/h" },
      { label: "温度", value: "25", unit: "°C" },
      { label: "电池电量", value: "75%", unit: "" },
    ],
    [
      params.altitude,
      params.lat,
      params.lng,
      params.pitch,
      params.heading,
      params.roll,
      params.speed,
    ]
  );

  return (
    <Container>
      <div className="flex gap-2.5 w-full h-full">
        <div className="box-border grid grid-rows-3 grid-cols-3 items-center justify-center h-[233px] border border-solid border-[var(--color-border)]">
          {sources.map((item, index) => (
            <div
              key={item.label}
              className={`
                flex flex-col items-center justify-center h-full px-5 text-center
                border-r border-b border-solid border-[var(--color-border)]
                ${(index + 1) % 3 === 0 ? "border-r-0" : ""}
                ${index >= 6 ? "border-b-0" : ""}
              `}
            >
              <div className="text-xs text-[var(--color-neutral-6)]">
                {item.label}
              </div>
              <div className="mt-1 text-base">
                <span className="font-[DincorosBlack]">{item.value}</span>
                <span className="ml-1.5 text-xs text-[var(--color-neutral-6)]">
                  {item.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ParamsPanel;
