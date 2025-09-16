// Copyright (c) 2025 Oktapian Candra Adi Wijaya
// Licensed under the MIT License. See LICENSE file for details.

"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Divide,
  Droplets,
  Grip,
  Info,
  Thermometer,
  Waves,
} from "lucide-react";
interface PourStep {
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import PourSection from "@/components/pour-section";
import SummaryCard from "@/components/summary-card";
import MethodHeader from "@/components/method-header";

export default function SimpleOne() {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [coffeeGrams, setCoffeeGrams] = useState<number>(14);

  const totalWater = useMemo(() => coffeeGrams * 15, [coffeeGrams]);
  const latterPours = 4;

  const eachLatterVol = totalWater / latterPours;
  const pourSchedule: PourStep[] = useMemo(() => {
    const schedule: PourStep[] = [];
    schedule.push({
      time: 0,
      endTime: 45,
      volume: eachLatterVol,
      label: "Bloom",
    });
    let bodyTime = 45;

    for (let i = 1; i < latterPours; i++) {
      const endTimeTemp = bodyTime + 45;
      schedule.push({
        time: bodyTime,
        endTime: endTimeTemp,
        volume: eachLatterVol,
        label: `~${(i + 1) * eachLatterVol}ml Total`,
      });
      bodyTime = endTimeTemp;
    }
    return schedule;
  }, [latterPours, eachLatterVol]);

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
    title: "Simple Brew",
    creator: "Oktapian",
    tags: ["filter", "pour-over", "v60"],
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
      notes: "90°C",
    },
    {
      title: "Grind Size",
      Icon: Grip,
      notes: "Medium coarse",
    },
    {
      title: "Pouring",
      Icon: Droplets,
      notes: latterPours.toString() + " Pours",
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
      <main className="space-y-12 max-w-3xl mx-auto p-4">
        <section className="opacity: 1; filter: blur(0px); transform: none;">
          <Alert variant="default">
            <Info className="h-full" />
            <AlertTitle>Perparations</AlertTitle>
            <AlertDescription>
              Things that need to be prepared
              <ul className="list-disc">
                <li>Rinse filter & pre-heat V60</li>
                <li>
                  <b>Medium-coarse</b> Grind size of coffee
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </section>
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
                      <Divide />
                      <p className="font-bold tracking-wider text-sm ">1:15</p>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Coffee ratio</TooltipContent>
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
