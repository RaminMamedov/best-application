import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
    username: string | null;
    isAuthenticated: boolean;
};

const initialState: UserState = {
    username: null,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string | null>) => {
            state.username = action.payload;
            state.isAuthenticated = action.payload !== null;
        },
        clearUser: (state) => {
            state.username = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
