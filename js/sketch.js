var Engine;
var Render;
var World;
var Bodies;
var MouseConstraint;
var engine;
var state = 0;
var cab = document.getElementById('canvas');
var two;
var hammer;
var count = 0;
var pcount = 0;
var targetpower = 100;
var ifpunch = 0;
var miyata;
var mbg;
var stage;
var contain;
var imageWidth = 100;
var imageHeight = 164;
var gamestate = 0;
var t1;
var t2;
var floor;
var wincount = 0;
var sky;
var setumei;
var disc;
// create an engine
window.addEventListener('load', () => {
    if (createjs.Touch.isSupported() == true) {
        createjs.Touch.enable(stage)
    }
    stage = new createjs.Stage("myCanvas");
    mbg = new createjs.Bitmap('./assets/m.png');
    sky = new createjs.Bitmap('./assets/sky.png');
    disc = new createjs.Bitmap('./assets/discforNMIN.png');
    gamestate = 0;
    t1 = new createjs.Text("賀正　宮田落とし", "font1", "DarkRed");
    stage.addChild(t1);
    t1.textAlign = "center";
    t1.x = stage.canvas.width / 2;
    t1.y = stage.canvas.height / 4;
    t1.scaleX = 2;
    t1.scaleY = 2;
    t2 = new createjs.Text("touch to start", "font1", "DarkRed");
    stage.addChild(t2);
    t2.textAlign = "center";
    t2.x = stage.canvas.width / 2;
    t2.y = stage.canvas.height / 3 * 2;
    t2.scaleX = 2;
    t2.scaleY = 2;
    // Stageの描画を更新
    stage.update();
    console.info("loded");
    window.addEventListener('mousedown', function (e) {
        switch (gamestate) {
            case 0:
                gamestate = 4;
                stage.removeChild(t1);
                stage.removeChild(t2);
                stage.addChild(disc);
                stage.update();
                break;
            case 1:
                if (ifpunch == 0) {
                    ifpunch = 1;
                }
                break;
            case 4:
                gamestate = 1;
                stage.removeChild(disc);
                init();
                break;
        }
    }, false);
});
function gameupdate() {
    if (gamestate == 1) {
        if (ifpunch == 0) {
            var twomax = 600
            if (count % twomax > twomax / 2) {
                Matter.Body.translate(hammer, Matter.Vector.create(0, -1));
            } else {
                Matter.Body.translate(hammer, Matter.Vector.create(0, 1));
            }
            count++;
        } else {
            Matter.Body.translate(hammer, Matter.Vector.create(20, 0));
            pcount++;
            if (pcount > 30) {
                ifpunch = 0;
                pcount = 0;
                count = 0;
                Matter.Body.setPosition(hammer, Matter.Vector.create(10, 260));
            }
        }
    }
}
function init() {
    Engine = Matter.Engine,
        //Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        MouseConstraint = Matter.MouseConstraint;
    engine = Engine.create();
    floor = Bodies.rectangle(170, 560, 150, 20, {
        isStatic: true, //固定する
        id: "floor",
        friction:0.05,
        render: {
            
            fillStyle: '#977559', // 塗りつぶす色: CSSの記述法で指定
            strokeStyle: 'rgba(0, 0, 0, 0)', // 線の色: CSSの記述法で指定
            lineWidth: 0
        }
    });
    World.add(engine.world, floor);
    for (var i = 0; i < 5; i++) {
        World.add(engine.world, [Bodies.rectangle(180, 300 - 60 * i, 150, 60, {
            isStatic: false,
            friction: 0.05,
            render: {
                strokeStyle: 'rgba(0, 0, 0, 0)', // 線の色: CSSの記述法で指定
                lineWidth: 0
            }
        })]);
    }
    miyata = Bodies.rectangle(160+Math.random()*60, -200, imageWidth, imageHeight, {//player
        isStatic: false,
        id: "player",
        render: {
            strokeStyle: 'rgba(0, 0, 0, 0)', // 線の色: CSSの記述法で指定
            lineWidth: 0,
        }
    });
    World.add(engine.world, miyata);
    hammer = Bodies.rectangle(10, 260, 100, 50, {
        isStatic: true, //固定する
        id: "hammer",
        render: {
            strokeStyle: 'rgba(0, 0, 0, 0)', // 線の色: CSSの記述法で指定
            lineWidth: 0
        }
    });
    World.add(engine.world, hammer);
    Matter.Events.on(engine, 'afterUpdate', function () {
        if (gamestate == 1) {
            gameupdate();
            rend(stage);
            var an = ((miyata.angle) / (Math.PI * 2)) * 360;
            if (Math.abs(an) > 90 || miyata.position.y > stage.canvas.height) {
                //stage.remove(t1);
                gamestate = 2;
                t1 = new createjs.Text("残念！\nリロードしてね", "font1", "Black");
                stage.addChild(t1);
                t1.textAlign = "center";
                t1.x = stage.canvas.width / 2;
                t1.y = stage.canvas.height / 2;
                t1.scaleX = 2;
                t1.scaleY = 2;
                stage.update();
            } else {
                if (floor.position.y - miyata.position.y < 105) {
                    wincount++;
                    if (wincount > 60) {
                        gamestate = 3;
                        t1 = new createjs.Text("やったね！", "font1", "Black");
                        stage.addChild(t1);
                        t1.textAlign = "center";
                        t1.x = stage.canvas.width / 2;
                        t1.y = stage.canvas.height / 3;
                        t1.scaleX = 2;
                        t1.scaleY = 2;
                        Matter.Runner.stop(engine)
                        stage.update();
                    }
                }
            }
        }
    });
    console.info(stage);
    // run the engine
    Engine.run(engine);
    // run the renderer
    //Render.run(render);
}
function rend(ttwo) {
    ttwo.removeChild(contain);
    contain = new createjs.Container();
    sky.scaleX = 340 / sky.getBounds().width;
    sky.scaleY = 680 / sky.getBounds().height;
    contain.addChild(sky);
    const bodies = Matter.Composite.allBodies(this.engine.world);
    var obj = new createjs.Shape();
    for (let i = 0; i < bodies.length; i += 1) {
        const part = bodies[i];
        if (part.id == "player") {
            const vertices = part.vertices;
            mbg.scaleX = imageWidth / mbg.getBounds().width;
            mbg.scaleY = imageHeight / mbg.getBounds().height;
            mbg.regX = 0;
            mbg.regY = 0;
            mbg.rotation = ((part.angle) / (Math.PI * 2)) * 360;
            mbg.x = (vertices[0].x);
            mbg.y = (vertices[0].y);
            //console.log(part.angle);
            contain.addChild(mbg);
        } else {
            if (part.id == "hammer") {
                obj.graphics.beginFill("#F0B82D");
                obj.graphics.beginStroke("#5984BE");
            } else if (part.id == "floor") {
                obj.graphics.beginFill("#EA6163");
                obj.graphics.beginStroke("#5984BE");
            } else {
                obj.graphics.beginFill("#B0E0D2");
                obj.graphics.beginStroke("#5984BE");
            }
            const vertices = bodies[i].vertices;
            obj.graphics.moveTo(vertices[0].x, vertices[0].y);
            for (var j = 1; j < vertices.length; j += 1) {
                obj.graphics.lineTo(vertices[j].x, vertices[j].y);
            }
            obj.graphics.lineTo(vertices[0].x, vertices[0].y);
            contain.addChild(obj);
        }
    }
    ttwo.addChild(contain);
    ttwo.update();
}
