import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Layout } from '../../components/layout/Layout';
import { Users, FileText, TrendingUp, Activity } from 'lucide-react';
import { fetchUsers, fetchPosts } from '../../api/users';
import { User, Post } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, postsData] = await Promise.all([
          fetchUsers(),
          fetchPosts()
        ]);
        setUsers(usersData);
        setPosts(postsData.slice(0, 20)); // Limit to 20 posts for demo
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = [
    {
      name: 'Total Users',
      value: users.length,
      change: '+4.75%',
      icon: Users,
      color: 'blue'
    },
    {
      name: 'Total Posts',
      value: posts.length,
      change: '+54.02%',
      icon: FileText,
      color: 'green'
    },
    {
      name: 'Engagement Rate',
      value: '12.5%',
      change: '+2.35%',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      name: 'Active Sessions',
      value: '89',
      change: '+12.5%',
      icon: Activity,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Overview of your application</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-14 h-14 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-7 w-7 text-${stat.color}-600`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Users</h2>
            <div className="space-y-6">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center space-x-4">
                  <img
                    src={user.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1&random=${user.id}`}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Posts</h2>
            <div className="space-y-6">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{post.body}</p>
                  <p className="text-xs text-gray-400 mt-2">By {post.author}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group">
              <Users className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mx-auto mb-3 transition-colors duration-200" />
              <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">Manage Users</p>
            </button>
            
            <button className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group">
              <FileText className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mx-auto mb-3 transition-colors duration-200" />
              <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">Create Post</p>
            </button>
            
            <button className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group">
              <TrendingUp className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mx-auto mb-3 transition-colors duration-200" />
              <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">View Analytics</p>
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};