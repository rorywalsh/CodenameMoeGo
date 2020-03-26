class GameScene extends Phaser.Scene {

    constructor(config) {
        super(config);
    }

    //https://rorywalsh.github.io/codenamemoego/assets/MoeWalk.png
    preload() {
        this.load.spritesheet('Moe', 'assets/MoeWalk.png', { frameWidth: 63, frameHeight: 96 });
        this.load.spritesheet('June', 'assets/JuneWalk.png', { frameWidth: 77, frameHeight: 96 });
        this.load.image('gameWorld', 'assets/gameWorldLowRes.png');
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