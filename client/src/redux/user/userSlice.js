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
        },
        updateStart:(state)=>{
            state.loading = true
            state.error = null
        },
        updateSuccess:(state, action)=>{
            state.currentUser = action.payload
            state.error = null
            state.loading =false
        },
        updateFailure:(state,action)=>{
            state.currentUser = null
            state.error = action.payload
            state.loading =false
        },
        deleteUserStart:(state)=>{
            state.loading =true
            state.error = null
        },
        deleteUserFailure:(state,action)=>{
            state.loading = false
            state.error = action.payload
        },
        deleteUserSuccess:(state)=>{
            state.currentUser = null
            state.error = null
            state.loading = false
        },
        SignoutSuccess:(state)=>{
            state.currentUser = null
            state.error = null
            state.loading = false
        }
    }
})

export const {SignInStart, SignInFailure, SignInSuccess, Signout, updateFailure, updateStart, updateSuccess, SignoutSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess} = userSlice.actions
export default userSlice.reducer;