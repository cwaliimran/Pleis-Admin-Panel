import { createSlice } from "@reduxjs/toolkit";




interface InitialState {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        image: string;
    } | null;
}
const initialState: InitialState = {
    user: null,
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});


export const { setUser, clearUser } = userSlice.actions;