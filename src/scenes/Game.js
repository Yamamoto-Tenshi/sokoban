import Phaser from "phaser";
import * as EVENT_NAMES from "../consts/events";
import * as SIZES from "../consts/sizes";
import * as BOX_COLORS from "../consts/boxes";
import * as TARGET_COLORS from "../consts/targets";
import * as DIRECTIONS from "../consts/directions";
import PLAYER_IDLE from "../consts/player";
import EventEmitter from "../util/eventEmitter";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
    this.player = null;
    this.boxes = [];
    this.targets = null;
    
    this.targetsCovered = 0;
    this.steps = 0;
    
    this.targetsToCover = 0;
    
    this.isWalking = false;
    
    this.targetMap = {
      [BOX_COLORS.BLUE_BOX]: TARGET_COLORS.BLUE_TARGET,
      [BOX_COLORS.RED_BOX]: TARGET_COLORS.RED_TARGET,
      [BOX_COLORS.GREEN_BOX]: TARGET_COLORS.GREEN_TARGET,
      [BOX_COLORS.BROWN_BOX]: TARGET_COLORS.BROWN_TARGET,
      [BOX_COLORS.YELLOW_BOX]: TARGET_COLORS.YELLOW_TARGET,
      [BOX_COLORS.PURPLE_BOX]: TARGET_COLORS.PURPLE_TARGET
    }
    
    this.levelScale = 1;
  }

  init(data) {
    this.currentLevel = data.currentLevel;
    
    this.targetsCovered = 0;
    this.steps = 0;
    
    this.targetsToCover = 0;
    
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  
  preload() {
    this.load.tilemapTiledJSON("tilemap", `../assets/levels/level${this.currentLevel}.json`);
  }

  create(data) {
    this.scene.run("hud");
    
    this.cameras.main.fadeIn(200, 0, 0, 0);
    
    const {width, height} = this.scale;
    
    this.map = this.make.tilemap({key: "tilemap"});
    
    this.levelScale = 8 / this.map.height;
    
    this.createLevel();
    
    this.shadow = this.add.image(0, 0, "shadow");
    this.shadow.setOrigin(0);
    if (this.levelScale !== 1) this.shadow.setScale(this.levelScale);
    
    this.player = this.createPlayer(this.playerLayer);
    
    
    this.shadow.x = this.player.x;
    this.shadow.y = this.player.y;

    this.boxes = this.createBoxes(this.boxesLayer);
    
    this.targetsToCover = this.targetsLayer.filterTiles((tile) => tile.index > 1).length;
    
    for (let box of this.boxes) {
      let boxOnTarget = this.checkIfBoxMatchesTarget(box);
      if (boxOnTarget) {
        this.targetsCovered += 1;
        this.changeBoxTexture(box, false);
      }
    }
    
    EventEmitter.once(EVENT_NAMES.RESET_LEVEL, this.reset, this);
    EventEmitter.once(EVENT_NAMES.TO_START_SCREEN, this.goToStartScreen, this);
    
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cache.tilemap.remove("tilemap");
      
      EventEmitter.off(EVENT_NAMES.RESET_LEVEL, this.reset, this);
      EventEmitter.off(EVENT_NAMES.TO_START_SCREEN, this.goToStartScreen, this);
    })
  }

  update(time, delta) {
    
    const justLeft = Phaser.Input.Keyboard.JustDown(this.cursors.left);
    const justRight = Phaser.Input.Keyboard.JustDown(this.cursors.right);
    const justUp = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const justDown = Phaser.Input.Keyboard.JustDown(this.cursors.down);

    if (justLeft) {
      this.movePlayer("left");
    }
    else if (justRight) {
      this.movePlayer("right");
    }
    else if (justUp) {
      this.movePlayer("up");
    }
    else if (justDown) {
      this.movePlayer("down");
    }
  }
  
  createLevel() {
    const {width, height} = this.scale;
    
    this.tileset = this.map.addTilesetImage("sokoban", "tiles");
    
    let x = (width / 2) - (this.map.widthInPixels / 2) * this.levelScale;
    
    this.layer = this.map.createLayer("level", this.tileset, x, 55);
    
    this.targetsLayer = this.map.createLayer("targets", this.tileset, x, 55);
    
    this.boxesLayer = this.map.createLayer("boxes", this.tileset, x, 55);
    
    this.playerLayer = this.map.createLayer("player", this.tileset, x, 55);
    
    if (this.levelScale !== 1) {
      for (let layer of this.map.layers) {
        layer.tilemapLayer.scale = this.levelScale;
      }
    }
  }
  
  createPlayer(layer) {
    const player = layer.createFromTiles(8, 0, {key: "tiles", frame: 7}).pop();
    player.setOrigin(0);
    
    if (this.levelScale !== 1) player.setScale(this.levelScale);
    
    const playerData = layer.getTileAtWorldXY(player.x, player.y);
    player.setData("coordinates", {x: playerData.x, y: playerData.y});
    
    return player;
  }
  
  createBoxes(layer) {
    const boxMap = [
      BOX_COLORS.BLUE_BOX,
      BOX_COLORS.RED_BOX,
      BOX_COLORS.GREEN_BOX,
      BOX_COLORS.BROWN_BOX,
      BOX_COLORS.YELLOW_BOX,
      BOX_COLORS.PURPLE_BOX,
      BOX_COLORS.NORMAL_BOX
    ];
    
    return boxMap.reduce((result, box) => {
      const boxes = layer.createFromTiles(box+1, 0, {key: "tiles", frame: box})
        .map(box => {
          const {x, y} = layer.getTileAtWorldXY(box.x, box.y);
          box.setData("coordinates", {x, y});
          
          if (this.levelScale !== 1) box.setScale(this.levelScale);
          
          box.setOrigin(0);
          box.setData("frame", box.frame.name);
          return box;
        });
      
      result.push(...boxes);
      return result;
    }, []);
  }
  
  getCoordinates(coordinates, direction, steps) {
    let newCoordinates = {};
    
    if (direction === DIRECTIONS.LEFT) {
      newCoordinates = {x: coordinates.x - steps, y: coordinates.y}
    }
    else if (direction === DIRECTIONS.RIGHT) {
      newCoordinates = {x: coordinates.x + steps, y: coordinates.y}
    }
    else if (direction === DIRECTIONS.UP) {
      newCoordinates = {x: coordinates.x, y: coordinates.y - steps}
    }
    else if (direction === DIRECTIONS.DOWN) {
      newCoordinates = {x: coordinates.x, y: coordinates.y + steps}
    }
    
    return newCoordinates;
  }
  
  movePlayer(direction) {
    if (this.isWalking) return;
    
    let tileSize = SIZES.TILE_SIZE * this.levelScale;
    
    let box = null;
    let playerAnimation = "";
    let tweenDirection = {};
    
    const playerCoordinates = this.player.getData("coordinates");
    
    //const currentTileIndex = this.layer.getTileAt(this.playerCoordinates.x, this.playerCoordinates.y).index;
    
    this.player.setFrame(PLAYER_IDLE[direction]);
    
    if (direction === DIRECTIONS.LEFT) {
      playerAnimation = "left-walk";
      tweenDirection = {x: `-=${tileSize}`};
    }
    else if (direction === DIRECTIONS.RIGHT) {
      playerAnimation = "right-walk";
      tweenDirection = {x: `+=${tileSize}`};
    }
    else if (direction === DIRECTIONS.UP) {
      playerAnimation = "up-walk";
      tweenDirection = {y: `-=${tileSize}`};
    }
    else if (direction === DIRECTIONS.DOWN) {
      playerAnimation = "down-walk";
      tweenDirection = {y: `+=${tileSize}`};
    }
    
    const firstCoordinates = this.getCoordinates(playerCoordinates, direction, 1);
    const secondCoordinates = this.getCoordinates(playerCoordinates, direction, 2);
    
    box = this.getBoxAt(firstCoordinates.x, firstCoordinates.y);
    
    const hasBox = box !== undefined;
    const hasObstacle = hasBox ? this.hasObstacleAt(secondCoordinates.x, secondCoordinates.y, hasBox) : 
                                 this.hasObstacleAt(firstCoordinates.x, firstCoordinates.y, hasBox);
    
    if (hasObstacle) return;
    
    this.isWalking = true;
    
    if (box) this.moveBox(box, tweenDirection, direction);
    
    this.steps++;
    
    this.player.setData("coordinates", firstCoordinates);
    
    this.tweens.add(Object.assign(
      tweenDirection,
      {
        targets: [this.player, this.shadow],
        duration: 450,
        onStart: () => {
          this.player.anims.play(playerAnimation, true);
        },
        onComplete: () => {
          this.stopPlayer();
          this.updateSteps();
        }
      }
    ));
  }
  
  moveBox(box, tweenDirection, direction) {
    let isBoxOnTarget = this.checkIfBoxMatchesTarget(box);
    if (isBoxOnTarget === true) {
      this.targetsCovered -= 1;
      this.changeBoxTexture(box, true);
    }
    
    const boxCoordinates = box.getData("coordinates");
    const newBoxCoordinates = this.getCoordinates(boxCoordinates, direction, 1);
    box.setData("coordinates", newBoxCoordinates);
    
    this.tweens.add(Object.assign(
      tweenDirection,
      {
        targets: box,
        duration: 450,
        onComplete: () => {
          isBoxOnTarget = this.checkIfBoxMatchesTarget(box);
          if (isBoxOnTarget === true) {
            this.targetsCovered += 1;
            this.changeBoxTexture(box, false);
          }
          this.checkIfAllTargetsCovered();
        }
      }
    ))
  }
  
  getBoxAt(x, y) {
    return this.boxes.find(box => {
      const coordinates = box.getData("coordinates");
      return (coordinates.x === x && coordinates.y === y);
    })
  }
  
  hasObstacleAt(x, y, hasBox) {
    const tile = this.layer.getTileAt(x, y);
    
    if (!tile) return true;
    
    const obstacleIndexList = [47];
    
    const hasObstacle = obstacleIndexList.includes(tile.index);
    
    if (hasBox) {
      const secondBox = this.getBoxAt(x, y);
      
      return (!!secondBox || hasObstacle);
    }
    
    return hasObstacle;
  }
  
  checkIfBoxMatchesTarget(box) {
    const tile = this.targetsLayer.getTileAtWorldXY(box.x, box.y);
    
    if (!tile) return false;
    
    return this.targetMap[box.getData("frame")]+1 === tile.index;
  }
  
  checkIfAllTargetsCovered() {
    if (this.targetsCovered === this.targetsToCover) {
      this.time.delayedCall(500, () => {
        this.stopScene();
        this.scene.start("level-finished", {steps: this.steps, currentLevel: this.currentLevel});
      });
    }
  }
  
  changeBoxTexture(box, isOnTarget) {
    const currentFrame = box.frame.name;
    let frameMap = {};
    
    if (isOnTarget) {
      frameMap = {
        [BOX_COLORS.BLUE_BOX_MARKED]: BOX_COLORS.BLUE_BOX,
        [BOX_COLORS.RED_BOX_MARKED]: BOX_COLORS.RED_BOX,
        [BOX_COLORS.GREEN_BOX_MARKED]: BOX_COLORS.GREEN_BOX,
        [BOX_COLORS.BROWN_BOX_MARKED]: BOX_COLORS.BROWN_BOX,
        [BOX_COLORS.YELLOW_BOX_MARKED]: BOX_COLORS.YELLOW_BOX,
        [BOX_COLORS.PURPLE_BOX_MARKED]: BOX_COLORS.PURPLE_BOX
      }
    }
    else {
      frameMap = {
        [BOX_COLORS.BLUE_BOX]: BOX_COLORS.BLUE_BOX_MARKED,
        [BOX_COLORS.RED_BOX]: BOX_COLORS.RED_BOX_MARKED,
        [BOX_COLORS.GREEN_BOX]: BOX_COLORS.GREEN_BOX_MARKED,
        [BOX_COLORS.BROWN_BOX]: BOX_COLORS.BROWN_BOX_MARKED,
        [BOX_COLORS.YELLOW_BOX]: BOX_COLORS.YELLOW_BOX_MARKED,
        [BOX_COLORS.PURPLE_BOX]: BOX_COLORS.PURPLE_BOX_MARKED
      }
    }
    box.setFrame(Number(frameMap[currentFrame]));
  }
  
  stopPlayer() {
    const key = this.player.anims.currentAnim.key;
    const parts = key.split("-");
    const direction = parts[0];
    this.player.anims.stop(key);
    this.player.setFrame(PLAYER_IDLE[direction]);
    this.isWalking = false;
  }
  
  stopScene() {
    this.scene.stop("hud");
    this.scene.stop("game");
  }
  
  updateSteps() {
    EventEmitter.emit(EVENT_NAMES.STEPS_UPDATE, {steps: this.steps});
  }
  
  reset() {
    this.scene.restart({currentLevel: this.currentLevel});
  }
  
  goToStartScreen() {
    this.stopScene();
    this.scene.start("start-screen");
  }

}