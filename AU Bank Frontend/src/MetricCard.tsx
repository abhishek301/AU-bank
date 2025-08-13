import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-card text-card-foreground shadow-md rounded-none border-0 py-[30px]">
      <CardContent
        className="
          flex items-center px-[30px] 
          md:flex-col md:items-center md:text-center
          lg:flex-row lg:text-left lg:items-center
        "
      >
        <div className="mr-[30px] md:mr-0 md:mb-4 lg:mb-0 lg:mr-[30px]">
          {icon}
        </div>
        <div>
          <h2 className="font-inter font-medium text-xl leading-none tracking-normal mb-[12px]">
            {title}
          </h2>
          <p className="font-inter font-bold text-3xl leading-none tracking-normal">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
