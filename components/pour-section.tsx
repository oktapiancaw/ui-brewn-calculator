import { ArrowUpFromDot, Pause, Play, RotateCcw, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface PourStep {
  time: number;
  endTime: number;
  volume: number;
  label: string;
}
type PourSectionProps = {
  pourSchedule: PourStep[];
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  totalDuration: number;
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function PourSection({
  pourSchedule,
  seconds,
  setSeconds,
  isRunning,
  setIsRunning,
  totalDuration,
}: PourSectionProps) {
  const [dockMode, setDockMode] = useState(false)

  const getCurrentScheduleItem = () => {
    return pourSchedule.find(
      (item) => seconds >= item.time && seconds < item.endTime
    );
  };
  const getBrewTimeClass = (rowIndex: number) => {
    const currentItem = getCurrentScheduleItem();
    const baseClasses =
      "transition-all duration-300 flex items-center justify-between px-4 py-5 rounded-md space-x-3";
    if (seconds === 0) {
      return `${baseClasses} border border-dashed`;
    } else if (currentItem && pourSchedule.indexOf(currentItem) === rowIndex) {
      return `${baseClasses} border border-l-6 border-green-900/55 border-solid bg-white font-bold dark:bg-stone-900/30 shadow-md transform  scale-105`;
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

  return (
    <section className="opacity: 1; filter: blur(0px); transform: none; space-y-5">
      <p className="font-semibold text-center text-md mb-4 text-stone-400 dark:text-stone-600">
        Pour Schedule
      </p>
      <div className={`grid grid-cols-1 gap-4 ${dockMode ? "mb-56" : ""}`}>
        <div className="flex items-center justify-between px-4 py-3 space-x-3">
          <span className="basis-4/12 text-center text-sm text-stone-600 dark:text-stone-400 font-semibold">
            Time
          </span>
          <span className="basis-3/12 text-center text-sm text-stone-600 dark:text-stone-400 font-semibold">
            Volume (ml)
          </span>
          <span className="basis-5/12 text-center text-sm text-stone-600 dark:text-stone-400 font-semibold">
            Label
          </span>
        </div>

        {pourSchedule.map((p, index) => (
          <div key={index} className={getBrewTimeClass(index)}>
            <span className="text-sm sm:text-base basis-4/12 text-center text-stone-700 dark:text-stone-200 font-medium">
              {formatTime(p.time)} - {formatTime(p.endTime)}
            </span>
            <span className="text-sm sm:text-base basis-3/12 border-x-2 border-dashed text-center text-stone-700 dark:text-stone-200">
              {p.volume != 0 ? p.volume.toFixed(1) : ""}
            </span>
            <span className="text-sm sm:text-base basis-5/12 text-left text-stone-700 dark:text-stone-200">
              {p.label}
            </span>
          </div>
        ))}
      </div>
      <div
        className={`${
          dockMode ? "fixed z-10 bottom-0 left-0 right-0 w-full " : ""
        } duration-200 transition-all`}
      >
        <div className="flex flex-col justify-center items-center">
          <Button
            variant={"ghost"}
            onClick={() => setDockMode(!dockMode)}
            className={`h-[36px] w-[36px]  transition-colors ${dockMode ? 'dark:text-white bg-red-300/20': 'text-stone-800 dark:text-white bg-stone-300/20 dark:bg-stone-900/40  hover:bg-stone-300 dark:hover:bg-stone-950 '}`}
          >
            {
              !dockMode ? (
                <ArrowUpFromDot />
              ) : (
                <X />
              )
            }
          </Button>
          <div
            className={`flex mt-2 pb-2 pt-6 sm:py-4 sm:mb-2 justify-center items-center sm:w-32 sm:rounded-2xl ${
              dockMode
                ? "border-t-2 border-dashed sm:border-none px-20 w-full bg-stone-200 dark:bg-stone-900 sm:bg-stone-200/40 sm:dark:bg-stone-900/40"
                : ""
            }`}
          >
            <div className={`text-4xl tracking-wider font-mono font-bold text-stone-600 ${dockMode ? 'dark:text-stone-400' : 'dark:text-stone-700'}`}>
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </div>
          </div>
          <div
            className={`flex justify-center items-center space-x-3 sm:w-auto p-4 pb-12 sm:pb-4 sm:mb-6 sm:mt-2 mb-0  rounded-2xl ${
              dockMode ? "w-full bg-stone-200 dark:bg-stone-900 sm:bg-stone-200/40 sm:dark:bg-stone-900/40" : ""
            }`}
          >
            <Button
              variant={"outline"}
              onClick={handleStart}
              disabled={isRunning || seconds >= totalDuration}
              className="h-[52px] w-[52px] bg-green-600 dark:bg-green-900 text-white  hover:text-stone-100 rounded-md hover:bg-green-700 dark:hover:bg-green-800  disabled:bg-stone-600 dark:disabled:bg-stone-900 disabled:cursor-not-allowed transition-colors"
            >
              <Play />
            </Button>
            <Button
              variant={"outline"}
              onClick={handleStop}
              disabled={!isRunning}
              className="h-[52px] w-[52px] bg-red-700 darK:bg-red-800/55 text-white hover:text-stone-100 rounded-md hover:bg-red-600 disabled:bg-stone-600 dark:disabled:bg-stone-900 disabled:cursor-not-allowed transition-colors"
            >
              <Pause />
            </Button>
            <Button
              variant={"outline"}
              onClick={handleReset}
              className="h-[52px] w-[52px] bg-stone-600 dark:bg-stone-800 text-white hover:text-stone-100 rounded-md hover:bg-stone-700 dark:hover:bg-stone-900 transition-colors"
            >
              <RotateCcw />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
