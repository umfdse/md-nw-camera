<template>
    <div class="CoverView">
      <div class="btn-cont">
        <button @click="CVideoToImage">拍照</button>
      </div>
      <div class="videoContainer">
          <video ref="videoElement"  class="video" controls="controls"></video>
      </div>
      <div class="hide_Box">
          <canvas ref="canvasElement" class="canvas"></canvas>
          <img src="" ref="imageElement"  class="img"  alt="">
      </div>
    </div>
</template>

<script>
  export default {
    name: 'App',
    data(){
        return{}
    },
    methods:{
      getUserMediaFn(constraints, success, error) {
        if (navigator.mediaDevices.getUserMedia) {
          //最新的标准API
          navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
        } else if (navigator.webkitGetUserMedia) {
          //webkit核心浏览器
          navigator.webkitGetUserMedia(constraints, success, error)
        } else if (navigator.mozGetUserMedia) {
          //firfox浏览器
          navigator.mozGetUserMedia(constraints, success, error);
        } else if (navigator.getUserMedia) {
          //旧版API
          navigator.getUserMedia(constraints, success, error);
        }
      },
      submitFile(File){
          var that=this;
          var subData=new FormData();
          subData.append('file',File);
          that.$axios.post('http://172.16.15.116:10180/api/base/up/upFile',subData).then((response) => {
            let data = response.data;
            if (data && data.msg && data.msg == 201) {
                console.log(data);
            } else {
              that.$message.error(data.content || '服务器异常');
            }
          });
      },
      dataURItoBlob(base64Data){
          var byteString;
          if (base64Data.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(base64Data.split(',')[1]);
          else
            byteString = unescape(base64Data.split(',')[1]);
          var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
          var ia = new Uint8Array(byteString.length);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          return new File([new Blob([ia], {type: mimeString})],"md-1235.png", {type:"image/*"})
      },
      CVideoToImage(){
          var that=this;
          var scale=1;
          var video=that.$refs.videoElement;
          // var w1_h1=video.videoWidth/video.videoHeight;
          // var w2_h2=video.videoWidth/video.videoHeight;

          console.log(video.videoWidth); //获取视频流对象的宽度 （只读属性）
          console.log(video.videoHeight);//获取视频流对象的高度 （只读属性）
          if(video.videoWidth!=video.offsetWidth*10){
              console.log("视频流尺寸宽度与视频设置尺寸宽度不相等---videoWidth:"+video.videoWidth+"  offsetWidth:"+video.offsetWidth*10);
          }
          if(video.videoHeight!=video.offsetHeight*10){
              console.log("视频流尺寸高度与视频设置尺寸高度不相等---videoHeight:"+video.videoHeight+"  offsetHeight:"+video.offsetHeight*10);
          }
          // window.cameraElement.drawCanvasObj.drawCanvasFn(canvas.width,canvas.height,canvas.width*100,canvas.height*100)
          var canvas=that.$refs.canvasElement;
          var image =that.$refs.imageElement;
          var context=canvas.getContext('2d');
          canvas.width=video.offsetWidth*scale;
          canvas.height=video.offsetHeight*scale;
          image.setAttribute('width',video.offsetWidth*scale);
          image.setAttribute('height',video.offsetHeight*scale);
          context.drawImage(video, 0, 0,video.videoWidth,video.videoHeight,0,0,video.offsetWidth,video.offsetHeight);
          debugger;
          console.log(context.getImageData(0,0,video.videoWidth,video.videoHeight))
          // context.drawImage(video, 0, 0,video.offsetWidth*10,video.offsetHeight*10,0,0,video.offsetWidth,video.offsetHeight);
          image.src = canvas.toDataURL("image/png");
          image.onload=function(){
              // that.saveImgFile(this.src);
              that.submitFile(that.dataURItoBlob(this.src))
          }
      },
      saveImgFile(data) {
          var save_link=document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
          save_link.href=data;
          save_link.download='md-'+Date.now()+'.png';
          var event=document.createEvent('MouseEvents');
          event.initMouseEvent('click',true,false,window,0,0,0,0,0,false,false,false,false,0,null);
          save_link.dispatchEvent(event);
      },
      setDomSize(dom){
          dom.setAttribute('width',dom.offsetWidth);
          dom.setAttribute('height',dom.offsetHeight);
      },
      openCameraFn(){
        var that=this;
        var video=that.$refs.videoElement;
        if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
          //调用用户媒体设备, 访问摄像头
          that.getUserMediaFn({ video: { width:video.offsetWidth*10, height:video.offsetHeight*10}},function(stream){
            if (navigator.mozGetUserMedia) {
               video.mozSrcObject = stream;
            } else {
                try{
                    video.srcObject=stream;
                }catch (e) {
                    let CompatibleURL = window.URL || window.webkitURL;
                    video.src = CompatibleURL.createObjectURL(stream);
                }
            }
            video.play();
          },function(error){

              console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
          });
        } else { alert('不支持访问用户媒体');}
      }
    },
    mounted(){
      this.$nextTick(()=>{
          this.setDomSize(this.$refs.videoElement);
          this.openCameraFn();
      });
    }
  };
</script>

<style lang="scss">
  .CoverView{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    .btn-cont{
      display:block;
      position:absolute;
      top:0;
      left:0;
      right:0;
      text-align:center;
      z-index: 2;
      button{
        padding:4px 5px;
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }
    .videoContainer{
      display:block;
      position:relative;
      width:100%;
      margin:0 auto;
      height:100%;
      .video{
        position:relative;
        display:block;
        width:100%;
        height:100%;
      }
      .img,
      .canvas{
        position:absolute;
        top:0;
        left:0;
        display:block;
        width:100%;
        height:100%;
        z-index:-1;
      }
    }
    .hide_Box{
        display:none;
        position:fixed;
        top:50px;
        z-index:5;

    }
  }
</style>
