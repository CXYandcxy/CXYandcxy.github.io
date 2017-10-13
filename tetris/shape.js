//Step1: 定义Cell类型描述格子对象统一的结构
function Cell(r,c,src){
  this.r=r;this.c=c;this.src=src;
}
//Step2: 抽象公共父类型Shape描述图形,四个格子表示一个对象
function Shape(r0,c0,r1,c1,r2,c2,r3,c3,src,states,orgi)
{
  this.cells=[
      new Cell(r0,c0,src),
      new Cell(r1,c1,src),
      new Cell(r2,c2,src),
      new Cell(r3,c3,src),
  ];
  this.states=states;//旋转静态数组
  this.orgCell=this.cells[orgi];//根据下标获得参照格
    this.statei=0;//保存所有图形的初始状态为0状态
}
//定义父类型原型对象封装公共的方法
Shape.prototype={

    moveDown(){//this->当前图形
        //遍历当前图形的cells
        for(var i=0;i<this.cells.length;i++){
            this.cells[i].r++;//将当前cell的r+1
        }
    },
    moveLeft(){//this->当前图形
        //遍历当前图形的cells
        for(var i=0;i<this.cells.length;i++){
            this.cells[i].c--;//将当前cell的c-1
        }
    },
    moveRight(){//this->当前图形
        //遍历当前图形的cells
        for(var i=0;i<this.cells.length;i++){
            this.cells[i].c++;//将当前cell的c+1
        }
    },
    rotateR(){//顺时针旋转
        //将当前图形的statei+1
        this.statei++;
        //如果statei>=当前图形的states的length,就改回0
        if(this.statei===this.states.length){
            this.statei=0;
        }
        this.rotate();
    },
    rotate(){
        //获得当前对象states数组中statei位置的对象，保存在state中
        var state=this.states[this.statei];
        //遍历当前图形的cells //i=0
        for(var i=0;i<this.cells.length;i++){
            //将当前cell保存在cell中
            var cell=this.cells[i];
            if(cell!==this.orgCell){
                //修改cell的r为orgCell.r+state的ri
                cell.r=this.orgCell.r+state['r'+i];
                //修改cell的c为orgCell.c+state的ci
                cell.c=this.orgCell.c+state['c'+i];
            }

        }
    },
    rotateL(){//逆时针旋转
        this.statei--;//将当前图形的statei-1
        //如果statei<0,就改回states的length-1
        if(this.statei<0){
            this.statei=this.states.length-1;
        }
        this.rotate();
    },
}
//描述状态对象的数据结构,此处的大小是相对1的距离
function State(r0,c0,r1,c1,r2,c2,r3,c3){
    this.r0=r0; this.c0=c0;
    this.r1=r1; this.c1=c1;
    this.r2=r2; this.c2=c2;
    this.r3=r3; this.c3=c3;
}
//Step3:定义具体图形类型描述所有图形的数据结构
function T(){//借用Shape()
  Shape.call(this,
    0,3,0,4,0,5,1,4, "img/T.png",
      [
          new State(0,-1, 0,0, 0,+1, +1,0),
          new State(-1,0, 0,0, +1,0, 0,-1),
          new State(0,+1, 0,0, 0,-1, -1,0),
          new State(+1,0, 0,0, -1,0, 0,+1),
      ],
      1
  );
}
//设置子类型原型对象继承父类型原型对象
Object.setPrototypeOf(
  T.prototype,Shape.prototype
);
//定义O类型描述所有O图形的数据结构
function O(){//借用Shape()
  Shape.call(this,
    0,4,0,5,1,4,1,5,"img/O.png",
      [ new State(0,-1, 0,0, +1,-1, +1,0) ],
      1
  );
}
Object.setPrototypeOf(
  O.prototype,Shape.prototype
);
function I(){//借用Shape()
  Shape.call(this,
    0,3,0,4,0,5,0,6,"img/I.png",
      [
          new State(0,-1, 0,0, 0,+1, 0,+2),
          new State(-1,0, 0,0, +1,0, +2,0),
      ],
      1
  );
}
Object.setPrototypeOf(
  I.prototype,Shape.prototype
);
function J(){//借用Shape()
    Shape.call(this,
        0,3,0,4,0,5,1,5,"img/J.png",
        [
            new State(0,-1, 0,0, 0,+1, +1,+1),
            new State(-1,0, 0,0, +1,0, +1,-1),
            new State(0,+1, 0,0, 0,-1, -1,-1),
            new State(+1,0, 0,0, -1,0, -1,+1),
        ],
        1
    );
}
Object.setPrototypeOf(
    J.prototype,Shape.prototype
);
function L(){//借用Shape()
    Shape.call(this,
        0,3,0,4,0,5,1,3,"img/L.png",
        [
            new State(0,+1, 0,0, 0,-1, -1,+1),
            new State(+1,0, 0,0, -1,0, +1,+1),
            new State(0,-1, 0,0, 0,+1, +1,-1),
            new State(-1,0, 0,0, +1,0, -1,-1),
        ],
        1
    );
}
Object.setPrototypeOf(
    L.prototype,Shape.prototype
);
function S(){//借用Shape()
    Shape.call(this,
        0,3,0,4,1,4,1,5,"img/S.png",
        [
            new State(0,-1, 0,0, -1,0, -1,+1),
            new State(-1,0, 0,0, 0,+1, +1,+1),
        ],
        1
    );
}
Object.setPrototypeOf(
    S.prototype,Shape.prototype
);
function Z(){//借用Shape()
    Shape.call(this,
        0,3,0,4,1,4,1,5,"img/Z.png",
        [
            new State(-1,-1, 0,0, -1,0, 0,+1),
            new State(-1,+1, 0,0, 0,+1, +1,0),
        ],
        1
    );
}
Object.setPrototypeOf(
    Z.prototype,Shape.prototype
);
