import { request } from './https'

// 分类
const layoutGroupApi = '/resource-orchestration-system/bookPortal/v102/forApp'                         
// 推荐
const layoutApi = '/mini-orch/carLoadMini/v100/suggest'   
// 查询专辑故事
const albumMediaApi = '/resource-orchestration-system/fragment/v101/content'                                                                               
// 最近播放
const historyApi = '/resource-behavior-orchestration/play/v100/histories'                              
// 添加播放记录
const saveHistoryApi = '/ubd/open/listenHistory/batch/save'             
// 收藏书籍
const albumFavoriteApi = '/resource-orchestration-system/favorite/v100/folder/detail'                     
// 添加书籍收藏
const albumFavoriteAddApi = '/resource-orchestration-system/fragment/v101/favorite'                    
// 取消书籍收藏
const albumFavoriteCancelApi = '/resource-orchestration-system/fragment/v101/unfavorite'               
// 书籍是否收藏
const isAlbumFavoriteApi = '/open/album/favorite/exist'               
// 获取个人信息
const userInfoApi = '/user-orchestration/user/api/v101/userInfo' 




// 微信授权
const authApi = '/open/user/auth'                                                                      
// 微信登录
const loginWxApi = '/open/user/wechat/login'                                                    
// 开通会员
const vipListApi = '/open/vip/openPage'                                  
// 获取购买签名
const signatureApi = '/open/buy/signature'                               
// 购买下单接口
const buyApi = '/open/buy/create'                                        
// 查询支付结果接口
const buyResultApi = '/open/buy/payResult'                               
                                                                  

export const layoutGroup = (data) => request(layoutGroupApi, data)
export const layout = (data) => request(layoutApi, data)
export const history = (data) => request(historyApi, data)
export const saveHistory = (data) => request(saveHistoryApi, data)
export const albumFavorite = (data) => request(albumFavoriteApi, data)
export const albumFavoriteAdd = (data) => request(albumFavoriteAddApi, data)
export const albumFavoriteCancel = (data) => request(albumFavoriteCancelApi, data)
export const isAlbumFavorite = (data) => request(isAlbumFavoriteApi, data)
export const albumMedia = (data) => request(albumMediaApi, data)
export const auth = (data) => request(authApi, data)
export const loginWx = (data) => request(loginWxApi, data)
export const vipList = (data) => request(vipListApi, data)
export const signature = (data) => request(signatureApi, data)
export const buy = (data) => request(buyApi, data)
export const buyResult = (data) => request(buyResultApi, data)
export const userInfo = (data) => request(userInfoApi, data)
