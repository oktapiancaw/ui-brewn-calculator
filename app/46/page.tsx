// Copyright (c) 2025 Oktapian Candra Adi Wijaya
// Licensed under the MIT License. See LICENSE file for details.

"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  ArrowLeft,
  Divide,
  Droplets,
  Grip,
  Info,
  Thermometer,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PourSection from "@/components/pour-section";
import MethodHeader from "@/components/method-header";
import SummaryCard from "@/components/summary-card";
type RoastLevel = "light" | "medium" | "dark";
type TasteBalance = "neutral" | "sweetness" | "acidity";
type Body = "thinner" | "medium" | "stronger";

interface PourStep {
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

export default function TetsuKasuyaMethod() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [coffeeGrams, setCoffeeGrams] = useState<number>(14);
  const [roastLevel, setRoastLevel] = useState<RoastLevel>("medium");
  const [tasteBalance, setTasteBalance] = useState<TasteBalance>("neutral");
  const [body, setBody] = useState<Body>("medium");

  const totalWater = useMemo(() => coffeeGrams * 15, [coffeeGrams]);
  const firstHalfWater = useMemo(() => totalWater * 0.4, [totalWater]);
  const secondHalfWater = useMemo(() => totalWater * 0.6, [totalWater]);
  const latterPours = bodyPoursMap[body];

  const [firstPourRatio, secondPourRatio] = useMemo(() => {
    const base = 0.5;
    const delta = 0.1;
    if (tasteBalance === "sweetness") {
      return [base - delta, base + delta];
    }
    if (tasteBalance === "acidity") {
      return [base + delta, base - delta];
    }
    return [base, base];
  }, [tasteBalance]);

  const pourSchedule: PourStep[] = useMemo(() => {
    const schedule: PourStep[] = [];
    const firstPourVol = firstHalfWater * firstPourRatio;
    schedule.push({
      time: 0,
      endTime: 45,
      volume: firstPourVol,
      label: "1st (bloom)",
    });
    const secondPourVol = firstHalfWater * secondPourRatio;
    schedule.push({
      time: 45,
      endTime: 90,
      volume: secondPourVol,
      label: "2nd (balance)",
    });
    const targetTotal = 165;
    let bodyTime = 90;
    const available = targetTotal - 45;
    const scale = available / latterPours;

    const eachLatterVol = secondHalfWater / latterPours;
    for (let i = 0; i < latterPours; i++) {
      const endTimeTemp = bodyTime + scale;
      schedule.push({
        time: bodyTime,
        endTime: endTimeTemp,
        volume: eachLatterVol,
        label: `${i + 3}th (body)`,
      });
      bodyTime = endTimeTemp;
    }
    return schedule;
  }, [
    firstHalfWater,
    secondHalfWater,
    firstPourRatio,
    secondPourRatio,
    latterPours,
  ]);

  const totalDuration = Math.max(...pourSchedule.map((item) => item.endTime));
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

  const BrewMethod = {
    title: "4:6 Method",
    creator: "Tetsu Kasuya",
    tags: ["filter", "v60", "champ"],
  };
  const summaryCard = [
    {
      title: "Total Water",
      Icon: Waves,
      notes: totalWater.toFixed(1).toString() + " ml",
    },
    {
      title: "Temperature",
      Icon: Thermometer,
      notes: roastTempMap[roastLevel].toString() + "°C",
    },
    {
      title: "Grind Size",
      Icon: Grip,
      notes: "Coarse",
    },
    {
      title: "Pouring",
      Icon: Droplets,
      notes: (2 + latterPours).toString() + " Pours",
    },
  ];

  return (
    <>
      <div className="mb-8">
        <Link href={"/"}>
          <Button
            variant={"outline"}
            className="h-[44px] md:w-[44px] w-full flex items-center justify-center"
          >
            <ArrowLeft />
            <span className="inline md:hidden">Back to home</span>
          </Button>
        </Link>
      </div>
      <MethodHeader
        title={BrewMethod.title}
        creator={BrewMethod.creator}
        tags={BrewMethod.tags}
      />
      <section className="opacity: 1; filter: blur(0px); transform: none;">
        <Alert variant="default">
          <Info className="h-full" />
          <AlertTitle>Perparations</AlertTitle>
          <AlertDescription>
            Things that need to be prepared
            <ul className="list-disc">
              <li>Rinse filter & pre-heat V60</li>
              <li>
                <b>Coarse</b> Grind size of coffee
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
                      <Divide />
                      <p className="font-bold tracking-wider text-sm ">1:15</p>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Coffee ratio</TooltipContent>
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
            {summaryCard.map((summary, index) => (
              <SummaryCard
                key={index}
                title={summary.title}
                Icon={summary.Icon}
                notes={summary.notes}
              />
            ))}
          </div>
        </section>
        <PourSection
          pourSchedule={pourSchedule}
          seconds={seconds}
          setSeconds={setSeconds}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          totalDuration={totalDuration}
        />
      </main>
    </>
  );
}
