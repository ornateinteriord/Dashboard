import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Layout } from '../../components/layout/Layout';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Edit, Trash2, Plus, Mail, Phone } from 'lucide-react';
import { fetchUsers } from '../../api/users';
import { User, PaginationInfo } from '../../types';

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, pagination.currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    
    setFilteredUsers(filtered.slice(startIndex, endIndex));
    setPagination(prev => ({
      ...prev,
      totalPages,
      totalItems
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const columns: Column<User>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      width: '80px',
      render: (user) => (
        <span className="text-sm font-mono text-gray-600">#{user.id}</span>
      )
    },
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (user) => (
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1&random=${user.id}`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      width: '120px',
      render: (user) => (
        <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
          {user.role}
        </Badge>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      width: '200px',
      render: (user) => (
        <div className="space-y-1">
          {user.phone && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Phone className="h-3 w-3" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Mail className="h-3 w-3" />
            <span>{user.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      width: '150px',
      render: (user) => (
        <span className="text-sm text-gray-600">
          {user.address ? `${user.address.city}, ${user.address.zipcode}` : 'N/A'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '150px',
      render: (user) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => console.log('Edit user:', user.id)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => console.log('Delete user:', user.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-1">Manage all users in your application</p>
          </div>
          <Button icon={Plus} size="lg">
            New User
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          data={filteredUsers}
          columns={columns}
          loading={loading}
          searchable={true}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          emptyMessage="No users found"
        />
      </div>
    </Layout>
  );
};