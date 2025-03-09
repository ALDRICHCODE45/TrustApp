import { Card } from "@/components/ui/card";

export const CardGeneralInformation = ({
  Icon,
  iconColor,
  title,
  info,
  borderColor,
}: {
  Icon: React.ElementType; // O React.ComponentType si prefieres
  iconColor: string;
  title: string;
  info: string | number;
  borderColor: string;
}) => {
  return (
    <Card className={`p-4 border-l-4 ${borderColor}`}>
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="mt-1 flex items-baseline justify-between">
          <p className="text-2xl font-semibold">{info}</p>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
    </Card>
  );
};
