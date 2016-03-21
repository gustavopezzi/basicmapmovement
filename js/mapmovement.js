/*****************************************************************************/
// This source code is a simple demonstration of how to process 2D movement.
//
// The goal of this code is to be the starting point when it comes to teaching
// the basics of 2D movement to update a the map relative to the player.
//
// Wall:
//     x1:       beginning position coordinate x1 of the wall
//     y1:       beginning position coordinate y1 of the wall
//     x2:       end position coordinate x2 of the wall
//     y2:       end position coordinate y2 of the wall
//     color:    wall color in hex
//     draw:     method to render wall position based on the player new values
//
// Player:
//     x:        the player x position on the screen
//     y:        the player y position on the screen
//     angle:    the player rotation angle in radians
//     speed:    the speed factor that increases when pressing the shift key
//     angSpeed: how much the angle changes when pressing left or right keys
//     update:   method to change the values acording to what keys are pressed
//     draw:     method to render the player in the center of the canvas
/*****************************************************************************/

var KEY_ARROW_UP = false;
var KEY_ARROW_DOWN = false;
var KEY_ARROW_LEFT = false;
var KEY_ARROW_RIGHT = false;
var KEY_SHIFT = false;
var canvascanvasCenterX;
var canvascanvasCenterY;
var canvas;
var context;
var player;
var walls;

/*****************************************************************************/
// WALL CLASS
/*****************************************************************************/
var Wall = function (x1, y1, x2, y2, color) {
    this.x1 = x1, this.y1 = y1;
    this.x2 = x2, this.y2 = y2;
    this.color = color;

    this.draw = function () {
        var tx1 = this.x1 - player.x;
        var ty1 = this.y1 - player.y;
        var tx2 = this.x2 - player.x;
        var ty2 = this.y2 - player.y;

        // rotate them around the players view
        tz1 = tx1 * Math.cos(player.angle) + ty1 * Math.sin(player.angle);
        tz2 = tx2 * Math.cos(player.angle) + ty2 * Math.sin(player.angle);
        tx1 = tx1 * Math.sin(player.angle) - ty1 * Math.cos(player.angle);
        tx2 = tx2 * Math.sin(player.angle) - ty2 * Math.cos(player.angle);

        context.beginPath();
        context.lineWidth = 4;
        context.strokeStyle = this.color;
        context.moveTo(canvasCenterX - tx1, canvasCenterY - tz1);
        context.lineTo(canvasCenterX - tx2, canvasCenterY - tz2);
        context.stroke();
    }
}

/*****************************************************************************/
// PLAYER CLASS
/*****************************************************************************/
var Player = function () {
    this.x;
    this.y;
    this.speed;
    this.angle;
    this.angSpeed = 0.04;

    this.update = function () {
        if (KEY_ARROW_UP) {
            this.x = this.x + Math.cos(this.angle) * this.speed;
            this.y = this.y + Math.sin(this.angle) * this.speed;
        }
        if (KEY_ARROW_DOWN) {
            this.x = this.x - Math.cos(this.angle) * this.speed;
            this.y = this.y - Math.sin(this.angle) * this.speed;
        }
        if (KEY_ARROW_LEFT) {
            this.angle = this.angle - this.angSpeed;
        }
        if (KEY_ARROW_RIGHT) {
            this.angle = this.angle + this.angSpeed;
        }

        this.speed = (KEY_SHIFT) ? 2 : 1;
    }

    this.draw = function () {
        context.beginPath();
        context.rect(canvasCenterX - 2, canvasCenterY - 2, 4, 4);
        context.fillStyle = 'white';
        context.lineWidth = 1;
        context.strokeStyle = '#777';
        context.moveTo(canvasCenterX, canvasCenterY);
        context.lineTo(Math.cos(Math.PI*3/2) * 10 + canvasCenterX, Math.sin(Math.PI*3/2) * 10 + canvasCenterY);
        context.stroke();
        context.fill();
    }
}

/*****************************************************************************/
// TRIGGER FUNCTIONS FOR KEY DOWN AND KEY UP
/*****************************************************************************/
function onKeyDown(evt) {
    switch (evt.keyCode) {
        case 39: KEY_ARROW_RIGHT = true; break;
        case 37: KEY_ARROW_LEFT  = true; break;
        case 38: KEY_ARROW_UP    = true; break;
        case 40: KEY_ARROW_DOWN  = true; break;
        case 16: KEY_SHIFT       = true; break;
    }
}

function onKeyUp(evt) {
    switch (evt.keyCode) {
        case 39: KEY_ARROW_RIGHT = false; break;
        case 37: KEY_ARROW_LEFT  = false; break;
        case 38: KEY_ARROW_UP    = false; break;
        case 40: KEY_ARROW_DOWN  = false; break;
        case 16: KEY_SHIFT       = false; break;
    }
}

/*****************************************************************************/
// DEGREE AND RADIAN ANGLE CONVERSION
/*****************************************************************************/
function deg2rad(angleInDegrees) {
    return angleInDegrees * (Math.PI / 180);
}

function rad2deg(angleInRadians) {
    return angleInRadians * (180 / Math.PI);
}

/*****************************************************************************/
// ANIMATION LOOP
/*****************************************************************************/
function mainAnimationLoop() {
    // clear canvas every frame
    context.fillStyle = "black";
    context.clearRect(0, 0, canvas.width, canvas.height);

    // update properties and redraw walls on canvas
    walls.forEach(function (wall) {
        wall.draw();
    });

    // update properties and redraw player on canvas
    player.update();
    player.draw();

    // recall animation frame loop
    window.requestAnimationFrame(mainAnimationLoop);
}

/**********************************************/
// ON LOAD
/**********************************************/
document.addEventListener("DOMContentLoaded", function(event) {
    canvas = document.getElementById('canvas-map');
    context = canvas.getContext("2d");

    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;

    // create the player object
    player = new Player();
    player.x = canvas.width / 3;
    player.y = canvas.height / 2;
    player.angle = 0;

    walls = new Array(
        new Wall(160,  30, 160, 170, '#888'),
        new Wall(161,  31, 100,  11, '#888'),
        new Wall(101,  10,  30,  81, '#888'),
        new Wall( 31,  80,  30, 150, '#888'),
        new Wall( 29, 148,  81, 170, '#888'),
        new Wall( 80, 170, 162, 170, '#888')
    );

    // key event listeners
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    // start animation frame loop
    window.requestAnimationFrame(mainAnimationLoop);

    window.requestAnimationFrame = function () {
        return window.requestAnimationFrame || function(a) {
            window.setTimeout(a, 1000 / 60);
        }
    }();
});