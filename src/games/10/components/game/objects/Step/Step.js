"use strict";

import PhaserManager from 'system/phaser/utils/PhaserManager';
import BasicGameObject from "system/phaser/BasicGameObject";

import Phaser from 'phaser';
import {Signal} from 'phaser';

import Button from '../Button/Button';
import QuestionFactory from "../Question/QuestionFactory";
import Document from "../Document/Document";

export default class Step extends BasicGameObject {

    finish = new Signal();
    game;
    stepData;
    graphic;
    questions = [];
    selectedAnswers = [];
    graphic;
    button;

    constructor(game, stepData) {
        super(game);
        this.stepData = stepData;
    }

    start() {
        this.questions = new QuestionFactory(this.game, this.stepData.questions);
        this.button = new Button(
            this.game, 
            this.game.world.width - 100 * this.game.SCALE, 
            this.game.world.height - 50 * this.game.SCALE, 
            'continuer');
        this.dataButton = new Button(
            this.game, 
            this.game.world.width - 100 * this.game.SCALE, 
            this.game.world.centerY, 
            'doc');
        // this.game.layer.zDepth2.addChild(this.dataButton.sprite);
        this.dataButton.sprite.events.onInputDown.add(this.createDocument, this);
        this.initQuestions();
    }

    createDocument(){
        // Remove controls
        this.questions.forEach((question) => {
            question.removeControls();
        });
        this.button.sprite.inputEnabled = false;
        // this.dataButton.changeSprite('continuer');
        // Background
        this.graphics = this.game.add.graphics(0, 0);
        this.game.layer.zDepth1.addChild(this.graphics);
        this.graphics.lineStyle(0, "balck", 0);
        this.graphics.beginFill("black", 0.6);
        this.graphics.drawRect(0, 0, this.game.world.width, this.game.world.height);
        // this.dataButton.sprite.events.onInputDown.add(this.removeDocument, this);
        //Background controls
        this.graphics.inputEnabled = true;
        this.graphics.input.useHandCursor = true;
        this.graphics.events.onInputDown.add(this.removeDocument, this);
        // Document
        if (this.stepData.document == "un_cas_decole.mp4") {
            // Video
            this.game.iframe.setState({
                visible:true,
                url:'https://www.youtube.com/embed/IQIPXJvX9gY?rel=0&autoplay=1&controls=0&showinfo=0'
            });
        } else if (this.stepData.document == "bande_son.wav") {
            // Sound
            this.game.iframe.setState({
                visible:true,
                url:'https://www.youtube.com/embed/Q0q9a5QS6WQ?rel=0&autoplay=1&controls=0&showinfo=0'
            });
        } else {
            this.document = new Document(this.game, this.game.world.centerX, this.game.world.centerY, 'compte_rendu');
        }

        this.dataButton.sprite.events.onInputDown.removeAll();
        
    }

    removeDocument(){
        console.log("Remove");
        if (this.stepData.document == "un_cas_decole.mp4" || this.stepData.document == "bande_son.wav") {
            this.game.iframe.setState({ visible:false });
        } else {
            this.document.destroy();
        }
        this.graphics.destroy();
        this.dataButton.sprite.events.onInputDown.add(this.createDocument, this);
        // Add controls
        this.questions.forEach((question) => {
            question.addControls();
        });
        this.button.sprite.inputEnabled = true;
    }

    initQuestions(){
        this.questions.forEach((question) => {
            question.answers.forEach((answer) => {
                answer.events.onInputDown.add(function(){
                    question.selectAnswer(answer);
                }, this);
            });
        });

        this.button.sprite.events.onInputDown.add(function(){

            let count = 0;
            this.questions.forEach((question) => {
                question.checkAnswer();
                if (question.isCompleted) {
                    count++;
                    if (count >= this.questions.children.length) {
                        this.finishStep();
                    }
                }
            });
        }, this);
    }

    destroyElements() {
        this.questions.forEach((question) => {
            question.destroyTexts();
        });
        this.questions = null;
        this.button.destroy();
    }

    finishStep() {
        this.destroyElements();
        this.finish.dispatch();
    }
}