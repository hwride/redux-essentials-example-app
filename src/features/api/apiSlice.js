// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPosts: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => '/posts',
      // Note you should handle result being undefined in case of error or no data. Handle it here by assigning a
      // default value of empty array.
      providesTags: (result = [], error, arg) => [
        { type: 'Post', id: 'LIST' },
        // Because we provide a tag for each individual post, whenever an individual post is edited we will re-fetch
        // the entire posts list.
        ...result.map(({ id }) => ({ type: 'Post', id }))
      ]
    }),
    // Note previously we always requested all posts and then in SinglePostPage looked up the post we needed from that.
    // Adding an endpoint to query an individual post partially to demo support for query args in RTKQ. But also this
    // would give us the ability to link directly to a post page and only request that post instead of requesting all
    // posts.
    getPost: builder.query({
      query: postId => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg }]
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        // Include the entire post object as the body of the request
        body: initialPost // fetchBaseQuery automatically serializes JSON to string for our body
      }),
      // If we'd say invalidated only post + ID tag, then because that tag doesn't yet exist for getPosts, it wouldn't
      // actually cause a re-fetch of posts list. So instead we have to invalidate the generic tag.
      invalidatesTags: [{ type: 'Post', id: 'LIST' }]
    }),
    editPost: builder.mutation({
      query: post => ({
        url: `/posts/${post.id}`,
        method: 'PATCH',
        body: post
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]
    }),
    addReaction: builder.mutation({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.postId }
      ]
    })
  })
})

// Export the auto-generated hook for the `getPost` query endpoint
export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetUsersQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = apiSlice
