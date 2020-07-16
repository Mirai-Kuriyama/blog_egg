const crypto = require('crypto');
module.exports = {
    async getOpenId(code) {
        let config = this.app.config.wx_mini
        let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.AppID}&secret=${config.AppSecret}&js_code=${code}&grant_type=authorization_code`
        let result = await this.curl(url)
        let data = JSON.parse(result.data)
        if (data.openid) {
            return data
        } else {
            this.apiFail("登陆失败")
        }
    },
    // api返回成功
    apiSuccess(data = '', msg = 'ok', code = 200) {
        this.status = code;
        this.body = { msg, data };
    },
    // api返回
    apiFail(data = '', msg = 'fail', code = 200) {
        this.status = code;
        this.body = { msg, data };
    },
    // 生成token
    getToken(value) {
        return this.app.jwt.sign(value, this.app.config.jwt.secret);
    },
    // 验证token
    checkToken(token) {
        return this.app.jwt.verify(token, this.app.config.jwt.secret);
    },
    // 生成唯一id
    genID(length = 10) {
        return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
    },
    // 验证密码
    async checkPassword(password, hash_password) {
        // 先对需要验证的密码进行加密
        const hmac = crypto.createHash("sha256", this.app.config.crypto.secret);
        hmac.update(password);
        password = hmac.digest("hex");
        // let res = password === hash_password;
        // if (!res) {
        //     this.throw(200, '密码错误');
        // }
        return password;
    }
}