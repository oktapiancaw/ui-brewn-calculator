"use client";
import Link from "next/link";

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
            <Link
              className="relative h-full w-full bg-white p-4 border dark:bg-stone-950 overflow-hidden rounded-2xl"
              href={"/46"}
            >
              <div className="flex flex-col justify-left">
                <div className="flex  justify-between items-center space-x-4 flex-col sm:flex-row">
                  <h4 className="font-bold dark:text-stone-100 text-lg md:text-xl">
                    4:6 Method
                  </h4>
                  <p className="space-x-2 text-center sm:text-left">
                    <span className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-stone-100 px-2.5 py-1 my-1.5 text-xs text-black transition-colors duration-200 hover:bg-stone-600 hover:text-stone-50 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700">
                      #filter
                    </span>
                    <span className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-stone-100 px-2.5 py-1 my-1.5 text-xs text-black transition-colors duration-200 hover:bg-stone-600 hover:text-stone-50 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700">
                      #v60
                    </span>
                    <span className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-stone-100 px-2.5 py-1 my-1.5 text-xs text-black transition-colors duration-200 hover:bg-stone-600 hover:text-stone-50 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700">
                      #champ
                    </span>
                  </p>
                </div>
                <p className="text-stone-500 text-sm dark:text-stone-400 text-center sm:text-left">
                  <span className="hidden sm:inline-block">by</span> Tetsu
                  Kasuya
                </p>
              </div>
            </Link>
            <Link
              className="relative h-full w-full bg-white p-4 border dark:bg-stone-950 overflow-hidden rounded-2xl"
              href={"/better_one"}
            >
              <div className="flex flex-col justify-left">
                <div className="flex  justify-between items-center space-x-4 flex-col sm:flex-row">
                  <h4 className="font-bold dark:text-stone-100 text-lg md:text-xl">
                    A Better One Cup
                  </h4>
                  <p className="space-x-2 text-center sm:text-left">
                    <span className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-stone-100 px-2.5 py-1 my-1.5 text-xs text-black transition-colors duration-200 hover:bg-stone-600 hover:text-stone-50 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700">
                      #filter
                    </span>
                    <span className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-stone-100 px-2.5 py-1 my-1.5 text-xs text-black transition-colors duration-200 hover:bg-stone-600 hover:text-stone-50 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700">
                      #v60
                    </span>
                  </p>
                </div>
                <p className="text-stone-500 text-sm dark:text-stone-400 text-center sm:text-left">
                  <span className="hidden sm:inline-block">by</span> James
                  Hoffman
                </p>
              </div>
            </Link>
            <Link
              className="relative h-full w-full bg-white p-4 border dark:bg-stone-950 overflow-hidden rounded-2xl"
              href={"/simple"}
            >
              <div className="flex flex-col justify-left">
                <div className="flex  justify-between items-center space-x-4 flex-col sm:flex-row">
                  <h4 className="font-bold dark:text-stone-100 text-lg md:text-xl">
                    Simple Brew
                  </h4>
                  <p className="space-x-2 text-center sm:text-left">
                    <span className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-stone-100 px-2.5 py-1 my-1.5 text-xs text-black transition-colors duration-200 hover:bg-stone-600 hover:text-stone-50 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700">
                      #filter
                    </span>
                    <span className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-stone-100 px-2.5 py-1 my-1.5 text-xs text-black transition-colors duration-200 hover:bg-stone-600 hover:text-stone-50 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700">
                      #v60
                    </span>
                  </p>
                </div>
                <p className="text-stone-500 text-sm dark:text-stone-400 text-center sm:text-left">
                  <span className="hidden sm:inline-block">by</span> AI
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
