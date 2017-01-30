"use strict";
import Type from 'system/utils/Type';
import Modal from 'system/phaser/Modal';
import GameModal from 'system/phaser/GameModal';


/** Description Tooltip Modal */
export default class DefaultModal extends Modal {

    /**
     * Constructor for a new modal
     * @param data
     * @param manager
     * @param game
     */
    constructor(data, manager, game) {
        super(Type.deepMerge(DefaultModal.pattern, data), manager, game);
    }

    static get pattern() {
        return {
            type: "group",
            items: {
                bg: {
                    type: "sprite",
                    key: "big_modal"
                },
                title: {
                    type: "text",
                    x: 20,
                    y: 25,
                    text: "Informations",
                    style: {
                        fill: "#5F4D21",
                        fontFamily: "Arial",
                        fontSize: 28
                    }
                },
                description: {
                    type: "text",
                    x: 20,
                    y: 85,
                    text: "Bienvenue sur le chantier.\n\n" +
                    "Vous avez à disposition des ressources et des véhicules, choisissez le bon moyen de transport " +
                    "(celui qui vous fera gagner du temps) pour déplacer du liant dans le dépôt en bas.\n\n" +
                    "Utilisez la croix directionnelle et votre souris pour déplacer le personnage ou le véhicule et " +
                    "survoler les objets pour voir de quoi il s'agit.",
                    style: {
                        fill: "#5F4D21",
                        fontFamily: "Arial",
                        fontSize: 14,
                        wordWrap: true,
                        wordWrapWidth: 450 - 40 //sprite.width - margin
                    }
                },
                close: {
                    type: "group",
                    x: 360,
                    y: 320,
                    items: {
                        iconA: {
                            type: "sprite",
                            key: "bouton_a",
                            x: -36,
                            y: -7,
                            props: { scale: 0.53, inputEnabled: true }
                        },
                        textA: {
                            type : "text",
                            text: "CONTINUER",
                            style: {
                                fill: "#5F4D21",
                                fontFamily: "Arial",
                                fontSize: 12
                            },
                            props: { inputEnabled: true }
                        }
                    },
                }
            }
        }
    }
};