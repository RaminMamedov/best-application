import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

const PostSchema = z.object({
    id: z.number(),
    title: z.string(),
    body: z.string(),
    userId: z.number(),
});

const CommentSchema = z.object({
    id: z.number(),
    body: z.string(),
    postId: z.number(),
    email: z.string(),
});

const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    name: z.string(),
});

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
    tagTypes: ["Posts", "Comments", "Users"],
    endpoints: (builder) => ({
        getPosts: builder.query<any[], { page: number }>({
            query: ({ page }) => `posts?_page=${page}&_limit=12`,
            transformResponse: (response: any) => PostSchema.array().parse(response),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "Posts" as const, id })),
                        { type: "Posts", id: "PARTIAL-LIST" },
                    ]
                    : [{ type: "Posts", id: "PARTIAL-LIST" }],
        }),
        getPostById: builder.query<any, number>({
            query: (id) => `posts/${id}`,
            transformResponse: (response: any) => PostSchema.parse(response),
            providesTags: (result, error, id) => [{ type: "Posts", id }],
        }),
        getCommentsByPostId: builder.query<any[], number>({
            query: (postId) => `comments?postId=${postId}`,
            transformResponse: (response: any) => CommentSchema.array().parse(response),
            providesTags: (result, error, postId) => [{ type: "Comments", id: postId }],
        }),
        getUserByUsername: builder.query<any[], string>({
            query: (username) => `users?username=${username}`,
            transformResponse: (response: any) => UserSchema.array().parse(response),
            providesTags: (result, error, username) => [{ type: "Users", id: username }],
        }),
    }),
});

export const {
    useLazyGetPostsQuery,
    useGetPostByIdQuery,
    useGetCommentsByPostIdQuery,
    useLazyGetUserByUsernameQuery
} = baseApi;
