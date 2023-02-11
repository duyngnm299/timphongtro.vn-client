import { createSlice } from '@reduxjs/toolkit';
const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notification: {
            newNtf: null,
        },
    },
    reducers: {
        newNotification: (state, action) => {
            state.notification.newNtf = action.payload || null;
        },
    },
});

export const { newNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
