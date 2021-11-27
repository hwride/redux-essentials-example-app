import { createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

// const usersAdapter = createEntityAdapter()
// const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '/users'
    })
  })
})

export const { useGetUsersQuery } = extendedApiSlice

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()

const emptyUsers = []

export const selectAllUsers = createSelector(
  selectUsersResult,
  usersResult => usersResult?.data ?? emptyUsers
)

export const selectUserById = createSelector(
  selectAllUsers,
  (state, userId) => userId,
  (users, userId) => users.find(user => user.id === userId)
)

// Selectors.
// export const {
//   selectAll: selectAllUsers,
//   selectById: selectUserById,
// } = usersAdapter.getSelectors(state => state.users)
