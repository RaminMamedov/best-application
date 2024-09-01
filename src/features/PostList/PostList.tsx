import React, {useEffect, useRef, useState} from 'react';
import {useLazyGetPostsQuery} from '../../baseApi/api';
import { useNavigate } from 'react-router-dom';
import s from './PostList.module.css';
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import {toast} from "react-toastify";

type Post = {
    id: number;
    title: string;
    body: string;
};

const PostList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [trigger, { data: posts, error, isLoading }] = useLazyGetPostsQuery();
    const navigate = useNavigate();

    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostElementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await trigger({ page }).unwrap();
                if (result) {
                    setAllPosts(prevPosts => [...prevPosts, ...result]);
                }
            } catch (e) {
                toast.error('An unexpected error occurred. Please try again later.');
                console.error(e);
            }
        };

        fetchPosts();
    }, [page, trigger]);

    useEffect(() => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            entries => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setPage(prevPage => prevPage + 1);
                }
            },
            { threshold: 0.5 }
        );

        if (lastPostElementRef.current) {
            observer.current.observe(lastPostElementRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };

    }, [posts, isLoading]);

    const handlePostClick = (postId: number) => {
        navigate(`/post/${postId}`);
    };

    if (isLoading) return <Loader />;

    if (error) return <ErrorMessage error={error} context={'Posts'} />;

    return (
        <div className={s.postList}>
            {allPosts.map((post: Post, index) => (
                <div
                    key={`post-${post.id}-${index}-${page}`}
                    className={s.postCard}
                    onClick={() => handlePostClick(post.id)}
                    ref={index === allPosts.length - 1 ? lastPostElementRef : null}
                >
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}
            {isLoading && <Loader />}
        </div>
    );
};

export default PostList;
