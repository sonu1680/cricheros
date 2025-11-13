
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { POINTS_TABLE } from "@/lib/constants";



export function PointsTable() {
  return (
    <Card
      className="cricket-card bg-card border-red-200 shadow-lg"
      style={{ animation: "fadeInUp 0.6s ease-out" }}
    >
      <CardHeader className="border-b border-red-200 bg-linear-to-r from-red-50 to-orange-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-red-900">
            IPL 2022 Points Table
          </CardTitle>
          <Badge
            className="bg-red-600 hover:bg-red-700 text-white"
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
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
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider">
                  Pos
                </TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider">
                  Team
                </TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider text-right">
                  M
                </TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider text-right">
                  W
                </TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider text-right">
                  L
                </TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider text-right">
                  NRR
                </TableHead>
                <TableHead className="text-xs font-bold text-red-900 uppercase tracking-wider text-right">
                  Pts
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {POINTS_TABLE.map((row, idx) => (
                <TableRow
                  key={row.name}
                  className={`border-b border-red-100 transition-all duration-300 hover:bg-red-100 cursor-pointer ${
                    idx === 0 ? "bg-red-50" : "hover:bg-red-50"
                  }`}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <TableCell className="font-bold text-red-600 text-lg">
                    {idx+1}
                  </TableCell>
                  <TableCell className="font-semibold text-sm text-foreground">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    {row.matches}
                  </TableCell>
                  <TableCell className="text-right text-sm font-bold text-green-600">
                    {row.won}
                  </TableCell>
                  <TableCell className="text-right text-sm font-bold text-red-600">
                    {row.lost}
                  </TableCell>
                  <TableCell className="text-right text-sm font-mono font-semibold text-blue-600">
                    {row.nrr.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-bold text-red-700">
                    {row.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
