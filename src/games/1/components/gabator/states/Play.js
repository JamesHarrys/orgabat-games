"use strict";
import {State} from 'phaser';

/** State when we start gabator */
export default class Play extends State {

    /** Called when the state must be created */
    create() {
        this.gabator = this.game.add.sprite(0, 0, 'gabator-sleep');
        this.gabator.x = this.game.canvas.width / 2 - this.gabator.width / 2;
        this.gabator.y = this.game.canvas.height - this.gabator.height;
    }

    /** Called when the game start */
    awakeGabator() {
        this.gabator.loadTexture('gabator', 0);
    }
};