//=======author:"fsh" qq:"741691336" weixin:"忘我之鱼"=======//
//=======看见好多网站的按钮都有这种puff的特效================//
//=======发现人家引了jq-UI，咱不爱用，好大的说===============//
//=======也懒得看它的源码，自己看着效果仿一个================//
//=======依旧是原生js封装，欢迎大家试用找bug^_^==============//
(function() {
    window.onload = function() {
        var ePuffs = document.querySelectorAll(".Puff");
        for (var i = ePuffs.length; i--;) {
            var classes = ePuffs[i].className;
            var params = classes.match(/\bPuff_(\d{1,3})_(\d{1,3})_(\d{1,3})_(\d{1,3})\b/);
            if (params) {
                ePuffs[i].percent = parseFloat(params[1] / 4); //膨胀百分比转换
                ePuffs[i].cr = params[2];
                ePuffs[i].cg = params[3];
                ePuffs[i].cb = params[4];
            } else { //默认参数
                ePuffs[i].percent = 0;
                ePuffs[i].cr = 200;
                ePuffs[i].cg = 200;
                ePuffs[i].cb = 200;
            }
            var thisStyle = getComputedStyle(ePuffs[i], null);
            ePuffs[i].bg = thisStyle.backgroundImage;
            ePuffs[i].bs = thisStyle.backgroundSize;
            ePuffs[i].bp = thisStyle.backgroundPosition;
            ePuffs[i].br = thisStyle.backgroundRepeat;
            ePuffs[i].addEventListener("touchstart", function(event) {
                event.preventDefault();
                fnClick.call(this, event);
            });
            ePuffs[i].addEventListener("click", fnClick);
        }

        function fnClick(event) {
            var self = event.target;
            if (event.touches) {
                event = event.touches[event.touches.length - 1]; //如果变成event=event.touches[0]；则多指同时触控会发生圆的扩散传递，若元素相邻，有惊喜，效果很神奇
            }
            var x, y, width = this.clientWidth,
                height = this.clientHeight;
            if (typeof event.pageX == undefined && typeof event.pageY == undefined) {
                x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            } else {
                x = event.pageX;
                y = event.pageY;
            }
            x -= this.offsetLeft;
            y -= this.offsetTop;
            //圓的大小，放大原图大小的4倍
            var size = width > height ? width * 4 : height * 4;
            //把背景圖的中心點移到觸點
            x -= size / 2;
            y -= size / 2;
            // console.log(this.percent, this.cr, this.cg, this.cb)
            fnPuff(self, self.percent, x, y, size, this.bg, this.bs, this.bp, this.br);
        }

        function fnPuff(ele, i, x, y, size, bg, bs, bp, br) { //参数：1、填加膨胀特效的元素 2、从哪开始膨胀（百分比）3、相對于元素中心點的偏移量x分量 4、相對于元素中心點的偏移量y分量 5、圓的大小 6、元素原来的背景图 7、元素原来的背景图大小 8、元素原来的背景图位置 9、元素原来的背景图重复属性
            var opacity = 1 - i / 100;
            ele.style.backgroundImage = "radial-gradient(at " + size / 2 + "px " + size / 2 + "px,rgba(" + ele.cr + "," + ele.cg + "," + ele.cb + "," + opacity + ") 0%,rgba(" + ele.cr + "," + ele.cg + "," + ele.cb + "," + opacity + ") " + i + "%,transparent " + i + "%)," + bg;
            ele.style.backgroundSize = size + "px " + size + "px," + bs;
            ele.style.backgroundPosition = x + "px " + y + "px," + bp;
            ele.style.backgroundRepeat = "no-repeat," + br;
            if (i >= 100) {
                cancelAnimationFrame(ele.raf);
            } else {
                i += 2;
                cancelAnimationFrame(ele.raf);
                ele.raf = requestAnimationFrame(function() {
                    fnPuff(ele, i, x, y, size, bg, bs, bp, br);
                });
            }
        }
    }
})();
