/*
  User Entity
*/

class User {
  validate ({ name, email, password, profilePictureUrl, about, website } = {}) {
    // Input Validation
    if (!email || typeof email !== 'string') {
      throw new Error("Property 'email' must be a string!")
    }
    if (!password || typeof password !== 'string') {
      throw new Error("Property 'password' must be a string!")
    }
    if (!name || typeof name !== 'string') {
      throw new Error("Property 'name' must be a string!")
    }
    // Optional inputs, but they must be strings if included.
    if (profilePictureUrl && typeof profilePictureUrl !== 'string') {
      throw new Error("Property 'profilePictureUrl' must be a string!")
    }
    if (about && typeof about !== 'string') {
      throw new Error("Property 'about' must be a string!")
    }
    if (website && typeof website !== 'string') {
      throw new Error("Property 'website' must be a string!")
    }

    const userData = { name, email, password, profilePictureUrl, about, website }

    return userData
  }
}

export default User
