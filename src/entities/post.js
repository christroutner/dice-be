/*
  Post Entity
*/

class Post {
  validate ({ ownerId, createdAt, postContent, mediaUrls } = {}) {
    // Input Validation
    if (!ownerId || typeof ownerId !== 'string') {
      throw new Error("Property 'ownerId' must be a string!")
    }

    if (!postContent || typeof postContent !== 'string') {
      throw new Error("Property 'postContent' must be a string!")
    }
    if (mediaUrls && !Array.isArray(mediaUrls)) {
      throw new Error("Property 'mediaUrls' must be an array!")
    }

    const postData = { ownerId, createdAt, postContent, likes: [], mediaUrls }

    return postData
  }
}

export default Post
