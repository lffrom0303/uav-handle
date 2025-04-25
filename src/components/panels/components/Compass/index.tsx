import React, { useMemo } from "react";
import Container from "../Container";
import { params } from "@/hooks";

const Compass: React.FC = () => {
  const tickNumbers = [
    "北",
    "30",
    "60",
    "东",
    "120",
    "150",
    "南",
    "210",
    "240",
    "西",
    "300",
    "330",
  ];

  const generateTickStyle = (i: number): React.CSSProperties => {
    if (i % 5 === 0) {
      return {
        height: "15px",
        transform: `rotate(${i * 6}deg) translateY(-75px)`,
        background: "var(--color-neutral-4)",
      };
    } else {
      return {
        transform: `rotate(${i * 6}deg) translateY(-80px)`,
      };
    }
  };

  const generateNumberStyle = (i: number): React.CSSProperties => {
    if ([0].includes(i)) {
      return {
        color: "rgb(var(--primary-6))",
        transform: `rotate(${i * 30}deg) translateY(-52px)`,
      };
    } else {
      return {
        transform: `rotate(${i * 30}deg) translateY(-52px)`,
      };
    }
  };

  const valueStyle = useMemo(() => {
    const angle = (params.heading * (180 / Math.PI)).toFixed(0);
    return {
      transform: `rotate(${angle}deg)`,
    };
  }, [params.heading]);

  return (
    <Container>
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="absolute top-[5px] z-[1] w-0 h-0 border-[10px] border-solid border-t-[rgb(var(--primary-6))] border-x-transparent border-b-transparent"></div>
        <div className="relative flex items-center justify-center w-[170px] aspect-[1/1] mt-[10px] overflow-hidden bg-[var(--color-neutral-2)] rounded-[50%]">
          <div className="w-[130px] aspect-[1/1] bg-[var(--color-neutral-5)] rounded-[50%]"></div>
          <div className="absolute w-[80px] aspect-[1/1] bg-[var(--color-neutral-2)] bg-[url('@/assets/images/world.svg')] bg-no-repeat bg-center bg-[80%] rounded-[50%]"></div>
          <div
            className="absolute flex items-center justify-center w-[170px] aspect-[1/1]"
            style={valueStyle}
          >
            {Array.from({ length: 60 }).map((_, index) => (
              <div
                key={`tick-${index + 1}`}
                className="absolute w-[1px] bg-[var(--color-neutral-4)]"
                style={generateTickStyle(index + 1)}
              ></div>
            ))}
            {tickNumbers.map((number, index) => (
              <div
                key={`number-${number}`}
                className="absolute text-[11px] text-[var(--color-neutral-2)]"
                style={generateNumberStyle(index)}
              >
                {number}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Compass;
