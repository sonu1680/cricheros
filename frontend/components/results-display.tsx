
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ResultsDisplay({ results }:{results:any}) {
  if (!results || !results.questions) return null
  const renderAnswer = (q:any) => {
    if (q.type === "batting_restrict") {
      return (
        <div className="space-y-3">
          <div
            className="bg-linear-to-r from-red-50 to-orange-50 rounded-lg p-5 border-2 border-red-200 hover:shadow-lg transition-all duration-300"
            style={{ animation: "scaleIn 0.5s ease-out" }}
          >
            <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Required Restriction Range</p>
            <p className="text-2xl font-bold text-red-600">
              {q.minRuns} – {q.maxRuns} <span className="text-sm text-red-500 font-semibold">runs</span>
            </p>
            <p className="text-xs text-red-600 mt-2 font-medium">
              in {q.overs} overs against <span className="font-bold">{q.oppositionTeam}</span>
            </p>
          </div>
          <div
            className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg p-5 border-2 border-blue-200 hover:shadow-lg transition-all duration-300"
            style={{ animation: "scaleIn 0.5s ease-out 0.1s both" }}
          >
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Revised NRR Range</p>
            <p className="text-2xl font-bold font-mono text-blue-600">
              {q.minNRR.toFixed(3)} — {q.maxNRR.toFixed(3)}
            </p>
          </div>
        </div>
      )
    }

    if (q.type === "bowling_chase") {
      return (
        <div className="space-y-3">
          <div
            className="bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200 hover:shadow-lg transition-all duration-300"
            style={{ animation: "scaleIn 0.5s ease-out" }}
          >
            <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Required Chase Range</p>
            <p className="text-2xl font-bold text-green-600">
              {q.minOvers} – {q.maxOvers} <span className="text-sm text-green-500 font-semibold">overs</span>
            </p>
            <p className="text-xs text-green-600 mt-2 font-medium">
              to chase <span className="font-bold">{q.runsToChase} runs</span>
            </p>
          </div>
          <div
            className="bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-5 border-2 border-purple-200 hover:shadow-lg transition-all duration-300"
            style={{ animation: "scaleIn 0.5s ease-out 0.1s both" }}
          >
            <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Revised NRR Range</p>
            <p className="text-2xl font-bold font-mono text-purple-600">
              {q.minNRR.toFixed(3)} — {q.maxNRR.toFixed(3)}
            </p>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <Card className="cricket-card bg-card border-red-200 shadow-lg" style={{ animation: "fadeInUp 0.6s ease-out" }}>
      <CardHeader className="border-b border-red-200 bg-linear-to-r from-red-50 to-orange-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-red-900">Calculation Results</CardTitle>
          <Badge
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold"
            style={{ animation: "scaleIn 0.5s ease-out" }}
          >
            Ready
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {results.questions.map((q:any, idx:number) => (
            <div
              key={idx}
              className="border-2 border-red-100 rounded-xl p-6 hover:border-red-300 transition-all duration-300 bg-white hover:shadow-lg"
              style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <Badge className="mb-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold uppercase tracking-wider text-xs">
                    {q.label}
                  </Badge>
                  <h3 className="font-bold text-lg text-foreground">{q.title}</h3>
                </div>
              </div>
              {renderAnswer(q)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
