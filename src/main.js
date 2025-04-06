import Phaser from "phaser"

import Preloader from "./scenes/Preloader";
import StartScreen from "./scenes/StartScreen";
import LevelSelection from "./scenes/LevelSelection"
import AboutScreen from "./scenes/AboutScreen";
import Game from "./scenes/Game";
import HUD from "./scenes/HUD";
import LevelFinishedScene from "./scenes/LevelFinishedScene";

const config = {
	type: Phaser.AUTO,
	parent: "game",
	dom: {
		createContainer: true
	},
	scale: {
		mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 730,
		height: 625,
	},
	backgroundColor: "#31302d",
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [Preloader, StartScreen, LevelSelection, AboutScreen, Game, HUD, LevelFinishedScene],
}

export default new Phaser.Game(config)
