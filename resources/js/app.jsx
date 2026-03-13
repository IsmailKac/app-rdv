import './bootstrap';
// Force rebuild
import './echo';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import AdminUsers from './pages/AdminUsers';
import AdminDoctors from './pages/AdminDoctors';
import Register from './pages/Register';
import Home from './pages/Home';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="doctors" element={<Doctors />} />
                        <Route path="book/:doctorId" element={<BookAppointment />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="my-appointments" element={<MyAppointments />} />
                            <Route path="admin-users" element={<AdminUsers />} />
                            <Route path="admin-doctors" element={<AdminDoctors />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
