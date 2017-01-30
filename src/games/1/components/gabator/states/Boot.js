"use strict";
import {State} from 'phaser';
import PhaserManager from 'system/phaser/utils/PhaserManager';
import MyMath from 'system/utils/Math';

import {DoOnce} from 'system/utils/Utils';
import {StackManager} from 'system/phaser/Modal';
import HelpModal from '../modals/HelpModal';
import ConfirmModal from '../modals/ConfirmModal';

/** State to boot gabator */
export default class Boot extends State {

    init(dom) {
        this.game.stats = dom;
    }

    /** Called when the state must be created */
    create() {
        this.game.baseWidth = 250;
        let sWidth = this.game.width / this.game.baseWidth;
        let sHeight = this.game.height / this.game.baseWidth;
        this.game.SCALE = this.game.width > this.game.height ? sHeight : sWidth;
        this.game.uiScale = (n) => MyMath.scale(this.game.SCALE * 0.9, n);

        PhaserManager.add('gabator', this.game);
        PhaserManager.onReady.add((name, state) => {
            if(name == 'game' && state == 'play') this.initModal()
        }, this);
        this.game.state.start('load');
    }
    initModal() {
        this.game.modal = new Modal();
    }
}

class Modal {
    constructor(){
        this.help = new HelpModal({}, StackManager, PhaserManager.get('game'));
        this.confirm = new ConfirmModal({}, StackManager, PhaserManager.get('game'));
    }

    showHelp(title = "", description = "", cb = ()=>{}) {
        this.helpOnce = this.helpOnce || new DoOnce((args = {}) => {
            this.help.title = args.title;
            this.help.description = args.description;
            this.help.toggle(true, {stack: 'BOTTOM_RIGHT', fixed:true});
            const close = () => {
                this.help.toggle(false, {stack: 'BOTTOM_RIGHT', fixed:true});
                this.helpOnce.done = false;
                args.cb();
                clearTimeout(timeOut);
            };
            const timeOut = setTimeout(close, 7000);
            this.help.items.close.events.onInputDown.addOnce(close, this);
        });
        this.helpOnce.call({title:title, description:description, cb:cb});
    }

    showConfirm(title = "", description = "", cb = ()=>{}) {
        this.confirmOnce = this.confirmOnce || new DoOnce((args = {}) => {
                this.confirm.title = args.title;
                this.confirm.description = args.description;
                this.confirm.toggle(true, {stack: 'BOTTOM_RIGHT', fixed:true});
                const close = (isConfirm = false) => {
                    this.confirm.toggle(false, {stack: 'BOTTOM_RIGHT', fixed:true});
                    this.confirmOnce.done = false;
                    if(isConfirm) args.cb();
                    clearTimeout(timeOut);
                };
                const timeOut = setTimeout(() => close(), 7000);
                this.confirm.items.close.events.onInputDown.addOnce(() => close(), this);
                this.confirm.items.buttons.items.yes.events.onInputDown.addOnce(() => close(true), this);
                this.confirm.items.buttons.items.no.events.onInputDown.addOnce(() => close(), this);
            });
        this.confirmOnce.call({title:title, description:description, cb:cb});
    }
}