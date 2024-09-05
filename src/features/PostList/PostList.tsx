import React, {useEffect, useState} from 'react';
import { useGetPostsQuery} from '../../baseApi/api';
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
    const [page, setPage] = useState(1);
    const { data: posts, error, isLoading} = useGetPostsQuery({page}, {refetchOnFocus: true});
    const navigate = useNavigate();
    const { isIntersecting, ref } = useIntersectionObserver({
        threshold: 0.1
    });

    useEffect(() => {
        if (isIntersecting && !isLoading) {
            setPage(prevPage => prevPage + 1);
        }
    }, [isIntersecting, isLoading]);

    const handlePostClick = (postId: number) => {
        navigate(`/post/${postId}`);
    };

    if (isLoading) return <Loader />;

    if (error) return <ErrorMessage error={error} context={'Posts'} />;

    return (
        <div className={s.postList}>
            {posts?.map((post: Post, index) => (
                <div
                    key={`${post.id}-${page}-${index}`}
                    className={s.postCard}
                    onClick={() => handlePostClick(post.id)}
                    ref={!!posts && index === posts.length - 1 ? ref : null}
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
