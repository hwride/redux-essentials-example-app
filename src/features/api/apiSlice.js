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
      providesTags: ['Post']
    }),
    // Note previously we always requested all posts and then in SinglePostPage looked up the post we needed from that.
    // Adding an endpoint to query an individual post partially to demo support for query args in RTKQ. But also this
    // would give us the ability to link directly to a post page and only request that post instead of requesting all
    // posts.
    getPost: builder.query({
      query: postId => `/posts/${postId}`
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        // Include the entire post object as the body of the request
        body: initialPost // fetchBaseQuery automatically serializes JSON to string for our body
      }),
      invalidatesTags: ['Post']
    }),
    editPost: builder.mutation({
      query: post => ({
        url: `/posts/${post.id}`,
        method: 'PATCH',
        body: post
      })
    })
  })
})

// Export the auto-generated hook for the `getPost` query endpoint
export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
} = apiSlice
