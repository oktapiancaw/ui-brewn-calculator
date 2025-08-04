"use client";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ArrowLeft, Droplets, GlassWater, Info, ThermometerSun, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
type RoastLevel = "light" | "medium" | "dark";
type TasteBalance = "neutral" | "sweetness" | "acidity";
type Body = "thinner" | "medium" | "stronger";

interface PourStep {
  index: number;
  time: number;
  endTime: number;
  volume: number;
  label: string;
}

const roastTempMap: Record<RoastLevel, number> = {
  light: 93,
  medium: 90,
  dark: 85,
};

const bodyPoursMap: Record<Body, number> = {
  thinner: 2,
  medium: 3,
  stronger: 4,
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function TetsuKasuyaMethod() {
  const [coffeeGrams, setCoffeeGrams] = useState<number>(14);
  const [roastLevel, setRoastLevel] = useState<RoastLevel>("medium");
  const [tasteBalance, setTasteBalance] = useState<TasteBalance>("neutral");
  const [body, setBody] = useState<Body>("medium");

  // Derived values
  const totalWater = useMemo(() => coffeeGrams * 15, [coffeeGrams]); // 1:15 ratio
  const firstHalfWater = useMemo(() => totalWater * 0.4, [totalWater]); // 40%
  const secondHalfWater = useMemo(() => totalWater * 0.6, [totalWater]); // 60%
  const latterPours = bodyPoursMap[body];

  // Adjust first-half split for sweetness/acidity
  // Base is 50/50 of first half (two pours: each 20% of total)
  // sweetness: shift 10% of first half from first pour to second (i.e., first gets 0.4*total * (0.5 - 0.1)=0.4*total*0.4 etc.)
  const [firstPourRatio, secondPourRatio] = useMemo(() => {
    const base = 0.5; // of first half
    const delta = 0.1; // shift magnitude
    if (tasteBalance === "sweetness") {
      // less in first pour, more in second
      return [base - delta, base + delta];
    }
    if (tasteBalance === "acidity") {
      return [base + delta, base - delta];
    }
    return [base, base];
  }, [tasteBalance]);

  // Build pour schedule
  const pourSchedule: PourStep[] = useMemo(() => {
    const schedule: PourStep[] = [];
    // first pour at 0:00
    const firstPourVol = firstHalfWater * firstPourRatio;
    schedule.push({
      index: 1,
      time: 0,
      endTime: 45,
      volume: firstPourVol,
      label: "1st (bloom)",
    });
    // second pour after fixed 45s
    const secondPourVol = firstHalfWater * secondPourRatio;
    schedule.push({
      index: 2,
      time: 45,
      endTime: 90,
      volume: secondPourVol,
      label: "2nd (balance)",
    });

    // // Latter half: we want total brew time ~165s (2:45)
    // const targetTotal = 165; // seconds
    // // Current time after second pour is 45s. We need to schedule `latterPours` pours between >45 and around targetTotal - small buffer (assume pours instantaneous)
    // // We'll create descending intervals starting at 40s, decreasing by 5s but not below 25s, then scale to fit available window.
    // const rawIntervals: number[] = [];
    // const startInterval = 40;
    // for (let i = 0; i < latterPours; i++) {
    //   const interval = Math.max(25, startInterval - i * 5);
    //   rawIntervals.push(interval);
    // }
    // // Sum of raw intervals
    // const rawSum = rawIntervals.reduce((a, b) => a + b, 0);
    // // Available time for latter half from after second pour to targetTotal
    // const available = targetTotal - 45; // e.g., 165s
    // // Scale factor to stretch/shrink intervals to fit
    // const scale = available / rawSum;
    // const scaledIntervals = rawIntervals.map((iv) => iv * scale);
    // let cursor = 45;

    const targetTotal = 165;
    let bodyTime = 90;
    const available = targetTotal - 45; // e.g., 120s
    const scale = available / latterPours;

    const eachLatterVol = secondHalfWater / latterPours;
    for (let i = 0; i < latterPours; i++) {
      const endTimeTemp = bodyTime + scale;
      schedule.push({
        index: 3 + i,
        time: bodyTime,
        endTime: endTimeTemp,
        volume: eachLatterVol,
        label: `${i + 3}th (body)`,
      });
      bodyTime = endTimeTemp;
    }
    return schedule;
  }, [firstHalfWater, secondHalfWater, firstPourRatio, secondPourRatio, latterPours]);

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
            The 4:6 Method
          </p>
          <p className="text-stone-600 dark:text-stone-500">
            <span>by Tetsu Kasuya</span>
          </p>

          <p className="space-x-1 mt-5">
            <Badge variant="outline">#filter</Badge>
            <Badge variant="outline">#v60</Badge>
            <Badge variant="outline">#champ</Badge>
          </p>
        </div>
      </header>
      <main className="space-y-12 max-w-3xl mx-auto p-4">
        <section className="opacity: 1; filter: blur(0px); transform: none;">
          <p className="font-semibold text-center text-md mb-4 text-stone-400 dark:text-stone-600">
            Adjustment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
            <div className="grid w-full items-center gap-2 my-2">
              <span className="font-semibold text-sm text-stone-700 dark:text-stone-400">
                Taste Balance
              </span>
              <Select
                value={tasteBalance}
                onValueChange={(e) => setTasteBalance(e as TasteBalance)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select taste balance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="sweetness">More Sweetness</SelectItem>
                    <SelectItem value="acidity">More Acidity</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-2 my-2">
              <span className="font-semibold text-sm text-stone-700 dark:text-stone-400">
                Body (thinner/stronger)
              </span>
              <Select value={body} onValueChange={(e) => setBody(e as Body)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select body" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="thinner">
                      Thinner (2 pours latter half)
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium (3 pours latter half)
                    </SelectItem>
                    <SelectItem value="stronger">
                      Stronger (4 pours latter half)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-2 my-2">
              <span className="font-semibold text-sm text-stone-700 dark:text-stone-400">
                Roast Level
              </span>
              <Select
                value={roastLevel}
                onValueChange={(e) => setRoastLevel(e as RoastLevel)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select roast level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              <span className="font-medium text-base">
                {roastTempMap[roastLevel]}°C
              </span>
            </div>
            <div className="p-4 border rounded-lg text-center flex items-center flex-col">
              <span className="text-sm  text-stone-700 dark:text-stone-400">
                Brew Time
              </span>
              <Timer className="h-[2.5rem] w-[2.5rem] my-4 stroke-stone-900 dark:stroke-stone-100" />
              <span className="font-medium text-base">3:30</span>
            </div>
            <div className="p-4 border rounded-lg text-center flex items-center flex-col">
              <span className="text-sm  text-stone-700 dark:text-stone-400">
                Pouring
              </span>
              <Droplets className="h-[2.5rem] w-[2.5rem] my-4 stroke-stone-900 dark:stroke-stone-100" />
              <span className="font-medium text-base">
                {2 + latterPours} Pours
              </span>
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
