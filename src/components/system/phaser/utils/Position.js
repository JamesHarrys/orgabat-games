'use strict';
var MyPhaser = MyPhaser || {};
MyPhaser.Utils = MyPhaser.Utils || {};

/**
 * Position in the grid
 * @type {Position}
 */
MyPhaser.Utils.Position = class Position {

    /**
     * Constructor for a new position
     * @param x
     * @param y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Get current grid position to pixel
     * @param n
     * @returns {*}
     */
    getPixelFor(n) {
        return Position.getPixelAt(this[n]);
    }

    /**
     * Get a grid position in pixel
     * @param n
     * @returns {number}
     */
    static getPixelAt(n) {
        return n * Game.TileSize;
    }
};