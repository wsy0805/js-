// 图片上传的方法
'use strict'
import axios from 'axios'
import commonMethod from './common'

const aliOss = {


    // 放入common.js中的方法配合图片上传
    // 为了防止原图过大，使用阿里云后缀对图片进行压缩
    aliSuffix: function (width, height) {
        // 宽高固定，宽度固定高度自适应，两种情况
        var suffix = "";
        if (height == null) {
            suffix = "?x-oss-process=image/resize,m_lfit,w_" + width + ",limit_0/auto-orient,1/quality,q_100/format,jpg";
        } else {
            suffix = "?x-oss-process=image/resize,m_fill,w_" + width + ",h_" + height + ",limit_0/auto-orient,1/quality,q_100/format,jpg";
        }
        return suffix;
    },
    // 生成随机数，适用于各种创建接口传的唯一ID和阿里云上传生成随机文件名
    buildUUID: function () {
        var s = [];
        var hexDigits = "0123456789ABCDEF";
        for (var i = 0; i < 30; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[12] = "4";
        s[17] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        var uuid = s.join("");
        return uuid;
    },
    // 放入common.js中的方法配合图片上传




    aliSet: {},
    client: {},
    getKey() {
        axios
            .post("/json/user/getKey.json", {})
            .then(res => {
                this.aliSet = res.data;
                this.client = new OSS.Wrapper({
                    endpoint: "https://" + this.aliSet.endPoint,
                    accessKeyId: this.aliSet.key,
                    accessKeySecret: this.aliSet.secret,
                    stsToken: this.aliSet.sercurityToken,
                    bucket: this.aliSet.bucket
                });
                resolve(this.client);
            })
            .catch(err => { });

    },
    upload(file, that, loading) {
        let this_ = this;
        return new Promise((resolve, reject) => {
            let key =
                this_.aliSet.folder +
                "/" +
                commonMethod.buildUUID() +
                this_.getExtend(file.name);
            this_.client
                .multipartUpload(key, file, {
                    progress: async function (p, checkpoint) {
                    }
                })
                .then(function (res) {
                    // console.log(res.name);
                    loading.close();
                    resolve(res.name);
                })
                .catch(function (err) {
                    console.log(err);
                    loading.close();
                    if (err.code == "InvalidAccessKeyId") {
                        this_.getKey();
                        setTimeout(function () {
                            this_.upload(file, that);
                        }, 2000);
                    } else {
                        that.$message.error("网络错误，请重新上传");
                        this_.getKey();
                    }
                });
        });
    },
    getExtend(fileName) {
        return /\.[^\.]+$/.exec(fileName);
    }
}

export default aliOss;