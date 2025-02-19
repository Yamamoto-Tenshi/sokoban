import Phaser from "phaser"

export default class CustomButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, txt, style, callback) {
    super(scene, x, y);
    
    this.style = Object.assign({
      fontSize: "32px",
      fontFamily: "Segoe UI",
      color: "#000000",
      fontStyle: "bold"
    }, style);
    
    this.callback = callback;
    
    this.buttonBorder = scene.add.image(0, 0, "button-border")
      .setOrigin(0.5, 0.5);
    
    this.buttonBorder.visible = false;
    
    this.button = scene.add.sprite(0, 0, "button")
      .setOrigin(0.5, 0.5);
    
    this.button.setDisplaySize(width, height);
    this.buttonBorder.setDisplaySize(width, height);
    
    this.buttonText = scene.add.text(0, 0, txt, this.style)
      .setOrigin(0.5, 0.5);
    
    this.add(this.buttonBorder);
    this.add(this.button);
    this.add(this.buttonText);
    
    this.setSize(this.button.displayWidth, this.button.displayHeight);
    
    this.setInteractive({useHandCursor: true})
      .on("pointerover", this.enterHoverState.bind(this))
      .on("pointerout", this.enterRestState.bind(this))
      .on("pointerdown", this.enterActiveState.bind(this))
      .on("pointerup", this.onPointerUp.bind(this))
    
    scene.add.existing(this);
  }
  
  enterHoverState() {
    this.button.setFrame(1);
    this.buttonBorder.visible = true;
  }
  
  enterRestState() {
    this.button.setFrame(0);
    this.buttonBorder.visible = false;
  }
  
  enterActiveState() {
    
  }
  
  onPointerUp() {
    this.enterHoverState();
    this.callback();
  }
}