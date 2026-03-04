/**
 * End-to-end tests for /post endpoints.
 *
 */
import testUtils from '../../utils/test-utils.js'
import { assert } from 'chai'
import config from '../../../config/index.js'
import axios from 'axios'
import sinon from 'sinon'
import util from 'util'

util.inspect.defaultOptions = { depth: 1 }

const LOCALHOST = `http://localhost:${config.port}`

const context = {}
let sandbox

// const mockContext = require('../../unit/mocks/ctx-mock').context

if (!config.noMongo) {
  describe('Posts', () => {
    before(async () => {
      // console.log(`config: ${JSON.stringify(config, null, 2)}`)

      // Create a second test user.
      const userObj = {
        email: 'test2@test.com',
        password: 'pass2',
        name: 'test2'
      }
      const userObj2 = {
        email: 'test3@test.com',
        password: 'pass3',
        name: 'test3'
      }
      const testUser = await testUtils.createUser(userObj)
      const testUser2 = await testUtils.createUser(userObj2)
      // console.log(`testUser2: ${JSON.stringify(testUser, null, 2)}`)
      context.user = testUser.user
      context.token = testUser.token
      context.id = testUser.user._id

      context.user2 = testUser2.user
      context.token2 = testUser2.token
      context.id2 = testUser2.user._id

      // Get the JWT used to log in as the admin 'system' user.
      const adminJWT = await testUtils.getAdminJWT()
      context.adminJWT = adminJWT

      // const admin = await testUtils.loginAdminUser()
      // context.adminJWT = admin.token

      // const admin = await adminLib.loginAdmin()
      // console.log(`admin: ${JSON.stringify(admin, null, 2)}`)
    })

    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })

    afterEach(() => sandbox.restore())

    describe('POST /post - Create post', () => {
      it('should not create  if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'POST',
            url: `${LOCALHOST}/post`,
            data: {
              post: {
                ownerId: context.user._id,
                postContent: 'This is a test post'
              }
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not create a post if the authorization header is missing the scheme', async () => {
        try {
          const options = {
            method: 'POST',
            url: `${LOCALHOST}/post`,
            data: {
              post: {
                ownerId: context.user._id,
                createdAt: new Date(),
                postContent: 'This is a test post'
              }
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not create a post if the authorization header has invalid scheme', async () => {
        try {
          const options = {
            method: 'POST',
            url: `${LOCALHOST}/post`,
            data: {
              post: {
                ownerId: context.user._id,
                createdAt: new Date(),
                postContent: 'This is a test post'
              }
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not create a post if the token is invalid', async () => {
        try {
          const options = {
            method: 'POST',
            url: `${LOCALHOST}/post`,
            data: {
              post: {
                ownerId: context.user._id,
                createdAt: new Date(),
                postContent: 'This is a test post'
              }
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should create a post', async () => {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/post`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${context.token}`
          },
          data: {
            post: {
              ownerId: context.user._id,
              createdAt: new Date(),
              postContent: 'This is a test post'
            }
          }
        }
        const result = await axios(options)
        assert.equal(result.status, 200)
        assert.equal(result.data.post.ownerId, context.user._id)
        assert.equal(result.data.post.postContent, 'This is a test post')
        assert.equal(result.data.post.likes.length, 0)
        assert.property(result.data.post, 'createdAt')

        context.postId = result.data.post._id
      })
    })

    describe('GET /post', () => {
      it('should not get a post if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'POST',
            url: `${LOCALHOST}/post`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }

          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not get a post if the authorization header has invalid scheme', async () => {
        const { token } = context
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post`,
            headers: {
              Accept: 'application/json',
              Authorization: `Unknown ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not get a post if token is invalid', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should get all posts', async () => {
        const { token } = context

        const options = {
          method: 'GET',
          url: `${LOCALHOST}/post`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
        const result = await axios(options)
        const post = result.data.posts[0]
        // console.log(`users: ${util.inspect(users)}`)

        assert.hasAnyKeys(post, ['ownerId', 'createdAt', 'postContent', 'likes'])
      })
    })

    describe('GET /post/:id', () => {
      it('should not get a post if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/1`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not get a post if the authorization header has invalid scheme', async () => {
        const { token } = context
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/1`,
            headers: {
              Accept: 'application/json',
              Authorization: `Unknown ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not get a post if token is invalid', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/1`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it("should throw 404 if post doesn't exist", async () => {
        const { token } = context

        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/5fa4bd7ee1828f5f4d8ed004`,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 404)
        }
      })

      it('should throw 422 for invalid post id', async () => {
        const { token } = context

        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/1`,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 422)
        }
      })

      it('should get a post', async () => {
        const _id = context.postId
        const token = context.token

        const options = {
          method: 'GET',
          url: `${LOCALHOST}/post/${_id}`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
        const result = await axios(options)

        const post = result.data.post
        // console.log(`user: ${util.inspect(user)}`)

        assert.property(post, 'ownerId')
        assert.property(post, 'createdAt')
        assert.property(post, 'postContent')
        assert.property(post, 'likes')
      })
    })

    describe('PUT /post/:id', () => {
      it('should not update a post if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'PUT',
            url: `${LOCALHOST}/post/1`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not get a post if the authorization header has invalid scheme', async () => {
        const { token } = context
        try {
          const options = {
            method: 'PUT',
            url: `${LOCALHOST}/post/5fa4bd7ee1828f5f4d8ed004`,
            headers: {
              Accept: 'application/json',
              Authorization: `Unknown ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not update a post if token is invalid', async () => {
        try {
          const options = {
            method: 'PUT',
            url: `${LOCALHOST}/post/5fa4bd7ee1828f5f4d8ed004`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it("should not update a post if post doesn't exist", async () => {
        const { token } = context

        try {
          const options = {
            method: 'PUT',
            url: `${LOCALHOST}/post/5fa4bd7ee1828f5f4d8ed004`,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 404)
        }
      })

      it('should not update a post if post id is invalid', async () => {
        const { token } = context

        try {
          const options = {
            method: 'PUT',
            url: `${LOCALHOST}/post/1`,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 422)
        }
      })

      it('should update a post when owner', async () => {
        const options = {
          method: 'PUT',
          url: `${LOCALHOST}/post/${context.postId}`,
          headers: {
            Authorization: `Bearer ${context.token}`
          },
          data: {
            post: {
              postContent: 'This is a test post updated',
              likes: [`${context.user._id}`]
            }
          }
        }
        const result = await axios(options)
        assert.equal(result.status, 200)
        assert.equal(result.data.post.postContent, 'This is a test post updated')
        assert.equal(result.data.post.likes.length, 1)
        assert.property(result.data.post, 'updatedAt')
      })

      it('should update a post when admin', async () => {
        const options = {
          method: 'PUT',
          url: `${LOCALHOST}/post/${context.postId}`,
          headers: {
            Authorization: `Bearer ${context.adminJWT}`
          },
          data: {
            post: {
              postContent: 'This is a test post updated by admin',
              likes: []
            }
          }
        }

        const result = await axios(options)
        // console.log(`result stringified: ${JSON.stringify(result, null, 2)}`)

        const post = result.data.post
        assert.equal(post.postContent, 'This is a test post updated by admin')
      })
    })
    describe('GET /post/hydrated', () => {
      it('should not get all hydrated posts if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/hydrated`
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should not get all hydrated posts if the authorization header has invalid scheme', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/hydrated`
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should not get all hydrated posts if token is invalid', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/hydrated`
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should get all hydrated posts', async () => {
        const options = {
          method: 'GET',
          url: `${LOCALHOST}/post/hydrated`,
          headers: {
            Authorization: `Bearer ${context.token}`
          }
        }
        const result = await axios(options)
        const post = result.data.posts[0]
        assert.property(post, 'ownerId')
        assert.property(post, 'createdAt')
        assert.property(post, 'postContent')
        assert.property(post, 'likes')
        assert.property(post, 'totalComments')
      })
    })
    describe('GET /post/hydrated/:id', () => {
      it('should not get a hydrated post if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/hydrated/${context.postId}`
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should not get a hydrated post if the authorization header has invalid scheme', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/hydrated/${context.postId}`
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should not get a hydrated post if token is invalid', async () => {
        try {
          const options = {
            method: 'GET',
            url: `${LOCALHOST}/post/hydrated/${context.postId}`
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })
      it('should get a hydrated post', async () => {
        const options = {
          method: 'GET',
          url: `${LOCALHOST}/post/hydrated/${context.postId}`,
          headers: {
            Authorization: `Bearer ${context.token}`
          }
        }
        const result = await axios(options)
        const post = result.data.post
        assert.property(post, 'ownerId')
        assert.property(post, 'createdAt')
        assert.property(post, 'postContent')
        assert.property(post, 'likes')
        assert.property(post, 'totalComments')
      })
    })
    describe('DELETE /post/:id', () => {
      it('should not delete a post if the authorization header is missing', async () => {
        try {
          const options = {
            method: 'DELETE',
            url: `${LOCALHOST}/post/${context.postId}`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not delete a post if the authorization header has invalid scheme', async () => {
        const { token } = context

        try {
          const options = {
            method: 'DELETE',
            url: `${LOCALHOST}/post/${context.postId}`,
            headers: {
              Accept: 'application/json',
              Authorization: `Unknown ${token}`
            }
          }
          await axios(options)

          assert.equal(true, false, 'Unexpected behavior')
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should not delete a post if token is invalid', async () => {
        try {
          const options = {
            method: 'DELETE',
            url: `${LOCALHOST}/post/${context.postId}`,
            headers: {
              Authorization: 'Bearer 1'
            }
          }
          await axios(options)
        } catch (err) {
          assert.equal(err.response.status, 401)
        }
      })

      it('should delete a post', async () => {
        const options = {
          method: 'DELETE',
          url: `${LOCALHOST}/post/${context.postId}`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${context.token}`
          }
        }
        const result = await axios(options)
        // console.log(`result: ${util.inspect(result.data.success)}`)

        assert.equal(result.data.success, true)
      })
    })
  })
}
