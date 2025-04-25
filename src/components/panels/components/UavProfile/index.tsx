import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import Container from "../Container";
const UavProfile: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const generateOption = () => {
    return {
      radar: {
        indicator: [
          { name: "环境适应性", max: 6500 },
          { name: "飞行性能", max: 16000 },
          { name: "软件指标", max: 30000 },
          { name: "导航定位能力", max: 38000 },
          { name: "数据链路", max: 52000 },
          { name: "续航时间", max: 25000 },
        ],
        radius: "65%",
        name: {
          textStyle: {
            color: "#4e5969",
            fontSize: 10,
          },
        },
        splitNumber: 4,
        splitArea: {
          areaStyle: {
            color: [],
          },
        },
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: [4300, 10000, 28000, 35000, 50000, 19000],
              name: "",
              areaStyle: {
                color: "rgba(22, 93, 255, 0.15)",
              },
              itemStyle: {
                color: "rgb(22, 93, 255)",
              },
              lineStyle: {
                width: 1,
                type: "",
              },
              symbol: "none",
            },
          ],
        },
      ],
    };
  };

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.setOption(generateOption());
    }

    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <Container height={300}>
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-shrink-0 items-center justify-between pb-2.5 mb-2.5 border-b border-solid border-[var(--color-border)]">
          <div className="mr-2.5">
            <div className="font-[DincorosBlack] text-xl font-bold">
              DJI Mavic pro
            </div>
            <div className="mt-1.5 text-[10px] text-[var(--color-text-2)]">
              FHD high-Framerate Live Feed
            </div>
          </div>
          <div className="absolute right-2.5 w-[70px] h-[70px] bg-[url('@/assets/images/uav2.png')] bg-no-repeat bg-center bg-contain object-cover"></div>
        </div>
        <div ref={chartRef} className="flex-1 w-full"></div>
      </div>
    </Container>
  );
};

export default UavProfile;
