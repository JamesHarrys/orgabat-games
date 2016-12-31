"use strict";
var Game = Game || {};
Game.Object = Game.Object || {};

/**
 * Tool Object (include sprite and modals)
 * @type {Tool}
 */
Game.Object.Tool = class Tool extends MyPhaser.Object {

    /**
     * Constructor for a new tool object
     * @param game
     * @param layer
     * @param name
     * @param properties
     * @param x
     * @param y
     */
    constructor(game, layer, name, properties, x, y) {
        super(game, layer, "tool");
        this.toolIsFullEvent = new MyPhaser.Utils.EventHandler();
        this.addSprite(new Game.Object.ToolSprite(this.game, MyPhaser.Utils.Position.getPixelAt(x),
            MyPhaser.Utils.Position.getPixelAt(y), name, this));
        this.addModal(new Game.Object.ToolModal(properties, this, game));
        this.configure(properties);
        this.ready = true;
    }

    /** Config */
    configure(properties) {
        this.properties = properties;
    }
    
    /** Events */
    onVehicleStart(vehicle){
        this.modal.changeVehicleState(vehicle);
    }
    onVehicleStop(){
        this.modal.changeVehicleState(null);
    }

    /** Ressource comportements */
    setRessource(amount, cb) {
        let cbZero = () => { cb(this.sprite.key, 0); };
        let cbAmount = () => { cb(this.sprite.key, amount); };
        if(this.properties.amountMax < this.properties.amount + amount) return cbZero();
        this.properties.amount += amount;
        this.modal.updateAmount(this.properties.amount);
        if(this.properties.amountMax === this.properties.amount) this.toolIsFullEvent.fire();
        return cbAmount();
    }

    /** Add events comportements */
    objectCollision(o) {
        super.objectCollision(o.object);
        switch(this.objectInCollision.obj.type) {
            case "character":
                this.modal.infoBox();
                break;
            default:
                break;
        }
    }
    mouseOver() {
        if(!Game.modals.infoboxAreHided() || this.modal.isShowing('infoBox', 'fixed')) return;
        this.modal.infoBox();
    }
    mouseOut() {
        this.modal.hideInfobox('infoBox');
    }
};

