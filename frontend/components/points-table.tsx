
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const INITIAL_TABLE = [
  {
    position: 1,
    team: "Chennai Super Kings",
    matches: 7,
    won: 5,
    lost: 2,
    nrr: 0.771,
    for: "1130/133.1",
    against: "1071/138.5",
    points: 10,
  },
  {
    position: 2,
    team: "Royal Challengers Bangalore",
    matches: 7,
    won: 4,
    lost: 3,
    nrr: 0.597,
    for: "1217/140",
    against: "1066/131.4",
    points: 8,
  },
  {
    position: 3,
    team: "Delhi Capitals",
    matches: 7,
    won: 4,
    lost: 3,
    nrr: 0.319,
    for: "1085/126",
    against: "1136/137",
    points: 8,
  },
  {
    position: 4,
    team: "Rajasthan Royals",
    matches: 7,
    won: 3,
    lost: 4,
    nrr: 0.331,
    for: "1066/128.2",
    against: "1094/137.1",
    points: 6,
  },
  {
    position: 5,
    team: "Mumbai Indians",
    matches: 8,
    won: 2,
    lost: 6,
    nrr: -1.75,
    for: "1003/155.2",
    against: "1134/138.1",
    points: 4,
  },
]

export function PointsTable() {
  return (
    <Card className="cricket-card bg-card border-red-200 shadow-lg" style={{ animation: "fadeInUp 0.6s ease-out" }}>
      <CardHeader className="border-b border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-red-900">IPL 2022 Points Table</CardTitle>
          <Badge
            className="bg-red-600 hover:bg-red-700 text-white"
            style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
          >
            Live Standings
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-red-100 bg-red-50">
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider">Pos</TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider">Team</TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider text-right">M</TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider text-right">W</TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider text-right">L</TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider text-right">
                  NRR
                </TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider text-right">
                  Pts
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INITIAL_TABLE.map((row, idx) => (
                <TableRow
                  key={row.team}
                  className={`border-b border-red-100 transition-all duration-300 hover:bg-red-100 cursor-pointer ${
                    idx === 0 ? "bg-red-50" : "hover:bg-red-50"
                  }`}
                  style={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both` }}
                >
                  <TableCell className="font-bold text-red-600 text-lg">{row.position}</TableCell>
                  <TableCell className="font-semibold text-sm text-foreground">{row.team}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">{row.matches}</TableCell>
                  <TableCell className="text-right text-sm font-bold text-green-600">{row.won}</TableCell>
                  <TableCell className="text-right text-sm font-bold text-red-600">{row.lost}</TableCell>
                  <TableCell className="text-right text-sm font-mono font-semibold text-blue-600">
                    {row.nrr.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-bold text-red-700">{row.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
