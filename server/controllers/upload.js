const { uploader } = require('../qcloud')
const { mysql } = require('../qcloud')
const zm = require('../tools/zm_tools') 
var fs = require('fs');
const multiparty = require('multiparty')
const path = require('path')

var getFileUp=function (req,uuid){
const maxSize = 10;
    const fieldName = 'file'; 

    // 初始化 multiparty
    const form = new multiparty.Form({
      encoding: 'utf8',
      maxFilesSize: maxSize * 1024 * 1024,
      autoFiles: true,
      uploadDir: '/Web/daniuren/upload/'
    })
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields = {}, files = {}) => {
            if (err) {
                console.log("上传失败:" + err.message);
                console.log(err);
            }
        err ? reject(err) : resolve({ fields, files })
      })
    });
}

var ctr = {
    save: async (ctx, next) => {
        
        var fpid = zm.uuid(); 
        //console.log("上传开始:" + fpid);
      let fil = await getFileUp(ctx.req);
      if (fil && fil.files.file.length > 0) {
          let fl = fil.files.file[0];
          let rejg = "";
          // try{
          //   let newfilesrc = '../upload/' + fpid + '.zm';
          //   fs.renameSync(fl.path, newfilesrc);
          // }catch(e){
          //   rejg = e && e.message ? e.message : e.toString()
          // }

          let fileinfo = {
              pid: fpid,
              fileKey: fpid,
              mimeType: fl.headers["content-type"],
              xianshi: fl.path.replace("C:\\Web\\daniuren\\upload\\", ""),
              daxiao: fl.size,
              fileurl: "https://xiaochengxu.yunkucun.top/weapp/upload/getfile?pid=" + fpid
          }
          let newfilesrc = '/Web/daniuren/upload/' + fpid + '.zm';
          fs.rename(fl.path, newfilesrc)
          let jg = await mysql("Files").insert(fileinfo);
          ctx.state.data = {
              msg: 'uploader jg2s2:',
              rejg: fl.path,
              pid: fpid
          }
      } else {
          ctx.state.data = {
              msg: 'uploader jg2s2:',
              jg: "上传失败"
          }
      }
   
},
  getfile: async (ctx, next) => {
    let newfilesrc = '../upload/' + rq.pid + '.zm';
    let fullStaticPath = path.join(__dirname, newfilesrc);
    let _content = fs.readFileSync(fullStaticPath, 'binary')

    ctx.res.writeHead(200)
    ctx.res.write(_content, 'binary')
    ctx.res.end()
  },
save2: async (ctx, next) => {
  //search
  let data = await uploader(ctx.req);
  let fpid = zm.uuid();
  let fileinfo = {
    pid: fpid,
    fileKey: data.imgKey,
    mimeType: data.mimeType,
    xianshi: data.name,
    daxiao: data.size,
    fileurl: data.imgUrl
  }
  ctx.state.data = {
    msg: 'uploader jg2:',
    pid: fileinfo
  }
  let jg = await mysql("Files").insert(fileinfo);
  ctx.state.data = {
    msg: 'uploader jg22:',
    jg: jg,
    pid: fpid
  }
},
  test:async (ctx, next) => {
    ctx.state.data = {
      msg: 'uploader jg3:',
      pid: zm.uuid()
    }
  }
};
var rq = {};
module.exports = async (ctx, next) => {
  Object.assign(rq, ctx.query, ctx.request.body, ctx.params);
  var action = rq.action;
  var fun = ctr[action];
  if (typeof (fun) == "function") {
    try {
      await fun(ctx, next);
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
