import chromep from 'chrome-promise'
import { API } from './types'

const api: API = {
  namespace: 'bookmarks',
  endpoint: chromep.bookmarks,
  methods: [
    'get',
    'getChildren',
    'getRecent',
    'getTree',
    'getSubTree',
    'search',
    'create',
    'move',
    'update',
    'remove',
    'removeTree',
  ],
}
export default api
