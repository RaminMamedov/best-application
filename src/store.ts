import {configureStore, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './baseApi/api';
import userReducer from './userSlice/userSlice';
import {router} from "./router/router";
import {useDispatch, useSelector, useStore} from "react-redux";

export const extraArgument = {
    router,
};

export const store = configureStore({
    reducer: {
        user: userReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);



export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppSelector = createSelector.withTypes<AppState>();
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppState;
    dispatch: AppDispatch;
    extra: typeof extraArgument;
}>();

export type StoreType = typeof store;

