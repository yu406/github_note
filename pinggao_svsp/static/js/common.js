var common = new Vue({
  data: {
    url: '',
    url_jiazhen: 'http://192.168.2.88:8081/check-service',
    url_shuaipeng: 'http://192.168.2.50:8081/clarification-service',
    url_fanjx: "http://192.168.2.23:8081/clarification-service",
    url_upload: "http://192.168.2.50:8081/upload-service",
  },
  methods: {
    //正则表达式获取url指定参数
    getUrlParam: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return decodeURI(r[2]);
      return null; //返回参数值
    },
    //JS-使用history的replaceState方法向当前url追加参数
    updateQueryStringParameter: function (uri, key, value) {
      if (!value) {
        return uri;
      }
      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = uri.indexOf('?') !== -1 ? "&" : "?";
      if (uri.match(re)) {
        this.replaceStatefunction(uri.replace(re, '$1' + key + "=" + value + '$2'))
        // return uri.replace(re, '$1' + key + "=" + value + '$2');
      } else {
        this.replaceStatefunction(uri + separator + key + "=" + value)
        // return uri + separator + key + "=" + value;
      }
    },
    //向当前url添加参数，没有历史记录
    replaceStatefunction: function (newurl) {
      window.history.pushState({
        path: newurl
      }, '', newurl);
    },
    purchaseStatus: function (params) {
      return params * 2
    }
  }
});