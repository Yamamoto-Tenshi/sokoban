import Phaser from "phaser";
import * as EVENT_NAMES from "../consts/events";
import EventEmitter from "../util/eventEmitter";

export default class HUD extends Phaser.Scene {
  constructor() {
    super("hud");
    
    this.stepsText = "";
  }
  
  create() {
    const {width, height} = this.scale;
    
    this.stepsText = this.add.text(15, 15, `Steps: 0`);
    
    const retryButton = this.add.text(width - 15, 15, "Reset", {fontFamily: "Segoe UI"})
      .setOrigin(1, 0)
      .setInteractive({useHandCursor: true})
      .once("pointerup", this.resetLevel.bind(this));
    
    const homeButton = this.add.text(width - 75, 15, "Start Screen", {fontFamily: "Segoe UI"})
      .setOrigin(1, 0)
      .setInteractive({useHandCursor: true})
      .once("pointerup", this.goToStartScreen.bind(this));
    
    EventEmitter.on(EVENT_NAMES.STEPS_UPDATE, this.updateStepsDisplay, this);
    
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventEmitter.off(EVENT_NAMES.STEPS_UPDATE, this.updateStepsDisplay, this);
    });
  }
  
  updateStepsDisplay(data) {
    this.stepsText.text = `Steps: ${data.steps}`;
  }
  
  resetLevel() {
    EventEmitter.emit(EVENT_NAMES.RESET_LEVEL);
  }
  
  goToStartScreen() {
    EventEmitter.emit(EVENT_NAMES.TO_START_SCREEN);
  }
}