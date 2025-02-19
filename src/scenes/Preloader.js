import Phaser from "phaser";
import * as SIZES from "../consts/sizes";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader")
  }

  preload() {
    this.load.spritesheet("tiles", "assets/kanamiSprite2.png", {
      frameWidth: SIZES.TILE_SIZE, frameHeight: SIZES.TILE_SIZE, startFrame: 0
    });

    this.load.spritesheet("button", "assets/button-sprite.png", {
      frameWidth: 204, frameHeight: 64
    });

    this.load.spritesheet("arrow-button", "assets/arrowButton.png", {
      frameWidth: 70, frameHeight: 70
    });

    this.load.image("button-border", "assets/buttonBorder.png");

    this.load.image("title", "assets/title.png");

    this.load.image("start-bg", "assets/startBG.png");

    this.load.image("shadow", "assets/player-shadow.png");
  }

  create() {
    this.anims.create({
      key: "idle",
      frames: [{key: "tiles", frame: 7}],
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: "left-walk",
      frames: this.anims.generateFrameNumbers("tiles", {start: 8, end: 13}),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: "right-walk",
      frames: this.anims.generateFrameNumbers("tiles", {start: 22, end: 27}),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: "up-walk",
      frames: this.anims.generateFrameNumbers("tiles", {start: 15, end: 20}),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: "down-walk",
      frames: this.anims.generateFrameNumbers("tiles", {start: 1, end: 6}),
      frameRate: 10,
      repeat: -1
    });

    this.scene.start("start-screen", {currentLevel: 1});
  }
}