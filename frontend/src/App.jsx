import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import './index.css';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            {/* Comment out missing pages for now */}
                            {/* <Route path="/products" element={<Products />} /> */}
                            {/* <Route path="/orders" element={<Orders />} /> */}
                            {/* <Route path="/checkout" element={<Checkout />} /> */}
                            {/* <Route path="/orders/success" element={<OrderSuccess />} /> */}
                        </Routes>
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;