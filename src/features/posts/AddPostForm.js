import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewPost } from './postsSlice'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  const dispatch = useDispatch()

  const users = useSelector(state => state.users)
  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={e => setUserId(e.target.value)}>
          <option value=""></option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button type="button"  disabled={!canSave} onClick={async () => {
          if (canSave) {
            try {
              setAddRequestStatus('pending')
              await dispatch(addNewPost({ title, content, user: userId })).unwrap()
              setTitle('')
              setContent('')
              setUserId('')
            } catch (err) {
              console.error('Failed to save the post: ', err)
            } finally {
              setAddRequestStatus('idle')
            }
          }
        }}>Save Post</button>
      </form>
    </section>
  )
}
