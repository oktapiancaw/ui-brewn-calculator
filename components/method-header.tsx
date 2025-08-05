import { Badge } from "./ui/badge";

type methodHeaderProps = {
  title: string;
  creator: string;
  tags: string[];
};

export default function MethodHeader({
  title,
  creator,
  tags,
}: methodHeaderProps) {
  return (
    <header className="mb-12 flex flex-col justify-start items-center">
      <div className="text-center">
        <p className="font-bold text-2xl capitalize text-black dark:text-white">
          {title}
        </p>
        <p className="text-stone-600 dark:text-stone-500">
          <span>by {creator}</span>
        </p>

        <p className="space-x-1 mt-5">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              #{tag}
            </Badge>
          ))}
        </p>
      </div>
    </header>
  );
}
