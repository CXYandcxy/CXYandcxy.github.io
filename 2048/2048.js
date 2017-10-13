var game={
    //保存游戏二维数组,总行数,总列数
    data:null,RN:4,CN:4,
    score:0,
    state:1,RUNNING:1,GAMEOVER:0,
    start(){
        this.score=0;
        this.state=this.RUNNING;
        this.data=[];//新建空数组保存在data中
        for(var r=0;r<this.RN;r++){
            this.data[r]=[];//新建空数组保存到data中r行
            for(var c=0;c<this.CN;c++){
                this.data[r][c]=0;//设置data中r行c列的值为0
            }
        }
        // 在随机的两个位置生成随机数
        this.randomNum();
        this.randomNum();
        this.updateView();
        //键盘按下事件
        document.onkeydown=function (e) {
            //document中的this指代的是document,不是想要的game中的this,因为不是马上要执行而是按键之后才执行,所以用bind来找到全局中的this,若是碰到要马上执行的可以使用call来找到想要的this
            switch(e.keyCode){
                case 37://左移
                    this.moveLeft();
                    break;
                case 38://上移
                    this.moveUp();
                    break;
                case 39://右移
                    this.moveRight();
                    break;
                case 40://下移
                    this.moveDown();
                    break;
            }
        }.bind(this);
    },
    randomNum(){//在一个随机位置生成2或4
        //反复:
        //在0到RN-1之间生成随机数r
        //在0到CN-1之间生成随机数c
        //如果data中r行c列的值为0
        //将data中r行c列赋值为：随机生成一个小数，如果小于0.5就取2，否则就取4
        //退出循环
        while(true){
            var r=Math.floor(Math.random()*this.RN);
            var c=Math.floor(Math.random()*this.CN);
            if(this.data[r][c]===0){
                this.data[r][c]=Math.random()<0.5?2:4;
                break;
            }
        }
    },
    updateView(){//将data中的数据更新到每个div中
        //遍历二二维数组
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                var n=this.data[r][c];
                var div=document.getElementById("c"+r+c);
                if(n!==0){
                    div.innerHTML=n;
                    div.className="cell n"+n;
                }
                else{
                    div.innerHTML="";
                    div.className="cell";
                }
            }
        }
        document.getElementById("score").innerHTML=this.score;
        //找到id为gameOver的div,设置其style的display属性为: 如果游戏状态为GAMEOVER?"block":"none"
        // document.getElementById("gameOver").style.display= this.state===this.GAMEOVER? "block":"none";
        var div=document.getElementById("gameOver");
        if(this.state===this.GAMEOVER){
            div.style.display="block";
            document.getElementById("final").innerHTML=this.score;
        }
        else{
            div.style.display="none";
        }

    },
    isGameOver(){//判断游戏是否结束
        //遍历二维数组data
        //如果当前元素是0,,返回false
        //否则
        //如果c<CN-1且当前元素等于右侧元素时,返回false
        //否则
        //如果r<RN-1且当前元素等于下方元素时,返回false
        //遍历结束
        //返回true
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                if(this.data[r][c]===0){
                    return false;
                }
                else{
                    if(c<this.CN-1&&this.data[r][c]===this.data[r][c+1]){
                        return false;
                    }
                    else{
                        if(r<this.RN-1&&this.data[r][c]===this.data[r+1][c]){
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },
    moveLeft(){//左移所有行
        //为数组拍照保存在before中
        //r从0开始,到<RN结束
        //左移第r行
        //(循环结束)
        //为数组拍照保存在after中
        //如果before!=after
        //随机生成数
        //更新页面
        var before=String(this.data);
        //遍历data中每一行  r
        for(var r=0;r<this.RN;r++)//从上到下
            this.moveLeftInRow(r);//左移第r行
        //(遍历结束)
        var after=String(this.data);
        //如果before不等于after
        if(before!==after){
            this.randomNum();//随机生成一个新数
            if(this.isGameOver()){//如果游戏结束
                this.state=this.GAMEOVER;
            }
            this.updateView();//更新页面
        }
    },
    moveLeftInRow(r){//左移第r行
        //c从0开始，到<CN-1结束，遍历r行中每个格
        //找r行c列右侧(c位置后)下一个不为0的位置nextc  var nextc=this.getNextInRow(r,c);
        //如果没找到nextc为-1,就退出循环
        //否则
        //如果c位置的值是0
        //将nextc位置的值赋值给c位置
        //将nextc位置的值置为0
        //c留在原地
        //否则 如果c位置的值等于nextc位置的值
        //将c位置的值*2
        //将nextc位置的值置为0
        for(var c=0;c<this.CN-1;c++){
            var nextc=this.getNextInRow(r,c);
            if(nextc===-1){
                break;
            }
            else{
                if(this.data[r][c]===0){
                    this.data[r][c]=this.data[r][nextc];
                    this.data[r][nextc]=0;
                    c--;
                }
                else if(this.data[r][c]===this.data[r][nextc]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[r][nextc]=0;
                }
            }
        }
    },
    //找r行c列右侧下一个不为0的位置
    getNextInRow(r,c){
        //i从c+1开始，到<CN结束
        //如果i位置的值不是0,就返回i
        //(遍历结束)
        //返回-1
        for(var i=c+1;i<this.CN;i++){
            if(this.data[r][i]!==0)
                return i;
        }
        return -1;
    },
    moveRight(){//右移所有行
        //为data拍照，保存在before中
        //遍历data中每一行
        //右移第r行
        //(遍历结束)
        //为data拍照，保存在after中
        //如果发生了移动
        //随机生成数
        //更新页面
        var before=String(this.data);
        for(var r=0;r<this.RN;r++){
            this.moveRightInRow(r);
        }
        var after=String(this.data);
        //如果before不等于after
        if(before!==after){
            this.randomNum();//随机生成一个新数
            if(this.isGameOver()){//如果游戏结束
                this.state=this.GAMEOVER;
            }
            this.updateView();//更新页面
        }
    },
    moveRightInRow(r){//右移第r行
    //c从CN-1开始，到>0结束，反向遍历r行中每个格
    //找r行c列左侧前一个不为0的位置prevc
    //如果prevc为-1,就退出循环
    //否则
    //如果c列的值是0
    //将prevc列的值赋值给c列
    //将prevc列的值置为0
    //c留在原地
    //否则 如果c列的值等于prevc列的值
    //将c列的值*2
    //将prevc列置为0
        for(var c=this.CN-1;c>0;c--){
            var prevc=this.getPrevInRow(r,c);
            if(prevc===-1){
                break;
            }
            else{
                if(this.data[r][c]===0){
                    this.data[r][c]=this.data[r][prevc];
                    this.data[r][prevc]=0;
                    c++;
                }
                else if(this.data[r][c]===this.data[r][prevc]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[r][prevc]=0;
                }
            }
        }
    },
    getPrevInRow(r,c){
        for(var i=c-1;i>=0;i--){
            if(this.data[r][i]!==0)
                return i;
        }
        return -1;
    }
    ,
    moveUp(){
        //为data拍照保存在before中
        //遍历data中每一列
        //调用moveUpInCol上移第c列
        //为data拍照保存在after中
        //如果before不等于after
        //随机生成数
        //更新页面
        var before=String(this.data);
        for(var c=0;c<this.CN;c++){
            this.moveUpInCol(c);
        }
        var after=String(this.data);
        //如果before不等于after
        if(before!==after){
            this.randomNum();//随机生成一个新数
            if(this.isGameOver()){//如果游戏结束
                this.state=this.GAMEOVER;
            }
            this.updateView();//更新页面
        }
    },
    moveUpInCol(c){
        //r从0开始,到r<RN-1结束，r每次递增1
        //查找r行c列下方下一个不为0的位置nextr
        //如果没找到,就退出循环
        //否则
        //如果r位置c列的值为0
        //将nextr位置c列的值赋值给r位置
        //将nextr位置c列置为0
        //r留在原地
        //否则，如果r位置c列的值等于nextr位置的值
        //将r位置c列的值*2
        //将nextr位置c列的值置为0
        for(var r=0;r<this.RN-1;r++){
            var nextr=this.getNextInCol(r,c);
            if(nextr===-1){
                break;
            }
            else{
                if(this.data[r][c]===0){
                    this.data[r][c]=this.data[nextr][c];
                    this.data[nextr][c]=0;
                    r--;
                }
                else if(this.data[r][c]===this.data[nextr][c]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[nextr][c]=0;
                }
            }
        }
    },
    getNextInCol(r,c){
        //r+1
        //循环，到<RN结束，r每次递增1
        //如果r位置c列不等于0, 就返回r
        //(遍历结束)
        //返回-1
        for(var i=r+1;i<this.RN;i++){
            if(this.data[i][c]!==0)
                return i;
        }
        return -1;
    },
    moveDown(){
        //为data拍照保存在before中
        //遍历data中每一列
        //调用moveDownInCol下移第c列
        //为data拍照保存在after中
        //如果before不等于after
        //随机生成数
        //更新页面
        var before=String(this.data);
        for(var c=0;c<this.CN;c++){
            this.moveDownInCol(c);
        }
        var after=String(this.data);
        //如果before不等于after
        if(before!==after){
            this.randomNum();//随机生成一个新数
            if(this.isGameOver()){//如果游戏结束
                this.state=this.GAMEOVER;
            }
            this.updateView();//更新页面
        }
    },
    moveDownInCol(c){
        //r从RN-1开始，到r>0结束，r每次递减1
        //查找r位置c列上方前一个不为0的位置prevr
        //如果没找到,就退出循环
        //否则
        //如果r位置c列的值为0
        //将prevr位置c列的值赋值给r位置
        //将prevr位置c列置为0
        //r留在原地
        //否则，如果r位置c列的值等于prevr位置的值
        //将r位置c列的值*2
        //将prevr位置c列置为0
        for(var r=this.RN-1;r>0;r--){
            var prevr=this.getPrevInCol(r,c);
            if(prevr===-1){
                break;
            }
            else{
                if(this.data[r][c]===0){
                    this.data[r][c]=this.data[prevr][c];
                    this.data[prevr][c]=0;
                    r++;
                }
                else if(this.data[r][c]===this.data[prevr][c]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[prevr][c]=0;
                }
            }
        }
    },
    getPrevInCol(r,c){
        //r-1
        //循环，r到>=0结束，每次递减1
        //如果r位置c列不等于0, 就返回r
        //(遍历结束)
        //返回-1
        for(var i=r-1;i>=0;i--){
            if(this.data[i][c]!==0)
                return i;
        }
        return -1;
    }
}
game.start();