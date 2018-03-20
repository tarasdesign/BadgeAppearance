function onDomReady() {
	'use strict';

	var img = document.querySelector('.image');

	// Detect device user agent
	var isMobile = {
		Android: function() {
		    return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
		    return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
		    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
		    return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
		    return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
		    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	//if (isMobile.any()) alert('Mobile');
	//if (isMobile.iOS()) alert('iOS');

	Number.prototype.map = function (in_min, in_max, out_min, out_max) {
		return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}

	function format00(x) {
		var str = '' + x;
		var pad = '00';
		var num = pad.substring(str.length) + str;
		return num;
	}

	var num = Math.floor((Math.random() * 17) + 1);
	var src = 'images/Image-' + format00(num) + '.png';
	img.setAttribute('src', src);

	var tl = new TimelineMax({
		onComplete: function(){
			document.body.addEventListener('mousemove', onMouseMove);
			document.body.addEventListener('touchmove', onTouchMove);

			window.ondevicemotion = function(event) {
				var width = window.innerWidth;
				var height = window.innerHeight;
				if (height > width) {
					var x = event.accelerationIncludingGravity.x.map(2, -2, 0, width);
					var y = event.accelerationIncludingGravity.y.map(-10, -5, 0, height);
					followingCursor(x, y);
				} else {
					TweenMax.to(img, 0.4, {
						rotationY: '0deg',
						rotationX: '0deg',
						filter: 'brightness(100%)',
					});
				}
			}
		}
	});

	// IMAGE FOLLOWING THE CURSOR

	function onTouchMove(event) {
		event.preventDefault();
		var x = event.touches[0].clientX;
		var y = event.touches[0].clientY;
		followingCursor(x, y);
	}

	function onMouseMove(event){
		var x = event.clientX;
		var y = event.clientY;
		followingCursor(x, y);
	}

	function followingCursor(clientX,clientY) {
		var width = window.innerWidth;
		var height = window.innerHeight;

		var y = (clientX / width - 0.5) * 25;
		var x = (clientY / height - 0.5) * -25;
		var light = 100 + (clientX / width - 0.5) * 40;

		TweenMax.to(img, 0.4, {
			rotationY: y + 'deg',
			rotationX: x + 'deg',
			filter: 'brightness(' + light + '%)',
			transformPerspective: 450,
		});
	}

	tl.from('.background', 1.0, {
		opacity: 0,
		ease: Power2.easeInOut,
	}, "0");

	tl.from('.glow', 1.0, {
		opacity: 0,
		scale: 0.1,
		rotationZ: -540,
		ease: Power2.easeIn,
	}, "0");

	tl.fromTo(img, 1.0, {
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
	}, "0");

	tl.from(img, 2.5, {
		rotationY: -1080,
		ease: Elastic.easeOut.config(1, 0.3),
	}, "0");

	tl.add(function(){ explode(emitter);},"0.9");

	// ANIMATION SPEED
	tl.timeScale(0.75);

	// SCALE IMAGE

	if (isMobile.any()) {
		img.addEventListener('touchstart', zoomIn);
		img.addEventListener('touchend', zoomOut);
	} else {
		img.addEventListener('mouseover', zoomIn)
		img.addEventListener('mouseout', zoomOut)
	}

	function zoomIn() {
		TweenMax.to(img, 0.2, {
			scale: 1.05,
		});
	}

	function zoomOut() {
		TweenMax.to(img, 0.2, {
			scale: 1,
		});
	}

	// EMITTER

	var emitter = document.getElementById("emitter"),
    emitterContainer = document.createElement("div"),
    emitterSize = 120,
    dotQuantity = 50,
    dotSizeMax = 100,
    dotSizeMin = 30,
    speed = 5.0,
    gravity = 0.25;

	emitterContainer.style.cssText = "position: absolute; left: 50%; top: 50%; overflow: visible; z-index: 0; pointer-events: none;opacity:0; will-change: opacity;";
	document.body.appendChild(emitterContainer);

	var explosion = createExplosion(emitterContainer);

	function createExplosion(emitterContainer) {
		var tl_emitter = new TimelineLite({paused: true}), angle, length, dot, i, size;

		function createStar() {
			dot = document.createElement("div");
			dot.className = "dot";
			size = getRandom(dotSizeMin, dotSizeMax);
			emitterContainer.appendChild(dot);
			angle = Math.random() * Math.PI * 2;
			length = Math.random() * (emitterSize / 2 - size / 2);
			TweenLite.set(dot, {
				x: Math.cos(angle) * length,
				y: Math.sin(angle) * length,
				width: size,
				height: size,
				xPercent: -50,
				yPercent: -50,
				force3D: true
			});

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
			}, 0);
		}

		for (let i = 0; i < dotQuantity; i++) {
			createStar()
		}
		return tl_emitter;
	}

	function explode(element) {
		// var bounds = element.getBoundingClientRect();
		TweenLite.set(emitterContainer, {opacity: 1});
		explosion.restart();
	}

	function getRandom(min, max) {
		return min + Math.random() * (max - min);
	}

};

if (document.readyState !== 'loading') {
  onDomReady();
} else {
  document.addEventListener('DOMContentLoaded', onDomReady);
}
