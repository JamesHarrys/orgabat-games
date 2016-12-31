"use strict";
var Game = Game || {};
Game.Object = Game.Object || {};

/**
 * Vehicle Modal (called by the vehicle gameObject)
 * @type {VehicleModal}
 */
Game.Object.VehicleModal = class Vehicle extends MyPhaser.Modal {

    /**
     * Constructor for a new vehicle modal
     * @param properties
     * @param vehicleObj
     * @param game
     */
    constructor(properties, vehicleObj, game) {
        super(properties, vehicleObj, game);
        //pattern - type - name
        this.createWithPattern('big_infobulle', 'infobox', 'infoBox');
        this.createWithPattern('left_robot_infobulle', 'fixed', 'infoBox');

        this.infobox = new MyPhaser.Modals.DescriptionInfobox({items: {
            title: { text: this.properties.name },
            description: { text: this.properties.description + '\n'
            + "Sa taille est de " + this.properties.size }
        }}, MyPhaser.XmodalManager, this.game);

        this.smallFeedback = new MyPhaser.Modals.SmallFeedback({}, MyPhaser.XmodalManager, this.game);
    }

    /** ------------------------------------------
     * Modals
     * ------------------------------------------ */

    infoBox(params) {
        try {
            Utils.Type.isBoolean(params.visible, true);
            !Utils.Type.isExist(params.isPlayerCollide) || Utils.Type.isBoolean(params.isPlayerCollide, true);
            !Utils.Type.isExist(params.fixed) || Utils.Type.isBoolean(params.fixed, true);
        } catch (e) {
            console.error(e.name + ": " + e.message);
        }

        if(params.visible) {
            this.infobox.items.useButton.visible = params.isPlayerCollide;
            let dir = this.outerRightToSpriteIsPossible(this.obj.sprite, this.game.modalScale(10), this.infobox.items.bg) ? 'right' : 'left';
            this.infobox.y =  this.getInnerTopToSprite(this.obj.sprite) + this.game.modalScale(10);
            if(dir === 'right') {
                this.infobox.x = this.getOuterRightToSprite(this.obj.sprite, 10);
                new MyPhaser.Modals.DescriptionInfoboxRight(this.infobox);
            } else {
                this.infobox.x = this.getOuterLeftToSprite(this.obj.sprite, this.infobox.items.bg, 10);
                new MyPhaser.Modals.DescriptionInfoboxLeft(this.infobox);
            }
        }
        this.infobox.toggle(params.visible, {fixed: Utils.Type.isExist(params.fixed) ? params.fixed : false});
    }
    
    fixedDropInfoBox() {
        this.smallFeedback.x = this.game.modalScale(10);
        this.smallFeedback.y = this.game.canvas.height - this.game.modalScale(60);
        this.smallFeedback.toggle(true, {fixed: true});

        return;
        let modalName = this.modals.fixed['infoBox'].modal;
        Game.modals.update({type: "x", value: 10 * Game.Manager.ModalScale}, modalName, -1);
        Game.modals.update({type: "y", value: this.game.canvas.height - 60 * Game.Manager.ModalScale}, modalName, -1);
        Game.modals.update({type: "text", value: "pour ne plus utiliser."}, modalName, 1);
        Game.modals.show(modalName, true);
    }

    static droppedInfoBox() {
        let modalName = "robot_infobulle";
        Game.modals.update({type: "image", value: "info_infobulle"}, modalName, 0);
        Game.modals.update({type: "x", value: Game.game.canvas.width - 310 * Game.Manager.ModalScale}, modalName, -1);
        Game.modals.update({type: "y", value: Game.game.canvas.height - 90 * Game.Manager.ModalScale}, modalName, -1);
        Game.modals.update({type: "text", value: "Vous venez de quitter le véhicule."}, modalName, 1);
        Game.modals.show(modalName);
        Game.modals.count(2, function() { Game.modals.hide(modalName); });
    }

    static cantUseInfoBox() {
        let modalName = "robot_infobulle";
        Game.modals.update({type: "image", value: "alert_infobulle"}, modalName, 0);
        Game.modals.update({type: "x", value: Game.game.canvas.width - 310 * Game.Manager.ModalScale}, modalName, -1);
        Game.modals.update({type: "y", value: Game.game.canvas.height - 90 * Game.Manager.ModalScale}, modalName, -1);
        Game.modals.update({type: "text", value: "Quittez l'outil actuel avant."}, modalName, 1);
        Game.modals.show(modalName);
        Game.modals.count(2, function () {
            Game.modals.hide(modalName);
        });
    }

    static containerIsFull() {
        let modalName = "robot_infobulle";
        Game.modals.update({type: "image", value: "alert_infobulle"}, modalName, 0);
        Game.modals.update({type: "x", value: Game.game.canvas.width - 310 * Game.Manager.ModalScale}, modalName, -1);
        Game.modals.update({type: "y", value: Game.game.canvas.height - 90 * Game.Manager.ModalScale}, modalName, -1);
        Game.modals.update({type: "text", value: "Le vehicule est plein !"}, modalName, 1);
        Game.modals.show(modalName);
        Game.modals.count(2, function () {
            Game.modals.hide(modalName);
        });
    }

    static beCareful(str) {
        let text = str !== undefined ? `${str} ` : '';
        let modalName = "robot_infobulle";
        Game.modals.update({type: "image", value: "alert_infobulle"}, modalName, 0);
        Game.modals.update({type: "x", value: Game.game.canvas.width - 310 * Game.Manager.ModalScale}, modalName, -1);
        Game.modals.update({type: "y", value: Game.game.canvas.height - 90 * Game.Manager.ModalScale}, modalName, -1);
        Game.modals.update({type: "text", value: `Attention ${text}!`}, modalName, 1);
        Game.modals.show(modalName);
        Game.modals.count(2, function () {
            Game.modals.hide(modalName);
        });
    }


};