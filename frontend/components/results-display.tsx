import { Question, ResultsDisplayProps } from "@/lib/constants";
import "../style/ResultsDisplay.css";

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || !results.questions) return null;

  const renderAnswer = (q: Question) => {
    if (q.type === "batting_restrict") {
      return (
        <div className="answer-section">
          <div className="info-box red">
            <p className="info-label">Required Restriction Range</p>
            <p className="info-value">
              {q.minRuns} – {q.maxRuns} <span>runs</span>
            </p>
            <p className="info-detail">
              in {q.overs} overs against <strong>{q.oppositionTeam}</strong>
            </p>
          </div>

          <div className="info-box blue">
            <p className="info-label">Revised NRR Range</p>
            <p className="info-value">
              {q.minNRR?.toFixed(3)} — {q.maxNRR?.toFixed(3)}
            </p>
          </div>
        </div>
      );
    }

    if (q.type === "bowling_chase") {
      return (
        <div className="answer-section">
          <div className="info-box green">
            <p className="info-label">Required Chase Range</p>
            <p className="info-value">
              {q.minOvers} – {q.maxOvers} <span>overs</span>
            </p>
            <p className="info-detail">
              to chase <strong>{q.runsToChase} runs</strong>
            </p>
          </div>

          <div className="info-box purple">
            <p className="info-label">Revised NRR Range</p>
            <p className="info-value">
              {q.minNRR?.toFixed(3)} — {q.maxNRR?.toFixed(3)}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="results-card">
      <div className="results-header">
        <h2 className="results-title">Calculation Results</h2>
        <span className="status-badge">Ready</span>
      </div>

      <div className="results-content">
        {results.questions.map((q, idx) => (
          <div
            key={idx}
            className="question-box"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <span className="question-label">{q.label}</span>
            <h3 className="question-title">{q.title}</h3>
            {renderAnswer(q)}
          </div>
        ))}
      </div>
    </div>
  );
}
