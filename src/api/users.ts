import { User, Post } from '../types';

const API_BASE = 'https://jsonplaceholder.typicode.com';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE}/users`);
  const users = await response.json();
  return users.map((user: any) => ({
    ...user,
    role: user.id === 1 ? 'admin' : 'user',
    avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1&random=${user.id}`
  }));
};

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_BASE}/posts`);
  const posts = await response.json();
  
  // Fetch users to get author names
  const users = await fetchUsers();
  
  return posts.map((post: any) => ({
    ...post,
    author: users.find(user => user.id === post.userId)?.name || 'Unknown'
  }));
};

export const deletePost = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
};

export const updatePost = async (id: number, post: Partial<Post>): Promise<Post> => {
  const response = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(post)
  });
  return response.json();
};