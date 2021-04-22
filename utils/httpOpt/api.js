import { request } from './https'

// 首页推荐
const feedApi = '/mini-orch/carLoadMini/v100/getRecommendBookInfos'
// 分类
const layoutGroupApi = '/mini-orch/carLoadMini/bookPortal/v102/forApp'                         
// 推荐
const layoutApi = '/mini-orch/carLoadMini/v100/suggest'   
// 查询专辑故事
const albumMediaApi = '/mini-orch/carLoadMini/fragment/v101/content'                                                                               
// 最近播放
const historyApi = '/mini-orch/carLoadMini/play/v100/histories'                              
// 添加播放记录
const saveHistoryApi = '/mini-orch/carLoadMini/play/addPlayHistory'             
// 收藏书籍
const albumFavoriteApi = '/mini-orch/carLoadMini/favorite/v100/folder/detail'                     
// 添加书籍收藏
const albumFavoriteAddApi = '/mini-orch/carLoadMini/fragment/v101/favorite'                    
// 取消书籍收藏
const albumFavoriteCancelApi = '/mini-orch/carLoadMini/fragment/v101/unfavorite'               
// 书籍是否收藏
const isAlbumFavoriteApi = '/info-system/freeReadInfo/v100/getFreeReadBookList'               
// 获取个人信息
const userInfoApi = '/mini-orch/carLoadMini/user/api/v101/userInfo' 
// 微信授权
const validationAuthorizeApi = '/mini-orch/auth/carLoadMini/v100/validationAuthorize'
// 通过手机号登录
const authLoginApi = '/mini-orch/auth/carLoadMini/v100/authLogin'
// 退出登录
const logoutApi = '/mini-orch/auth/carLoadMini/v100/logout'
// 支付接口
const getPayQrCodeApi = '/mini-orch/pay/carLoadMini/v100/getPayQrCode'
// 分类书籍
const bookCategoryAPi = '/mini-orch/carLoadMini/books/bookInfoByCategory'
// 免费书籍
const freeBookApi = '/mini-orch/carLoadMini/books/freeList'
      



// 测试登录用
const testNewApi = '/mini-orch/auth/carLoadMini/v100/testValidateSign'                               
// 测试登录用
const createOrUpdateWeChatUserApi = '/mini-orch/auth/carLoadMini/v100/createOrUpdateWeChatUser'      

// 批量获取音频src
const songsUrlApI = '/mini-orch/carLoadMini/v100/getBooksInfoByIds'
                                                                  
export const feed = (data) => request(feedApi, data)
export const layoutGroup = (data) => request(layoutGroupApi, data)
export const layout = (data) => request(layoutApi, data)
export const history = (data) => request(historyApi, data)
export const saveHistory = (data) => request(saveHistoryApi, data)
export const albumFavorite = (data) => request(albumFavoriteApi, data)
export const albumFavoriteAdd = (data) => request(albumFavoriteAddApi, data)
export const albumFavoriteCancel = (data) => request(albumFavoriteCancelApi, data)
export const isAlbumFavorite = (data) => request(isAlbumFavoriteApi, data)
export const albumMedia = (data) => request(albumMediaApi, data)
export const validationAuthorize = (data) => request(validationAuthorizeApi, data)
export const authLogin = (data) => request(authLoginApi, data)
export const logout = (data) => request(logoutApi, data)
export const getPayQrCode = (data) => request(getPayQrCodeApi, data)


export const userInfo = (data) => request(userInfoApi, data)


export const testNew = (data) => request(testNewApi, data)
export const createOrUpdateWeChatUser = (data) => request(createOrUpdateWeChatUserApi, data)
export const bookCategory = (data) => request(bookCategoryAPi, data)
export const freeBook = (data) => request(freeBookApi, data)
export const songsUrl = (data) => request(songsUrlApI, data)
