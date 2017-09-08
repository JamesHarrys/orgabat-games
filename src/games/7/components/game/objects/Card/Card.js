"use strict";
import BasicGameObject from "system/phaser/BasicGameObject";
import Phaser from 'phaser';
import {Signal} from "phaser";

import CardSprite from "./CardSprite";
import BigCardSprite from "./BigCardSprite";
import BigCard from "./BigCard";

export default class Card extends BasicGameObject {

    zoomSignal = new Phaser.Signal();
    dezoomSignal = new Phaser.Signal();

    constructor(game, x, y, key, validated, clicked) {
        super(game);
        this.x = x;
        this.y = y;
        this.key = key;
        this.validated = validated;
        this.clicked = clicked;
        this.isZoomed = false;
    }

    click() {
        if (!this.validated) {
            this.sprite.destroy();
            this.addSprite(new CardSprite(this.game, this.x, this.y, this.key, this));
            this.game.layer.zDepth0.addChild(this.sprite);
            this.sprite.inputEnabled = true;
            this.sprite.input.useHandCursor = true;
            // this.sprite.events.onInputOver.add(this.zoom, this); // Hover
            // this.sprite.events.onInputOut.add(this.dezoom, this); // Dezoom with mouse out
            this.sprite.events.onInputDown.add(this.zoom, this); // Click
        }
    }

    zoom() {
        if (!this.isZoomed) {
            console.log("zoom");
            this.zoomSignal.dispatch();
            this.isZoomed = true;
            // this.sprite.scale.set(1.5); // zoom with small cards
            // this.sprite.scale.set(0.8); // zoom with big cards

            let width = this.game.width;
            let height = this.game.height;

            // let cardsWidth = 254;
            // let cardsHeight = 377; // sprite scale(1)

            let cardsWidth = 386;
            let cardsHeight = 572; // sprite scale(1.1)

            let bigWidthMargin = (width - cardsWidth) / 2;
            let bigHeightMargin = (height - cardsHeight) / 2;

            this.bigCard = new BigCard(this.game, bigWidthMargin, bigHeightMargin, this.key, this);
            this.bigCard.addImage();
            this.game.layer.zDepth1.addChild(this.bigCard.sprite);
            this.bigCard.sprite.inputEnabled = true;
            this.bigCard.sprite.input.useHandCursor = true;

            this.bigCard.sprite.events.onInputDown.add(this.dezoom, this);
            // this.game.time.events.add(Phaser.Timer.SECOND * 2, this.dezoom, this);

            // Draw a cross
            let crossWidth = 40;
            let x = bigWidthMargin + this.bigCard.sprite.width - crossWidth;
            let y = bigHeightMargin;
            this.graphics = this.game.add.graphics(0, 0);
            this.game.layer.zDepthOverAll.addChild(this.graphics);
            this.graphics.lineStyle(3, "black", 1);
            this.graphics.moveTo(x,y);
            this.graphics.lineTo(x + crossWidth, y + crossWidth);
            this.graphics.moveTo(x + crossWidth,y);
            this.graphics.lineTo(x, y + crossWidth);
        }
    }

    dezoom() {
        // this.sprite.scale.set(0.95); // zoom with small cards
        // this.sprite.scale.set(0.28); // zoom with big cards
        if (this.isZoomed) {
            this.dezoomSignal.dispatch();
            this.isZoomed = false;
            try {
                this.bigCard.destroy();
            } catch (e) {
                //
            }
            try {
                this.graphics.destroy();
            } catch (e) {
                //
            }
        }
    }

    turnBack() {
        if (!this.validated) {
            try {
                this.sprite.destroy();
            } catch (e) {
                //
            }
            this.addSprite(new CardSprite(this.game, this.x, this.y, "cardBg", this));
            this.game.layer.zDepth0.addChild(this.sprite);
        }
    }

    validate() {
        this.validated = true;
    }

    preUpdate() {
        //
    }

    update() {
        //
    }

    postUpdate() {
        //
    }

    updateTransform() {
        //
    }

    _renderCanvas() {
        //
    }
}