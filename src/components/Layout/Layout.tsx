import React from 'react';
import { Link } from 'react-router-dom';
import { clearUser } from '../../userSlice/userSlice';
import s from './Layout.module.css';
import {useAppDispatch, useAppSelector} from "../../store";
import {selectIsAuthenticated} from "../../selectors/userSelectors";

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const dispatch = useAppDispatch();

    return (
        <div>
            <header className={s.header}>
                <h1>
                    <Link to="/">Best Application</Link>
                </h1>
                {isAuthenticated ? (
                    <div>
                        <Link to="/login" onClick={() => dispatch(clearUser())}><button>Log Out</button></Link>
                    </div>
                ) : (
                    <Link to="/login"><button>Sign In</button></Link>
                )}
            </header>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
