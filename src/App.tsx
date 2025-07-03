import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { UserDashboard } from './pages/user/Dashboard';
import { AdminDashboard } from './pages/admin/Dashboard';
import { PostsManagement } from './pages/admin/PostsManagement';
import { UsersManagement } from './pages/admin/UsersManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/posts" element={
            <ProtectedRoute requireAdmin>
              <PostsManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin>
              <UsersManagement />
            </ProtectedRoute>
          } />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;