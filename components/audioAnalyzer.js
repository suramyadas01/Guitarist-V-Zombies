class AudioAnalyzer {
  constructor() {
    this.audioContext = new AudioContext();
    this.analyzer = new AnalyserNode(this.audioContext, { fftSize: 16384 });
    this.isActive = false;
  }

  async setupContext() {  
    const stream = await this.getAudioSource()
    if(this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
    const source = this.audioContext.createMediaStreamSource(stream)
    source
    .connect(this.analyzer)
      .connect(this.audioContext.destination)
      
      
    }
  


    
 rxx(l, N, x) {
  var sum = 0;
  for (var n = 0; n <= N - l - 1; n++) {
    sum += (x[n] * x [n + l])
  }
  return sum;
}

 autocorrelationWithShiftingLag(samples) {
  var autocorrelation = []
  for (var lag = 0; lag < samples.length; lag++) {
    autocorrelation[lag] = this.rxx(lag, samples.length, samples)
  }
  return autocorrelation
}

 maxAbsoluteScaling(data) {
  var xMax = Math.abs(Math.max(...data))
  return data.map(x => x / xMax)
}
   

   getAudioSource() {
    if (navigator.getUserMedia = ( navigator.getUserMedia    || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||navigator.msGetUserMedia)){
      this.isActive = true;
      return navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          latency: 0
        }
      })

    }
  }

  updateStream() {
    const bufferLen = this.analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLen);  
    this.analyzer.getByteFrequencyData(dataArray);

    
    //console.log(dataArray);

    
    let max = 0;
    let maxIndex = 0;
    dataArray.forEach((value, i) => {
        if(value > max){
            max = value;
            maxIndex = i;
        }
    });

    let frequency = maxIndex * this.audioContext.sampleRate / bufferLen;
    return this.findClosestNote(frequency) ;
  }

  // getNoteFromFrequency(frequency) {
  //   const notes = [
  //     { name: 'C', frequency: 261.63 },
  //     { name: 'C#', frequency: 277.18 },
  //     { name: 'D', frequency: 293.66 },
  //     { name: 'D#', frequency: 311.13 },
  //     { name: 'E', frequency: 329.63 },
  //     { name: 'F', frequency: 349.23 },
  //     { name: 'F#', frequency: 369.99 },
  //     { name: 'G', frequency: 392.00 },
  //     { name: 'G#', frequency: 415.30 },
  //     { name: 'A', frequency: 440.00 },
  //     { name: 'A#', frequency: 466.16 },
  //     { name: 'B', frequency: 493.88 }
  //   ];

  //   let concertA = 440;
  //   let closestNote = null;
  //   let closestDifference = Infinity;


      
  //    let i = 12 * Math.log2(frequency / concertA);
  //    i = Math.round(i);

  //    closestNote = notes[i % 12].name + (4 + Math.floor((i + 9) / 12));

     
  //   return closestNote;
  // }

  
 findClosestNote(pitch) {
    let CONCERT_PITCH = 440;
    let ALL_NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];


    let i = Math.round(Math.log2(pitch / CONCERT_PITCH) * 12);
    let closestNote = ALL_NOTES[i % 12] + (4 + Math.floor((i + 9) / 12));
    return closestNote;
}

}

