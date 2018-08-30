const { mysql } = require('../qcloud') 
var zm = require('../tools/zm_tools')
var rq = {};
module.exports = async (ctx, next) => {
  Object.assign(rq, ctx.query, ctx.request.body, ctx.params);
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
  if (rq.uuid) {
        // loginState 为 1，登录态校验成功
      //查询用户是否已经注册存在
      let userinfo = await mysql("yonghu").where({ openId: rq.uuid});
      if(userinfo&&userinfo.length>0){
        let dt=zm.getDate(new Date().toString(),"yyyy-MM-dd hh:mm:ss");
        let jg=await mysql("yonghu").update({updated_at:dt}).where({ openId: rq.uuid})
        ctx.state.data = userinfo[0];
      }else{
        //插入用户
        let newuser={
          openId: rq.uuid,
          avatarUrl: ctx.state.$wxInfo.userinfo.avatarUrl,
          chengwei: "赏金小菜",
          city: ctx.state.$wxInfo.userinfo.city,
          country: ctx.state.$wxInfo.userinfo.country,
          gender: ctx.state.$wxInfo.userinfo.gender,
          language: ctx.state.$wxInfo.userinfo.language,
          nickName: ctx.state.$wxInfo.userinfo.nickName,
          province: ctx.state.$wxInfo.userinfo.province
        }
        let jg = await mysql("yonghu").insert(newuser);
      
        ctx.state.data = newuser;
      }
    } else {
        ctx.state.code = -1
    }
}
