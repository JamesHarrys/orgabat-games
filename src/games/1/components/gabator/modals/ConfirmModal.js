"use strict";
import Type from 'system/utils/Type';
import Modal from 'system/phaser/Modal';
import GameModal from 'system/phaser/GameModal';


/** Gabator Help Modal */
export default class HelpModal extends Modal {

    /**
     * Constructor for a new modal
     * @param data
     * @param manager
     * @param game
     */
    constructor(data, manager, game) {
        super(Type.deepMerge(HelpModal.pattern, data), manager, game);
        this.x = game.canvas.width - this.items.bg.width - 10;
        this.y = game.canvas.height - this.items.bg.height - 10;
    }
    set title(title) {
        this.items.title.text = title;
    }

    set description(title) {
        this.items.description.text = title;
    }
    set fixed(fixed) {
        this.fixed = fixed;
    }

    static get pattern() {
        return {
            type: "group",
            items: {
                bg: {
                    type: "sprite",
                    key: "gabator_confirm_modal"
                },
                title: {
                    type: "text",
                    x: 18,
                    y: 25,
                    text: "{title}",
                    style: {
                        fill: "#5F4D21",
                        fontFamily: "Arial",
                        fontSize: 18,
                        wordWrap: true,
                        wordWrapWidth: 300
                    }
                },
                description: {
                    type: "text",
                    x: 18,
                    y: 60,
                    text: "{content}",
                    style: {
                        fill: "#5F4D21",
                        fontFamily: "Arial",
                        fontSize: 12,
                        wordWrap: true,
                        wordWrapWidth: 300
                    }
                },
                close: {
                    type: "button",
                    key: "bouton_close",
                    x: 298,
                    y: 14,
                    props: { scale: 0.7 }
                },
                buttons: {
                    type: "group",
                    x: 120,
                    y: 125,
                    items: {
                        yes: {
                            type: "text",
                            text: "OUI",
                            style: {
                                fill: "#5F4D21",
                                fontFamily: "Arial",
                                fontSize: 12
                            },
                            props: { inputEnabled: true }
                        },
                        no: {
                            type: "text",
                            x: 70,
                            text: "NON",
                            style: {
                                fill: "#5F4D21",
                                fontFamily: "Arial",
                                fontSize: 12
                            },
                            props: { inputEnabled: true }
                        }
                    }
                }
            }
        }
    }
};