import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios.ts';

interface DashboardStatsProps {
  modelUsageData?: any;
  responseTimeData?: any;
  visitorData?: any;
}

interface ServiceResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  value: number;
  serviceName: string;
}

interface UserResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  value: number;
  username: string;
}

interface Framework {
  id: string;
  status: string;
  email: string;
  password: string;
  role: string;
  name: string
  optimizationModelIds: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ServiceStats = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axiosInstance
      .get('/statistics/services/top3', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setError(false);
      })
      .catch((error) => {
        console.error('Error fetching top services:', error.message);
        setError(true);
      });
  }, []);

  if (error) {
    return <p className="text-red-500">Failed to load service statistics. Please try again later.</p>;
  }

  if (data.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="serviceName"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const UserStats = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axiosInstance
      .get('/statistics/users/top3', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setError(false);
      })
      .catch((error) => {
        console.error('Error fetching top users:', error.message);
        setError(true);
      });
  }, []);

  if (error) {
    return <p className="text-red-500">Failed to load user statistics. Please try again later.</p>;
  }

  if (data.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="username"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const ModelSearch = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState('');
  const [serviceStats, setServiceStats] = useState<ServiceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get<Framework[]>('/models', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFrameworks(response.data);
      } catch (err) {
        setError('Error fetching frameworks');
        console.error('Error fetching frameworks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFrameworks();
  }, []);

  const handleSearch = async () => {
    if (!selectedFramework) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get<ServiceResponse>(
        `/statistics/services?serviceId=${selectedFramework}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setServiceStats(response.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Failed to fetch statistics');
    }
  };

  if (isLoading) return <div>Loading frameworks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Service Tool Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <select 
            className="p-2 border rounded w-full"
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
          >
            <option value="">Select service tool...</option>
            {frameworks.length > 0 ? (
              frameworks.map(framework => (
                <option key={framework.id} value={framework.id}>
                  {framework.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No frameworks available</option>
            )}
          </select>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            onClick={handleSearch}
            disabled={!selectedFramework}
          >
            Search
          </button>
        </div>
        {serviceStats && (
          <div className="mt-4 p-4 border rounded">
            <p className="font-medium">Name: {serviceStats.serviceName}</p>
            <p>Type: {serviceStats.type}</p>
            <p>Value: {serviceStats.value}</p>
            <p className="text-sm text-gray-500">Last updated: {new Date(serviceStats.updatedAt).toLocaleString()}</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 border rounded bg-red-50 text-red-500">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const UserSearch = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState('');
  const [userStats, setUserStats] = useState<UserResponse[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get<Framework[]>('/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFrameworks(response.data);
      } catch (err) {
        setError('Error fetching users');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async () => {
    if (!selectedFramework) return;
    
    try {
      setSearchError(null);
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get<UserResponse[]>(
        `/statistics/users?userId=${selectedFramework}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUserStats(response.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setSearchError('Failed to fetch statistics');
      setUserStats([]);
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search User Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <select 
            className="p-2 border rounded w-full"
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
          >
            <option value="">Select user...</option>
            {frameworks.map(framework => (
              <option key={framework.id} value={framework.id}>
                {framework.email}
              </option>
            ))}
          </select>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            onClick={handleSearch}
            disabled={!selectedFramework}
          >
            Search
          </button>
        </div>
        {userStats.map((stat, index) => (
          <div key={index} className="mb-2 p-4 border rounded">
            <p className="font-medium">Username: {stat.username}</p>
            <p>Type: {stat.type}</p>
            <p>Value: {stat.value}</p>
            <p className="text-sm text-gray-500">Last updated: {new Date(stat.updatedAt).toLocaleString()}</p>
          </div>
        ))}
        {error && (
          <div className="mt-4 p-4 border rounded bg-red-50 text-red-500">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SearchComponents = () => {
  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      <ModelSearch />
      <UserSearch />
    </div>
  );
};

export const DashboardStats = () => {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 3 Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceStats />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 3 Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UserStats />
          </CardContent>
        </Card>
      </div>
      <SearchComponents />
    </div>
  );
};