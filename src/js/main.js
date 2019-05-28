import Vue from 'vue/dist/vue'
import { longClickDirective } from 'vue-long-click'

const longClickInstance = longClickDirective({delay: 400, interval: 50})
Vue.directive('longclick', longClickInstance)

let app = new Vue({
	el: '.app',
	data: {
		temp: 120,
		beats: 4,
		noteLength: 4,
		onAir: false,
		btnName: 'play',
		timerId: 0,
		audioHi: new Audio('../misc/click_hi.ogg'),
		audioLow: new Audio('../misc/click_low.ogg'),
		iteration: 0,
		emphasis: true
	},
	computed: {
		tempTime: function () {
			return ( 60 / this.temp ) * 1000
		}
	},
	methods: {
		faster(n) {
			this.temp += n;
			this.checkTempo();
		},
		slower(n) {
			this.temp -= n;
			this.checkTempo();
		},
		checkTempo() {
			if (this.temp === 1) {
				this.$refs.slower.disabled = true;
			} else {
				this.$refs.slower.disabled = false;
			}
		},
		stopSound() {
			this.audioHi.pause();
			this.audioHi.currentTime = 0.0;
			this.audioLow.pause();
			this.audioLow.currentTime = 0.0;
		},
		playTempo() {
			if ( this.emphasis ) {
				this.stopSound();
				this.audioHi.play();
				this.iteration++;
			}
			this.timerId = setInterval(() => {
				if ( this.beats === 1 ) {
					this.stopSound();
					this.audioHi.play();
				} else if ( this.emphasis && this.iteration === 0) {
					this.stopSound();
					this.audioHi.play();
					this.iteration++;
				} else {
					this.stopSound();
					this.audioLow.play();
					if ( this.emphasis ) {
						this.iteration === this.beats - 1 ? this.iteration = 0 : this.iteration++;
					} else {
						this.iteration === this.beats ? this.iteration = 0 : this.iteration++;
					}
				}
			}, this.tempTime)
		},
		btnClick() {
			if (this.onAir === false) {
				this.onAir = true;
				this.btnName = 'stop';
				this.playTempo();
			} else {
				this.onAir = false;
				this.btnName = 'play';
				clearInterval(this.timerId);
			}
		},
		increaseBeats() {
			this.beats++;
		},
		decreaseBeats() {
			this.beats === 1 ? this.beats = 1 : this.beats--;
		},
		increaseNoteLength() {
			this.noteLength *= 2;
		},
		decreaseNoteLength() {
			this.noteLength === 1 ? this.noteLength = 1 : this.noteLength /= 2;
		},
	}
})
