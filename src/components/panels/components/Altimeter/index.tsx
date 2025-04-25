import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import dayjs from "dayjs";
import Container from "../Container";
import { params } from "@/hooks";

const Altimeter: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const sourceData = useRef<Array<{ label: string; value: number }>>([]);

  const generateOption = (arr: Array<{ label: string; value: number }>) => {
    return {
      grid: {
        left: "60",
        right: "20",
        top: "15",
        bottom: "25",
      },
      xAxis: {
        type: "category",
        data: arr.map((item) => item.label),
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          fontSize: 10,
          color: "#555",
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "rgb(229, 230, 235)",
            width: 1,
          },
        },
      },
      yAxis: {
        name: "飞机高度(米)",
        nameLocation: "middle",
        nameGap: 36,
        type: "value",
        axisLabel: {
          show: true,
          fontSize: 10,
          color: "#555",
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "#f2f3f5",
            width: 1,
            type: "dashed",
          },
        },
      },
      series: [
        {
          data: arr.map((item) => item.value),
          type: "line",
          symbol: "none",
          lineStyle: {
            width: 1,
          },
          areaStyle: {
            color: "rgba(22, 93, 255, 0.15)",
          },
          itemStyle: {
            color: "rgb(22, 93, 255)",
          },
          markLine: {
            symbol: ["none", "none"],
            label: {
              show: true,
              position: "middle",
              formatter: "高度警戒线",
              fontSize: 10,
              color: "#e24f48aa",
            },
            lineStyle: {
              type: "dashed",
              color: "#e24f48aa",
            },
            data: [
              {
                yAxis: 300,
              },
            ],
          },
        },
      ],
    };
  };

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const timer = setInterval(() => {
      const max = 1000 * 2;
      if (sourceData.current.length > max) {
        sourceData.current.splice(0, sourceData.current.length - max);
      }
      sourceData.current.push({
        label: dayjs().format("HH:mm:ss"),
        value: params.altitude,
      });

      if (chartInstance.current) {
        chartInstance.current.setOption(generateOption(sourceData.current));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <Container height={200}>
      <div className="flex gap-2.5 w-full h-full">
        <div
          ref={chartRef}
          className="flex-1 h-full border border-solid border-[var(--color-border)]"
        />
      </div>
    </Container>
  );
};

export default Altimeter;
