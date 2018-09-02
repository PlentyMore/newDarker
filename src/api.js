import axios from "axios";

import Vue from "vue";
// import qs from 'qs'; //此模块用于转成Form Data 格式

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.JWT_TOKEN) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config. headers.Authorization = `${localStorage.JWT_TOKEN}`;
    }
    if (`!${localStorage.ClientId}`) {
      localStorage.setItem("ClientId", new Date() - 0);
    }
    config.headers.ClientId = `${localStorage.ClientId}`;
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http响应拦截器
axios.interceptors.response.use(
  data => {
    // 响应成功关闭loading
    return data;
  },
  err => {
    // 这里是返回状态码不为200时候的错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 403:
          err.message = err.response.data.msg;
          Vue.prototype.$message({
            message: err.message,
            type: "error"
          });
          console.log("ready to clear/..............");
          localStorage.setItem("USER_ID", "");
          localStorage.setItem("JWT_TOKEN", "");
          localStorage.setItem("loginUserName", "");
          localStorage.setItem("face","");
          localStorage.setItem("ROLE","");
          setTimeout(() => {
            window.location.href = "/";
          }, 2500);
          return ;

        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`;
          break;

        case 408:
          err.message = "请求超时";
          break;

        case 500:
          err.message = "服务器内部错误";
          break;
        default:
          err.message = err.response.data.msg;
          break;
      }
      Vue.prototype.$message({
        message: err.message,
        type: "error"
      });
    }

    return Promise.reject(err);
  }
);

//本地开发请设置为"/api"
// const baseURL = "http://207.148.103.82:8080";
const baseURL = "https://darker.online";
const baseURL2 = "http://test.echisan.cn:8888";
// const baseURL = "http://10.0.46.20:8080";

//首页相关
const getWelcome= ()=>{
  return axios.get(`${baseURL2}/index/is`);
}
const getIndex=()=>{
  return axios.get(`${baseURL2}/index`);
}
const getOnlineList=()=>{
  return axios.get(`${baseURL2}/index/online`);
}

//  登录相关
const login = data => {
  return axios.post(`${baseURL2}/auth/login`, data);
};
const logout = () => {
  return axios.get(`${baseURL2}/auth/logout`);
};

const checkToken = token => {
  return axios.get(`${baseURL2}/tokens`, token);
};

const updateUserInfo = (uid, user) => {
  return axios.put(`${baseURL2}/users/${uid}`, user);
};

const updateUserPwd = (uid, user) => {
  return axios.put(`${baseURL2}/users/${uid}/pwd`, user);
};

const getVideosInfo = (fileSize, vMd5) => {
  return axios.get(`${baseURL2}/videos/${fileSize}/${vMd5}`);
};
const getDanmakujiIdByBangumisIdAndepIndex = (bangumiId, epIndex) => {
  return axios.get(`${baseURL2}/episodes`, {
    params: {
      bangumiId: bangumiId,
      epIndex: epIndex
    }
  });
};
const getsearchBangumisIdResult = query => {
  return axios.get(`${baseURL2}/bangumis`, {
    params: {
      bangumiName: query
    }
  });
};

const getEpisodeInfoByEpId = epId => {
  return axios.get(`${baseURL2}/episodes/${epId}`);
};

const reVerifyEmail = ()=> {
  return axios.get(`${baseURL2}/auth/emailReVerify`);
};

//评论API-------------------------------
const getRepliesByEpId = epId => {
  return axios.get(`${baseURL2}/replies`, {
    params: {
      epId: epId
    }
  });
};

const getRepliesByEpIdAndPageNum = (epId, pn) => {
  return axios.get(`${baseURL2}/replies`, {
    params: {
      epId: epId,
      pn: pn
    }
  });
};

const getSubReplies = (prid, pn) => {
  return axios.get(`${baseURL2}/replies/son`, {
    params: {
      prid: prid,
      pn: pn
    }
  });
};

const addReply = data => {
  return axios.post(`${baseURL2}/replies`, data);
};

const deleteReply = rid => {
  return axios.delete(`${baseURL2}/replies/${rid}`);
};

const postActiontoReply = (rid, action) => {
  return axios.post(`${baseURL2}/replies/like/${rid}/${action}`);
};
//评论API-------------------------------

const register = data => {
  return axios.post(`${baseURL2}/users`, data);
};

const getNotices = (userId, type) => {
  return axios.get(`${baseURL2}/messages/${userId}/type/${type}`);
};

const getNoticesBypn = (userId, type, pn) => {
  return axios.get(`${baseURL2}/messages/${userId}/type/${type}`, {
    params: {
      pn: pn
    }
  });
};

const countUnreadMsg = userId => {
  return axios.get(`${baseURL2}/v2/messages/cum`);
};

const getSpecificReply = rid => {
  return axios.get(`${baseURL2}/replies`, {
    params: {
      rid: rid
    }
  });
};

const verifyEmail = (uid, key) => {
  return axios.get(`${baseURL2}/auth/verify/uid/${uid}/key/${key}`);
};

const getEmailResetCode=() => {
  return axios.get(`${baseURL2}/auth/emailReset`);
}

const modifyEmail=(uid,data)=>{
  return axios.put(`${baseURL2}/users/${uid}/email`,data);
}

const getUserInfoByUid = uid => {
  return axios.get(`${baseURL2}/users/${uid}`);
};

const sendVideoMatchInfo = data => {
  return axios.post(`${baseURL2}/videos/videoMatchInfo`, data);
};

const sendPostBangumi = data => {
  return axios.post(`${baseURL2}/postBangumis`, data);
};

const updatePostBangumi = data => {
  return axios.put(`${baseURL2}/postBangumis`, data);
};

const getUserPostBangumi = data => {
  return axios.get(`${baseURL2}/postBangumis`, {
    params: data
  });
};

const updatePostBangumiThumb = data => {
  return axios.put(`${baseURL2}/postBangumis/thumb`, data);
};

const deletePostBangumi = pbId => {
  return axios.delete(`${baseURL2}/postBangumis/${pbId}`);
};

const matchVideoSuccess = data => {
  return axios.post(`${baseURL2}/videos/matchSuccess`, data);
};

const getEpisodesByBid = bid => {
  return axios.get(`${baseURL2}/episodes/bid/${bid}`);
};

const getBangumiById = bid => {
  return axios.get(`${baseURL2}/bangumis/${bid}`);
};

const getMostViewBangumis = () => {
  return axios.get(`${baseURL2}/bangumis/mostView`);
};

const searchBangumisByName = (name, pn, ps) => {
  return axios.get(`${baseURL2}/bangumis`,{
    params: {
      bangumiName: name,
      pageNum: pn,
      pageSize: ps
    }
  })
};

const getNotice = () => {
  return axios.get(`${baseURL2}/notices/showIndex`);
};

const getNoticeById = id => {
  return axios.get(`${baseURL2}/notices/${id}`);
};

//---replies_v2
const getRepliesOfAnyClassPage = data =>{
  return axios.get(`${baseURL2}/v2/replies`,{params:data});
};
const postVideoReply = data=>{
  return axios.post(`${baseURL2}/v2/replies`,data);
};
const upvoteReply = rpid=>{
  return axios.post(`${baseURL2}/v2/replies/${rpid}/like`);
};
const cancelUpvoteReply = rpid=>{
  return axios.delete(`${baseURL2}/v2/replies/${rpid}/like`);
};
const deleteMyRpely = rpid =>{
  return axios.delete(`${baseURL2}/v2/replies/${rpid}`);
};
const stickReply = rpid =>{
  return axios.post(`${baseURL2}/v2/replies/${rpid}/top`);
};
const unstickReply = rpid =>{
  return axios.delete(`${baseURL2}/v2/replies/${rpid}/top`);
};

//---message_v2
const getUnreadMessage = () =>{
  return axios.get(`${baseURL2}/v2/messages/cum`);
};

const getMessageList = data =>{
  return axios.get(`${baseURL2}/v2/messages`,{params:data});
};

const deleteMessage = mid =>{
  return axios.delete(`${baseURL2}/v2/messages/${mid}`);
};

//---forgetPassword
const checkEmail = data =>{
  return axios.post(`${baseURL2}/users/pwd/forget/cemail`,data);
};
const getMailCode = ticket =>{
  return axios.get(`${baseURL2}/users/pwd/forget/vcode`,{params:ticket});
};
const resetPassword = data =>{
  return axios.put(`${baseURL2}/users/pwd/forget/reset`,data);
};

const postReport = data => {
  return axios.post(`${baseURL2}/reports`,data)
};

export default {
  baseURL,
  baseURL2,
  getIndex,
  getOnlineList,
  getWelcome,
  login,
  logout,
  checkToken,
  getVideosInfo,
  getDanmakujiIdByBangumisIdAndepIndex,
  getsearchBangumisIdResult,
  getRepliesByEpId,
  getRepliesByEpIdAndPageNum,
  addReply,
  deleteReply,
  postActiontoReply,
  getSubReplies,
  register,
  updateUserInfo,
  getEpisodeInfoByEpId,
  getNotices,
  getNoticesBypn,
  countUnreadMsg,
  getSpecificReply,
  verifyEmail,
  getEmailResetCode,
  modifyEmail,
  getUserInfoByUid,
  sendVideoMatchInfo,
  sendPostBangumi,
  getUserPostBangumi,
  updatePostBangumi,
  updatePostBangumiThumb,
  deletePostBangumi,
  matchVideoSuccess,
  reVerifyEmail,
  updateUserPwd,
  getEpisodesByBid,
  getMostViewBangumis,
  getBangumiById,
  searchBangumisByName,
  getNotice,
  getNoticeById,
  getRepliesOfAnyClassPage,
  postVideoReply,
  upvoteReply,
  cancelUpvoteReply,
  deleteMyRpely,
  getUnreadMessage,
  getMessageList,
  deleteMessage,
  checkEmail,
  getMailCode,
  resetPassword,
  stickReply,
  unstickReply,
  postReport
};
