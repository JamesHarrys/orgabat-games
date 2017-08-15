"use strict";
import BasicGameObject from "system/phaser/BasicGameObject";
import Phaser from 'phaser';
import {Signal} from "phaser";

import ItemSprite from "./ItemSprite";
import ItemModal from "../Modal/ItemModal";

export default class Item extends BasicGameObject {

    onClicked = new Phaser.Signal();
    onClosed = new Phaser.Signal();
    key;
    mistakes;
    quantity;
    dimensions;
    note;
    modal;

    constructor(game, x, y, key, mistakes, quantity, dimensions, note) {
        super(game);

        this.key = key;
        this.mistakes = mistakes;
        this.quantity = quantity;
        this.dimensions = dimensions;
        this.note = note;

        this.addSprite(new ItemSprite(game, x, y, key, this));

        if (this.quantity < 1) {
            this.sprite.visible = false;
        }

        this.sprite.events.onInputDown.add(function () {
            this.modal = new ItemModal(
                game, 
                game.world.centerX, 
                game.world.centerY, 
                "half_modal", 
                "Information sur le produit", 
                this);
            this.onClicked.dispatch();
            this.modal.sprite.events.onInputDown.add(function(){
                this.modal.removeElements();
                this.modal.sprite.destroy();
                this.onClosed.dispatch();
            }, this);
        }, this);
    }

    disableControls() {
        this.sprite.inputEnabled = false;
        this.sprite.input.useHandCursor = false;
    }

    enableControls() {
        this.sprite.inputEnabled = true;
        this.sprite.input.useHandCursor = true;
    }

}