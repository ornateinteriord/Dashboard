import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Layout } from '../../components/layout/Layout';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { fetchPosts, deletePost, updatePost } from '../../api/users';
import { Post, PaginationInfo } from '../../types';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export const PostsManagement: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0
  });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, pagination.currentPage]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await fetchPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;
    
    if (searchTerm) {
      filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    
    setFilteredPosts(filtered.slice(startIndex, endIndex));
    setPagination(prev => ({
      ...prev,
      totalPages,
      totalItems
    }));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        setPosts(posts.filter(post => post.id !== id));
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
  };

  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      await updatePost(updatedPost.id, updatedPost);
      setPosts(posts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      ));
      setEditingPost(null);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const columns: Column<Post>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      width: '80px',
      render: (post) => (
        <span className="text-sm font-mono text-gray-600">#{post.id}</span>
      )
    },
    {
      key: 'title',
      header: 'Post',
      sortable: true,
      render: (post) => (
        <div className="max-w-xs">
          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{post.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{post.body}</p>
        </div>
      )
    },
    {
      key: 'author',
      header: 'Author',
      sortable: true,
      width: '150px',
      render: (post) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-600">
              {post.author?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-900">{post.author}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: () => (
        <Badge variant="success">Published</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '200px',
      render: (post) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => console.log('View post:', post.id)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => handleEdit(post)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDelete(post.id)}
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
            <h1 className="text-3xl font-bold text-gray-900">Posts Management</h1>
            <p className="text-gray-600 mt-1">Manage all posts in your application</p>
          </div>
          <Button icon={Plus} size="lg">
            New Post
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          data={filteredPosts}
          columns={columns}
          loading={loading}
          searchable={true}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          emptyMessage="No posts found"
        />

        {/* Edit Modal */}
        {editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Post</h2>
                <div className="space-y-4">
                  <Input
                    label="Title"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={editingPost.body}
                      onChange={(e) => setEditingPost({...editingPost, body: e.target.value})}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => setEditingPost(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleUpdatePost(editingPost)}
                    >
                      Update Post
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};