var game={
    CSIZE:26,//格子大小
    OFFSET:15,//内边距
    pg:null,//容器元素
    shape:null,//主角图形——正在下落的图形
    nextShape:null,//备胎图形
    interval:300,//下落的时间间隔——游戏速度
    timer:null,//定时器序号
    wall:null,//保存停止下落的方块的墙
    RN:20,CN:10,//保存总行数和总列数
    lines:0,//保存总行数
    score:0,//保存得分
    SCORES:[0,10,30,60,120],
          //0  1  2  3  4
    state:0,//保存游戏状态
    GAMEOVER:0,//游戏结束
    RUNNING:1,//运行
    PAUSE:2,//暂停
    start(){
        this.state=this.RUNNING;
        this.score=this.lines=0;//游戏开始将分数和行数清零
        this.wall=[];//创建空数组保存在wall中
        //创建一个CN*RN的二维数组
        for(var r=0;r<this.RN;r++){
            this.wall[r]=new Array(this.CN);
        }
        //查找class为playground的div保存在pg属性中
        //新建一个T图形,保存在shape属性中
        //绘制主角图形
        this.pg=document.querySelector(".playground");
        this.shape=this.randomShape();
        this.nextShape=this.randomShape();
        this.paint();
        this.timer=setInterval(this.moveDown.bind(this),this.interval);
        //为document绑定键盘按下事件onkeydown
        document.onkeydown=function (e) {
            switch (e.keyCode){
                case 37:
                    this.state===this.RUNNING&&this.moveLeft();
                    break;
                case 38:
                    this.state===this.RUNNING&&this.rotateR();
                    break;
                case 39:
                    this.state===this.RUNNING&&this.moveRight();
                    break;
                case 40:
                    this.state===this.RUNNING&&this.moveDown();
                    break;
                case 32://空格
                    this.state===this.RUNNING&&this.hardDrop();
                    break;
                case 90://z键
                    this.state===this.RUNNING&&this.rotateL();
                    break;
                case 80://p键暂停
                    this.state===this.RUNNING&&this.pause();
                    break;
                case 67://c键恢复暂停
                    this.state===this.PAUSE&&this.myContinue();
                    break;
                case 83://s键重新启动游戏
                    this.start();
                    break;
                case 81://q键退出游戏
                    this.state!==this.GAMEOVER&&this.quit();
                    break;
            }
        }.bind(this);
    },
    paintShape(){//绘制主角图形
        //创建文档片段frag
        //遍历shape中cells数组中每个cell
        //将当前cell保存在变量cell中
        //新建一个img
        var frag=document.createDocumentFragment();
        for(var i=0;i<this.shape.cells.length;i++){
            var cell=this.shape.cells[i];
            var img=new Image();
            img.style.left=this.OFFSET+this.CSIZE*cell.c+"px";
            img.style.top=this.OFFSET+this.CSIZE*cell.r+"px";
            img.src=cell.src;
            frag.appendChild(img);
        }
        this.pg.appendChild(frag);
    },
    paint(){//重绘一切
        //先清除所有img
        var reg=/<img [^>]+>/g;
        this.pg.innerHTML=this.pg.innerHTML.replace(reg,"");
        this.paintShape();//再重绘
        this.paintWall();
        this.paintNext();
        this.paintScore();
        this.paintState();
    },
    paintState(){//根据游戏状态绘制图片
        if(this.state===this.GAMEOVER){
            var img=new Image();
            img.src="img/game-over.png";
            img.style.width="100%";
            this.pg.appendChild(img);
        }
    },
    paintNext(){//重绘备胎图形
        var frag=document.createDocumentFragment();
        for(var i=0;i<this.nextShape.cells.length;i++){
            var cell=this.nextShape.cells[i];
            var img=new Image();
            img.style.left=this.OFFSET+this.CSIZE*cell.c+10*this.CSIZE+"px";
            img.style.top=this.OFFSET+this.CSIZE*cell.r+this.CSIZE+"px";
            img.src=cell.src;
            frag.appendChild(img);
        }
        this.pg.appendChild(frag);
    },
    paintScore(){
      //找到id为score的span,设置其内容为score属性
        document.getElementById("score").innerHTML=this.score;
        document.getElementById("lines").innerHTML=this.lines;
    },
    paintWall(){//绘制墙
        //创建frag
        //自底向上遍历wall中行
        //如果当前行是空行就退出循环
        //否则
        //遍历当前行中每一行
        //如果wall中当前格不是undefined
        //新建img
        //将frag追加到pg中
        var frag=document.createDocumentFragment();
        for(var r=this.RN-1;r>=0;r--){
            if(this.wall[r].join("")===""){
                break;
            }
            else{
                for(var c=0;c<this.CN;c++){
                    if(this.wall[r][c]!==undefined){
                        var cell=this.wall[r][c];
                        var img=new Image();
                        img.style.left=this.OFFSET+this.CSIZE*cell.c+"px";
                        img.style.top=this.OFFSET+this.CSIZE*cell.r+"px";
                        img.src=cell.src;
                        frag.appendChild(img);
                    }
                }
            }
        }
        this.pg.appendChild(frag);
    },
    canDown(){//判断能否下落
        for(var i=0;i<this.shape.cells.length;i++){
            var cell=this.shape.cells[i];
            if(this.shape.cells[i].r===this.RN-1){
                return false;
            }
            else if(this.wall[cell.r+1][cell.c]!==undefined){//如果wall中cell的下方位置不为undefined,就返回false
                return false;
            }
        }
        return true;
    },
    canLeft(){
        //遍历shape的cells中的每个cell
        //将当前cell另存为
        //如果cell的c等于0或者wall中cell左侧不是undefined返回false
        //返回true
        for(var i=0;i<this.shape.cells.length;i++){
            var cell=this.shape.cells[i];
            if(cell.c===0||this.wall[cell.r][cell.c-1]!==undefined){
                return false;
            }
        }
        return true;
    },
    canRight(){
        //遍历shape中每个格
        for(var i=0;i<this.shape.cells.length;i++){
            //将当前格保存在cell中
            var cell=this.shape.cells[i];
            //如果cell的c是CN-1或wall中cell右侧不是undefined
            if(cell.c===this.CN-1
                ||this.wall[cell.r][cell.c+1]!==undefined){
                return false;//返回false
            }
        }//(遍历结束)
        return true;//返回true
    },
    landIntoWall(){//主角图形落入墙中
        for(var i=0;i<this.shape.cells.length;i++){
            var cell=this.shape.cells[i];
            this.wall[cell.r][cell.c]=cell;
        }
    },
    deleteRows(){//删除所有满格行
        //自底向上遍历wall中每一行
        //如果当前行是满格
        //删除当前行
        for(var r=this.RN-1,ln=0;r>=0&&ln<4;r--){
            if(this.wall[r].join("")===""){
                break;
            }
            if(this.isFullRow(r)){
                this.deleteRow(r);
                r++;//r留在原地继续判断新的r行是否满格
                ln++;
            }
        }
        return ln;
    },
    deleteRow(r){//删除第r行
        //从r行开始，向上遍历wall中每一行
        //将wall中r-1行赋值给r行
        //将wall中r-1行赋值为CN个空元素的数组
        //遍历wall中r行每个格
        //如果当前格不是undefined
        //就将当前格的r+1
        //如果wall中r-2行是空行
        //就退出循环
        for(;r>=0;r--){
            this.wall[r]=this.wall[r-1];
            this.wall[r-1]=new Array(this.CN);
            for(var c=0;c<this.CN;c++){
                if(this.wall[r][c]!==undefined){
                    this.wall[r][c].r++;
                }
            }
            if(this.wall[r-2].join("")===""){
                break;
            }
        }
    },
    isFullRow(r){//判断第r行是否满格
        //如果在当期行的字符串中没有找到开头的逗号或结尾的逗号或连续的两个逗号,说明是满格
        return String(this.wall[r]).search(/^,|,,|,$/)===-1;

    },
    randomShape(){//随机生成图形
        //在0~6之间生成随机整数r
        switch (Math.floor(Math.random()*7)){
            case 0:return new O();
            case 1:return new I();
            case 2:return new T();
            case 3:return new J();
            case 4:return new S();
            case 5:return new Z();
            case 6:return new L();
        }
    },
    canRotate(){//旋转后判断是否越界或撞墙
        //遍历shape的cells中每个cell
        //将当前cell临时保存在cell中
        //如果cell的r<0或>=RN或cell的c<0或>=CN或在wall中相同位置有格返回false
        //遍历结束返回true
        for(var i=0;i<this.shape.cells.length;i++){
           var cell=this.shape.cells[i];
           if(cell.r<0||cell.r>=this.RN||cell.c<0||cell.c>=this.CN||this.wall[cell.r][cell.c]!==undefined){
               return false;
           }
        }
        return true;
    },
    rotateR(){
        this.shape.rotateR();
        //如果不能转就转回来
        if(!this.canRotate()){
            this.shape.rotateL();
        }
    },
    rotateL(){
        this.shape.rotateL();
        if(!this.canRotate()){
            this.shape.rotateR();
        }
    },
    hardDrop(){
        //只要可以下落就反复调用游戏的movedown
        while(this.canDown()){
            this.moveDown();
        }
    },
    isGameOver(){
        //遍历备胎图形的cells中每个cell
        //将cell另存为cell
        //如果在wall中cell相同位置有格
        //返回true
        //遍历结束
        //返回false
        for(var i=0;i<this.nextShape.cells.length;i++){
            var cell=this.nextShape.cells[i];
            if(this.wall[cell.r][cell.c]!==undefined){
                return true;
            }
        }
        return false;
    },
    moveDown(){//让主角图形下落一步
        if(this.canDown()){//如果可以下落
            this.shape.moveDown();//只改内存,不改页面
        }
        else{  //否则
            this.landIntoWall();
            var ln=this.deleteRows();//删除行
            this.lines+=ln;
            this.score+=this.SCORES[ln];
            if(!this.isGameOver()){
                //将备胎转正再生成新的备胎
                this.shape=this.nextShape;
                this.nextShape=this.randomShape();
            }
            else{
                this.quit();
            }

        }
        this.paint();
    },
    moveLeft(){
        //如果可以左移
        //调用shape的moveLeft方法
        //重绘一切
        if(this.canLeft()){
            this.shape.moveLeft();
            this.paint();
        }
    },
    moveRight(){
        if(this.canRight()){
            this.shape.moveRight();
            this.paint();
        }
    },
    pause(){
        clearInterval(this.timer);
        this.state=this.PAUSE;
    },
    myContinue(){
        this.state=this.RUNNING;
        this.timer=setInterval(this.moveDown.bind(this),this.interval);
        this.paint();
    },
    quit(){
        this.state=this.GAMEOVER;
        clearInterval(this.timer);
        this.paint();
    }
}
game.start();