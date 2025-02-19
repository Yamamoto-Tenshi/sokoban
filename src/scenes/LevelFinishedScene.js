import Phaser from "phaser";
import CustomButton from "../components/button";
import levelManager from "../util/levelManager";

export default class LevelFinishedScene extends Phaser.Scene {
  constructor() {
    super("level-finished");
  }
  
  create(data = {steps: 0, currentLevel: 0}) {
    const {width, height} = this.scale;
    
    this.currentLevel = data.currentLevel;
    this.nextLevel = data.currentLevel+1;
    
    const bg = this.add.rectangle(width / 2, height / 2, width - 75, height - 75, 0x524322);
    const border = this.add.graphics();
    border.lineStyle(5, 0xe2d090);
    border.strokeRect(37, 37, width - 75, height -75);
    
    this.add.text(width * 0.5, height * 0.4, `Level ${this.currentLevel} Finished`, 
                  {fontSize: "40px", fontFamily: "Segoe UI", shadow: {fill: true, blur: 5}})
      .setOrigin(0.5, 0);
    
    this.add.text(width * 0.5, height * 0.5, `Steps: ${data.steps}`, 
                  {fontSize: "24px", fontFamily: "Segoe UI", shadow: {fill: true, blur: 5}})
      .setOrigin(0.5, 0);
    
    const retryButton = new CustomButton(this, 
      250, height * 0.7, 
      200, 60, 
      "Retry", 
      {}, 
      this.retry.bind(this)
    );
    
    if (this.nextLevel <= levelManager.getLevelsCount()) {
      const nextLevelButton = new CustomButton(this, 
        width - 250, height * 0.7, 
        200, 60, 
        "Next", 
        {}, 
        this.playNextLevel.bind(this)
      );
    }
    
  }
  
  playNextLevel() {
    this.scene.stop("level-finished");
    this.scene.start("game", {currentLevel: this.nextLevel});
  }
  
  retry() {
    this.scene.stop("level-finished");
    this.scene.start("game", {currentLevel: this.currentLevel});
  }
}