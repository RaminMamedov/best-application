import React, {useState, useEffect} from 'react';
import { useLazyGetUserByUsernameQuery } from '../../baseApi/api';
import { setUser, clearUser } from '../../userSlice/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import s from './Auth.module.css';
import {selectIsAuthenticated} from "../../selectors/userSelectors";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import {useAppDispatch, useAppSelector} from "../../store/hooks";

const Auth: React.FC = () => {
    const [inputUsername, setInputUsername] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [trigger, { data: users, error, isLoading }] = useLazyGetUserByUsernameQuery();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

// приложение никогда не сможет найти введенного пользователя, это ограничение самого API
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!inputUsername) return;

        try {
            await trigger(inputUsername);

            if (users && users.length > 0 && users[0].username) {
                dispatch(setUser(users[0].username));
                navigate('/');
                toast.success('Login successful');
            } else {
                toast.error('User not found');
            }
        } catch (err) {
            console.error('Error logging in:', err);
            toast.error('An error occurred during login');
        }
    };

// тестовый сценарий для успешного входа. Выше приведена корректная реализация
//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         if (!inputUsername) return;
//
//         if (inputUsername === 'Ramin') {
//             dispatch(setUser(inputUsername));
//             navigate('/');
//             toast.success('Login successful');
//         } else {
//             toast.error('User not found');
//         }
//     };

    const handleLogout = () => {
        dispatch(clearUser());
        navigate('/login');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= 20 && !newValue.includes(" ")) {
            setInputUsername(newValue);
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage error={error} context={'User'}/>;

    return (
        <>
            <ToastContainer />
            <div className={s.auth}>
                <div className={s.authContainer}>
                    {isAuthenticated ? (
                        <>
                            <button className={`${s.button} ${s.logoutButton}`} onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className={s.signInButton}>Sign In</h2>
                            <form className={s.authForm} onSubmit={handleSubmit}>
                                <input
                                    className={s.authInput}
                                    type="text"
                                    value={inputUsername}
                                    onChange={handleChange}
                                    placeholder="Type the username 'Ramin'"
                                    disabled={isLoading}
                                />
                                <button type={'submit'} className={s.button} disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Submit'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Auth;
