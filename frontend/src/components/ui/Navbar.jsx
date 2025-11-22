import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="bg-green-700 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold">AgriConnect</Link>
                    
                    <div className="flex-1 mx-8">
                        <SearchBar />
                    </div>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <Link to="/" className="hover:text-green-200">Home</Link>
                        <Link to="/about" className="hover:text-green-200">About</Link>
                        
                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" className="hover:text-green-200">Dashboard</Link>
                                <Link to="/messages" className="hover:text-green-200">Messages</Link>
                                <Link to="/profile" className="hover:text-green-200">Profile</Link>
                                <button onClick={handleLogout} className="hover:text-green-200">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-green-200">Login</Link>
                                <Link to="/register" className="hover:text-green-200">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;