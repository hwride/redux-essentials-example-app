import { createAsyncThunk, createSlice, createSelector, nanoid, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
})

/* Async actions */
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

// The payload creator receives the partial `{title, content, user}` object
export const addNewPost = createAsyncThunk('posts/addNewPost', async initialPost => {
  // We send the initial data to the fake API server
  const response = await client.post('/fakeApi/posts', initialPost)
  // The response includes the complete post object, including unique ID
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      // prepare is basically a hook into the action creator for this reducer
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
          }
        }
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { id, reaction } = action.payload
      const existingPost = state.entities[id]
      if(existingPost) {
        existingPost.reactions[reaction] += 1
      }
    }
  },
  extraReducers: builder => builder
    .addCase(fetchPosts.pending, (state, action) => {
      state.status = 'loading'
    })
    .addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = 'succeeded'
      // Use the `upsertMany` reducer as a mutating update utility
      postsAdapter.upsertMany(state, action.payload)
    })
    .addCase(fetchPosts.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
    // Use the `addOne` reducer for the fulfilled case
    .addCase(addNewPost.fulfilled, postsAdapter.addOne)
})

export default postsSlice.reducer

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

// Creating a memoized selector function.
export const selectPostsByUser = createSelector(
  // Input selector functions.
  // These get passed all arguments of the selector and should return final args to be passed to output selector function.
  [selectAllPosts, (state, userId) => userId],
  // Output selector functions.
  // This returns the final value of the selector.
  (posts, userId) => posts.filter(post => post.user === userId)
)
