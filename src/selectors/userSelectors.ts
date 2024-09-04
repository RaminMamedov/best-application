import { createSelector } from 'reselect';
import {AppState} from "../store/hooks";

export const selectUserState = (state: AppState) => state.user;

export const selectIsAuthenticated = createSelector(
    selectUserState,
    (userState) => userState.isAuthenticated
);
