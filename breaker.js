window.onload = init;
// window.onmousemove = mouseMoveHandler;

var context;
var bg2, ball, board;

var lv = 1;
var t;
var gameover=0;
var suspend
var score=0;
var allbricks=0;

// canvas的宽高
var cW = 1000, cH = 625;
// 挡板坐标
var boardX = 0, boardY = 630;
// 小球坐标
var ballX = 400, ballY = 350;
// 小球速度
var vx = 4, vy = -8;

// 声明并初始化一个空的数组
var bricks = [];

//初始化
function init(){
    log("init");

    var canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");

    context.font = '48px Microsoft YaHei';
    context.fillText('打砖块', 404, 226);

    var rect = canvas.getBoundingClientRect();
    //绑定鼠标跟挡板x坐标
    canvas.onmousemove = function(e){
        var x = e.clientX - rect.left * (canvas.width / rect.width);
        boardX = x - board.width / 2;
    }

    bg2 = addImage("assets/bg.jpg");
    board = addImage("assets/board.png");
    ball = addImage("assets/ball.png");

    // 添加循环机制
    // setInterval(gameTick, 1000/60);

}

function gameStart(){
    log("gameStart");
    clearInterval(t);

    score =0;
    bricks = [];
    createBrick();

    gameover = 0;
    boardX = 0; boardY = 600;
    ballX = 400; ballY = 350;
    vx = 4; vy = -8;

    context.drawImage(bg2,0,0);
    context.drawImage(board,boardX,boardY);

    t = setInterval(gameTick, 1000/60);
}

// 游戏循环逻辑
function gameTick(){
    clearScreen();

    
    context.drawImage(bg2,0,0);
    context.drawImage(board,boardX,boardY);

    updateBricks();
    updateBall();

    testBallAndBoard();

    testBallAndBricks();
    calculateScore();
    updateScore();

    if(gameover==1){
        gameOver();
    }
    if(bricks.length == 0){
        gameEnd();
    }
}

function gameEnd(){
    clearInterval(t);
    context.clearRect(0, 0, 1000, 625);
    context.font = '48px Microsoft YaHei';
    context.fillText('成功通关 \n 分数:', 404, 226);
}

function gameOver(){
    clearInterval(t);
    context.clearRect(0, 0, 1000, 625);
    context.font = '48px Microsoft YaHei';
    context.fillText('游戏结束', 404, 226);
}

// 小球和砖块的碰撞检测
function testBallAndBricks(){
    for(var i = bricks.length - 1; i >= 0; i--){
        var item = bricks[i];
        var hit = hitTestPoint(item.x - 32, item.y - 32, 70, 30 + 32, ballX, ballY)
        if(hit){
            bricks.splice(i,1);
            vy *= -1;
        }
    }
}

// 小球与挡板的碰撞检测
function testBallAndBoard(){
    var hit = hitTestPoint(boardX - 32, boardY - 32, board.width, board.height + 32, ballX, ballY)
    if(hit){
        ballY = boardY - 32;
        vy *= -1;
    }
}

// 简单检测碰撞方法
function hitTestPoint(x1, y1, w1, h1, x2,y2){
    if(x2 >= x1 && x2<=x1 + w1 &&
       y2 >= y1 && y2 <=  y1 + h1)      // 判断(x2,y2)是否撞上砖块
       return true;
    else return false;
}

// 显示砖块
function updateBricks(){
    for(var i =0; i<bricks.length; i++){
        var item = bricks[i];
        context.drawImage(item.item,item.x,item.y);
    }
}

// 创建砖块
function createBrick(){
    var x_start;
    var xNum =12;
    var yNum = 7;
    switch(lv){
        case 1:
            for (let i = 0; i < yNum; i++) {
                if(i === 0){
                    xNum = 1;
                }
                else if(i === 1){
                    xNum = 2;
                }
                else{
                    xNum += 2;
                }
                x_start = cW/2 - (xNum/2)*70

                for(var j = 0; j < xNum; j++){
                    var item = addImage("assets/brick.png");
                    bricks.push({
                        item : item,
                        x : x_start + 70 * j,
                        y : 80 + 30 * i
                    })
                }
            }
            break;
        case 2:
            for (let i = yNum-1; i >= 0; i--) {
                if(i === 6){
                    xNum = 1;
                }
                else if(i === 5){
                    xNum = 2;
                }
                 else{
                    xNum += 2;
                }
                x_start = cW/2 - (xNum/2)*70

                for(var j = 0; j < xNum; j++){
                     var item = addImage("assets/brick.png");
                     bricks.push({
                        item : item,
                        x : x_start + 70 * j,
                        y : 80 + 30 * i
                    })
                }
            }
            break;
        case 3:
            for(let i = 0; i < yNum; i++){
                if(i === 0){
                    xNum = xNum
                }else if(i > 3){
                    xNum += 2
                }else{
                    xNum -= 2
                }
                x_start = cW/2 - (xNum/2)*70

                for(var j = 0; j < xNum; j++){
                    var item = addImage("assets/brick.png");
                    bricks.push({
                       item : item,
                       x : x_start + 70 * j,
                       y : 80 + 30 * i
                   })
               }
            }
            break;
    }
    allbricks = bricks.length;
    // for(var i =0; i<12; i++){
    //     for(var j =0; j<7; j++){
    //         var item = addImage("assets/brick.png");
    //         bricks.push({item : item, x:80 + 70 * i, y:item.y = 80 + 30 * j });
    //     }
    // }
    // allbricks = bricks.length;
}

function updateScore(){
    context.font = '24px Microsoft YaHei'
    // 绘制分数
    context.fillText("分数:" + score, 50, 50)
    // 绘制关卡
    context.fillText("关卡:" + lv, 1000 - 100, 50)
}

function calculateScore(){
    num = allbricks - bricks.length;
    score = 50*num;
}

// 更新小球坐标
function updateBall(){

    ballX += vx;
    ballY += vy;

    if(ballX < 0){
        ballX = 0;
        vx *= -1;
    }else if(ballX > cW - ball.width){
        ballX = cW - ball.width;
        vx *= -1;
    }

    if(ballY < 0){
        ballY = 0;
        vy *= -1;
    }else if(ballY > 700){
        gameover = 1;
        log("gameOver");
    }

    context.drawImage(ball,ballX,ballY);
}

function mouseMoveHandler(e){
    boardX = e.x - board.width / 2;
}

// 清屏
function clearScreen(){
    context.clearRect(0,0,cW,cH);
}

//添加图片
function addImage(url){
    var img = new Image();
    img.src = url;
    return img;
}

//输出log到chrome控制台
function log(msg){
    console.log(msg);
}

//下一关
function next(){
    clearInterval(t);
    if(lv<3){
        lv++;
    }
    gameStart();
}

//上一关
function last(){
    clearInterval(t);
    if(lv>1){
        lv--;
    }
    gameStart();
}