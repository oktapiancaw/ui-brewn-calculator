// Copyright (c) 2025 Oktapian Candra Adi Wijaya
// Licensed under the MIT License. See LICENSE file for details.

"use client";
import MethodHeader from "@/components/method-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  DivideCircle,
  GitCommitHorizontal,
  GlassWater,
  Sliders,
  Timer,
  Waves,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState, useCallback } from "react";
type FlavourStrength = "lighter" | "balanced" | "bold" | "extrabold";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SummaryCard from "@/components/summary-card";
type ColdBrewMethod = {
  title: string;
  creator: string;
  brewStrength: FlavourStrength;
  tags: string[];
  coffeeGram: number;
  liquidMl: number;
  liquidType: string;
  ratio: number;
};

const brewHoursMap: Record<FlavourStrength, number> = {
  lighter: 12,
  balanced: 16,
  bold: 20,
  extrabold: 24,
};

const defaultMethod = {
  title: "Cold Brew Method",
  creator: "Okta",
  brewStrength: "balanced" as FlavourStrength,
  liquidType: "water",
  coffeeGram: 20,
  liquidMl: 200,
  ratio: 10,
  tags: ["manual-brew", "cold-brew"],
};

function capitalizeFirstLetter(str: string): string {
  if (!str) return ""; // Handle empty or null strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ColdBrew() {
  const [method, setMethod] = useState<ColdBrewMethod>(defaultMethod);
  const [useRatioInput, setUseRatioInput] = useState(true);

  const updateMethodField = <K extends keyof ColdBrewMethod>(
    key: K,
    value: ColdBrewMethod[K]
  ) => {
    setMethod((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const changeCoffeeGram = useCallback((coffeeGram: number) => {
    setMethod((prev) => ({
      ...prev,
      coffeeGram,
      ratio: prev.liquidMl / coffeeGram,
    }));
  }, []);

  const changeLiquidMl = useCallback((liquidMl: number) => {
    setMethod((prev) => ({
      ...prev,
      liquidMl,
      ratio: liquidMl / prev.coffeeGram,
    }));
  }, []);

  const changeCoffeeRatio = useCallback((ratio: number) => {
    setMethod((prev) => ({
      ...prev,
      ratio,
      liquidMl: prev.coffeeGram * ratio,
    }));
  }, []);

  const rangeTotalBrewResult = useMemo(() => {
    if (!method) return [0, 0];
    return [
      method.liquidMl - (method.liquidMl * 22) / 100,
      method.liquidMl - (method.liquidMl * 17) / 100,
    ];
  }, [method]);

  const summaryCard = [
    {
      title: "Brew Time",
      Icon: Timer,
      notes: brewHoursMap[method.brewStrength] + " Hours",
    },
    {
      title: "Total Water",
      Icon: GlassWater,
      notes: method.liquidMl.toFixed(1) + " ml",
    },
    {
      title: "Avg Result",
      Icon: GitCommitHorizontal,
      notes:
        "± " +
        ((rangeTotalBrewResult[0] + rangeTotalBrewResult[1]) / 2).toFixed(2) +
        " ml",
    },
    {
      title: "Liquidity",
      Icon: Waves,
      notes: method.ratio >= 10 ? "RTD" : "Concentrate",
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
      <main className="space-y-16 max-w-3xl mx-auto p-4">
        <section className="opacity: 1; filter: blur(0px); transform: none;">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-400 mb-4 sm:mb-0">
                Adjustment
              </h3>
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <div className="flex items-center gap-2 px-3 py-2rounded-lg">
                  <button
                    onClick={() => setUseRatioInput(false)}
                    className={`py-1 px-4 gap-x-2 flex justify-center items-center rounded transition-colors ${
                      !useRatioInput
                        ? "bg-stone-800 text-white duration-300 "
                        : "text-stone-600 duration-300  hover:bg-stone-200 dark:hover:bg-stone-800"
                    }`}
                    title="Slider Input"
                  >
                    <Sliders size={16} /> Manual
                  </button>
                  <button
                    onClick={() => setUseRatioInput(true)}
                    className={`py-1 px-4 gap-x-2 flex justify-center items-center rounded transition-colors ${
                      useRatioInput
                        ? "bg-stone-800 text-white duration-300 "
                        : "text-stone-600 duration-300  hover:bg-stone-200 dark:hover:bg-stone-800"
                    }`}
                    title="Number Input"
                  >
                    <DivideCircle size={16} />
                    Ratio
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-x-4 px-6 py-8 border rounded-lg">
              <div className="grid w-full items-center gap-2 my-2">
                <span className="font-semibold text-sm text-stone-700 dark:text-stone-400">
                  Liquid Type
                </span>
                <Select
                  value={method.liquidType}
                  onValueChange={(e) => updateMethodField("liquidType", e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Liquid type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="milk">Milk</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-2 my-2">
                <span className="font-semibold text-sm text-stone-700 dark:text-stone-400">
                  Flavour
                </span>
                <Select
                  value={method.brewStrength}
                  onValueChange={(e) =>
                    updateMethodField("brewStrength", e as FlavourStrength)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Liquid type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="lighter">Lighter</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="extrabold">Extra Bold</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full col-span-2 grid-cols-6 gap-4">
                <div className="grid w-full col-span-6 xs:col-span-2  sm:col-span-3 items-center gap-2 my-2">
                  <label
                    className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                    htmlFor="methodName"
                  >
                    Coffee (gram)
                  </label>

                  <div className="flex justify-center items-center space-x-2">
                    <Input
                      id="coffeeGram"
                      type="number"
                      value={method.coffeeGram}
                      onChange={(e) =>
                        // updateMethodField("coffeeGram", Number(e.target.value))
                        changeCoffeeGram(Number(e.target.value))
                      }
                      min={5}
                      step={0.5}
                    />
                  </div>
                </div>
                {useRatioInput ? (
                  <div className="grid w-full col-span-6 xs:col-span-4 sm:col-span-3 items-center gap-2 my-2">
                    <label
                      className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                      htmlFor="methodName"
                    >
                      Ratio (coffee : {method.liquidType})
                    </label>

                    <div className="flex justify-center items-center space-x-2">
                      <div className="flex px-6 py-1 rounded-md border bg-transparent border-input dark:bg-input/30">
                        1
                      </div>
                      <span className="px-3">:</span>
                      <Input
                        id="ratio"
                        type="number"
                        value={method.ratio}
                        onChange={(e) =>
                          changeCoffeeRatio(Number(e.target.value))
                        }
                        min={5}
                        step={0.5}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid w-full col-span-6 xs:col-span-4 sm:col-span-3 items-center gap-2 my-2">
                    <label
                      className="font-semibold text-sm text-stone-700 dark:text-stone-400"
                      htmlFor="methodName"
                    >
                      {capitalizeFirstLetter(method.liquidType)} (ml)
                    </label>

                    <div className="flex justify-center items-center space-x-2">
                      <Input
                        id="liquidMl"
                        type="number"
                        value={method.liquidMl}
                        onChange={
                          (e) => changeLiquidMl(Number(e.target.value))
                          // updateMethodField('liquidMl', Number(e.target.value))
                        }
                        min={5}
                        step={0.5}
                      />
                    </div>
                  </div>
                )}
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
      </main>
    </>
  );
}
