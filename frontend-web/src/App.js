import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Login, {}) }), _jsx(Route, { path: "/dashboard", element: (_jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) })) })] }) }));
}
export default App;
