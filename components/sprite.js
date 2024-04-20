class Sprite{
    constructor(position,  imageSource, frames = 1, frameRate = 30){
        this.position = position;
        this.frames = frames;
        this.image = new Image();
        this.image.src = imageSource
        this.framewidth = this.image.width / this.frames;
        this.image.onload = () => {
            this.loaded = true;
            console.log(frames)
        }
        this.loaded = false;
        this.currentFrame = 0;
        this.frameRate = frameRate;
        this.count = 0;
    }
    
    draw(ctx){
        if(!this.loaded){
            return;
        }
        this.updateFrames();
        let cropBox = {
            position: {
                x: this.framewidth * this.currentFrame,
                y: 0
            },
            width: this.image.width / this.frames,
            height: this.image.height
        }
        ctx.drawImage(
            this.image, 
            cropBox.position.x, 
            cropBox.position.y,
            cropBox.width,
            cropBox.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames,    
            this.image.height
        );
    }


    updateFrames(){
       this.count++;
       if(this.count >= this.frameRate){
           this.count = 0;
           this.currentFrame++;
           if(this.currentFrame >= this.frames){
               this.currentFrame = 0;
           }
       }
    }
}
