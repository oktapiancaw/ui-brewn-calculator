import { LucideIcon } from "lucide-react";

type summaryCardProps = {
  title: string;
  Icon: LucideIcon;
  notes: string;
};

export default function SummaryCard({ title, Icon, notes }: summaryCardProps) {
  return (
    <div className="p-4 border rounded-lg text-center flex items-center flex-col">
      <span className="text-sm  text-stone-700 dark:text-stone-400">
        {title}
      </span>
      <Icon className="h-[2.5rem] w-[2.5rem] my-4 stroke-stone-900 dark:stroke-stone-100" />
      <span className="font-medium text-base">{notes}</span>
    </div>
  );
}
