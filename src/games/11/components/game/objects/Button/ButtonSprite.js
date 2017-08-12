"use strict";
import BasicGameSprite from "system/phaser/BasicGameSprite";

export default class ButtonSprite extends BasicGameSprite {
    constructor({game, x, y, key, buttonObj}) {
        super(game, x, y, `jeu11/other/${key}`, buttonObj);
        this.anchor.setTo(0.5);
    }
};