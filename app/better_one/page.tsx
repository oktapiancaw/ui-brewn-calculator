"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Droplets,
  GlassWater,
  Info,
  Pause,
  Play,
  RotateCcw,
  ThermometerSun,
  Timer,
} from "lucide-react";
interface PourStep {
  index: string;
  time: number;
  endTime: number;
  volume: number;
  label: string;
}
import { Button } from "@/components/ui/button";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

export default function BetterOneMethod() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [coffeeGrams, setCoffeeGrams] = useState<number>(14);

  const totalWater = useMemo(() => coffeeGrams * 16.67, [coffeeGrams]);
  const latterPours = 4;

  const eachLatterVol = totalWater / (latterPours + 1);
  const pourSchedule: PourStep[] = useMemo(() => {
    const schedule: PourStep[] = [];
    schedule.push({
      index: Math.random().toString(36).substring(2, 10),
      time: 0,
      endTime: 50,
      volume: eachLatterVol,
      label: "Bloom",
    });
    schedule.push({
      index: Math.random().toString(36).substring(2, 10),
      time: 10,
      endTime: 15,
      volume: 0,
      label: "Gentle Swirl",
    });
    let bodyTime = 50;

    for (let i = 1; i < latterPours; i++) {
      const endTimeTemp = bodyTime + 10;
      schedule.push({
        index: Math.random().toString(36).substring(2, 10),
        time: bodyTime,
        endTime: endTimeTemp,
        volume: eachLatterVol,
        label: `~${((i + 1) * eachLatterVol).toFixed(1)}ml Total`,
      });
      schedule.push({
        index: Math.random().toString(36).substring(2, 10),
        time: endTimeTemp,
        endTime: endTimeTemp + 10,
        volume: 0,
        label: `Pause`,
      });
      bodyTime = endTimeTemp + 10;
    }
    schedule.push({
      index: Math.random().toString(36).substring(2, 10),
      time: bodyTime,
      endTime: bodyTime + 10,
      volume: eachLatterVol,
      label: `~${((1 + latterPours) * eachLatterVol).toFixed(1)}ml Total`,
    });

    schedule.push({
      index: Math.random().toString(36).substring(2, 10),
      time: 120,
      endTime: 180,
      volume: 0,
      label: `Gentle Swirl, Wait for Drawdown`,
    });
    return schedule;
  }, [latterPours, eachLatterVol]);

  const totalDuration = Math.max(...pourSchedule.map((item) => item.endTime));
  // Function to get current active schedule item
  const getCurrentScheduleItem = () => {
    return pourSchedule.find(
      (item) => seconds >= item.time && seconds < item.endTime
    );
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning && seconds < totalDuration) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const next = prevSeconds + 1;
          if (next >= totalDuration) {
            setIsRunning(false);
            return totalDuration;
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isRunning, seconds, totalDuration]);

  const getBrewTimeClass = (rowIndex: number) => {
    const currentItem = getCurrentScheduleItem();
    const baseClasses =
      "transition-all duration-300 flex items-center justify-between px-4 py-5 rounded-md";
    if (seconds === 0) {
      return `${baseClasses} border border-dashed`;
    } else if (currentItem && pourSchedule.indexOf(currentItem) === rowIndex) {
      return `${baseClasses} border border-l-6 border-green-900/55 border-solid bg-white font-bold dark:bg-stone-900/30 shadow-md transform scale-105`;
    } else if (
      pourSchedule[rowIndex] &&
      seconds < pourSchedule[rowIndex].time
    ) {
      return `${baseClasses} border border-dashed`;
    } else if (
      pourSchedule[rowIndex] &&
      seconds >= pourSchedule[rowIndex].endTime
    ) {
      return `${baseClasses} border border-l-6 dark:border-stone-900/55  bg-stone-50  dark:bg-stone-900/30`;
    } else {
      return `${baseClasses} border border-dashed`;
    }
  };

  return (
    <>
      <div className="mb-8">
        <Link href={"/"}>
          <Button variant={"outline"} className="h-[44px] md:w-[44px] w-full">
            <ArrowLeft />
          </Button>
        </Link>
      </div>
      <header className="mb-12 flex flex-col justify-start items-center">
        <div className="text-center">
          <p className="font-bold text-2xl capitalize text-black dark:text-white">
            A Better One Cup
          </p>
          <p className="text-stone-600 dark:text-stone-500">
            <span>by James Hoffman</span>
          </p>

          <p className="space-x-1 mt-5">
            <Badge variant="outline">#filter</Badge>
            <Badge variant="outline">#v60</Badge>
          </p>
        </div>
      </header>
      <section className="opacity: 1; filter: blur(0px); transform: none;">
        <Alert variant="default">
          <Info className="h-full" />
          <AlertTitle>Perparations</AlertTitle>
          <AlertDescription>
            Things that need to be prepared
            <ul className="list-disc">
              <li>Use soft, clean-tasting filtered water</li>
              <li>Preheat the plastic V60 with hot tap water</li>
              <li>Rinse filter paper thoroughly and discard the rinse water</li>
              <li>
                <b>Medium-fine</b> Grind size of coffee
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </section>
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
                    <p className="font-bold tracking-wider text-base ">
                      1:16.67
                    </p>
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
              <span className="font-medium text-base">
                {latterPours + 1} Pours
              </span>
            </div>
          </div>
        </section>
        <section className="opacity: 1; filter: blur(0px); transform: none; space-y-5">
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

            {pourSchedule.map((p, index) => (
              <div key={index} className={getBrewTimeClass(index)}>
                <span className="basis-1/3 text-center text-stone-700 dark:text-stone-200 font-medium">
                  {formatTime(p.time)} - {formatTime(p.endTime)}
                </span>
                <span className="basis-1/4 text-center text-stone-700 dark:text-stone-200">
                  {p.volume != 0 ? p.volume.toFixed(1) : ""}
                </span>
                <span className="basis-1/3 text-center text-stone-700 dark:text-stone-200">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center space-x-3 mt-10">
            <button
              onClick={handleStart}
              disabled={isRunning || seconds >= totalDuration}
              className="p-4 bg-green-600 dark:bg-green-800/55 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600  disabled:bg-stone-400 dark:disabled:bg-stone-900 disabled:cursor-not-allowed transition-colors"
            >
              <Play />
            </button>
            <button
              onClick={handleStop}
              disabled={!isRunning}
              className="p-4 bg-red-700 darK:bg-red-800/55 text-white rounded-md hover:bg-red-600 disabled:bg-stone-400 dark:disabled:bg-stone-900 disabled:cursor-not-allowed transition-colors"
            >
              <Pause />
            </button>
            <button
              onClick={handleReset}
              className="p-4 bg-stone-600 dark:bg-stone-800 text-white rounded-md hover:bg-stone-700 dark:hover:bg-stone-900 transition-colors"
            >
              <RotateCcw />
            </button>
          </div>
          <div className="flex justify-center items-center">
            <div className="text-5xl font-mono font-bold text-stone-300 dark:text-stone-800">
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
