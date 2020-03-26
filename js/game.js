window.mobilecheck = function() {
    var check = false;
    (function(a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

var pathToAssets = '';
if (window.mobilecheck() == true) {
    pathToAssets = 'https://rorywalsh.github.io/codenamemoego/'
}

class GameScene extends Phaser.Scene {

    constructor(config) {
        super(config);
    }

    preload() {
        this.load.spritesheet('Moe', pathToAssets.toString() + 'assets/MoeWalk.png', { frameWidth: 63, frameHeight: 96 });
        this.load.spritesheet('June', pathToAssets.toString() + 'assets/JuneWalk.png', { frameWidth: 77, frameHeight: 96 });
        this.load.image('gameWorld', pathToAssets.toString() + 'assets/gameWorldLowRes.png');
    }


    create() {
        this.matter.world.setBounds(0, 0, 16000, 1000);
        this.cameras.main.setBounds(0, 0, 16000, 1000);
        this.gameWorld = this.add.image(8000, 500, 'gameWorld').setDepth(1);

        this.isMoeTouchingGround = false;
        this.isJuneTouchingObstacle = false;

        // this.gameWorld.setDisplayOrigin(0, 0);


        this.moe = this.matter.add.sprite(300, 10, 'Moe', 8, { label: 'Moe' });
        this.moe.setScale(.6);
        this.moe.setMass(10);
        this.moe.setBounce(0.1);
        this.moe.setFixedRotation(true);


        this.june = this.matter.add.sprite(40, 10, 'June', 8, { label: 'June' });
        this.june.setScale(.4);
        this.june.setMass(.01);
        this.june.setBounce(0.1);
        this.june.setFixedRotation(true);

        this.width = 930;
        this.height = 600;



        LevelData.buildGround(this, 25);
        // this.addObstacle(200, 460);


        this.matter.world.on('collisionactive', function(event, bodyA, bodyB) {
            if (this.checkBodies(bodyA, bodyB, "Moe", "Ground"))
                this.isMoeTouchingGround = true;
            else
                this.isMoeTouchingGround = true;

            if (this.checkBodies(bodyA, bodyB, "June", "Obstacle"))
                this.isJuneTouchingObstacle = true;
            else
                this.isJuneTouchingObstacle = false;

        }, this);

        this.keys = this.input.keyboard.addKeys('W,S,A,D,B');
        this.createAnimations();
    }

    checkBodies(bodyA, bodyB, label1, label2) {
        if ((bodyA.label == label1 && bodyB.label == label2) ||
            (bodyB.label == label1 && bodyA.label == label2))
            return true;

        return false;
    }

    addObstacle(x, y) {
        var obstacle = this.matter.add.image(x, y, 'Obstacle', null, { restitution: 0.4, isStatic: false, label: "Obstacle" });
        obstacle.setDisplaySize(20, 80);
        obstacle.setFixedRotation(true);
        obstacle.setSleepThreshold(2);
    }

    update() {
        var distance = Math.abs(this.moe.x - this.june.x);

        if (this.keys.A.isDown) {
            this.moe.setVelocityX(-3);
            this.moe.anims.play('moeLeft', true);
            console.log(distance);
            if (distance < 300) {
                this.june.setVelocityX(-3);
                this.june.anims.play('juneLeft', true);
            }

        } else if (this.keys.D.isDown) {
            this.moe.setVelocityX(3);
            this.moe.anims.play('moeRight', true);
            if (distance < 300) {
                if (this.isJuneTouchingObstacle == false) {
                    this.june.setVelocityX(3);
                    this.june.anims.play('juneRight', true);
                }
            }
        } else {
            this.moe.anims.play('moeTurn');
            this.june.anims.play('juneTurn');
            //this.moe.setVelocityX(0); 
        }

        if (this.keys.W.isDown && this.isMoeTouchingGround) {
            this.moe.setVelocityY(-10);
            this.isMoeTouchingGround = false;
        }

        this.cameras.main.scrollX = this.moe.x - 500;
        this.cameras.main.scrollY = this.moe.y - 200;

    }

    createAnimations() {
        //  Our moe animations, turning, walking left and walking right
        this.anims.create({
            key: 'moeLeft',
            frames: this.anims.generateFrameNumbers('Moe', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'moeTurn',
            frames: [{ key: 'Moe', frame: 8 }],
            frameRate: 10
        });

        this.anims.create({
            key: 'moeRight',
            frames: this.anims.generateFrameNumbers('Moe', { start: 9, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        //  Our moe animations, turning, walking left and walking right
        this.anims.create({
            key: 'juneLeft',
            frames: this.anims.generateFrameNumbers('June', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'juneTurn',
            frames: [{ key: 'June', frame: 8 }],
            frameRate: 10
        });

        this.anims.create({
            key: 'juneRight',
            frames: this.anims.generateFrameNumbers('June', { start: 9, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
    }
};

//basic config for game
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 'rgb(255, 255, 255)',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            lineColor: 'rgb(255, 0, 0)',

            enableSleeping: true
        }
    },
    scene: GameScene
};