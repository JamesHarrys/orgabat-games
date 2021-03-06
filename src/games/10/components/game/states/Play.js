/** State when we start the game */
"use strict";
import Phaser, {State, Easing} from 'phaser';
import PhaserManager from 'system/phaser/utils/PhaserManager';
import Canvas from "system/phaser/utils/PhaserManager";

import StartInfoModal from '../modals/StartInfoModal';
import EndInfoModal from '../modals/EndInfoModal';
import {DefaultManager, Stack} from 'system/phaser/Modal';

import QuestManager, {DomQuestList} from 'system/phaser/utils/Quest';
import Config from "../config/data";

import Step from "../objects/Step/Step";

import CommunicationQuest from "../quests/CommunicationQuest";

export default class Play extends State {

    /** Constructor for a new play state */
    constructor() {
        super();
    }

    /**
     * Called when the state must be created
     * init all the game (scale, physics, gameobjects...)
     */
    create() {
        this.game.controlsEnabled = false;
        this.game.stage.backgroundColor = '#FFFFFF';

        this.tileSprite = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, "atlas");
        this.tileSprite.tileScale.set(0.5);
        this.tileSprite.alpha = 0.5;

        this.initUI();
        PhaserManager.ready('game', 'play');

        this.start();
    }

    /** Called by create to add UI Layers */
    initUI() {
        this.game.layer = {
            zDepth0: this.add.group(),
            zDepth1: this.add.group(),
            zDepth2: this.add.group(),
            zDepth3: this.add.group(),
            zDepthOverAll: this.add.group()
        };
    }

    /** Called by Phaser to render */
    render() {
        /*if(Config.developer.debug) {
            this.game.time.advancedTiming = true; //SEE FPS
            this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
        }*/
    }

    /**
     * Called after create, to start the state
     * this.game Rules
     */
    start() {
        this.game.gameProcess = new GameProcess(this);
        this.game.gameProcess.init();
    }

};

class Engine {

    finish = new Phaser.Signal();

    step;
    stepNumber = 0;

    player;
    responseGroup;

    constructor(gameProcess) {
        this.gameProcess = gameProcess;

        this.gameProcess.quests.add(new CommunicationQuest(this.gameProcess.game));
        this.gameProcess.questsCleaned.addOnce(function(){
            this.finish.dispatch();
        }, this);
    }

    start() {
        if (this.stepNumber < Config.qcm.length) {
            this.step = new Step(this.gameProcess.game, Config.qcm[this.stepNumber]);
            this.step.start();
            this.stepNumber++;
            this.step.finish.addOnce(this.start, this);
        } else {
            this.gameProcess.quests._quests.communication_quest.done();
            this.finish.dispatch();
        }
    }

}

class GameProcess {

    questsCleaned = new Phaser.Signal();

    constructor(playState) {
        this.play = playState;
        this.game = playState.game;
        this.game.camera.y = this.game.camera.height;

        //On prépare les quêtes
        this.quests = new QuestManager(this.game);
        new DomQuestList(this.quests);

        // Classes à utiliser
        this.engine = new Engine(this);
    }

    init() {
        //On affiche la modale d'information du début
        this.startInfoModal = new StartInfoModal({}, DefaultManager, this.game);
        this.game.keys.addKey(Phaser.Keyboard.ENTER).onDown.addOnce(this._onStartInfoClose, this);
        this.game.keys.addKey(Phaser.Keyboard.A).onDown.addOnce(this._onStartInfoClose, this);
        this.startInfoModal.items.close.items.iconA.events.onInputDown.add(this._onStartInfoClose, this);
        this.startInfoModal.items.close.items.textA.events.onInputDown.add(this._onStartInfoClose, this);
        this.startInfoModal.onDeleted.addOnce(() => {
            delete this.startInfoModal
        }, this);
        this.startInfoModal.toggle(true);
    }

    _onStartInfoClose() {
        //On active Gabator
        if (PhaserManager.get('gabator').state.current == "play") {
            PhaserManager.get('gabator').state.getCurrentState().start();
            // Canvas.get('gabator').modal.showHelp(
            //     "..."
            // );
        }

        this.game.keys.addKey(Phaser.Keyboard.ENTER).onDown.remove(this._onStartInfoClose, this);
        this.game.keys.addKey(Phaser.Keyboard.A).onDown.remove(this._onStartInfoClose, this);

        this._initParts();

        //Evenements de progression du jeu ici (voir jeu 1 ou jeu 2)

        //Ferme la modale et active les controls
        this.startInfoModal.toggle(false, {});
        this.game.controlsEnabled = true;

        this._timeStart = this.game.time.now;
    }

    _initParts() {
        //When ready, lets init parts.
        this.engine.finish.addOnce(this._onFinish, this);
        this.engine.start();
    }

    _onFinish() {
        this.game.controlsEnabled = false;
        this._timeEnd = this.game.time.now;

        let healthLevel = Math.abs(PhaserManager.get('gabator').stats.state.health),
            healthLevelMax = PhaserManager.get('gabator').stats.healthMax,

            organizationLevel = Math.abs(PhaserManager.get('gabator').stats.state.organization),
            organizationLevelMax = PhaserManager.get('gabator').stats.organizationMax,

            enterpriseLevel = Math.abs(PhaserManager.get('gabator').stats.state.enterprise),
            enterpriseLevelMax = PhaserManager.get('gabator').stats.enterpriseMax,

            maxLevel = healthLevel + organizationLevel + enterpriseLevel,
            max = healthLevelMax + organizationLevelMax + enterpriseLevelMax;

        //On affiche la modale de fin
        const endInfoModal = new EndInfoModal({}, DefaultManager, this.game, {
            healthMax: healthLevelMax,
            organizationMax: organizationLevelMax,
            enterpriseMax: enterpriseLevelMax
        });

        endInfoModal.onExit.addOnce(() => window.parent.closeGameModal(), this);
        endInfoModal.onReplay.addOnce(() => window.location.reload(), this);

        // Stars:
        endInfoModal.toggle(true, {}, {
            star1: maxLevel >= 3,
            star2: maxLevel >= 9,
            star3: maxLevel == 15
        }, {
            health: healthLevel,
            organization: organizationLevel,
            enterprise: enterpriseLevel,
        });

        //Et on envoie le score à l'API
        window.api.sendScore({
            exerciseId: game_id,
            time: Math.round((this._timeEnd - this._timeStart) / 1000),
            health: healthLevel,
            organization: organizationLevel,
            business: enterpriseLevel
        }, () => {
        });
    }
}