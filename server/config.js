const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx0bdffe5149a58f3e',
    // 微信小程序 App Secret
    appSecret: '6ef293f7a62640155acc3bb1d3f92e26',
    qcloudAppId: '1251023168',
    //商户号与支付秘钥
    mch_id: '1241634902',
    mch_key:'u9qKm5g8l10iItDkBK55fNS2ZHNBOBuG',

    
    qcloudSecretId: 'AKIDVYVOIDAWzJSUM4mxU1SjpkX9sX6XOrpW',
    qcloudSecretKey:"vnZAbrwuiPrFTV2Tkx3ymldNwKZdlnfO",

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'root',//'wxa7d3fd5ac6af5a22',//
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'abcdefgh',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
