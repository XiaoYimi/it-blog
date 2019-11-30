
export default {
	oneMinute: (that) => {
		let count = 60
		if (that.timer) { return }
		that.timer = setInterval(() => {
			that.timercount =-- count + ' s'
			if (count < 0) {
				clearInterval(that.timer)
				that.timer = null
				that.timercount = '获取验证码'
				that.timertip = '验证码超时,请重新获取'
			}
		}, 1000)
	},
	threeMinute: (that) => {
		let count = 180
		if (!that.timer) {
			that.timertip = '验证码已发送,可能因网络有所延迟'
			that.timer = setInterval(() => {
				that.timercount = --count + ' s'
				if (count < 0) {
					clearInterval(that.timer)
					that.timer = null
					that.timercount = '获取验证码'
					that.timertip = '验证码超时,请重新获取'
				}
			}, 1000)
		}
	},
	customTime: (that, count, timestart_timertip, overtime) => {
		if (!that.timer) {
			that.timertip = '验证码已发送,可能因网络有所延迟'
			that.timer = setInterval(() => {
				that.timercount = --count + ' s'
				if (count < 0) {
					clearInterval(that.timer)
					that.timer = null
					that.timercount = '获取验证码'
					that.timertip = '验证码超时,请重新获取'
				}
			}, 1000)
		}
	}
}

