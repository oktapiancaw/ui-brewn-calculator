"use client";
import React, { useEffect, useState } from "react";
import MethodHeader from "@/components/method-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Divide, Droplets, Hash, Plus, Sliders, Timer, Trash2, Waves } from "lucide-react";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import PourSection from "@/components/pour-section";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SummaryCard from "@/components/summary-card";

type BrewMethod = {
  title: string;
  creator: string;
  coffeeGram: number;
  tags: string[];
  grindSize: string;
  roastLevel: string;
  waterTemp: number;
};
interface PourStep {
  id: number;
  time: number;
  endTime: number;
  volume: number;
  label: string;
}
export default function CustomePage() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [method, setMethod] = useState<BrewMethod>({
    title: "Make your Own",
    creator: "Yourself",
    tags: ["filter", "v60"],
    coffeeGram: 14,
    grindSize: "fine",
    roastLevel: "medium",
    waterTemp: 90
  })
  const [useNumberInput, setUseNumberInput] = useState(false);
  const maxSeconds = 1200; // 20 Minutes
  const [schedules, setSchedules] = useState<PourStep[]>([
    {
      id: 1,
      time: 0,
      endTime: 60,
      volume: 40,
      label: "Bloom (click to change)",
    },
  ]);

  const addSchedule = () => {
    const newId = Math.max(...schedules.map((i) => i.id)) + 1;
    const lastSchedule = schedules[schedules.length - 1];
    const newStart = Math.min(
      lastSchedule ? lastSchedule.endTime : 0,
      maxSeconds - 10
    );
    const newEnd = Math.min(newStart + 30, maxSeconds);

    setSchedules([
      ...schedules,
      {
        id: newId,
        time: newStart,
        endTime: newEnd,
        volume: 0,
        label: "",
      },
    ]);
  };

  const removeSchedule = (id: number) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    }
  };
  const updateMethodField = <K extends keyof BrewMethod>(
      key: K,
      value: BrewMethod[K]
    ) => {
      setMethod((prev) => ({
        ...prev,
        [key]: value,
      }));
    };
  const updateSchedule = (id: number, field: string, value: number) => {
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.id === id) {
          const updated = { ...schedule, [field]: value };

          if (field === "time" && updated.time >= updated.endTime) {
            updated.endTime = Math.min(updated.time + 1, maxSeconds);
          }
          if (field === "endTime" && updated.endTime <= updated.time) {
            updated.time = Math.max(updated.endTime - 1, 0);
          }
          return updated;
        }
        return schedule;
      })
    );
  };

  const totalCycleDuration = schedules.reduce(
    (total, schedule) => total + (schedule.endTime - schedule.time),
    0
  );
  const totalWaterVolume = schedules.reduce(
    (total, schedule) => total + schedule.volume,
    0
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning && seconds < totalCycleDuration) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const next = prevSeconds + 1;
          if (next >= totalCycleDuration) {
            setIsRunning(false);
            return totalCycleDuration;
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
  }, [isRunning, seconds, totalCycleDuration]);

  const updateScheduleName = (id: number, label: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, label } : schedule
      )
    );
  };
  const updateScheduleVolume = (id: number, volume: number) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, volume } : schedule
      )
    );
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };


  const summaryCard = [
    {
      title: "Total Time",
      Icon: Timer,
      notes: formatTime(totalCycleDuration),
    },
    {
      title: "Total Water",
      Icon: Waves,
      notes: totalWaterVolume.toFixed(1).toString() + " ml",
    },
    {
      title: "Ratio",
      Icon: Divide,
      notes: "1 : " + (totalWaterVolume / method.coffeeGram).toFixed(2),
    },
    {
      title: "Pouring",
      Icon: Droplets,
      notes: (schedules.length).toString() + " Pours",
    },
  ];
  return (
    <>
      <div className="mb-8">
        <Link href={"/"}>
          <Button variant={"outline"} className="h-[44px] md:w-[44px] w-full">
            <ArrowLeft />
          </Button>
        </Link>
      </div>
      <MethodHeader
        title={method.title}
        creator={method.creator}
        tags={method.tags}
      />
      <main className="space-y-12 max-w-3xl mx-auto p-4">
        <section className="opacity: 1; filter: blur(0px); transform: none;">
          <p className="font-semibold text-center text-md mb-4 text-stone-400 dark:text-stone-600">
            Builder
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="grid w-full items-center gap-2 my-2">
              <label
                className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                htmlFor="methodName"
              >
                Method Name
              </label>

              <div className="flex justify-center items-center space-x-2">
                <Input
                  id="methodName"
                  type="text"
                  value={method.title}
                  onChange={(e) => updateMethodField('title', e.target.value)}
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-2 my-2">
              <label
                className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                htmlFor="yourName"
              >
                Your Name
              </label>

              <div className="flex justify-center items-center space-x-2">
                <Input
                  id="yourName"
                  type="text"
                  value={method.creator}
                  onChange={(e) => updateMethodField('creator', e.target.value)}
                />
              </div>
            </div>
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
                  value={method.coffeeGram}
                  onChange={(e) => updateMethodField('coffeeGram', Number(e.target.value))}
                  min={5}
                  step={0.5}
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-2 my-2">
              <label
                className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                htmlFor="waterTemp"
              >
                Water Temperature (Celcius)
              </label>

              <div className="flex justify-center items-center space-x-2">
                <Input
                  id="waterTemp"
                  type="number"
                  value={method.waterTemp}
                  onChange={(e) => updateMethodField('waterTemp', Number(e.target.value))}
                  min={-40}
                  max={200}
                  step={0.5}
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-2 my-2">
              <span className="font-semibold text-sm text-stone-700 dark:text-stone-400">
                Grind Size
              </span>
              <Select
                value={method.grindSize}
                onValueChange={(e) => updateMethodField('grindSize', e)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select grind size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="fine">Fine</SelectItem>
                    <SelectItem value="medium-fine">Medium Fine</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="medium-coarse">Medium Coarse</SelectItem>
                    <SelectItem value="coarse">Coarse</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-2 my-2">
              <span className="font-semibold text-sm text-stone-700 dark:text-stone-400">
                Roast Level
              </span>
              <Select
                value={method.roastLevel}
                onValueChange={(e) => updateMethodField('roastLevel', e)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select roast Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium-light">Medium Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="medium-dark">Medium Dark</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
        <section className="opacity: 1; filter: blur(0px); transform: none; mb-20">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <h3 className="text-xl font-semibold text-stone-800 mb-4 sm:mb-0">
                Schedules
              </h3>
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <div className="flex items-center gap-2 px-3 py-2rounded-lg">
                  <button
                    onClick={() => setUseNumberInput(false)}
                    className={`p-1 rounded transition-colors ${
                      !useNumberInput
                        ? "bg-stone-800 text-white duration-300 "
                        : "text-stone-600 duration-300  hover:bg-stone-200 dark:hover:bg-stone-800"
                    }`}
                    title="Slider Input"
                  >
                    <Sliders size={16} />
                  </button>
                  <button
                    onClick={() => setUseNumberInput(true)}
                    className={`p-1 rounded transition-colors ${
                      useNumberInput
                        ? "bg-stone-800 text-white duration-300 "
                        : "text-stone-600 duration-300  hover:bg-stone-200 dark:hover:bg-stone-800"
                    }`}
                    title="Number Input"
                  >
                    <Hash size={16} />
                  </button>
                </div>
                <button
                  onClick={addSchedule}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 duration-300 transition-colors"
                >
                  <Plus size={16} />
                  Add Schedule
                </button>
              </div>
            </div>

            {schedules.map((schedule, index) => (
              <div
                key={schedule.id}
                className={`p-4 border-2 rounded-lg transition-all border-stone-200 dark:border-stone-800`}
              >
                <div className="flex flex-col items-left sm:flex-row sm:items-center justify-between mb-3">
                  <input
                    type="text"
                    value={schedule.label}
                    onChange={(e) =>
                      updateScheduleName(schedule.id, e.target.value)
                    }
                    className="text-lg font-medium bg-transparent border-none outline-none focus:bg-stone-200 dark:focus:bg-stone-900 duration-200 focus:border focus:border-stone-300 rounded px-2 py-1"
                  />
                  <div className="flex items-center justify-end sm:justify-start gap-2 mt-4 sm:mt-0">
                    <span className="text-sm text-stone-500">
                      Duration: {formatTime(schedule.endTime - schedule.time)}
                    </span>
                    {schedules.length > 1 && (
                      <button
                        onClick={() => removeSchedule(schedule.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Second */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700">
                      Start Second
                    </label>
                    {useNumberInput ? (
                      <div className="space-y-2">
                        <Input
                          type="number"
                          value={schedule.time}
                          onChange={(e) =>
                            updateSchedule(
                              schedule.id,
                              "time",
                              Number(e.target.value)
                            )
                          }
                          min={5}
                          max={maxSeconds - 1}
                          step={1}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Slider
                          defaultValue={[schedule.time]}
                          value={[schedule.time]}
                          max={maxSeconds}
                          step={1}
                          onValueChange={(e) =>
                            updateSchedule(schedule.id, "time", e[0])
                          }
                        />
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>0</span>
                          <span>{maxSeconds - 1}</span>
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <span className="inline-block bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-stone-400 px-3 py-1 rounded-full text-sm font-medium">
                        {formatTime(schedule.time)}
                      </span>
                    </div>
                  </div>

                  {/* End Second */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700">
                      End Second
                    </label>
                    {useNumberInput ? (
                      <div className="space-y-2">
                        <Input
                          type="number"
                          value={schedule.endTime}
                          onChange={(e) =>
                            updateSchedule(
                              schedule.id,
                              "endTime",
                              Number(e.target.value)
                            )
                          }
                          min={1}
                          max={maxSeconds}
                          step={1}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Slider
                          defaultValue={[schedule.endTime]}
                          value={[schedule.endTime]}
                          max={maxSeconds}
                          step={1}
                          onValueChange={(e) =>
                            updateSchedule(schedule.id, "endTime", e[0])
                          }
                        />
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>1</span>
                          <span>{maxSeconds}</span>
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-stone-400 px-3 py-1 rounded-full text-sm font-medium">
                        {formatTime(schedule.endTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Timeline for this schedule */}
                <div className="mt-4">
                  <div className="relative h-6 bg-stone-200 dark:bg-stone-800 rounded-lg overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-lime-400 to-green-500 opacity-75"
                      style={{
                        left: `${(schedule.time / maxSeconds) * 100}%`,
                        width: `${
                          ((schedule.endTime - schedule.time) / maxSeconds) *
                          100
                        }%`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-stone-700 dark:text-stone-500">
                      {formatTime(schedule.time)} -{" "}
                      {formatTime(schedule.endTime)}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                    htmlFor="coffeeGram"
                  >
                    Water (ml)
                  </label>

                  <div className="flex justify-center items-center space-x-2">
                    <Input
                      id="coffeeGram"
                      type="number"
                      value={schedule.volume}
                      onChange={(e) =>
                        updateScheduleVolume(
                          schedule.id,
                          Number(e.target.value)
                        )
                      }
                      min={0}
                      step={0.5}
                    />
                  </div>
                </div>
              </div>
            ))}
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
          pourSchedule={schedules}
          seconds={seconds}
          setSeconds={setSeconds}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          totalDuration={totalCycleDuration}
        />
      </main>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
}
