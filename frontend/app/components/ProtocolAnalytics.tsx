import { BarChart, PieChart } from "lucide-react"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function ProtocolAnalytics({ data }) {
  if (!data) {
    return null
  }

  const barChartData = {
    labels: data.tvlHistory.map((item) => item.date),
    datasets: [
      {
        label: "TVL",
        data: data.tvlHistory.map((item) => item.value),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  const pieChartData = {
    labels: data.assetAllocation.map((item) => item.asset),
    datasets: [
      {
        data: data.assetAllocation.map((item) => item.percentage),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
      },
    ],
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Protocol Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <BarChart className="mr-2" /> TVL History
          </h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <PieChart className="mr-2" /> Asset Allocation
          </h3>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  )
}

