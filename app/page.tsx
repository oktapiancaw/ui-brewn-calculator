"use client";
import MenuLink from "@/components/menu-link";

const MENU_LIST = [
  {
    id: 1,
    title: "Simpel Brew",
    creator: "Oktapian",
    tags: ["filter", "pour-over", "v60"],
    url: "/simple",
  },
  {
    id: 2,
    title: "A Better One Cup",
    creator: "James Hoffman",
    tags: ["filter", "pour-over", "v60"],
    url: "/better_one",
  },
  {
    id: 3,
    title: "4:6 Method",
    creator: "Tetsu Kasuya",
    tags: ["filter", "pour-over", "v60", "champ"],
    url: "/46",
  },
  {
    id: 4,
    title: "Cold Brew Method",
    creator: "Oktapian",
    tags: ["filter", "cold-brew"],
    url: "/cold-brew",
  },
];

export default function Home() {
  return (
    <>
      <header className="mb-12 flex flex-col justify-start items-center">
        <div className="text-center">
          <p className="font-bold text-2xl capitalize text-stone-800 dark:text-stone-100">
            Manual Brew Methods
          </p>
          <p className="text-stone-600 dark:text-stone-300">
            <span>Recipe & Calculator</span>
          </p>
        </div>
      </header>

      <main className="space-y-12 max-w-3xl mx-auto p-4 min-h-[60vh]">
        <section className="">
          <p className="mb-8">
            Here are the brewing techniques that I know and have recreated as a
            calculator, so you can use them when you want to brew coffee.
          </p>
          <div className="flex flex-col space-y-4 sm:space-y-6">
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
        <section className="">
          <p className="mb-8 text-center text-stone-800 dark:text-stone-200">
            Or you can make it by Yourself
          </p>
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <MenuLink
              title="Make Your Own"
              creator="Yourself"
              tags={["filter", "v60"]}
              url={"/custom"}
            />
          </div>
        </section>
        <section className="">
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            &quot;There is no such thing as bad brewed coffee, there is only
            good coffee and really good coffee.&quot;
            <br />
            <br />- Someone I respect
          </blockquote>
        </section>
      </main>
    </>
  );
}
