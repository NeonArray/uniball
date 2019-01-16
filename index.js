const VIEWPORT_WIDTH = 900;
const MAX_BALLS_PER_GROUP = 5;
const PLAYER_SPEED = 5;
const PLAYER_RADIUS = 15;
const BALL_RADIUS = 10;
const BALL_COLOR_ID = ['red', 'blue', 'yellow'];
const MIN_VELOCITY = 15;
const MAX_VELOCITY = 200;
const GAME = new Phaser.Game({
    backgroundColor: 0x000000,
    height: 600,
    parent: 'game',
    state: {
        preload: preload,
        create: create,
        update: update,
        render: render,
    },
    type: Phaser.AUTO,
    width: VIEWPORT_WIDTH,
});

let player;
let balls;
let groups = {};
let counter = 0;
let wild;


function preload() {
    GAME.load.spritesheet('ball', 'balls.png', 10, 10, 3);
    GAME.load.spritesheet('player', 'player.png', 15, 15, 3);
}

function createBall(group) {
    const ball = groups[group].create(
        randomVector(), 
        randomVector(), 
        'ball',
        BALL_COLOR_ID.indexOf(group), 
        true
    );
    ball.anchor.setTo(0.5);
    ball.body.velocity.setTo(randomVelocity());
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.body.setCircle(BALL_RADIUS);

    if (group === 'wild') {
        ball.animations.add('flash');
        ball.animations.play('flash', 1, true);
    }

    return ball;
}

function randomVector() {
    return Math.random() * (VIEWPORT_WIDTH - BALL_RADIUS) + BALL_RADIUS;
}

function randomVelocity() {
    return Math.random() * (MAX_VELOCITY - MIN_VELOCITY) + MIN_VELOCITY;   
}

function changePlayerColor(playerCollider, wildCollider) {
    player.animations.frame = wildCollider.animations.frame;
    wildCollider.destroy();
    createBall('wild');
}

function checkCollision(playerCollider, ballCollider) {
    if (playerCollider.animations.frame !== ballCollider.animations.frame) {
        GAME.state.restart(); 
    }

    ballCollider.destroy();
}

function create() {
    groups = {
        red: GAME.add.group(),
        blue: GAME.add.group(),
        yellow: GAME.add.group(),
        wild: GAME.add.group(),
    };
        
    groups.red.enableBody = true;
    groups.blue.enableBody = true;
    groups.yellow.enableBody = true;
    groups.wild.enableBody = true;
    
    player = GAME.add.sprite(0, 0, 'player', 0);
    GAME.physics.arcade.enable(player);
    player.anchor.setTo(0.5);
    player.body.collideWorldBounds = true;
    player.body.setCircle(PLAYER_RADIUS);
    player.animations.add('color');

    createBall('wild');

    for (let i = 0; i < MAX_BALLS_PER_GROUP; i++) {
        createBall('red');
        createBall('blue');
        createBall('yellow');
    }
}

function update() {
    GAME.physics.arcade.collide(player, groups.wild, changePlayerColor);
    GAME.physics.arcade.collide(player, groups.red, checkCollision);
    GAME.physics.arcade.collide(player, groups.blue, checkCollision);
    GAME.physics.arcade.collide(player, groups.yellow, checkCollision);

    if (GAME.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        player.x -= PLAYER_SPEED;
    }

    if (GAME.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        player.x += PLAYER_SPEED;
    }

    if (GAME.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        player.y -= PLAYER_SPEED;
    }

    if (GAME.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        player.y += PLAYER_SPEED;
    }
}

function render() {}