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

export type Posts = z.infer<typeof PostSchema>;
type Comment = z.infer<typeof CommentSchema>;
type User = z.infer<typeof UserSchema>;


export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
    refetchOnFocus: true,
    refetchOnReconnect: true,
    tagTypes: ["Posts", "Comments", "Users"],
    endpoints: (builder) => ({
        getPosts: builder.query<Posts[], { page: number }>({
            query: ({ page }) => `posts?_page=${page}&_limit=12`,
            transformResponse: (response: Posts[]) => PostSchema.array().parse(response),
            providesTags: (result, error, { page }) => [{ type: "Posts", id: page }],
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems) => {
                currentCache.push(...newItems)
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page
            },
        }),
        getPostById: builder.query<Posts, number>({
            query: (id) => `posts/${id}`,
            transformResponse: (response: Posts) => PostSchema.parse(response),
            providesTags: (result, error, id) => [{ type: "Posts", id }],
        }),
        getCommentsByPostId: builder.query<Comment[], number>({
            query: (postId) => `comments?postId=${postId}`,
            transformResponse: (response: Comment[]) => CommentSchema.array().parse(response),
            providesTags: (result, error, postId) => [{ type: "Comments", id: postId }],
        }),
        getUserByUsername: builder.query<User[], string>({
            query: (username) => `users?username=${username}`,
            transformResponse: (response: User[]) => UserSchema.array().parse(response),
            providesTags: (result, error, username) => [{ type: "Users", id: username }],
        }),
    }),
});



export const {
    useGetPostsQuery,
    useGetPostByIdQuery,
    useGetCommentsByPostIdQuery,
    useLazyGetUserByUsernameQuery
} = baseApi;