import Phaser from "phaser";
import createButton from "../util/htmlButton";


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
      {fontSize: "24px", color: "#000000", fontFamily: "Segoe UI", fontStyle: "bold"}
    );
    
    aboutText.setWordWrapWidth(width - 100);
    
    const backButton = createButton("go back", ["button--primary"]);
    
    this.add.dom(125, height - 75, backButton)
      .addListener("click")
      .once("click", this.goBack.bind(this));

    backButton.focus();
  }
  
  goBack() {
    this.scene.stop("about-screen");
    this.scene.start("start-screen");
  }
}