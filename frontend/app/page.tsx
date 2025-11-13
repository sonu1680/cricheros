"use client";

import { useState } from "react";
import { PointsTable } from "@/components/points-table";
import { CalculatorForm } from "@/components/calculator-form";
import { ResultsDisplay } from "@/components/results-display";
import axios from "axios";
import { CalculateResponse } from "@/lib/constants";

export default function Home() {
  const [results, setResults] = useState<CalculateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (formData: any) => {
    setLoading(true);
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!backendUrl) {
          throw new Error(
            "Missing NEXT_PUBLIC_BACKEND_URL in environment variables"
          );
        }
      const res = await axios.post<CalculateResponse>(
        `${backendUrl}/calculate`,
        {
          ...formData,
        }
      );

      setResults(res.data);
    } catch (error) {
      console.error("Calculation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="gradient-red-animated relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
            style={{ animation: "float 3s ease-in-out infinite" }}
          ></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
            style={{ animation: "float 3s ease-in-out infinite 1s" }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div
            className="text-center"
            style={{ animation: "fadeInDown 0.6s ease-out" }}
          >
            <div className="inline-block mb-4">
              <div className="text-sm font-semibold tracking-widest uppercase opacity-90 animate-pulse">
                Cricket Analysis
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-balance mb-4 tracking-tight">
              IPL Points Calculator
            </h1>
            <p className="text-lg md:text-xl text-red-100 text-balance max-w-2xl mx-auto">
              Master your strategy. Calculate the exact performance needed to
              dominate the leaderboard.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            className="lg:col-span-1"
            style={{ animation: "slideInLeft 0.6s ease-out" }}
          >
            <div className="sticky top-6">
              <CalculatorForm onCalculate={handleCalculate} loading={loading} />
            </div>
          </div>

          <div
            className="lg:col-span-2 space-y-8"
            style={{ animation: "slideInRight 0.6s ease-out" }}
          >
            <PointsTable />

            {results?.result && <ResultsDisplay results={results?.result} />}
            {!loading && results && (
              <div className="bg-linear-to-r from-red-50 to-orange-50  rounded-2xl shadow-lg border border-red-300 p-6">
                {results?.result.summary?.message && (
                  <p className="mt-4 text-center text-lg font-medium text-red-600 border-t border-red-300 pt-4">
                    🏏 {results?.result.summary.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
