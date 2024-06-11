let runner, runnerAnimation;
let bgImg;
let obstacles = [];
let obstacle1Img, obstacle2Img;
let gameOver = false;
let score = 0;
let obstacleSpawnTime = 0;

function preload() {
    bgImg = loadImage('assets/bg.png');
    obstacle1Img = loadImage('assets/obstacle.png'); // Regular obstacle image
    obstacle2Img = loadImage('assets/spike.png'); // Spike obstacle image
    
    // Load runner animation frames
    runnerAnimation = loadAnimation(
        'assets/r1.png',
        'assets/r2.png',
        'assets/r3.png',
        'assets/r4.png',
        'assets/r5.png',
        'assets/r6.png'
    );
}

function setup() {
    let canvas = createCanvas(800, 400);
    canvas.parent('game-container');

    // Runner setup
    runner = createSprite(200, 350); // Lower the runner's initial position
    runner.addAnimation('running', runnerAnimation);
    runner.scale = 0.5;

    // Initial obstacle setup
    spawnObstacle();
}

function draw() {
    background(255);
    
    // Draw static background
    image(bgImg, 0, 0, width, height);

    // Spawn obstacles at intervals
    if (millis() > obstacleSpawnTime + 2000) { // every 2 seconds
        spawnObstacle();
        obstacleSpawnTime = millis();
    }

    // Runner jump
    if (keyDown('SPACE') && runner.velocityY === 0) {
        runner.velocityY = -15; // Increased jump velocity
    }

    // Gravity
    runner.velocityY += 0.8;

    // Prevent runner from falling through the ground
    if (runner.position.y > 350) { // Adjust ground collision check
        runner.position.y = 350;
        runner.velocityY = 0;
    }

    // Check for collisions and remove off-screen obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (runner.collide(obstacles[i])) {
            gameOver = true;
        }
        if (obstacles[i].position.x < 0) {
            obstacles.splice(i, 1);
            score++;
        }
    }

    // Stop everything if game over
    if (gameOver) {
        runner.velocityY = 0;
        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].velocityX = 0;
        }

        textSize(32);
        fill(0);
        textAlign(CENTER);
        text('Game Over', width / 2, height / 2);
        
        // Display score after game over
        textSize(24);
        text(`Score: ${score}`, width / 2, height / 2 + 40);

        noLoop();
    } else {
        drawSprites();

        // Display score during the game
        textSize(24);
        fill(0);
        text(`Score: ${score}`, width - 120, 30);
    }
}

function spawnObstacle() {
    let obstacle = createSprite(800, 370, 40, 25); // Adjust height for new obstacle
    let rand = Math.round(random(1, 2));
    switch(rand) {
        case 1:
            obstacle.addImage(obstacle1Img);
            break;
        case 2:
            obstacle.addImage(obstacle2Img);
            break;
    }
    obstacle.scale = 0.3; // Scale down the obstacle image
    obstacle.velocityX = -6;
    obstacles.push(obstacle);
}
