import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        message: {
            msg: null,
        },
        conversation: {
            conv: null,
        },
        online: {
            listUsers: null,
        },
    },
    reducers: {
        newMessage: (state, action) => {
            console.log(action.payload);
            state.message.msg = action.payload ? action.payload : null;
        },
        currentConversation: (state, action) => {
            state.conversation.conv = action.payload || null;
        },
        onlineUsers: (state, action) => {
            state.online.listUsers = action.payload || null;
        },
    },
});

export const { newMessage, currentConversation, onlineUsers } =
    messageSlice.actions;
export default messageSlice.reducer;
