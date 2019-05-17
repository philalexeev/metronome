import Vue from 'vue/dist/vue'
import { longClickDirective } from 'vue-long-click'

const longClickInstance = longClickDirective({delay: 400, interval: 50})
Vue.directive('longclick', longClickInstance)

let app = new Vue({
	el: '.app',
	data: {
		temp: 120,
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
		faster(n) {
			this.temp += n;
		},
		slower(n) {
			this.temp -= n;
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
