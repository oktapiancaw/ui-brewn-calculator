"use client";
import MenuLink from "@/components/menu-link";

const MENU_LIST = [
  {
    id: 1,
    title: "4:6 Method",
    creator: "Tetsu Kasuya",
    tags: ["filter", "v60", "champ"],
    url: "/46",
  },
  {
    id: 2,
    title: "A Better One Cup",
    creator: "James Hoffman",
    tags: ["filter", "v60"],
    url: "/better_one",
  },
  {
    id: 3,
    title: "Simpel Brew",
    creator: "AI",
    tags: ["filter", "v60"],
    url: "/simple",
  },
  {
    id: 4,
    title: "Make Your Own",
    creator: "Yourself",
    tags: ["filter", "v60"],
    url: "/custom",
  },
];

export default function Home() {
  return (
    <>
      <header className="mb-12 flex flex-col justify-start items-center">
        <div className="text-center">
          <p className="font-bold text-2xl capitalize text-black dark:text-white">
            Manual Brew Methods
          </p>
          <p className="text-stone-600 dark:text-stone-500">
            <span>by Someone I respect</span>
          </p>
        </div>
      </header>

      <main className="space-y-12 max-w-3xl mx-auto p-4 min-h-[60vh]">
        <section className="opacity: 1; filter: blur(0px); transform: none;">
          <p className="mb-8">
            Here are the brewing techniques that I know and have recreated as a
            calculator, so you can use them when you want to brew coffee.
          </p>
          <div className="flex flex-col space-y-4">
            {MENU_LIST.map((menu) => (
              <MenuLink
                key={menu.id}
                title={menu.title}
                creator={menu.creator}
                tags={menu.tags}
                url={menu.url}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
