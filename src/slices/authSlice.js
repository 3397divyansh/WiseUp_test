import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Check if token exists and handle non-JSON values safely
    token: localStorage.getItem("token")
        ? safeParse(localStorage.getItem("token"))
        : null,
        signupData: null,
        loading: false,
};

// Helper function to safely parse JSON
function safeParse(value) {
    try {
        return JSON.parse(value); // Try parsing as JSON
    } catch (error) {
        return value; // If parsing fails, return the raw value
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload;
        },
    },
});

export const { setToken, setLoading, setSignupData } = authSlice.actions;
export default authSlice.reducer;
