import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
function ProtectedRoute({ children }) {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const location = useLocation();
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/", replace: true, state: { from: location } });
    }
    return _jsx(_Fragment, { children: children });
}
export default ProtectedRoute;
