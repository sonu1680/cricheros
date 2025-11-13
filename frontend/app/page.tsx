"use client";

import { useState } from "react";
import { PointsTable } from "@/components/points-table";
import { CalculatorForm } from "@/components/calculator-form";
import { ResultsDisplay } from "@/components/results-display";
import axios from "axios";
import { CalculateResponse } from "@/lib/constants";
import "../style/page.css";

export default function Home() {
  const [results, setResults] = useState<CalculateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (formData: any) => {
    setLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

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
    <main className="main">
      <div className="hero">
        <div className="overlay-circle" style={{ top: 0, left: "25%" }}></div>
        <div
          className="overlay-circle delay"
          style={{ bottom: 0, right: "25%" }}
        ></div>

        <div style={{ animation: "fadeInDown 0.6s ease-out" }}>
          <div
            style={{
              marginBottom: "1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            Cricket Analysis
          </div>
          <h1>IPL Points Calculator</h1>
          <p>
            Master your strategy. Calculate the exact performance needed to
            dominate the leaderboard.
          </p>
        </div>
      </div>

      <div className="content">
        <div style={{ animation: "slideInLeft 0.6s ease-out" }}>
          <div className="sticky-form">
            <CalculatorForm onCalculate={handleCalculate} loading={loading} />
          </div>
        </div>

        <div style={{ animation: "slideInRight 0.6s ease-out" }}>
          <PointsTable />

          {results?.result && <ResultsDisplay results={results?.result} />}
          {!loading && results?.result?.summary?.message && (
            <div className="summary-card">
              <p>{results.result.summary.message}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
