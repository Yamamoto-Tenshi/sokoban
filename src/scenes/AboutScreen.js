import Phaser from "phaser";
import CustomButton from "../components/button";

export default class AboutScreen extends Phaser.Scene {
  constructor() {
    super("about-screen");
  }
  
  create() {
    const {width, height} = this.scale;
    
    const bg = this.add.rectangle(width / 2, height / 2, width - 75, height - 75, 0xfffce6);
    const border = this.add.graphics();
    border.lineStyle(5, 0xb59e66);
    border.strokeRect(37, 37, width - 75, height - 75);
    
    const text = `Move the colored boxes to their designated spots. Watch out that you don’t get a box stuck 
in a corner or behind a wall!
Use the arrow keys to move the character.`;
    
    const aboutText = this.add.text(75, 125, text, 
      {fontSize: "24px", color: "#000000", fontFamily: "Segoe UI", fontStyle: "bold", lineSpacing: 16}
    );
    
    aboutText.setWordWrapWidth(width - 100);
    
    const backButton = new CustomButton(this, 
      125, height - 75, 
      150, 45, 
      "Go Back", 
      {fontSize: "24px"}, 
      this.goBack.bind(this)
    );
  }
  
  goBack() {
    this.scene.stop("about-screen");
    this.scene.start("start-screen");
  }
}