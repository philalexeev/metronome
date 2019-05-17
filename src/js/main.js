import Vue from 'vue/dist/vue'

let app = new Vue({
	el: '.app',
	data: {
		temp: 80,
		onAir: false,
		btnName: 'play',
		timerId: 0
	},
	computed: {
		tempTime: function () {
			return ( 60 / this.temp ) * 1000
		}
	},
	methods: {
		faster() {
			this.temp++;
		},
		slower() {
			this.temp--;
		},
		btnClick() {
			let audio = new Audio();
			if (this.onAir === false) {
				this.onAir = true;
				this.btnName = 'stop';
				audio.src = '../misc/click.ogg';
				audio.play();
				this.timerId = setInterval(() => {
					audio.play();
				}, this.tempTime);
			} else {
				this.onAir = false;
				this.btnName = 'play';
				audio.pause();
				clearInterval(this.timerId);
			}
		}
	}
})
