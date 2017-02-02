"use strict";
import Config from '../../config/data';
import GameSprite from 'system/phaser/GameSprite';

/** Vehicle Sprite (called by the vehicle gameObject) */
export default class VehicleSprite extends GameSprite {

    /**
     * Constructor for a new vehicle sprite
     * @param game
     * @param x
     * @param y
     * @param name
     * @param vehicleObj
     */
    constructor(game, x, y, name, vehicleObj) {
        super(game, x, y, name, vehicleObj);
        this.setPhysics();
    }

    /** Initialize physics */
    setPhysics() {
        this.game.physics.p2.enable(this, Config.developer.debug);
        this.body.fixedRotation = true;
        this.body.setCollisionGroup(this.game.CollisionGroup.vehicle);
        this.body.collides(this.game.CollisionGroup.vehicle, this.onCollision, this);
        this.body.collides(this.game.CollisionGroup.player, this.onCollision, this);
        this.body.collides(this.game.CollisionGroup.tool, this.onCollision, this);
        this.body.collides(this.game.CollisionGroup.material, this.onCollision, this);
        this.body.collides(this.game.CollisionGroup.layer, this.wallCollision, this);
        this.body.static = true;
        this.body.damping = 0;
    }
};