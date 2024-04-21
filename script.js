const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const startButton = document.querySelector('#start');
const b2 = document.querySelector('#b2');

const scoreDisplay = document.querySelector('#score');
const highScoreDisplay = document.querySelector('#highScore');  

var cooldown = 0;

var keyboardInput = document.querySelector('#keyboardInput');


var audio = new AudioContext();
var audioElement
var audioSource
var audioIsPlaying = false;

function playAudio() {
    audioElement = new Audio("assets/backingTrack.mp3");
    audioSource = audio.createMediaElementSource(audioElement);
    audioSource.loop = true;
    audioSource.loopStart = 0;
    audioSource.loopEnd = 10;
    audioSource.connect(audio.destination);


    audioElement.play();
}
function stopAudio() {
    audioElement.pause();
    audioElement.currentTime = 0;
}


var score = 0;
var highScore = 0;

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
    if(audioSource !== undefined && audioIsPlaying){
   
        if(audioElement.currentTime > audioElement.duration - 0.1){
            audioElement.currentTime = 0;
        }
    }

    if(currentGameState === gameStates[0]){




         //Scene Logic
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         bg.draw(ctx);
         
 
         //Player logic
         player.draw(ctx);
    }


    if(currentGameState === gameStates[1]){
        //BGAudio Player Logic
       

        if(audioIsPlaying === false){
            playAudio();
            audioIsPlaying = true;
            console.log('audio is playing');
        }
        


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
            
        if (!keyboardInput.checked) {
            handleInputsFromAudio(Analyzer.updateStream());
        } else {
            handleInputs();
        }
        //keyboardInput.checked ?  handleInputsFromAudio(Analyzer.updateStream()) : handleInputs();
    
    }

    if(currentGameState === gameStates[2]){
        b2.style.visibility = 'visible';
        drawGameOver();
        if(audioIsPlaying === true){
            stopAudio();
            audioIsPlaying = false;
        }

    }
    
    ctx.font = '30px Sans-Serif';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 220, 100);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 20, 50);
    ctx.fillText('High Score: ' + highScore, 20, 80);
    //console.log('animate');
}

loop();


function drawGameOver(){
    ctx.fillStyle = 'black';
    ctx.fillRect(canvas.width/2 - 150, canvas.height/2 - 50 , 300 , 100);
    ctx.fillStyle = 'white';
    ctx.font = '30px Sans-Serif';
    ctx.fillText('Game Over', canvas.width/2 - 80, canvas.height/2);
}

function reset(){
    stopAudio();
    audioIsPlaying = false;
    currentGameState = gameStates[0];
    enemies = [];
    bullets = [];
    startButton.disabled = false;
    b2.disabled = true; 
    b2.style.visibility = 'hidden'; 

    if(score > highScore){
        highScore = score;
    }
    score = 0;
}

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
    b2.style.visibility = 'visible';


}

function createEnemyAtPosition(){
    let position = {
        x: 1000,
        y: Math.floor(Math.random() * 4) * 128 + 110
    }
    var enemy = new Enemy(position, 'assets/enemy.png', 4);
    enemies.push(enemy);
}