import { userService } from '../../services/user'
import { socketService } from '../../services/socket.service.js'
import { store } from '../store'
import { LOADING_DONE, LOADING_START } from '../reducers/system.reducer'
import {
  REMOVE_USER,
  SET_LOGGEDINUSER,
  SET_USERS,
  SET_WATCHED_USER,
  ADD_LIKE_HOME,
  REMOVE_LIKE_HOME,
  SET_AUTH_MODE
} from '../reducers/user.reducer'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export async function loadUsers() {
  try {
    store.dispatch({ type: LOADING_START })
    const users = await userService.getUsers()
    store.dispatch({ type: SET_USERS, users })
  } catch (err) {
    console.error('UserActions: err in loadUsers', err)
  } finally {
    store.dispatch({ type: LOADING_DONE })
  }
}

export async function removeUser(userId) {
  try {
    await userService.remove(userId)
    store.dispatch({ type: REMOVE_USER, userId })
  } catch (err) {
    console.error('UserActions: err in removeUser', err)
  }
}

export async function login(credentials) {
  try {
    const user = await userService.login(credentials)
    store.dispatch({
      type: SET_LOGGEDINUSER,
      user,
    })
    socketService.login(user._id)
    return user
  } catch (err) {
    console.error('Cannot login', err)
    throw err
  }
}

export async function signup(signingUpUser) {
  try {
    const user = await userService.signup(signingUpUser)
    store.dispatch({
      type: SET_LOGGEDINUSER,
      user,
    })
    socketService.login(user)
    return user
  } catch (err) {
    console.error('Cannot signup', err)
    throw err
  }
}

export async function logout() {
  try {
    await userService.logout()
    store.dispatch({
      type: SET_LOGGEDINUSER,
      user: null,
    })
    socketService.logout()
  } catch (err) {
    console.error('Cannot logout', err)
    throw err
  }
}

export async function loadUser(userId) {
  try {
    const user = await userService.getById(userId)
    store.dispatch({ type: SET_WATCHED_USER, user })
  } catch (err) {
    console.error('Cannot load user', err)
    throw err
  }
}

export async function addLike(homeId, userId) {
  try {
    await userService.toggleHomeLike(homeId)
    store.dispatch({ type: ADD_LIKE_HOME, homeId, userId })

    const currentUser = store.getState().userModule.loggedInUser
    if (currentUser) {
      sessionStorage.setItem(
        STORAGE_KEY_LOGGEDIN_USER,
        JSON.stringify(currentUser)
      )
    }
  } catch (err) {
    console.error('Cannot add like', err)
    throw err
  }
}

export async function removeLike(homeId, userId) {
  try {
    await userService.toggleHomeLike(homeId)
    store.dispatch({ type: REMOVE_LIKE_HOME, homeId, userId })

    const currentUser = store.getState().userModule.loggedInUser
    if (currentUser) {
      sessionStorage.setItem(
        STORAGE_KEY_LOGGEDIN_USER,
        JSON.stringify(currentUser)
      )
    }
  } catch (err) {
    console.error('Cannot remove like', err)
    throw err
  }
}

export async function initUsers() {
  try {
    const users = await userService.getUsers()
    store.dispatch({ type: SET_USERS, users })
  } catch (err) {
    console.error('Cannot init users', err)
  }
}

export async function initUser() {
  try {
    const localUser = userService.getLoggedinUser()
    if (localUser) {
      store.dispatch({
        type: SET_LOGGEDINUSER,
        user: localUser,
      })
      return localUser
    }

    const serverUser = await userService.getCurrentUser()
    if (serverUser) {
      store.dispatch({
        type: SET_LOGGEDINUSER,
        user: serverUser,
      })
      return serverUser
    }
  } catch (err) {
    console.error('Cannot init user', err)
  }
}

export function setAuthMode(authMode) {
  store.dispatch({
    type: SET_AUTH_MODE,
    authMode
  })
}