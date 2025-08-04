"use client";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Droplets,
  GlassWater,
  Info,
  ThermometerSun,
  Timer,
} from "lucide-react";
interface PourStep {
  index: number;
  time: number;
  endTime: number;
  volume: number;
  label: string;
}
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function TetsuKasuyaMethod() {
  const [coffeeGrams, setCoffeeGrams] = useState<number>(14);

  // Derived values
  const totalWater = useMemo(() => coffeeGrams * 15, [coffeeGrams]); // 1:15 ratio
  const latterPours = 4;

  const eachLatterVol = totalWater / latterPours;
  // Build pour schedule
  const pourSchedule: PourStep[] = useMemo(() => {
    const schedule: PourStep[] = [];
    // first pour at 0:00
    schedule.push({
      index: 1,
      time: 0,
      endTime: 45,
      volume: eachLatterVol,
      label: "bloom",
    });
    let bodyTime = 45;

    for (let i = 1; i < latterPours; i++) {
      const endTimeTemp = bodyTime + 45;
      schedule.push({
        index: 3 + i,
        time: bodyTime,
        endTime: endTimeTemp,
        volume: eachLatterVol,
        label: `~${ (i+1) * eachLatterVol}ml Total`,
      });
      bodyTime = endTimeTemp;
    }
    return schedule;
  }, [latterPours, eachLatterVol]);

  return (
    <>
      <div className="mb-8">
        <Button variant={'outline'} className="h-[44px] md:w-[44px] w-full">
          <Link href={'/'}><ArrowLeft /></Link> 
        </Button>
      </div>
      <header className="mb-12 flex flex-col justify-start items-center">
        <div className="text-center">
          <p className="font-bold text-2xl capitalize text-black dark:text-white">
            Simple Brew
          </p>
          <p className="text-stone-600 dark:text-stone-500">
            <span>by AI</span>
          </p>

          <p className="space-x-1 mt-5">
            <Badge variant="outline">#filter</Badge>
            <Badge variant="outline">#v60</Badge>
          </p>
        </div>
      </header>
      <main className="space-y-12 max-w-3xl mx-auto p-4">
        <section className="opacity: 1; filter: blur(0px); transform: none;">
          <p className="font-semibold text-center text-md mb-4 text-stone-400 dark:text-stone-600">
            Adjustment
          </p>
          <div className="grid grid-cols-1 gap-2">
            <div className="grid w-full items-center gap-2 my-2">
              <label
                className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                htmlFor="coffeeGram"
              >
                Coffee (grams)
              </label>

              <div className="flex justify-center items-center space-x-2">
                <Input
                  id="coffeeGram"
                  type="number"
                  value={coffeeGrams}
                  onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                  min={5}
                  step={0.5}
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <Info></Info>
                      Ratio
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold tracking-wider text-base ">1:15</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>
        <section className="opacity: 1; filter: blur(0px); transform: none;">
          <p className="font-semibold text-center text-md mb-4 text-stone-400 dark:text-stone-600">
            Summary
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="p-4 border rounded-lg text-center flex items-center flex-col">
              <span className="text-sm  text-stone-700 dark:text-stone-400">
                Total Water
              </span>
              <GlassWater className="h-[2.5rem] w-[2.5rem] my-4 stroke-stone-900 dark:stroke-stone-100" />
              <span className="font-medium text-base">
                {totalWater.toFixed(1)} ml
              </span>
            </div>
            <div className="p-4 border rounded-lg text-center flex items-center flex-col">
              <span className="text-sm text-stone-700 dark:text-stone-400">
                Temperature
              </span>
              <ThermometerSun className="h-[2.5rem] w-[2.5rem] my-4 stroke-stone-900 dark:stroke-stone-100" />
              <span className="font-medium text-base">90°C</span>
            </div>
            <div className="p-4 border rounded-lg text-center flex items-center flex-col">
              <span className="text-sm  text-stone-700 dark:text-stone-400">
                Brew Time
              </span>
              <Timer className="h-[2.5rem] w-[2.5rem] my-4 stroke-stone-900 dark:stroke-stone-100" />
              <span className="font-medium text-base">03:00</span>
            </div>
            <div className="p-4 border rounded-lg text-center flex items-center flex-col">
              <span className="text-sm  text-stone-700 dark:text-stone-400">
                Pouring
              </span>
              <Droplets className="h-[2.5rem] w-[2.5rem] my-4 stroke-stone-900 dark:stroke-stone-100" />
              <span className="font-medium text-base">{latterPours} Pours</span>
            </div>
          </div>
        </section>
        <section className="opacity: 1; filter: blur(0px); transform: none;">
          <p className="font-semibold text-center text-md mb-4 text-stone-400 dark:text-stone-600">
            Pour Schedule
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="basis-1/3 text-center text-sm text-stone-600 dark:text-stone-400 font-semibold">
                Time
              </span>
              <span className="basis-1/4 text-center text-sm text-stone-600 dark:text-stone-400 font-semibold">
                Volume (ml)
              </span>
              <span className="basis-1/3 text-center text-sm text-stone-600 dark:text-stone-400 font-semibold">
                Label
              </span>
            </div>

            {pourSchedule.map((p) => (
              <div
                key={p.index}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="basis-1/3 text-center text-stone-700 dark:text-stone-200 font-medium">
                  {formatTime(p.time)} - {formatTime(p.endTime)}
                </span>
                <span className="basis-1/4 text-center text-stone-700 dark:text-stone-200">
                  {p.volume.toFixed(1)}
                </span>
                <span className="basis-1/3 text-center text-stone-700 dark:text-stone-200">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
