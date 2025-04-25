import React, { useMemo } from "react";
import Container from "../Container";
import { params } from "@/hooks";

const Gradienter: React.FC = () => {
  const generateTickStyle = (i: number): React.CSSProperties => {
    let style: React.CSSProperties = {};
    if (i % 5 === 0) {
      style = {
        height: "15px",
        transform: `rotate(${i * 6}deg) translateY(-75px)`,
      };
    } else {
      style = {
        height: "5px",
        transform: `rotate(${i * 6}deg) translateY(-80px)`,
      };
    }
    if (15 < i && i < 45) {
      style.display = "none";
    }
    return style;
  };

  const generateNumberStyle = (i: number): React.CSSProperties => {
    const style: React.CSSProperties = {
      transform: `rotate(${i * 30}deg) translateY(-56px)`,
    };
    if (3 < i && i < 9) {
      style.display = "none";
    }
    return style;
  };

  const valueStyle = useMemo(() => {
    const xangle = (params.roll * (180 / Math.PI)).toFixed(0);
    const yangle = (-1 * (params.pitch * (180 / Math.PI))).toFixed(0);

    return {
      transform: `rotate(${xangle}deg) translateY(${yangle}px)`,
    };
  }, [params.roll, params.pitch]);

  return (
    <Container>
      <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
        <div className="relative flex items-center justify-center w-[170px] aspect-[1/1] overflow-hidden bg-[var(--color-neutral-2)] rounded-[50%]">
          <div className="w-[130px] aspect-[1/1] bg-[var(--color-neutral-5)] rounded-[50%]"></div>
          <div className="absolute w-[100px] aspect-[1/1] bg-[var(--color-neutral-2)] bg-no-repeat bg-center bg-[80%] rounded-[50%]"></div>
          <div className="absolute flex items-center justify-center w-[170px] aspect-[1/1]">
            {Array.from({ length: 60 }).map((_, index) => (
              <div
                key={`tick-${index + 1}`}
                className="absolute w-[1px] bg-[var(--color-neutral-4)]"
                style={generateTickStyle(index + 1)}
              ></div>
            ))}
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`number-${index + 1}`}
                className="absolute text-[11px] text-[var(--color-neutral-2)]"
                style={generateNumberStyle(index + 1)}
              >
                {(Math.abs(6 - (index + 1)) - 3) * 30}
              </div>
            ))}
          </div>
          <div className="absolute flex flex-col gap-[15px] items-center justify-center">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`line-${index}`} className="flex items-center">
                <span className="text-[10px]">{(index - 1) * 15 * -1}</span>
                <span className="inline-block w-[30px] h-[1px] mx-1 bg-[var(--color-neutral-5)]"></span>
                <span className="text-[10px]">{(index - 1) * 15 * -1}</span>
              </div>
            ))}
          </div>
          <div
            className="absolute top-[50%] w-full h-full bg-[rgba(22,93,255,0.15)] border-t border-solid border-t-[rgba(22,93,255,1)] origin-top-center after:absolute after:top-[-5px] after:left-[50%] after:w-[1px] after:h-[10px] after:content-[''] after:bg-[rgba(22,93,255,1)]"
            style={valueStyle}
          ></div>
        </div>
      </div>
    </Container>
  );
};

export default Gradienter;
