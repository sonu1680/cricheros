"use client";
import { useState } from "react";

const TEAMS = [
  "Chennai Super Kings",
  "Royal Challengers Bangalore",
  "Delhi Capitals",
  "Rajasthan Royals",
  "Mumbai Indians",
];

export function CalculatorForm({
  onCalculate,
  loading,
}: {
  onCalculate: any;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    team: "",
    opponent: "",
    overs: "20",
    desiredPosition: "3",
    tossResult: "bat",
    runsScored: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.team || !formData.opponent || !formData.runsScored) {
      alert("Please fill all fields");
      return;
    }
    onCalculate(formData);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Calculate Requirements</h2>
        <p>Find your path to glory</p>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} className="form">
          {/* Team Select */}
          <div className="form-group">
            <label>Your Team</label>
            <select
              value={formData.team}
              onChange={(e) =>
                setFormData({ ...formData, team: e.target.value })
              }
            >
              <option value="">Select team</option>
              {TEAMS.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          {/* Opponent Select */}
          <div className="form-group">
            <label>Opposition Team</label>
            <select
              value={formData.opponent}
              onChange={(e) =>
                setFormData({ ...formData, opponent: e.target.value })
              }
            >
              <option value="">Select opponent</option>
              {TEAMS.filter((t) => t !== formData.team).map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          {/* Desired Position */}
          <div className="form-group">
            <label>Desired Position</label>
            <select
              value={formData.desiredPosition}
              onChange={(e) =>
                setFormData({ ...formData, desiredPosition: e.target.value })
              }
            >
              {[1, 2, 3, 4, 5].map((pos) => (
                <option key={pos} value={pos}>
                  Position {pos}
                </option>
              ))}
            </select>
          </div>

          {/* Toss Result */}
          <div className="form-group">
            <label>Toss Result</label>
            <select
              value={formData.tossResult}
              onChange={(e) =>
                setFormData({ ...formData, tossResult: e.target.value })
              }
            >
              <option value="bat">Batting First</option>
              <option value="bowl">Bowling First</option>
            </select>
          </div>

          {/* Runs */}
          <div className="form-group">
            <label>
              {formData.tossResult === "bat"
                ? "Runs Scored (20 overs)"
                : "Runs to Chase"}
            </label>
            <input
              type="number"
              placeholder="Enter runs"
              value={formData.runsScored}
              onChange={(e) =>
                setFormData({ ...formData, runsScored: e.target.value })
              }
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Calculating..." : "⚡ Calculate Requirements"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .card {
          background: #fff;
          border: 1px solid #f5c2c2;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          max-width: 420px;
          margin: 2rem auto;
          animation: fadeInUp 0.6s ease-out;
        }

        .card-header {
          background: linear-gradient(to right, #fff0f0, #ffe5d1);
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f5c2c2;
        }

        .card-header h2 {
          font-size: 1.25rem;
          color: #a4161a;
          margin-bottom: 0.3rem;
        }

        .card-header p {
          font-size: 0.85rem;
          color: #7a1c1c;
        }

        .card-body {
          padding: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }

        label {
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: #333;
        }

        select,
        input {
          padding: 0.6rem 0.8rem;
          border: 1px solid #f5c2c2;
          border-radius: 6px;
          transition: border 0.2s;
        }

        select:hover,
        input:hover {
          border-color: #f08080;
        }

        .submit-btn {
          width: 100%;
          padding: 0.8rem;
          background: #c1121f;
          color: #fff;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
        }

        .submit-btn:hover {
          background: #a4161a;
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
