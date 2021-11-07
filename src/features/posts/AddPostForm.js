import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersSlice'
import { useAddNewPostMutation } from '../api/apiSlice'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const [addNewPost, { isLoading }] = useAddNewPostMutation()

  const users = useSelector(selectAllUsers)
  const canSave = [title, content, userId].every(Boolean) && !isLoading

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
              await addNewPost({ title, content, user: userId }).unwrap()
              setTitle('')
              setContent('')
              setUserId('')
            } catch (err) {
              console.error('Failed to save the post: ', err)
            }
          }
        }}>Save Post</button>
      </form>
    </section>
  )
}
