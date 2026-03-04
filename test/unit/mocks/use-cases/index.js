/*
  Mocks for the use cases.
*/
/* eslint-disable */

class UserUseCaseMock {
  async createUser(userObj) {
    return {}
  }

  async getAllUsers() {
    return true
  }

  async getUser(params) {
    return true
  }

  async updateUser(existingUser, newData) {
    return true
  }

  async deleteUser(user) {
    return true
  }

  async authUser(login, passwd) {
    return {
      generateToken: () => {}
    }
  }
}


class UsageUseCaseMock {
  async cleanUsage() {
    return {}
  }

  async getRestSummary() {
    return true
  }

  async getTopIps(params) {
    return true
  }

  async getTopEndpoints(existingUser, newData) {
    return true
  }

  async clearUsage() {
    return true
  }

  async saveUsage() {
    return true
  }
}
class PostUseCaseMock {
  async createPost(postObj) {
    return {}
  }

  async getAllPosts() {
    return true
  }
  async getPost(params) {
    return true
  }
  async updatePost(existingPost, newData) {
    return true
  }
  async deletePost(post) {
    return true
  }
  async getHydratedPosts() {
    return true
  }
  async getHydratedPost(id) {
    return true
  }
}

class CommentUseCaseMock {
  async createComment(commentObj) {
    return {}
  }

  async getAllComments(params) {
    return true
  }
  async getComment(params) {
    return true
  }
  async updateComment(existingComment, newData) {
    return true
  }
  async deleteComment(comment) {
    return true
  }
  async getCommentsByParentId(parentId) {
    return true
  }
}
class UseCasesMock {
  constuctor(localConfig = {}) {
    // this.user = new UserUseCaseMock(localConfig)
  }

  user = new UserUseCaseMock()
  usage = new UsageUseCaseMock()
  post = new PostUseCaseMock()
  comment = new CommentUseCaseMock()
}

export default UseCasesMock;
