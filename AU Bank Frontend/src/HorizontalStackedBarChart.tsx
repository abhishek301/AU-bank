import { useState, useEffect, useCallback } from "react";
import ReactECharts from "echarts-for-react";
import { Card } from "./components/ui/card";
import { useTheme } from "@/components/theme-provider";

interface BarChartProps {
  title: string;
  data: { label: string; value: number; total: number }[];
  primaryColor?: string; // oklch or hex
  secondaryColor?: string; // oklch or hex
}

export default function HorizontalStackedBarChart({
  title,
  data,
  primaryColor = "oklch(75% 0.056 236)",
  secondaryColor = "oklch(93% 0.013 236)",
}: BarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Memoized option generator
  const getOption = useCallback(
    (isMobile: boolean) => ({
      grid: { left: 100, right: 40, top: 40, bottom: 40 },
      xAxis: {
        type: "value",
        max: 100,
        interval: isMobile ? 20 : 10,
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: isDark ? "#fff" : "#000",
          formatter: "${value}",
        },
      },
      yAxis: {
        type: "category",
        data: data.map((d) => d.label),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { color: isDark ? "#fff" : "#000" },
        inverse: true,
      },
      series: [
        {
          name: "Value",
          type: "bar",
          stack: "total",
          data: data.map((d) => d.value),
          barWidth: 27,
          itemStyle: { color: primaryColor },
        },
        {
          name: "Remaining",
          type: "bar",
          stack: "total",
          data: data.map((d) => d.total - d.value),
          barWidth: 27,
          itemStyle: { color: secondaryColor },
        },
      ],
    }),
    [data, isDark, primaryColor, secondaryColor]
  );

  const [option, setOption] = useState(getOption(window.innerWidth < 1280));

  // Update chart on resize
  useEffect(() => {
    const handleResize = () => {
      setOption(getOption(window.innerWidth < 1280));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getOption]);

  // Update chart on theme change
  useEffect(() => {
    setOption(getOption(window.innerWidth < 1280));
  }, [theme, getOption]);

  return (
    <Card className="border-0 rounded-none p-[20px] gap-0">
      <h2 className="dark:text-white text-black text-lg font-semibold">
        {title}
      </h2>
      <ReactECharts option={option} style={{ height: 400 }} />
    </Card>
  );
}
