class Bullet extends Sprite {
  constructor(position, imageSource) {
    super(position, imageSource);
    this.speed = 2;
    this.collided = false;
    this.isBeyondScreen = false;
  }

  update() {
    this.position.x += this.speed;
    if(this.position.x > 1080) {
        this.position.x = -32;
        this.isBeyondScreen = true;
    }
  }

  checkCollisions(enemies) {
    enemies.forEach(enemy => {
      if(this.position.x < enemy.position.x + 32 &&
        this.position.x + 32 > enemy.position.x &&
        this.position.y < enemy.position.y + 128 &&
        this.position.y + 128 > enemy.position.y) {
        console.log('hit!')
        this.collided = true;
        this.position.x = -32;
        enemies.splice(enemies.indexOf(enemy), 1);
        score += 10;
      }
      
    });
  }
}