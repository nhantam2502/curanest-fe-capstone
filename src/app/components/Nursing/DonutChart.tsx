import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  value: number;
  total: number;
  label?: string;
  size?: number;
  centerText?: string;
  mainColor?: string;
  backgroundColor?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  value,
  total,
  label = 'Ca',
  size = 128,
  centerText,
  mainColor = '#3B82F6',
  backgroundColor = '#E8EDF1',
}) => {
  const percentage = (value / total) * 100;

  const data: ChartData<'doughnut'> = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [mainColor, backgroundColor],
        borderWidth: 0,
        circumference: 360,
        rotation: -90,
      },
    ],
    labels: ['Completed', 'Remaining'],
  };

  const options: ChartOptions<'doughnut'> = {
    cutout: '75%',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-sm">
        <div className="font-medium mb-2">Tổng kết ca</div>
        <div className="text-xs text-gray-500">Tuần 19 → 25 Th9 2024</div>
      </div>

      {/* Donut Chart */}
      <div className="relative w-32 h-32 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {centerText || value}
              </div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm">32 Ca thông thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-sm">4 Ca bổ sung</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm">4 Ca thay thế</span>
        </div>
      </div>

      {/* Workload Summary */}
      <div>
        <div className="text-sm font-medium mb-2">Khối lượng công việc</div>
        <div className="text-xs text-gray-500">Tổng 40 ca - 80 giờ</div>
        <div className="mt-2 h-2 bg-red-500 rounded-full w-4/5"></div>
      </div>
    </div>
  );
};

export default DonutChart;
