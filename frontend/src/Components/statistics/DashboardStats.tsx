import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DashboardStatsProps {
  modelUsageData?: any;
  responseTimeData?: any;
  visitorData?: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const DashboardStats = ({ modelUsageData, responseTimeData, visitorData }) => {
  const sampleResponseTimeData = [
    { month: 'Jan', time: 450 },
    { month: 'Feb', time: 520 },
    { month: 'Mar', time: 480 },
    { month: 'Apr', time: 380 },
    { month: 'May', time: 430 },
    { month: 'Jun', time: 450 }
  ];

  const sampleUsersData = [
    { name: 'John', optimizations: 186 },
    { name: 'Mark', optimizations: 305 },
    { name: 'Phil', optimizations: 237 },
    { name: 'April', optimizations: 73 },
    { name: 'May', optimizations: 209 },
    { name: 'Jude', optimizations: 214 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Model usage</CardTitle>
            <p className="text-sm text-gray-500">January - June 2024</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 1125 }]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center">
                <h3 className="text-2xl font-bold">1,125</h3>
                <p className="text-sm text-gray-500">visitors</p>
              </div>
              <p className="text-sm text-gray-500 mt-4">Trending up by 5.2% this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Python model 1 - response time</CardTitle>
            <p className="text-sm text-gray-500">in milliseconds</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleResponseTimeData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="time" stroke="#DEB887" fill="#DEB887" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-500 mt-4">Trending up by 5.2% this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users with most optimizations</CardTitle>
          <p className="text-sm text-gray-500">January - June 2024</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleUsersData.map((user) => (
              <div key={user.name} className="flex items-center">
                <div className="flex-1">
                  <div className="h-4 bg-[#DEB887] rounded" style={{ width: `${(user.optimizations / 305) * 100}%` }} />
                </div>
                <span className="ml-4 min-w-[3rem] text-sm font-medium">{user.optimizations}</span>
                <span className="ml-4 min-w-[4rem] text-sm text-gray-500">{user.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


