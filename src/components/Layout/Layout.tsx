import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { clearUser } from '../../slice/userSlice';
import s from './Layout.module.css';
import {selectIsAuthenticated} from "../../selectors/userSelectors";
import {useAppDispatch, useAppSelector} from "../../store/hooks";

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogOut = () => {
        dispatch(clearUser());
        navigate('/login');
    };

    return (
        <div className={s.layoutContainer}>
            <header className={s.header}>
                <h1 className={s.title}>
                    <Link to="/" className={s.homeLink}>Best Application</Link>
                </h1>
                {isAuthenticated ? (
                    <button className={s.authButton} onClick={handleLogOut}>Log Out</button>
                ) : (
                    <button className={s.authButton} onClick={() => navigate('/login')}>Sign In</button>
                )}
            </header>
            <main className={s.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
