import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectUserById } from './usersSlice'
import { createSelector } from '@reduxjs/toolkit'
import { useGetPostsQuery } from '../api/apiSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector(state => selectUserById(state, userId))

  // Return a unique selector instance for this page instance so that the filtered results are correctly memoized. This
  // is required because reselect selectors have their own cache, which by default only has a size of 1.
  const selectPostsForUser = useMemo(() => createSelector(
    res => res.data,
    (res, userId) => userId,
    (data, userId) => data.filter(post => post.user === userId)
  ), [])

  const postsForUser = useGetPostsQuery(undefined, {
    selectFromResult: result => ({
      // We can optionally include the other metadata fields from the result here
      ...result,
      // Include a field called `postsForUser` in the hook result object,
      // which will be a filtered list of posts
      postsForUser: selectPostsForUser(result, userId)
    })
  }).postsForUser

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
