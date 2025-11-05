import { httpService } from '../http.service'


export const homeService = {
  query,
  getById,
  save,
  remove,
  addHomeMsg,
}

async function query(filterBy = {}) {
  return httpService.get(`homes`, filterBy)
}

function getById(homeId) {
  return httpService.get(`homes/${homeId}`)
}

async function remove(homeId) {
  return httpService.delete(`homes/${homeId}`)
}

async function save(home) {
  var savedHome
  if (home._id) {
    savedHome = await httpService.put(`homes/${home._id}`, home)
  } else {
    savedHome = await httpService.post('homes', home)
  }
  return savedHome
}

async function addHomeMsg(homeId, txt) {
  const savedMsg = await httpService.post(`home/${homeId}/msg`, { txt })
  return savedMsg
}
