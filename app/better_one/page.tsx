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

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import PourSection from "@/components/pour-section";
import MethodHeader from "@/components/method-header";
import SummaryCard from "@/components/summary-card";

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
      time: 0,
      endTime: 50,
      volume: eachLatterVol,
      label: "Bloom",
    });
    schedule.push({
      time: 10,
      endTime: 15,
      volume: 0,
      label: "Gentle Swirl",
    });
    let bodyTime = 50;

    for (let i = 1; i < latterPours; i++) {
      const endTimeTemp = bodyTime + 10;
      schedule.push({
        time: bodyTime,
        endTime: endTimeTemp,
        volume: eachLatterVol,
        label: `~${((i + 1) * eachLatterVol).toFixed(1)}ml Total`,
      });
      schedule.push({
        time: endTimeTemp,
        endTime: endTimeTemp + 10,
        volume: 0,
        label: `Pause`,
      });
      bodyTime = endTimeTemp + 10;
    }
    schedule.push({
      time: bodyTime,
      endTime: bodyTime + 10,
      volume: eachLatterVol,
      label: `~${((1 + latterPours) * eachLatterVol).toFixed(1)}ml Total`,
    });

    schedule.push({
      time: 120,
      endTime: 180,
      volume: 0,
      label: `Gentle Swirl, Wait for Drawdown`,
    });
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
    title: "The Better One Cup",
    creator: "James Hoffman",
    tags: ["filter", "v60"],
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
      notes: "Medium fine",
    },
    {
      title: "Pouring",
      Icon: Droplets,
      notes: (1 + latterPours).toString() + " Pours",
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
                      <Divide />
                      <p className="font-bold tracking-wider text-sm ">
                        1:16.67
                      </p>
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
