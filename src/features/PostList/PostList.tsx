import React, {useEffect, useState} from 'react';
import {useGetPostsQuery} from '../../baseApi/api';
import { useNavigate } from 'react-router-dom';
import s from './PostList.module.css';
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import {useIntersectionObserver} from "usehooks-ts";

type Post = {
    id: number;
    title: string;
    body: string;
};

const PostList: React.FC = () => {
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const { data: posts, error, isLoading} = useGetPostsQuery({page}, {refetchOnFocus: true});
    const navigate = useNavigate();
    const { isIntersecting, ref } = useIntersectionObserver({
        threshold: 0.1
    });

    useEffect(() => {
        if (!isLoading && posts && posts.length > 0) {
            setAllPosts(prevPosts => [...prevPosts, ...posts]);
        }
    }, [posts, isLoading]);

    useEffect(() => {
        if (isIntersecting && !isLoading) {
            setPage(prevPage => prevPage + 1);
        }
    }, [isIntersecting, isLoading]);

    const handlePostClick = (postId: number) => {
        navigate(`/post/${postId}`);
    };

    if (isLoading && allPosts.length === 0) return <Loader />;

    if (error) return <ErrorMessage error={error} context={'Posts'} />;

    return (
        <div className={s.postList}>
            {allPosts.map((post: Post, index) => (
                <div
                    key={`${post.id}-${page}-${index}`}
                    className={s.postCard}
                    onClick={() => handlePostClick(post.id)}
                    ref={index === allPosts.length - 1 ? ref : null}
                >
                    <h3 className={s.postListTitle}>{post.title}</h3>
                    <p className={s.postListBody}>{post.body}</p>
                </div>
            ))}
            {isLoading && <Loader />}
        </div>
    );
};

export default PostList;
