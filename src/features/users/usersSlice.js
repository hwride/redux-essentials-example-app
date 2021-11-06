import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const usersAdapter = createEntityAdapter()
const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => builder
    .addCase(fetchUsers.fulfilled, usersAdapter.setAll)
})

export default usersSlice.reducer

// Selectors.
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
} = usersAdapter.getSelectors(state => state.users)
