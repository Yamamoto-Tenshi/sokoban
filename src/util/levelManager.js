class LevelManager {
  constructor() {
    this.levels = [{level: 1}, {level: 2}, {level: 3},
                   {level: 4}, {level: 5}, {level: 6},
                   {level: 7}, {level: 8}
                  ];
  }
  
  getLevelsCount() {
    return this.levels.length;
  }
  
  getLevel(level) {
    if (level > this.getLevelsCount()) return 0;
    
    return this.levels[level - 1];
  }
}

const levelManager = new LevelManager();

export default levelManager;