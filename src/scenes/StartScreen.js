import Phaser from "phaser";
import CustomButton from "../components/button";

export default class StartScreen extends Phaser.Scene {
  constructor() {
    super("start-screen");
  }

  create(data) {
    const {width, height} = this.scale;
    
    const homeImage = this.add.image(width / 2, height / 2, "start-bg");
    homeImage.setDisplaySize(730, 625);
    this.add.image(width / 1.7, height / 3.25, "title");
    
    const bg = this.add.rectangle(width / 2, height - 100, width - 75, 120, 0x524322);
    const border = this.add.graphics();
    border.lineStyle(5, 0xe2d090);
    border.strokeRect(37, height - 160, width - 75, 120);
    
    const playButton = new CustomButton(this, 
      240, height - 100, 
      200, 60, 
      "Play", 
      {}, 
      this.play.bind(this)
    );
    
    const aboutButton = new CustomButton(this, 
      width - 240, height - 100, 
      200, 60,
      "About", 
      {}, 
      this.about.bind(this)
    );
  }

  play() {
    this.scene.stop("start-screen");
    this.scene.start("level-selection");
  }

  about() {
    this.scene.stop("start-screen");
    this.scene.start("about-screen");
  }
}