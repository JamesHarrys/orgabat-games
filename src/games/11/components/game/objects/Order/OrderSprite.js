"use strict";
import BasicGameSprite from "system/phaser/BasicGameSprite";

export default class ModalSprite extends BasicGameSprite {
    constructor(game, x, y, key, buttonObj) {
        super(game, x, y, `jeu11/${key}`, buttonObj);
        this.anchor.setTo(0.5);
        this.inputEnabled = true;
        this.input.useHandCursor = true;
    }
};