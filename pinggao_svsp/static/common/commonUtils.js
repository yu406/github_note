var commonUtils = new Vue({
    data: {
        url: '',
        fileTypeList:[".doc",".docx",".xls",".xlsx",".ppt",".pptx",".pdf",".png",".jpg",".jpeg"],//文件类型后缀集合
        DOCList:[".doc"],//doc集合
    },
    methods: {
        //判断文件类型
        fileTypeUtils: function (file) {
            var str =file.name.toLowerCase();
            var index1 = str.lastIndexOf(".");
            var index2 = str.length;
            var suffix = str.substring(index1, index2);//后缀名
            for (var i = 0; i <this.fileTypeList.length; i++) {
                if (this.fileTypeList[i]==suffix){
                    return true;
                }
            }
            return false;
        },
        fileTypeDOC: function (file) {
            var str =file.name.toLowerCase();
            var index1 = str.lastIndexOf(".");
            var index2 = str.length;
            var suffix = str.substring(index1, index2);//后缀名
            for (var i = 0; i <this.DOCList.length; i++) {
                if (this.DOCList[i]==suffix){
                    return true;
                }
            }
            return false;
        }


    }
});