import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    axiosConfig,
    toastErrorMessage,
    toastSuccessMessage,
} from '@/utils/index.js';

const initialState = {
    loading: false,
    status: false,
    userData: {},
};

export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({ username, email, password, fullName, role = 'user' }) => {
        try {
            const response = await axiosConfig.post('/auth/signup', {
                username,
                email,
                password,
                fullName,
                role,
            });
            toastSuccessMessage('Signed Up Successfully', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Sign Up Failed', error);
            return null;
        }
    }
);

export const getUserDashboardCards = createAsyncThunk(
    'user/getUserDashboardCards',
    async () => {
        try {
            const response = await axiosConfig.get('/dashboard/user/cards');
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Failed to fetch dashboard cards', error);
            return null;
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        //signUp
        builder.addCase(signUp.pending, (state) => {
            state.loading = true;
            state.status = false;
            state.userData = null;
        });
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.userData = action.payload;
        });
        builder.addCase(signUp.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
        // getUserDashboardCards
        builder.addCase(getUserDashboardCards.pending, (state) => {
            state.loading = true;
            state.status = false;
        });
        builder.addCase(getUserDashboardCards.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.userData.dashboardCardsData = action.payload;
        });
        builder.addCase(getUserDashboardCards.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
    },
});

export default userSlice.reducer;
