import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/dashboard/Dashboard'
import MenuEditor from './pages/dashboard/MenuEditor'
import TemplateSelector from './pages/dashboard/TemplateSelector'
import QRCodePage from './pages/dashboard/QRCodePage'
import BillingPage from './pages/dashboard/BillingPage'
import AnalyticsPage from './pages/dashboard/AnalyticsPage'
import RestaurantProfile from './pages/dashboard/RestaurantProfile'
import AdminDashboard from './pages/admin/AdminDashboard'
import PublicMenu from './pages/PublicMenu'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Public Menu (customer view) */}
      <Route path="/menu/:slug" element={<PublicMenu />} />
      
      {/* Owner Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/menu" element={<MenuEditor />} />
      <Route path="/dashboard/templates" element={<TemplateSelector />} />
      <Route path="/dashboard/qr" element={<QRCodePage />} />
      <Route path="/dashboard/billing" element={<BillingPage />} />
      <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
      <Route path="/dashboard/profile" element={<RestaurantProfile />} />
      
      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App
