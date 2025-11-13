"use client";
import { POINTS_TABLE } from "@/lib/constants";
import "../style/pointTable.css"
export function PointsTable() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="header-content">
          <h2>IPL 2022 Points Table</h2>
          <span className="badge">Live Standings</span>
        </div>
      </div>

      <div className="card-body">
        <div className="table-wrapper">
          <table className="points-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>M</th>
                <th>W</th>
                <th>L</th>
                <th>NRR</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {POINTS_TABLE.map((row, idx) => (
                <tr
                  key={row.name}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <td className="pos">{idx + 1}</td>
                  <td className="team">{row.name}</td>
                  <td>{row.matches}</td>
                  <td className="won">{row.won}</td>
                  <td className="lost">{row.lost}</td>
                  <td className="nrr">{row.nrr.toFixed(3)}</td>
                  <td className="points">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

     
    </div>
  );
}
