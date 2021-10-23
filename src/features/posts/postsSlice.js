import { createSlice, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

const initialState = [{
  id: '1',
  user: '1',
  date: sub(new Date(), { minutes: 10 }).toISOString(),
  reactions: { thumbsUp: 2, hooray: 1, heart: 0, rocket: 1, eyes: 0 },
  title: 'First Post!',
  content: 'Hello!'
}, {
  id: '2',
  user: '2',
  date: sub(new Date(), { minutes: 5 }).toISOString(),
  reactions: { thumbsUp: 1, hooray: 0, heart: 0, rocket: 0, eyes: 1 },
  title: 'Second Post',
  content: 'More text'
}]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
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
      const existingPost = state.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { id, reaction } = action.payload
      const existingPost = state.find(post => post.id === id)
      if(existingPost) {
        existingPost.reactions[reaction] += 1
      }
    }
  }
})

export default postsSlice.reducer

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
