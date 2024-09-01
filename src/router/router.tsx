import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import {lazy, Suspense} from "react";
import Loader from "../components/Loader/Loader";
import PostList from "../features/PostList/PostList";


const Auth = lazy(() => import('../features/Auth/Auth'));
const PostDetail = lazy(() => import('../features/PostDetail/PostDetail'));

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout>
                <Suspense fallback={<Loader />}>
                    <Outlet />
                </Suspense>
            </Layout>
        ),
        children: [
            {
                index: true,
                element: <PostList />,
            },
            {
                path: "login",
                element: (
                    <Suspense fallback={<Loader />}>
                        <Auth />
                    </Suspense>
                ),
            },
            {
                path: "post/:id",
                element: <PostDetail />,
            },
            {
                path: "*",
                element: (
                    <Suspense fallback={<Loader />}>
                        <PostDetail />
                    </Suspense>
                ),
            },
        ],
    },
]);
