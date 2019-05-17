import Vue from 'vue/dist/vue'

let app = new Vue({
	el: '.app',
	data: {
		temp: 80,
		onAir: false,
		btnName: 'play',
		audio: new Audio()
	},
	methods: {
		faster() {
			this.temp++;
		},
		slower() {
			this.temp--;
		},
		btnClick() {
			if (this.onAir === false) {
				this.onAir = true;
				this.btnName = 'stop';
				audio.src = '../misc/click.ogg';
				audio.autoplay = true;
				audio.loop = true;
			} else {
				this.onAir = false;
				this.btnName = 'play';
				audio.pause();
				audio.currentTime = 0;
				audio.loop = false;
			}
		}
	}
})
