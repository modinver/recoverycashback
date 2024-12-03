import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Welcome from './components/Welcome';
import PrayerTimes from './components/PrayerTimes';
import Services from './components/Services';
import PillarsOfIslam from './components/PillarsOfIslam';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import AuthPage from './pages/admin/AuthPage';
import DashboardPage from './pages/admin/DashboardPage';
import { PrayerProvider } from './contexts/PrayerContext';

const MainLayout = () => (
  <>
    <Header />
    <Hero />
    <Welcome />
    <PrayerTimes />
    <Services />
    <PillarsOfIslam />
    <Footer />
  </>
);

function App() {
  return (
    <PrayerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/admin/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            {/* Add more admin routes here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </PrayerProvider>
  );
}

export default App;