import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useEditPostMutation, useGetPostQuery } from '../api/apiSlice'

export const EditPostForm = ({ match }) => {
  const { postId } = match.params

  const { data: post } = useGetPostQuery(postId)
  const [updatePost, { isLoading }] = useEditPostMutation()

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  const history = useHistory()

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </form>
      <button type="button" onClick={async () => {
        if (title && content) {
          await updatePost({ id: postId, title, content })
          // Current there's no auto-update after this atm. Could e.g. call refetch here to trigger that.
          history.push(`/posts/${postId}`)
        }
      }}>
        Save Post
      </button>
    </section>
  )
}
