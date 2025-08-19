import Link from "next/link";

type MenuLinkProps = {
  title: string;
  creator: string;
  tags: string[];
  url: string;
};

export default function MenuLink({ title, creator, tags, url }: MenuLinkProps) {
  return (
    <Link
      className="relative h-full w-full bg-white shadow-sm p-4 border dark:bg-stone-950 overflow-hidden rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-900 duration-500"
      href={url}
    >
      <div className="flex flex-col justify-left">
        <div className="flex  justify-between items-center flex-col sm:flex-row">
          <h4 className="font-bold dark:text-stone-100 text-lg sm:text- text-center sm:text-left">
            {title}
          </h4>
          <p className="space-x-2 text-center sm:text-left">
            {tags.map((tag) => (
              <span
                key={tag}
                className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-stone-100 px-2.5 py-1 my-1.5 text-xs text-black transition-colors duration-200 hover:bg-stone-600 hover:text-stone-50 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
              >
                #{tag}
              </span>
            ))}
          </p>
        </div>
        <p className="text-stone-500 text-sm dark:text-stone-400 text-center sm:text-left">
          <span className="hidden sm:inline-block">by</span> {creator}
        </p>
      </div>
    </Link>
  );
}
