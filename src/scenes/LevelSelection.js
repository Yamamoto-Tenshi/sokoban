import Phaser from "phaser";
import CustomButton from "../components/button";
import levelManager from "../util/levelManager";

export default class LevelSelection extends Phaser.Scene {
  constructor() {
    super("level-selection");

    this.levelPerPage = 9;
    this.currentIndex = 0;
    this.currentPage = 1;
    this.levelsCount = levelManager.getLevelsCount();
  }

  init() {
    this.levelPerPage = 9;
    this.currentIndex = 0;
    this.currentPage = 1;
    this.levelsCount = levelManager.getLevelsCount();
  }

  create() {
    const {width, height} = this.scale;
    
    const bg = this.add.rectangle(width / 2, height / 2, width - 75, height - 75, 0xfffce6);
    const border = this.add.graphics();
    border.lineStyle(5, 0xb59e66);
    border.strokeRect(37, 37, width - 75, height -75);
    
    this.add.text(width * 0.5, 60, "Select a Level", 
                  {fontSize: "40px", fontFamily: "Segoe UI", color: "#000000", fontStyle: "bold"})
      .setOrigin(0.5, 0);
    
    
    this.levelButtons = this.add.group({classType: Phaser.GameObjects.Text});
    const buttonsToRender = this.levelsCount < 9 ? this.levelsCount : this.levelPerPage;
    
    for (let i = 1; i <= buttonsToRender; i++) {
      
      const txt = this.levelButtons.create(0, 0, i, 
        {
          color: "#000000", 
          fontSize: "48px",
          fontFamily: "Segoe UI",
          fontStyle: "bold",
          backgroundColor: "#ececcd",
          padding: {top: 2, right: 10, bottom: 2, left: 10}
        }
      );
      
      txt.setData("level", i);
      
      txt.setInteractive({useHandCursor: true})
        .once("pointerup", () => {
          let level = txt.getData("level");
          this.startLevel(level);
        }, this);
    }
    
    this.pageText = this.add.text(width / 2, height - 160, 
      `${this.currentPage} / ${Math.ceil(this.levelsCount / this.levelPerPage)}`, 
      {fontSize: "24px", fontFamily: "Segoe UI", color: "#000000"}
    ).setOrigin(0.5)
    
    this.previousButton = this.add.sprite(205, height - 160, "arrow-button", 1).setScale(0.75);
    
    this.nextButton = this.add.sprite(width - 205, height - 160, "arrow-button", 1).setScale(0.75);
    this.nextButton.flipX = true;
    
    this.previousButton.setInteractive({useHandCursor: true})
      .on("pointerup", this.previousPage, this);
    
    this.nextButton.setInteractive({useHandCursor: true})
      .on("pointerup", this.nextPage, this);
    
    Phaser.Actions.GridAlign(this.levelButtons.getChildren(), {
      width: 3,
      height: 3,
      cellWidth: 100,
      cellHeight: 100,
      position: Phaser.Display.Align.CENTER,
      x: (width / 2) - ((100 * 3) / 3),
      y: 155
    });
    
    const backButton = new CustomButton(this, 
      width / 2, height - 80, 
      150, 45, 
      "Go Back", 
      {fontSize: "24px"}, 
      this.goBack.bind(this)
    );
  }

  renderLevelButtons() {
    this.levelButtons.children.each(button => {
      button.visible = false;
    });
    
    let buttonIndex = 0;
    let levelsToLoad = (this.currentPage * this.levelPerPage) > this.levelsCount ? 
        this.levelsCount : this.currentPage * this.levelPerPage;
    
    for (let i = this.currentIndex; i < levelsToLoad; i++) {
      const button = this.levelButtons.children.entries[buttonIndex];
      button.visible = true;  
      button.text = i+1;
      button.setData("level", i+1);
      buttonIndex++;
    }
    
    this.pageText.text = `${this.currentPage} / ${Math.ceil(this.levelsCount / this.levelPerPage)}`;
  }

  nextPage() {
    if (this.currentPage >= Math.ceil(this.levelsCount / this.levelPerPage)) return;
    this.currentIndex += this.levelPerPage;
    this.currentPage++;
    this.renderLevelButtons();
    this.toggleArrowButtons();
  }

  previousPage() {
    if (this.currentPage === 1) return;
    this.currentIndex -= this.levelPerPage;
    this.currentPage--;
    this.renderLevelButtons();
    this.toggleArrowButtons();
  }

  toggleArrowButtons() {
    if (this.currentPage >= Math.ceil(this.levelsCount / this.levelPerPage)) {
      this.nextButton.setFrame(1);
    }
    else {
      this.nextButton.setFrame(0)
    }
    
    if (this.currentPage === 1) {
      this.previousButton.setFrame(1);
    }
    else {
      this.previousButton.setFrame(0);
    }
  }

  startLevel(level) {
    if (level > this.levelsCount) return;
    
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      this.scene.stop("level-selection");
      this.scene.start("game", {currentLevel: level});
    });
    
  }

  goBack() {
    this.scene.stop("level-selection");
    this.scene.start("start-screen");
  }
}