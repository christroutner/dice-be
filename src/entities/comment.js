/*
  Comment Entity
*/

const parentTypes = ['post', 'comment']
class Comment {
  validate ({ ownerId, createdAt, commentContent, parentId, parentType } = {}) {
    // Input Validation
    if (!ownerId || typeof ownerId !== 'string') {
      throw new Error("Property 'ownerId' must be a string!")
    }

    if (!commentContent || typeof commentContent !== 'string') {
      throw new Error("Property 'commentContent' must be a string!")
    }

    if (!parentId || typeof parentId !== 'string') {
      throw new Error("Property 'parentId' must be a string!")
    }

    if (!parentType || typeof parentType !== 'string') {
      throw new Error("Property 'parentType' must be a string!")
    }

    if (!parentTypes.includes(parentType)) {
      throw new Error("Property 'parentType' must be 'post' or 'comment'!")
    }

    const commentData = { ownerId, createdAt, commentContent, parentId, parentType, likes: [] }

    return commentData
  }
}

export default Comment
