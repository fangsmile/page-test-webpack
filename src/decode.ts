import decode from "./birdEncode.png";
       var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("myCanvas")
        var ctx = canvas.getContext("2d")
        var img = new Image();
        img.src =decode;
        // 图片加载完成
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // 将带有盲水印的图片绘入画布，获取到像素点的RGBA数组信息
            let originalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            processData(ctx,originalData);
        }

        function processData(ctx, originalData) {
            var data = originalData.data;
            for (var i = 0; i < data.length; i++) {
                //筛选每个像素点的R值
                if (i % 4 == 0) {
                    if (data[i] % 2 == 0) {//如果R值为偶数，说明这个点是没有水印信息的，将其R值设为0
                        data[i] = 0;
                    } else {//如果R值为奇数，说明这个点是有水印信息的，将其R值设为255
                        data[i] = 255;
                    }
                } else if (i % 4 == 3) {//透明度不作处理
                    continue;
                } else {
                    // G、B值设置为0，不影响
                    data[i] = 0;
                }
            }
            // 至此，带有水印信息的点都将展示为255,0,0   而没有水印信息的点将展示为0,0,0  将结果绘制到画布
            ctx.putImageData(originalData, 0, 0);
        }