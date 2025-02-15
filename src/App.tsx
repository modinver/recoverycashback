import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BestCashbackCards from "./pages/BestCashbackCards";
import StaticPage from "./pages/StaticPage";
import Home from "./pages/Home";
import CreditCards from "./pages/CreditCards";
import Banks from "./pages/Banks";
import Loans from "./pages/Loans";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreditCardDetails from "./pages/CreditCardDetails";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { Robots } from "./pages/Robots";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/credit-cards" element={<AppLayout><CreditCards /></AppLayout>} />
        <Route path="/credit-cards/:slug" element={<AppLayout><CreditCardDetails /></AppLayout>} />
        <Route path="/banks" element={<AppLayout><Banks /></AppLayout>} />
        <Route path="/loans" element={<AppLayout><Loans /></AppLayout>} />
        <Route path="/about" element={<AppLayout><About /></AppLayout>} />
        <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
        <Route path="/blog" element={<AppLayout><Blog /></AppLayout>} />
        <Route path="/pages/:slug" element={<AppLayout><StaticPage /></AppLayout>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/robots.txt" element={<Robots />} />
        <Route path="/best-cashback-credit-cards-uae" element={<BestCashbackCards />} />
      </Routes>
    </Router>
  );
}

export default App;
