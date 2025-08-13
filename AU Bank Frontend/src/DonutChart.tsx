import React from "react";
import ReactECharts from "echarts-for-react";
import { Card } from "./components/ui/card";
import { useTheme } from "@/components/theme-provider";

type ChartDataItem = {
  value: number;
  name: string;
  color?: string; // accepts oklch or any CSS color format
};

interface DonutChartProps {
  title: string;
  data: ChartDataItem[];
  innerRadius?: string; // e.g., "60%"
  outerRadius?: string; // e.g., "80%"
  height?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  title,
  data,
  innerRadius = "60%",
  outerRadius = "80%",
  height = 400,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const option = {
    tooltip: { trigger: "item" },
    legend: {
      bottom: 10,
      left: "center",
      textStyle: {
        color: isDark ? "#fff" : "#000",
        fontSize: 12,
      },
    },
    title: {
      text: title,
      left: "left",
      top: 10,
      textStyle: {
        color: isDark ? "#fff" : "#000",
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    series: [
      {
        name: title,
        type: "pie",
        radius: [innerRadius, outerRadius],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: data.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color },
        })),
      },
    ],
  };

  return (
    <Card className="border-0 rounded-none p-[20px] gap-0">
      <ReactECharts option={option} style={{ height }} />
    </Card>
  );
};

export default DonutChart;
