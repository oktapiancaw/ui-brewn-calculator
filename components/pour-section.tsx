import { Pause, Play, RotateCcw } from "lucide-react";

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

export default function PourSection({ pourSchedule, seconds, setSeconds, isRunning, setIsRunning, totalDuration }: PourSectionProps) {
  
  const getCurrentScheduleItem = () => {
    return pourSchedule.find(
      (item) => seconds >= item.time && seconds < item.endTime
    );
  };
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
              {p.volume.toFixed(1)}
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
  );
}
