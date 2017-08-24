"use strict";
import PhaserManager from 'system/phaser/utils/PhaserManager';
import BasicGameObject from "system/phaser/BasicGameObject";
import Phaser from 'phaser';
import {Signal} from "phaser";

import ModalSprite from "./ModalSprite";

export default class Question extends BasicGameObject {

    finish = new Signal();

    game;
    data;
    answer = [];

    constructor(game, data) {
        super(game);
        this.game = game;
        this.data = data;
        
        //Question title
        let x = 60 * this.game.SCALE,
            y = 20 * this.game.SCALE;

        this.title = this.game.add.text(
            x, 
            y, 
            this.data.title, 
            {
                font: 'Arial', 
                fontSize: 30 * this.game.SCALE, 
                fill: '#000000'
            }
        );

        x += 20;
        y += this.title.height + 40;

        // Answers
        for (let answerNumber in this.data.answers) {
            this.answer[answerNumber] = this.game.add.text(
                x, 
                y, 
                this.data.answers[answerNumber].title, 
                {
                    font: 'Arial', 
                    fontSize: 25 * this.game.SCALE, 
                    fill: '#000000'
                }
            );
            this.answer[answerNumber].correctAnswer = this.data.answers[answerNumber].correctAnswer;
            this.answer[answerNumber].inputEnabled = true;
            this.answer[answerNumber].input.useHandCursor = true;
            y += this.answer[answerNumber].height + 20;
        }
    }

}