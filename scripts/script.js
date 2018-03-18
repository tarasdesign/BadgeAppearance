$(document).ready(function() {
	"use strict"

	var body = $('body')
	var image = $('.image')

	// Device detection
	var isMobile = false;
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

	Number.prototype.map = function (in_min, in_max, out_min, out_max) {
		return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
	}

	function format00(x) {
		var str = '' + x
		var pad = '00'
		var num = pad.substring(str.length) + str
		return num
	}

	var num = Math.floor((Math.random() * 17) + 1)
	var src = "images/Image-" + format00(num) + ".png"
	image.attr("src", src)

	var tl = new TimelineMax({
		onComplete: function(){
			document.body.addEventListener('mousemove', onMouseMove)
			document.body.addEventListener('touchmove', onTouchMove)

			window.ondevicemotion = function(event) {
				var width = window.innerWidth
				var height = window.innerHeight
				if (height > width) {
					var x = event.accelerationIncludingGravity.x.map(2, -2, 0, width)
					var y = event.accelerationIncludingGravity.y.map(-10, -15, 0, height) * -1
					followingCursor(x, y)
				}
			}
		}
	})

	// IMAGE FOLLOWING THE CURSOR

	function onTouchMove(event) {
		event.preventDefault()
		var x = event.touches[0].clientX
		var y = event.touches[0].clientY
		followingCursor(x, y)
	}

	function onMouseMove(event){
		var x = event.clientX
		var y = event.clientY
		followingCursor(x, y)
	}

	function followingCursor(clientX, clientY) {
		var width = window.innerWidth
		var height = window.innerHeight

		var y = (clientX / width - 0.5) * 25
		var x = (clientY / height - 0.5) * -25
		var light = 100 + (clientX / width - 0.5) * 40

		TweenMax.to('.image', 0.4, {
			rotationY: y + 'deg',
			rotationX: x + 'deg',
			filter: 'brightness(' + light + '%)',
			transformPerspective: 450,
		});
	}

	tl.from('.background', 1.0, {
		opacity: 0,
		ease: Power2.easeInOut,
	},"0")

	tl.from('.glow', 1.0, {
		opacity: 0,
		scale: 0.1,
		rotationZ: -540,
		ease: Power2.easeIn,
	},"0")

	tl.fromTo('.image', 1.0, {
		opacity: 0,
		scale: 0.1,
		rotationZ: -540,
		transformPerspective: 450,
	}, {
		opacity: 1,
		scale: 1,
		rotationZ: 0,
		ease: Power2.easeIn,
		transformPerspective: 450,
	}, "0")

	tl.from('.image', 2.5, {
		rotationY: -1080,
		ease: Elastic.easeOut.config(1, 0.3),
	},"0")

	tl.add(function(){ explode(emitter); },'0.9')

	// ANIMATION SPEED
	tl.timeScale(0.75)

	// SCALE IMAGE

	if (isMobile) {
		$('.image').addEventListener('touchstart', zoomMouseOver)
		$('.image').addEventListener('touchend', zoomMouseOut)
	} else {
		document.querySelector('.image').addEventListener('mouseover', zoomMouseOver)
		document.querySelector('.image').addEventListener('mouseout', zoomMouseOut)
	}

	function zoomMouseOver() {
		TweenMax.to('.image', 0.2, {
			scale: 1.05,
		})
	}

	function zoomMouseOut() {
		TweenMax.to('.image', 0.2, {
			scale: 1,
		})
	}

	// EMITTER

	var emitter = document.getElementById("emitter"),
    emitterContainer = document.createElement("div"),
    emitterSize = 120,
    dotQuantity = 50,
    dotSizeMax = 100,
    dotSizeMin = 10,
    speed = 5.0,
    gravity = 0.25

	emitterContainer.style.cssText = "position: absolute; left: 50%; top: 50%; overflow: visible; z-index: 0; pointer-events: none;opacity:0;";
	document.body.appendChild(emitterContainer)

	var explosion = createExplosion(emitterContainer)

	function createExplosion(emitterContainer) {
		var tl_emitter = new TimelineLite({paused: true}), angle, length, dot, i, size

		for (i = 0; i < dotQuantity; i++) {
			dot = document.createElement("div")
			dot.className = "dot"
			size = getRandom(dotSizeMin, dotSizeMax)
			emitterContainer.appendChild(dot)
			angle = Math.random() * Math.PI * 2
			length = Math.random() * (emitterSize / 2 - size / 2)
			TweenLite.set(dot, {
				x: Math.cos(angle) * length,
				y: Math.sin(angle) * length,
				width: size,
				height: size,
				xPercent: -50,
				yPercent: -50,
				force3D: true
			})

			tl_emitter.to(dot, Math.random() / 1, {
				opacity: 0,
				// animate with physics2D
				/*physics2D: {
				angle: angle * 180 / Math.PI, //translate radians to degrees
				velocity: (100 + Math.random() * 250) * speed, //initial velocity
				gravity: 500 * gravity //you could increase/decrease this to give gravity more or less pull
				}*/
				// animate directly instead of physics2D
				x: Math.cos(angle) * length * 5,
				y: Math.sin(angle) * length * 5
			}, 0)
		}
		return tl_emitter
	}

	//just pass this function an element and it'll move the explosion container to its center and play the explosion animation.
	function explode(element) {
		var bounds = element.getBoundingClientRect()
		TweenLite.set(emitterContainer, {opacity: 1})
		explosion.restart()
	}

	function getRandom(min, max) {
		return min + Math.random() * (max - min)
	}

})
