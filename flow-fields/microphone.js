class Microphone {
  constructor(fftSize) {
    this.initialized = false;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(
        function (stream) {
          this.audioContext = new AudioContext(); //bringing WebApi into project by this line
          this.microphone = this.audioContext.createMediaStreamSource(stream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = fftSize; //fast fourier transform this number should always be between 2^5 and 2^15 i.e(32, 64, 128, 256, 512, 2048, 4096, 8192, 16384, 32768) and by default it is 2048
          const bufferLength = this.analyser.frequencyBinCount; //frequencyBinCount is read only property always equal to half of fft size
          this.dataArray = new Uint8Array(bufferLength); //creates 8 bit integrated array
          this.microphone.connect(this.analyser);
          this.initialized = true;
        }.bind(this)
      )
      .catch(function (err) {
        alert(err);
      });
  }
  getSamples() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    let normSamples = [...this.dataArray].map((e) => e / 128 - 1); //gives values bw +1 and -1
    return normSamples;
  }
  getVolume() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    let normSamples = [...this.dataArray].map((e) => e / 128 - 1); //gives values bw +1 and -1
    let sum = 0;
    for (let i = 0; i < normSamples.length; i++) {
      sum += normSamples[i] * normSamples[i];
    }
    let Volume = Math.sqrt(sum / normSamples.length);
    return Volume;
  }
}