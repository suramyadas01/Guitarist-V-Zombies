# Guitarist V Zombies

This repository contains the code for the game "Guitarist V Zombies". It is a fun and exciting game where you play as a guitarist defending yourself against hordes of zombies using the power of music.

<div align=center>
<img height="400" src="assets/canvas.png" alt="Screenshot">
</div>


## Gameplay

In this game, you control the guitarist character using your real guitar. Additionally support has been added for being able to play the game using WASD keys. Your goal is to defeat as many zombies as possible by playing the correct notes on your guitar. Be careful not to miss any notes, as the zombies will get closer to you!

The notes as of now are linked to certain scales so yo can enjoy a bit of freestyling while defeating the zombies. The goal is to have fun.

## Installation

To install and run the game, follow these steps:

1. Clone the repository: `git clone https://github.com/suramyadas01/Guitarist-V-Zombies.git`
2. Navigate to the project directory: `cd Guitarist-V-Zombies`
3. Install the dependencies: `npm install`
4. Start the game: `npm start`


## How Does This Thing Work?
The game has two major components. Lets look at them one by one.

### The Visual Stuff
The entire game is built on top of the HTML Canvas. It uses repeated calls to the HTML canvas to draw shapes and sprites over and over on the screen based on the given logic. The game maintains game states and tags logic accordingly based on the ```currentGameState```.

All the code related to the main loop of the game can be found in the ```script.js``` file. 

All the visual components derive functionality from the same base class. Since the scope of this game is pretty small, there are areas where clean code conventions have been ommited. This is mostly because the v1 was built over an weekend and if you're reading this, chances are, there haven't been any updates since.

### The Secret Sauce - The Guitar Part
Well, it's pretty simple actually, the program reads the current input from your mic and detects the pitch and tells you which note you're pressing and takes action based off of that.

```javascript
handleInputsFromAudio(Analyzer.updateStream());

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
```

Well how it does all this is the fun part. The ```AudioContext``` object allows you to read data from the mic and do further analysis on the received signal. We then convert this time domain signal to frequency domain using a ```sampleRate``` and a quick DFT algorithm. This gives us the data of the sample but in frequency domain. This data can then be used to analyze the pitch of the sample. Everything regarding the audio analysis can be found in the ```audioAnalyzer.js``` file.

A DFT or FFT based tuner is the simplest implementation for pitch detection and there are many more interesting algorithms used for pitch detection. For basics though,[here](https://www.chciken.com/digital/signal/processing/2020/05/13/guitar-tuner.html) is a nice article.

In the future, I plan on improving the pitch detection algorithm for a smoother experience. 

### Bringing It All Together
Well after we have the two parts working fine separately, it's just a matter of creating a simple API or a handler function to allow them to communicate and influence each other. I am using a simple function based off of a checkbox to either create inputs using an instrument or maybe just your keyboard(great for testing!!).

## Challenges and Bugs?
The code does have an issue at the moment. When the guitar is played through an audio interface, the output is clean and accurate. However, when the microphone is used, due to interference, there is some noise which kind of makes the experience bad. 

## Contributing

Contributions are welcome! If you have any ideas, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
