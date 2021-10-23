import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TimeAgo } from './TimeAgo'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

export const PostsList = () => {
  const posts = useSelector(state => state.posts)
  // Sort posts in reverse chronological order by datetime string
  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

  const renderedPosts = orderedPosts.map(post =>
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
      <ReactionButtons post={post} />
    </article>
  )

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
