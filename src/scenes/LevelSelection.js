import Phaser from "phaser";
import createButton from "../util/htmlButton";
import levelManager from "../util/levelManager";

export default class LevelSelection extends Phaser.Scene {
  constructor() {
    super("level-selection");

    this.currentIndex = 0;
    this.currentPage = 1;
    this.levelsCount = levelManager.getLevelsCount();
    this.levelPerPage = this.levelsCount < 9 ? this.levelsCount : 9;
  }

  init() {
    
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
    
    const levelButtonsWrapper = document.createElement("div");

    this.levelButtons = document.createElement("div");
    this.levelButtons.classList.add("level-buttons");

    levelButtonsWrapper.appendChild(this.levelButtons);
      
    for (let i = 0; i < this.levelPerPage; i++) {
      const levelButton = createButton(i+1, ["level-button"]);
      levelButton.setAttribute("data-level", i+1);
      levelButton.textContent = i+1;
      this.levelButtons.appendChild(levelButton);
    }
      
    this.add.dom(width / 2, 250, this.levelButtons)
      .addListener("click")
      .on("click", e => {
      if (e.target.classList.contains("level-button")) {
        this.startLevel(Number(e.target.getAttribute("data-level")))  
      }
    })

    this.levelButtons.children[0].focus();
    
    this.pageText = this.add.text(width / 2, height - 160, 
      `${this.currentPage} / ${Math.ceil(this.levelsCount / this.levelPerPage)}`, 
      {fontSize: "24px", fontFamily: "Segoe UI", color: "#000000"}
    ).setOrigin(0.5)
    
    this.previousButton = createButton("", ["button--icon", "prev", "button--disabled"]);
    
    this.add.dom(205, height - 160, this.previousButton)
      .addListener("click")
      .on("click", this.previousPage.bind(this));
    
    this.nextButton = createButton("", ["button--icon", "next"]);

    if (this.levelsCount < 10) this.nextButton.classList.add("button--disabled");
    
    this.add.dom(width - 205, height - 160, this.nextButton)
      .addListener("click")
      .on("click", this.nextPage.bind(this));
    
    const backButton = createButton("go back", ["button--primary"]);
    
    this.add.dom((width / 2), height - 80, backButton)
      .addListener("click")
      .once("click", this.goBack.bind(this));
  }

  renderLevelButtons() {

    let buttonIndex = 0;
    let levelsToLoad = (this.currentPage * this.levelPerPage) > this.levelsCount ? 
        this.levelsCount : this.currentPage * this.levelPerPage;
    
    for (let i = this.currentIndex; i < levelsToLoad; i++) {
      const button = this.levelButtons.children[buttonIndex]; 
      button.textContent = `${i+1}`;
      button.setAttribute("level", i+1);
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
      this.nextButton.classList.add("button--disabled");
    }
    else {
      this.nextButton.classList.remove("button--disabled");
    }
    
    if (this.currentPage === 1) {
      this.previousButton.classList.add("button--disabled");
    }
    else {
      this.previousButton.classList.remove("button--disabled");
    }
  }

  startLevel(level) {
    if (level > this.levelsCount) return;
    
    this.scene.stop("level-selection");
    this.scene.start("game", {currentLevel: level});
  }

  goBack() {
    this.scene.stop("level-selection");
    this.scene.start("start-screen");
  }
}