class Enemy extends Sprite {
  constructor(position, imageSource, frames) {
    super(position, imageSource, frames);
    this.position = position;
    this.speed = 0.35;
    this.health = 100;
  }

  changeSpeed() {
    this.speed += 0.5;
  }

  update() {
    this.position.x -= this.speed;
    if(this.position.x > 1080) {
      this.position.x = -32;
    }
  }

  checkGameOver (){
    if(this.position.x < 160){
      currentGameState = gameStates[2];
    }
  }
}