import React from "react";
import Container from "../Container";
const sources = [
  {
    name: "岗位",
    value: "高级飞行员",
  },
  {
    name: "行业经验",
    value: "5年",
  },
  {
    name: "编号",
    value: "#1c55e1d88e7b",
  },
  {
    name: "执照到期时间",
    value: "2030-01-01",
  },
  {
    name: "状态",
    value: "已授权",
  },
  {
    name: "牌照种类",
    value: "UTC",
  },
  {
    name: "语言",
    value: "中文(熟练)",
  },
];

const PlayerProfile: React.FC = () => {
  return (
    <Container>
      <div className="flex flex-col items-center">
        <div className="w-[50px] h-[50px] mt-5 bg-[url('@/assets/images/avatar.png')] bg-cover rounded-[50%]"></div>
        <div className="relative flex mt-2 text-xs">
          <span className="font-[DincorosBlack] text-lg">飞行员01</span>
          <span className="flex items-center justify-center w-[15px] h-[15px] ml-1 text-[10px] text-white bg-[#165dff] rounded-[50%]">
            ♂
          </span>
        </div>
        <div className="box-border w-full px-2.5 mt-6">
          {sources.map((item) => (
            <div key={item.name} className="flex text-sm leading-[25px]">
              <span className="w-[45%] text-[var(--color-text-2)]">
                {item.name}:
              </span>
              <span className="w-[50%]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default PlayerProfile;
