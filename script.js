const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const startButton = document.querySelector('#start');
const b2 = document.querySelector('#b2');

const freq = document.querySelector('#freq');
var cooldown = 0;


canvas.width = 1024;
canvas.height = 720;


var enemyCooldownLimit = 500;
var enemyCooldown = enemyCooldownLimit;
var enemies = []
var bullets = []    

const gameStates = ['start', 'game', 'end'];

var currentGameState = gameStates[0];   

// canvas.width = 32 * tiles.position.x * factor; 
// canvas.height = 32 * tiles.position.y * factor;


const Analyzer = new AudioAnalyzer();



var position = {
    x: 0,
    y: 0
}

var enemyPosition = {
    x: 1000,
    y: 110
}

var playerPosition = {
    x: 100,
    y: 238
}

var player = new Player(playerPosition, 'assets/player.png', 4, 40);



const bg = new Sprite(position, 'assets/bg.png');


function loop(){
    //console.log(bullets);
    window.requestAnimationFrame(loop);

    if(currentGameState === gameStates[0]){
         //Scene Logic
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         bg.draw(ctx);
         
 
         //Player logic
         player.draw(ctx);
    }


    if(currentGameState === gameStates[1]){
        if(cooldown > 0){
            cooldown--;
        }

        if(enemyCooldown > 0){
            enemyCooldown--;    
        }
        if(enemyCooldown === 0){
            enemyPosition.y = Math.floor(Math.random() * 4) * 128 + 110;
            createEnemyAtPosition(enemyPosition);
            enemyCooldown = enemyCooldownLimit;
        }

        //Audio Controller Logic
        //console.log(Analyzer.updateStream());
        
        //Scene Logic
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bg.draw(ctx);
        

        //Player logic
        player.draw(ctx);
        

        //Enemy logic
        enemies.forEach(enemy => {
            enemy.update();
            enemy.draw(ctx);
            enemy.checkGameOver();
        });
    

        //Bullet logic
        bullets.forEach(bullet => {
            if(bullet.isBeyondScreen || bullet.collided){
                bullets.splice(bullets.indexOf(bullet), 1);
                
            }else{
                bullet.update();
                bullet.draw(ctx);
                bullet.checkCollisions(enemies);
            }
         
        });
    
    
        handleInputsFromAudio(Analyzer.updateStream());
    
    }
    //console.log('animate');
}

loop();


function handleInputsFromAudio(note){
    if(note === 'G5' && cooldown === 0){
        var bullet = new Bullet({x: 100, y: player.position.y}, 'assets/bullet.png');
        bullets.push(bullet);
        //player.position.y += 128;
        cooldown = 100;
        
    }
    if(note === 'D5'){
        if(player.position.y > 128  && cooldown === 0){
            player.position.y -= 128;
            cooldown = 120;
        }
    }
    if(note === 'E5'){
        if(player.position.y < 384  && cooldown === 0){
            player.position.y += 128;
            cooldown = 120;
        }
    }
}

function handleInputs(){
    //add a keypress event listener
    window.addEventListener('keydown', (e) => {
        if(e.key === 'e' && cooldown === 0){
            e.preventDefault();
            var bullet = new Bullet({x: 100, y: player.position.y}, 'assets/bullet.png');
            bullets.push(bullet);
            //player.position.y += 128;
            cooldown = 50;
            
        }
        if(e.key === 'w'){
            if(player.position.y > 128  && cooldown === 0){
                player.position.y -= 128;
                cooldown = 20;
            }
        }
        if(e.key === 's'){
            if(player.position.y < 384  && cooldown === 0){
                player.position.y += 128;
                cooldown = 20;
            }
        }
    }
    ); 
}


function startClicked(){
    
    currentGameState = gameStates[1];
    Analyzer.setupContext(); 
    startButton.disabled = true;
    b2.disabled = false;
    b2.style.visibiility = visible;

}

function createEnemyAtPosition(){
    let position = {
        x: 1000,
        y: Math.floor(Math.random() * 4) * 128 + 110
    }
    var enemy = new Enemy(position, 'assets/enemy.png', 4);
    enemies.push(enemy);
}