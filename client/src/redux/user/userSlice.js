import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentUser:null,
    error:null,
    loading:false,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        SignInStart:(state)=>{
            state.loading = true;
            state.error = null
        },
        SignInSuccess:(state,action)=>{
            state.loading=false;
            state.error=null;
            state.currentUser = action.payload
        },
        SignInFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        Signout:(state)=>{
            state.loading=false;
            state.error=null;
            state.currentUser=null
        }
    }
})

export const {SignInStart, SignInFailure, SignInSuccess, Signout} = userSlice.actions
export default userSlice.reducer;