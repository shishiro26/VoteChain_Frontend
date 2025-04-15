"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/context/wallet-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

// Sample data for charts
const barData = [
  { name: "Candidate A", votes: 4000 },
  { name: "Candidate B", votes: 3000 },
  { name: "Candidate C", votes: 2000 },
  { name: "Candidate D", votes: 2780 },
  { name: "Candidate E", votes: 1890 },
]

const pieData = [
  { name: "Candidate A", value: 400 },
  { name: "Candidate B", value: 300 },
  { name: "Candidate C", value: 300 },
  { name: "Candidate D", value: 200 },
]

// Update the chart colors to match the new theme
const COLORS = ["#1e70eb", "#34d399", "#fbbf24", "#f87171"]

export default function ResultsPage() {
  const { wallet } = useWallet()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Election Results</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Update the card styling for better light theme appearance */}
        <Card className="border border-border">
          <CardHeader className="bg-primary/5 border-b border-border">
            <CardTitle>National General Election 2023</CardTitle>
            <CardDescription>Final results</CardDescription>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="#1e70eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="bg-primary/5 border-b border-border">
            <CardTitle>Local Municipal Election</CardTitle>
            <CardDescription>Preliminary results</CardDescription>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#1e70eb"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blockchain Verification</CardTitle>
          <CardDescription>All votes are recorded on the blockchain for transparency and verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Transaction Hash</th>
                  <th className="py-2 px-4 text-left">Election</th>
                  <th className="py-2 px-4 text-left">Timestamp</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4 font-mono text-xs">0x8a35d54c...b72f</td>
                  <td className="py-2 px-4">National General Election</td>
                  <td className="py-2 px-4">2023-11-05 14:32:15</td>
                  <td className="py-2 px-4 text-green-500">Confirmed</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4 font-mono text-xs">0x7b42e98d...c45a</td>
                  <td className="py-2 px-4">University Student Council</td>
                  <td className="py-2 px-4">2023-10-28 09:15:42</td>
                  <td className="py-2 px-4 text-green-500">Confirmed</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="py-2 px-4 font-mono text-xs">0x3f91a2c7...e83d</td>
                  <td className="py-2 px-4">Local Municipal Election</td>
                  <td className="py-2 px-4">2023-11-02 16:45:30</td>
                  <td className="py-2 px-4 text-amber-500">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
