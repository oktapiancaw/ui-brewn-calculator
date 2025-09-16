// Copyright (c) 2025 Oktapian Candra Adi Wijaya
// Licensed under the MIT License. See LICENSE file for details.

"use client";
import LZString from "lz-string";
import React, { useEffect, useState, useMemo } from "react";
import MethodHeader from "@/components/method-header";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowDownToLine,
  ArrowLeft,
  CircleCheck,
  Copy,
  Divide,
  Droplets,
  Eye,
  EyeOff,
  Hash,
  Info,
  Plus,
  Sliders,
  Timer,
  Trash2,
  Waves,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import MultiValueInput from "@/components/multi-value-input";
import { useSearchParams } from "next/navigation";

interface PourStep {
  id: number;
  time: number;
  endTime: number;
  volume: number;
  label: string;
}
type BrewMethod = {
  title: string;
  creator: string;
  coffeeGram: number;
  preparation?: string;
  keyNotes?: string;
  tags: string[];
  grindSize: string;
  roastLevel: string;
  waterTemp: number;
  schedules: PourStep[];
};

const defaultMethod = {
  title: "Make your Own",
  creator: "Yourself",
  tags: ["filter", "v60"],
  coffeeGram: 14,
  grindSize: "fine",
  roastLevel: "medium",
  preparation: "- Boil the water\n- Rinse the paper filter",
  keyNotes: "Tested on Kamojang Natural beans, and it smooth",
  waterTemp: 90,
  schedules: [
    {
      id: 1,
      time: 0,
      endTime: 45,
      volume: 40,
      label: "Bloom (click to change)",
    },
    {
      id: 2,
      time: 45,
      endTime: 120,
      volume: 50,
      label: "",
    },
    {
      id: 3,
      time: 120,
      endTime: 200,
      volume: 120,
      label: "",
    },
    {
      id: 4,
      time: 200,
      endTime: 240,
      volume: 0,
      label: "Wait the drawdown",
    },
  ],
};


export default function CustomePage() {
  const searchParams = useSearchParams();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [maxDuration, setMaxDuration] = useState(240);
  const [isHidden, setIsHidden] = useState(false);
  const [useNumberInput, setUseNumberInput] = useState(true);
  const [method, setMethod] = useState<BrewMethod>(defaultMethod);
  const [isCopied, setIsCopied] = useState<boolean>(false)
  useEffect(() => {
    const compressed = searchParams.get("d");
    if (compressed) {
      try {
        const jsonStr = LZString.decompressFromEncodedURIComponent(compressed);
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          setMethod(parsed);
        }
      } catch (err) {
        console.error("Failed to decompress", err);
      }
    }
  }, [searchParams]);

  const handleCopy = () => {
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(method));
    const shortUrl = `${window.location.protocol}//${window.location.host}/custom?d=${compressed}`
    navigator.clipboard.writeText(shortUrl)
    setIsCopied(true)

    setTimeout(() => setIsCopied(false), 3000);
  };


  const isValidBrewMethod = (data: unknown): data is BrewMethod => {
    if (typeof data !== "object" || data === null) return false;

    const bm = data as Record<string, unknown>;

    return (
      typeof bm.title === "string" &&
      typeof bm.creator === "string" &&
      typeof bm.coffeeGram === "number" &&
      Array.isArray(bm.tags) &&
      bm.tags.every((tag) => typeof tag === "string") &&
      typeof bm.grindSize === "string" &&
      typeof bm.roastLevel === "string" &&
      typeof bm.waterTemp === "number" &&
      Array.isArray(bm.schedules) &&
      bm.schedules.every((s: unknown) => {
        if (typeof s !== "object" || s === null) return false;
        const step = s as Record<string, unknown>;
        return (
          typeof step.id === "number" &&
          typeof step.time === "number" &&
          typeof step.endTime === "number" &&
          typeof step.volume === "number" &&
          typeof step.label === "string"
        );
      })
    );
  };

  const handleExport = () => {
    const json = JSON.stringify(method, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = method.title + " by " + method.creator + ".json";
    link.click();

    URL.revokeObjectURL(url);

    toast.success("Success export", {
      description: "Success to export your method, check it on your folder",
    });
  };

  const handleResetUpload = () => {
    if (isUploaded) {
      setMethod(defaultMethod);
      setIsUploaded(false);

      toast.info("Method reset", {
        description: "Brew method has been reset to default",
      });
    }
  };
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (isValidBrewMethod(parsed)) {
          setMethod(parsed);
          setIsUploaded(true);

          toast.success("Success import", {
            description: "Your brew method is valid, and success to import",
          });
        } else {
          toast.error("Failed to import", {
            description: "Your brew method is invalid",
          });
          throw new Error("Invalid BrewMethod structure");
        }
      } catch (err) {
        toast.error("Failed to import", {
          description: "Your brew method is invalid",
        });
        console.error(err);
        alert("Invalid BrewMethod JSON file");
      }
    };

    reader.readAsText(file);
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

  const addSchedule = () => {
    const newId = Math.max(...method.schedules.map((i) => i.id)) + 1;
    const lastSchedule = method.schedules[method.schedules.length - 1];
    const newStart = Math.min(
      lastSchedule ? lastSchedule.endTime : 0,
      maxDuration - 10
    );
    const newEnd = Math.min(newStart + 30, maxDuration);

    updateMethodField("schedules", [
      ...method.schedules,
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
    if (method.schedules.length > 1) {
      updateMethodField(
        "schedules",
        method.schedules.filter((schedule) => schedule.id !== id)
      );
    }
  };
  const updateSchedule = (id: number, field: string, value: number) => {
    updateMethodField(
      "schedules",
      method.schedules.map((schedule) => {
        if (schedule.id === id) {
          const updated = { ...schedule, [field]: value };

          if (field === "time" && updated.time >= updated.endTime) {
            updated.endTime = Math.min(updated.time + 1, maxDuration);
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



  const totalCycleDuration = useMemo(() => {
    if (!method) return 0;
    return method.schedules.reduce(
      (total, schedule) => total + (schedule.endTime - schedule.time),
      0
    );
  }, [method]);

  const totalWaterVolume = useMemo(() => {
    if (!method) return 0;
    return method.schedules.reduce(
      (total, schedule) => total + schedule.volume,
      0
    );
  }, [method]);

  const totalPours = useMemo(() => {
    if (!method) return 0;
    return method.schedules.filter((schedule) => schedule.volume > 0).length;
  }, [method]);

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
    updateMethodField(
      "schedules",
      method.schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, label } : schedule
      )
    );
  };

  const updateScheduleVolume = (id: number, volume: number) => {
    updateMethodField(
      "schedules",
      method.schedules.map((schedule) =>
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
      notes: totalPours + " Pours",
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
        title={method.title}
        creator={method.creator}
        tags={method.tags}
      />
      <main className="space-y-12 max-w-3xl mx-auto p-4">
        <section className="opacity: 1; filter: blur(0px); transform: none;">
          <p className="font-semibold text-center text-md mb-4 text-stone-400 dark:text-stone-600">
            Builder
          </p>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center space-x-2 mb-4">
            <label
              className="font-semibold min-w-1/2 text-sm text-stone-700 dark:text-stone-400 sm:mb-0 mb-2"
              htmlFor="methodName"
            >
              Import & Export
            </label>
            <div className="flex w-full justify-between items-center space-x-2">
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="picture"
                  type="file"
                  className="w-full"
                  onChange={handleUpload}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`h-[40px] md:w-[40px] ${
                        !isUploaded ? "hidden" : ""
                      }`}
                      onClick={handleResetUpload}
                    >
                      <Trash2 />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold ">Reset to default</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="h-[40px] md:w-[40px]"
                    onClick={handleExport}
                  >
                    <ArrowDownToLine />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold ">Save to JSON file</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

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
                  onChange={(e) => updateMethodField("title", e.target.value)}
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
                  onChange={(e) => updateMethodField("creator", e.target.value)}
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
                  onChange={(e) =>
                    updateMethodField("coffeeGram", Number(e.target.value))
                  }
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
                Water Temperature (°C)
              </label>

              <div className="flex justify-center items-center space-x-2">
                <Input
                  id="waterTemp"
                  type="number"
                  value={method.waterTemp}
                  onChange={(e) =>
                    updateMethodField("waterTemp", Number(e.target.value))
                  }
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
                onValueChange={(e) => updateMethodField("grindSize", e)}
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
                onValueChange={(e) => updateMethodField("roastLevel", e)}
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
                    <SelectItem value="omni">Omni</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center sm:col-span-2 gap-2 my-2">
              <label
                className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                htmlFor="preparation"
              >
                Preparation
              </label>

              <div className="flex justify-center items-center space-x-2">
                <Textarea
                  placeholder="Things to prepare before brewing coffee"
                  id="preparation"
                  className="max-h-[160px] sm:h-[40px] h-[120px]"
                  value={method.preparation}
                  onChange={(e) =>
                    updateMethodField("preparation", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid w-full items-center sm:col-span-2 gap-2 my-2">
              <label
                className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                htmlFor="keyNotes"
              >
                Key Notes
              </label>

              <div className="flex justify-center items-center space-x-2">
                <Textarea
                  placeholder="For example, this brewing method is suitable for what kind of coffee?"
                  id="keyNotes"
                  className="max-h-[160px] sm:h-[40px] h-[120px]"
                  value={method.keyNotes}
                  onChange={(e) =>
                    updateMethodField("keyNotes", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid w-full items-center sm:col-span-2 gap-2 my-2">
              <label className="font-semibold text-sm text-stone-700 dark:text-stone-400">
                Tags
              </label>
              <MultiValueInput
                value={method.tags}
                onChange={(e) => updateMethodField("tags", e)}
              />
            </div>
          </div>
        </section>
        <section className="opacity: 1; filter: blur(0px); transform: none; mb-20">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-400 mb-4 sm:mb-0">
                Schedules
              </h3>
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <div className="flex items-center gap-2 px-3 py-2rounded-lg">
                  <button
                    onClick={() => setUseNumberInput(false)}
                    className={`p-1 rounded transition-colors ${
                      isHidden ? "hidden" : ""
                    } ${
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
                      isHidden ? "hidden" : ""
                    } ${
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
                  className={`flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 duration-300 transition-colors ${
                    isHidden ? "hidden" : ""
                  }`}
                >
                  <Plus size={16} />
                  Add Schedule
                </button>
                <button
                  onClick={() => setIsHidden(!isHidden)}
                  className="flex items-center gap-2 p-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 duration-300 transition-colors"
                >
                  {!isHidden ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </div>

            {method.schedules.map((schedule, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg transition-all border-stone-200 dark:border-stone-800 ${
                  isHidden ? "hidden" : ""
                }`}
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
                    {method.schedules.length > 1 && (
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
                    <label htmlFor={'startSecond'+index} className="block text-sm font-medium text-stone-700">
                      Start Second
                    </label>
                    {useNumberInput ? (
                      <div className="space-y-2">
                        <Input
                          disabled={isHidden}
                          type="number"
                          id={'startSecond'+index}
                          value={schedule.time}
                          onChange={(e) =>
                            updateSchedule(
                              schedule.id,
                              "time",
                              Number(e.target.value)
                            )
                          }
                          min={5}
                          max={maxDuration - 1}
                          step={1}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Slider
                          disabled={isHidden}
                          defaultValue={[schedule.time]}
                          value={[schedule.time]}
                          max={maxDuration}
                          step={1}
                          onValueChange={(e) =>
                            updateSchedule(schedule.id, "time", e[0])
                          }
                        />
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>0</span>
                          <span>{maxDuration - 1}</span>
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
                    <label htmlFor={'endSecond'+index}  className="block text-sm font-medium text-stone-700">
                      End Second
                    </label>
                    {useNumberInput ? (
                      <div className="space-y-2">
                        <Input
                          disabled={isHidden}
                          type="number"
                          id={'endSecond'+index}
                          value={schedule.endTime}
                          onChange={(e) =>
                            updateSchedule(
                              schedule.id,
                              "endTime",
                              Number(e.target.value)
                            )
                          }
                          min={1}
                          max={maxDuration}
                          step={1}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Slider
                          disabled={isHidden}
                          defaultValue={[schedule.endTime]}
                          value={[schedule.endTime]}
                          max={maxDuration}
                          step={1}
                          onValueChange={(e) =>
                            updateSchedule(schedule.id, "endTime", e[0])
                          }
                        />
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>1</span>
                          <span>{maxDuration}</span>
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
                        left: `${(schedule.time / maxDuration) * 100}%`,
                        width: `${
                          ((schedule.endTime - schedule.time) / maxDuration) *
                          100
                        }%`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-stone-700 dark:text-stone-200">
                      {formatTime(schedule.time)} -{" "}
                      {formatTime(schedule.endTime)}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                    htmlFor={"waterMl"+index}
                  >
                    Water (ml)
                  </label>

                  <div className="flex justify-center items-center space-x-2">
                    <Input
                      disabled={isHidden}
                      id={"waterMl"+index}
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
            <div className={`mt-4  ${isHidden ? "hidden" : ""}`}>
              <label
                className="font-semibold block text-sm text-stone-700 dark:text-stone-400 mb-2"
                htmlFor="maxDuration"
              >
                Max Duration (seconds)
              </label>

              <div className="flex justify-center items-center space-x-2">
                <Input
                  id="maxDuration"
                  type="number"
                  value={
                    totalCycleDuration > maxDuration
                      ? totalCycleDuration
                      : maxDuration
                  }
                  onChange={(e) => setMaxDuration(Number(e.target.value))}
                  min={30}
                  step={1}
                />
              </div>
            </div>
            <div className={`mt-8  ${!isHidden ? "hidden" : ""}`}>
              <p className="text-center text-stone-400 dark:text-stone-700  ">
                {" "}
                Schedule has been hidden{" "}
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center w-full space-y-2">

          <p className="font-semibold text-center text-md mb-4 text-stone-400 dark:text-stone-600">
            Copy & Share
          </p>
          <div className="flex justify-center items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  className="h-[40px] w-full"
                  onClick={() => handleCopy()}
                >
                  Copy the link<Copy />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold ">Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className={`text-xs ${isCopied ? 'text-foreground': 'text-background'} transition-all  duration-300`}>Link copied!</span>
        </div>
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
        <section
          className={`opacity: 1; filter: blur(0px); transform: none; ${
            !method.keyNotes ? "hidden" : ""
          } `}
        >
          <Alert variant="default">
            <CircleCheck className="h-full" />
            <AlertTitle>Key Notes</AlertTitle>
            <AlertDescription className=" whitespace-pre-line">
              {method.keyNotes}
            </AlertDescription>
          </Alert>
        </section>
        <section
          className={`opacity: 1; filter: blur(0px); transform: none; ${
            !method.preparation ? "hidden" : ""
          } `}
        >
          <Alert variant="default">
            <Info className="h-full" />
            <AlertTitle>Preparations</AlertTitle>
            <AlertDescription className=" whitespace-pre-line">
              {method.preparation}
            </AlertDescription>
          </Alert>
        </section>
        
        <PourSection
          pourSchedule={method.schedules}
          seconds={seconds}
          setSeconds={setSeconds}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          totalDuration={totalCycleDuration}
        />
      </main>
    </>
  );
}
