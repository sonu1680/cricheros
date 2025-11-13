"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

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
    tossResult: "batting",
    runsScored: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formData.team || !formData.opponent || !formData.runsScored) {
      alert("Please fill all fields");
      return;
    }
    onCalculate(formData);
  };

  return (
    <Card
      className="cricket-card bg-card border-red-200 shadow-lg"
      style={{ animation: "fadeInUp 0.6s ease-out" }}
    >
      <CardHeader className="border-b border-red-200 bg-linear-to-r from-red-50 to-orange-50">
        <CardTitle className="text-xl font-bold text-red-900">
          Calculate Requirements
        </CardTitle>
        <p className="text-sm text-red-700 mt-1">Find your path to glory</p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="space-y-2"
            style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
          >
            <Label
              htmlFor="yourTeam"
              className="text-sm font-semibold text-foreground"
            >
              Your Team
            </Label>
            <Select
              value={formData.team}
              
              onValueChange={(value) =>
                setFormData({ ...formData, team: value })
              }
            >
              <SelectTrigger
                id="yourTeam"
                className="bg-white border-red-200 hover:border-red-400 transition-colors"
              >
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent className="bg-white border-red-200">
                {TEAMS.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className="space-y-2"
            style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
          >
            <Label
              htmlFor="oppositionTeam"
              className="text-sm font-semibold text-foreground"
            >
              Opposition Team
            </Label>
            <Select
              value={formData.opponent}
              onValueChange={(value) =>
                setFormData({ ...formData, opponent: value })
              }
            >
              <SelectTrigger
                id="oppositionTeam"
                className="bg-white border-red-200 hover:border-red-400 transition-colors"
              >
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent className="bg-white border-red-200">
                {TEAMS.filter((team) => team !== formData.team).map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className="space-y-2"
            style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}
          >
            <Label
              htmlFor="position"
              className="text-sm font-semibold text-foreground"
            >
              Desired Position
            </Label>
            <Select
              value={formData.desiredPosition}
              onValueChange={(value) =>
                setFormData({ ...formData, desiredPosition: value })
              }
            >
              <SelectTrigger
                id="position"
                className="bg-white border-red-200 hover:border-red-400 transition-colors"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-red-200">
                {[1, 2, 3, 4, 5].map((pos) => (
                  <SelectItem key={pos} value={pos.toString()}>
                    Position {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className="space-y-2"
            style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}
          >
            <Label
              htmlFor="toss"
              className="text-sm font-semibold text-foreground"
            >
              Toss Result
            </Label>
            <Select
              value={formData.tossResult}
              onValueChange={(value) =>
                setFormData({ ...formData, tossResult: value })
              }
            >
              <SelectTrigger
                id="toss"
                className="bg-white border-red-200 hover:border-red-400 transition-colors"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-red-200">
                <SelectItem value="bat">Batting First</SelectItem>
                <SelectItem value="bowl">Bowling First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className="space-y-2"
            style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}
          >
            <Label
              htmlFor="runs"
              className="text-sm font-semibold text-foreground"
            >
              {formData.tossResult === "batting"
                ? "Runs Scored (20 overs)"
                : "Runs to Chase"}
            </Label>
            <Input
              id="runs"
              type="number"
              placeholder="Enter runs"
              value={formData.runsScored}
              onChange={(e) =>
                setFormData({ ...formData, runsScored: e.target.value })
              }
              className="bg-white border-red-200 hover:border-red-400 transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-red hover:bg-red-700 text-white font-bold h-11 text-base rounded-lg transition-all shadow-md button-hover-lift"
            style={{ animation: "fadeInUp 0.6s ease-out 0.6s both" }}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4 animate-spin" />
                Calculating...
              </div>
            ) : (
              "⚡ Calculate Requirements"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
