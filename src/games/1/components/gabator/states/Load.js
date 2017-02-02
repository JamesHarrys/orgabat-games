"use strict";
import {State} from 'phaser';
import Config from '../config/data';

/** State to load gabator (image, tilemap, spritesheet...) */
export default class Load extends State {

    /** Called before create */
    preload() {
        this.game.stage.backgroundColor = "#FFFFFF";
        this.game.load.atlasJSONHash('atlas', `${assets_path}atlas.32.png`, `${assets_path}atlas.32.json`);
    }

    /** Called when the state must be created */
    create() {
        this.game.state.start('play');
    }
};