function ajax(options) {
  var xhr = null;
  // var params = formsParams(options.data);
  var params = options.data

  //创建对象
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  //打开链接
  if (!options.type) //默认get
  {
    options.type = "GET";
  }
  if (options.async == null) //默认为异步处理
  {
    options.async = true;
  }
  // 连接
  if (options.type == "GET") {
    // xhr.open(options.type, options.url + "?" + params, options.async);
    xhr.open(options.type, options.url, options.async);
    xhr.send(null)
  } else if (options.type == "POST") {
    xhr.open(options.type, options.url, options.async);

    if (options.contentType == "application/json;charset=utf-8") {
      xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    }
    xhr.send(params);
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // options.success(xhr.responseText);
      var data;
      var text = xhr.responseText;
      data = eval("(" + text + ")");
      //调用回调函数
      options.success(data);
      // var data;
      // if (!options.type) {
      //   data = xhr.responseText;
      // } else if (options.type == "xml") {
      //   data = xhr.responseXML;
      // } else if (options.type == "text") {
      //   data = xhr.responseText;
      // } else if (options.type == "json") {
      //   var text = xhr.responseText;
      //   data = eval("(" + text + ")");
      // }
      // //调用回调函数
      // options.success(data);
    }
  }

  function formsParams(data) {
    var arr = [];
    for (var prop in data) {
      arr.push(prop + "=" + data[prop]);
    }
    return arr.join("&");
  }
}