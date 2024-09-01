import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useGetPostByIdQuery, useGetCommentsByPostIdQuery } from '../../baseApi/api';
import s from './PostDetail.module.css';
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Loader from "../../components/Loader/Loader";

type Comment = {
    id: number;
    body: string;
    postId: number;
    email: string;
};

const PostDetail: React.FC = () => {
    const { id } = useParams();

    const postId = id && !isNaN(Number(id)) ? parseInt(id, 10) : null;

    const { data: post, error: postError, isLoading: postLoading } = useGetPostByIdQuery(postId as number, {
        skip: !postId,
    });
    const { data: comments, error: commentsError, isLoading: commentsLoading } = useGetCommentsByPostIdQuery(postId as number, {
        skip: !postId,
    });

    if (!postId) {
        return <Navigate to="/" />;
    }

    if (postLoading || commentsLoading) return <Loader />;
    if (postError || commentsError) {
        return <ErrorMessage error={postError || commentsError} />;
    }

    return (
        <div className={s.postDetail}>
            <h2>{post?.title}</h2>
            <p>{post?.body}</p>
            <h3>Comments</h3>
            {comments?.map((comment: Comment) => (
                <div key={comment.id} className={s.comment}>
                    <p><strong>{comment.email}</strong></p>
                    <p>{comment.body}</p>
                </div>
            ))}
        </div>
    );
};

export default PostDetail;
