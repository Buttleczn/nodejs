//小程序控制台phpmyadmin里给数据库cAuth添加表
const { mysql } = require('../qcloud')
var test = require('../modles/test')
var zm = require('../tools/zm_tools')
const { renwuzhuangtai } = require('../modles/meiju')

async function create(ctx, next) {
  console.log('exeu sql:')
  if (ctx.query.action == "create") {
    var jg = test.create();
    ctx.state.data = {
      msg: 'create jg:' + jg
    }

  }
}
var test = function (ctx, next) {
  ctx.state.data = {
    msg: 'test jg:' + ctx.params.action
  }
}
var insert = async function (ctx, next) {
  //add

  var testrow = {
    name: "ctx.request.body.name",
    age: 88
  }
  let jg = await mysql("test").returning('id').insert(testrow);
  ctx.state.data = {
    msg: 'insert jg:',
    jgr: jg
  }
}
//查询
var select = async function (ctx, next) {
  //search
  var jg = await mysql.select().table('test');
  //var jg = test.create();
  ctx.state.data = {
    msg: 'select jg:',
    jgr:jg,
    jgx: "rex"
  }

}
var update = async function (ctx, next) {
  //update
  var jg = await mysql("test").update({ name: rq.name }).where({ id:8 });
  ctx.state.data = {
    msg: 'update jg:',
    jgr: jg,
    jgx: "rex8"
  }
}
var del = async function (ctx, next) {
  //delete
  var jg = await mysql("test").del().where({ name:rq.name })
  ctx.state.data = {
    msg: 'del jg:',
    jgr: jg,
    jgx: "rex"
  }
  
}
var left = async function (ctx, next) {
  //left 不起别名会链接表覆盖被覆盖
  var jg = await mysql.select('renwu.*', 'yonghu.avatarUrl','yonghu.nickName').from('renwu').leftJoin('yonghu', 'renwu.ouid', 'yonghu.openId').andWhere({ zhuangtai: renwuzhuangtai.zhengchang }).orderBy('renwu.created_at', 'desc');
  ctx.state.data = {
    msg: 'del jg:',
    jgr: jg,
    jgx: "rex"
  }

}
var ctr = { create, test, insert, select, update, del,left };
var rq = {};
module.exports = async (ctx, next)  => {
  Object.assign(rq, ctx.query, ctx.request.body,ctx.params);
  var action = rq.action;
  var fun = ctr[action];
  if (typeof (fun) == "function") {
    try {
       await fun(ctx, next);
      // await  mysql('test').select('id').then(res => {
      //   ctx.state.data = res;
      // })
    } catch (e) {
      ctx.state.data = {
        ac: action,
        ty: typeof (fun),
        error: e && e.message ? e.message : e.toString()
      }
    }

  } else {
    ctx.state.data = {
      ac: action,
      ty: typeof (fun)
    }
  }
}