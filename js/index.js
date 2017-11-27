//纵有千言万语。。

var loadingRender = (function () {
    var $loading = $('.loading'),
        $loadingSpan = $loading.find('.progress').find('span');

    var ary = ["zf_emploment.png", "zf_messageArrow1.png", "zf_messageArrow2.png", "zf_messageChat.png", "zf_messageKeyboard.png", "zf_messageLogo.png", "zf_messageStudent.png", "zf_phoneBg.jpg", "zf_phoneDetail.png", "zf_phoneListen.png", "zf_phoneLogo.png", "zf_return.png"];

    var curNum = 0,
        total = ary.length;


    return {

        init:function () {
            $(ary).each(function (index,item) {
                var tempImg = new Image;
                tempImg.src = 'img/'+item;
                tempImg.onload = function () {
                    tempImg = null;
                    curNum++;
                    var n = curNum/total*100;
                    $loadingSpan.css('width',n+'%');

                    if(curNum==total){

                        window.setTimeout(function () {
                            //phone出现
                            phoneRender.init();

                            $loading.css('opacity',0).on('webkitTransitionEnd',function () {
                                $loading.remove();

                            });
                        },1500);
                    }
                }
            });
        }
    }

})();



var phoneRender = (function () {
    var $phone = $('.phone'),
        $time = $phone.find('.time'),
        $listen = $phone.find('.listen'),
        $listenTouch = $listen.find('.touch'),
        $detail = $phone.find('.detail'),
        $detailTouch = $detail.find('span');
    var phoneBell = $('#phoneBell')[0],
        phoneSay = $('#phoneSay')[0];


    function listenTouch() {
        phoneBell.pause();
        $(phoneBell).remove();
        $listen.remove();
        $detail.css('transform','translateY(0)');
        phoneSay.play();
        phoneSay.oncanplay = bindTime;
    }
    function bindTime() {
        $time.css('display','block');
        var duration = phoneSay.duration;

        var timer = window.setInterval(function () {
            var curTime = phoneSay.currentTime;
            var minute = Math.floor(curTime/60);
            var second = Math.floor(curTime-minute*60);
            minute = minute<10?'0'+minute:minute;
            second = second<10?'0'+second:second;
            $time.html(minute+':'+second);
            if(curTime>=duration){
                window.clearInterval(timer);
                closePhone();

            }
        },1000);
    }

    function closePhone() {
        phoneSay.pause();
        $(phoneSay).remove();
        $phone.css('transform','translateY('+document.documentElement.clientHeight+'px)').on('webkitTransitionEnd',function () {
            $phone.remove();

            //message出现
            messageRender.init();

        });

    }


    return {
        init:function () {
            // phoneBell.play();
            $phone.css('display','block');

            $listenTouch.tap(listenTouch);

            $detailTouch.tap(closePhone)
        }
    }

})();


var messageRender = (function () {
    var $message = $('.message'),
        $list = $message.find('.list'),
        $lis = $list.find('li');
    var $keyBoard = $message.find('.keyBoard');
    var $text = $keyBoard.find('.text');
    var $submit = $keyBoard.find('.submit');
    var messageMusic = $('#messageMusic')[0];
    
    var step = -1;
    var autoTimer = null;
    var isTrigger = false;
    var historyH = 0;
    
    function autoMessages() {
        tempFn();
        autoTimer = setInterval(tempFn,1000);
    }
    function tempFn() {
        var $cur = $lis.eq(++step);
        $cur.css({
            opacity:1,
            transform:'translateY(0)'
        });
        
        if(step==2){
            $cur.on('webkitTransitionEnd',function () {
                if(isTrigger) return;//
                isTrigger = true;
                //显示键盘
                $keyBoard.css("transform",'translateY(0')
                    .on('webkitTransitionEnd',textPrint)
            });
            window.clearInterval(autoTimer);
            return;
        }
        if(step>=3){
            historyH += -$cur.height();
            $list.css('transform','translateY('+historyH+'px)')
        }
        if(step==$lis.length-1){
            messageMusic.pause();
            $(messageMusic).remove();
            window.clearInterval(autoTimer);

            //魔方区域出现（延迟）
            window.setTimeout(function () {
                $message.remove();
                cube.init();

            },1500)

        }
        
    }
    function textPrint() {
        var text = '尖叫声在哪里？！';
        var n = -1;
        var textTimer = null;
        textTimer = window.setInterval(function () {
            $text.html($text.html()+text[++n]);
            if(n>=text.length-1){
                window.clearInterval(textTimer);
                // $text.html(text);
                $submit.css('display','block')
                    .tap(bindSubmit)
            }
        },100)
    }
    function bindSubmit() {
        $text.html('');
        $keyBoard.off('webkitTransitionEnd',textPrint)
            .css('transform','translateY(3.7rem)');
        autoMessages();
    }


    return {
        init:function () {
            $message.css('display','block');
            messageMusic.play();

            autoMessages();


        }
    }

})();


$(document).add($('img')).on('touchmove',function (e) {
    e.preventDefault();
});
var cube = (function () {
    var $cube = $('.cube');
    var $cubeBox = $cube.find('.cubeBox');
    var $cubeLis = $cubeBox.find('li');
    function startFn(e) {
        var point = e.changedTouches[0];

        $(this).attr({
            strX:point.pageX,
            strY:point.pageY,
            changeX:0,
            changeY:0,
            isMove:false
        })
    }
    function moveFn(e) {
        var point = e.changedTouches[0];
        var changeX = point.pageX - parseFloat($(this).attr('strX'));
        var changeY = point.pageY - parseFloat($(this).attr('strY'));
        $(this).attr({
            changeX:changeX,
            changeY:changeY,
            isMove:(Math.abs(changeX)>10||Math.abs(changeY)>10)
        })
    }
    function endMove(e) {
        var isMove = $(this).attr('isMove');
        if(isMove===false) return;
        var changeX = parseFloat($(this).attr('changeX')),
            changeY = parseFloat($(this).attr('changeY'));
        var rotateX = parseFloat($(this).attr('rotateX')),
            rotateY = parseFloat($(this).attr('rotateY'));
        rotateX = rotateX - changeY/2;
        rotateY = rotateY + changeX/2;
        console.log(changeX,changeY);
        $(this).css('transform','scale(0.6) rotateX('+rotateX+'deg) rotateY('+rotateY+'deg)').attr({
            rotateX:rotateX,
            rotateY:rotateY,
            strX:null,
            strY:null,
            changeX:null,
            changeY:null,
            isMove:null
        });

    }


    return {
        init:function () {
            $cube.css('display','block');
            $cubeBox.attr({
                rotateX:35,
                rotateY:45
            }).on('touchstart',startFn)
                .on('touchmove',moveFn)
                .on('touchend',endMove);

            //页面点击事件
            $cubeLis.tap(function () {
                $cube.css('display','none');
                console.log($(this).index());
                swiper.init($(this).index());
            })

        }
    }
})();


var swiper = (function () {
    var $swiperContainer = $('.swiper-container');
    var $return = $swiperContainer.find('.return');

    function moveFn(example) {
        var slideArr = example.slides,
            index = example.activeIndex;

        //makisu展示区


        $.each(slideArr,function (n,item) {
            item.id = index===n?"page"+(index+1):null;
        });
    }

    return {
        init:function (index) {
            index = index||0;
            $swiperContainer.css('display','block');
        var mySwiper = new Swiper('.swiper-container',{
            effect:'coverflow',
            loop:true,
            // initialSlide:3,
            onInit:moveFn,
            onSlideChangeEnd:moveFn
        });
        mySwiper.slideTo(index+1,0);

        $return.tap(function () {
            $swiperContainer.css('display','none');
            $('.cube').css('display','block');
        });
    }
    }
})();



loadingRender.init();


