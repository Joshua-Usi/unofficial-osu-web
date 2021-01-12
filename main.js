/*
 *	MIT License
 *	
 *	Copyright (c) 2021 Joshua Usi
 *	
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *	
 *	The above copyright notice and this permission notice shall be included in all
 *	copies or substantial portions of the Software.
 *	
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *	SOFTWARE.
 */
define(function(require) {
	"use strict";
	/* RequireJS Module Loading */
	const Mouse = require("./src/scripts/Mouse.js");
	const Song = require("./src/scripts/Song.js");	
	const utils = require("./src/scripts/utils.js");	
	/* First time run setup */
	if (!window.localStorage.use_low_power_mode) {
		window.localStorage.setItem("use_low_power_mode", 0);
	}
	/* offline context checks, needed to ensure if effects are working */
	if (window.origin === null) {
		console.warn("You appear to be running this locally without a web server, some effects may not work due to CORS");
	}
	/* osu!web version */
	const version = "osu!web v2021.0.1.0";
	/* set element version numbers */
	let classes = document.getElementsByClassName("version-number");
	for (var i = 0; i < classes.length; i++) {
		classes[i].innerText = version;
	}
	/* initialise mouse module */
	let mouse = new Mouse("body");
	mouse.init();
	/* initial menu song pool */
	let songs = [
		Song.create("cYsmix - Triangles.mp3", Song.bpm(160)),
		// Song.create("nekodex - circles.mp3", Song.bpm([185, 360, 600, 185], [0, 8, 10.5, 12])),
	];
	/* only add christmas songs to list if the month is december*/
	if (new Date().getMonth() === 11) {
		songs.push(Song.create("nekodex - aureole.mp3", Song.bpm(140)));
		songs.push(Song.create("nekodex - Little Drummer Girl.mp3", Song.bpm(140)));
	}
	let chosenSong = utils.randomInt(0, songs.length - 1);
	let bpm = songs[chosenSong].bpm.get();
	document.getElementById("bpm").value = bpm;
	let menuAudio = new Audio(`src/audio/${songs[chosenSong].src}`);
	menuAudio.addEventListener("play", function() {
		document.getElementById("now-playing").innerText = "Now Playing: " + utils.replaceAll(songs[chosenSong].src, [".wav", ".mp3", ".ogg"]);
	});
	menuAudio.addEventListener("ended", function() {
		chosenSong = utils.randomInt(0, songs.length - 1);
		document.getElementById("now-playing").innerText = "Now Playing: " + songs[chosenSong].src;
		this.src = `src/audio/${songs[chosenSong].src}`;
		bpm = songs[chosenSong].bpm.get();
		this.play();
	});
	menuAudio.id = "menu-audio";
	/* create canvas for audio visualizer */
	let canvas = document.getElementById("audio-visualiser");
	canvas.width = 0.9 * window.innerHeight;
	canvas.height = 0.9 * window.innerHeight;
	/* Need to append for wave.js */
	document.querySelector("body").appendChild(menuAudio);
	let isFirstClick = true;
	let currentSources = 0;
	let offset = 0;
	let time = 0;
	let lastTime = 0;
	let accumulator = 0;

	/* states:
	 * just-logo
	 * first
	 * play
	 * settings
	 */
	let menuState = "just-logo";
	let logoX = 50;
	let logoY = 50;
	let logoSize = 50;
	let logoPulseSize = 55;
	/* Local Storage ------------------------------------------------------------------------------------------- */
	if (window.localStorage.getItem("use_low_power_mode") == parseInt(1)) {
		document.getElementById("low-power-mode").checked = true;
	}
	if (window.localStorage.getItem("volume_music")) {
		document.getElementById("volume").value = window.localStorage.getItem("volume_music") * 100;
		document.getElementById("volume").dispatchEvent(new CustomEvent("input"));
	}
	/* Event Listeners ----------------------------------------------------------------------------------------- */
	window.addEventListener("click", function() {
		if (isFirstClick) {
			menuAudio.volume = window.localStorage.getItem("volume_music");
			menuAudio.play();
			isFirstClick = false;
			time = 0;
			lastTime = 0;
		}
	});
	window.addEventListener("resize", function() {
		let canvas = document.getElementById("audio-visualiser");
		if (menuAudio === "just-logo") {
			canvas.width = 0.9 * window.innerHeight;
			canvas.height = 0.9 * window.innerHeight;
		} else {
			canvas.width = 0.5 * window.innerHeight;
			canvas.height = 0.5 * window.innerHeight;
			canvas.style.top = "calc(" + logoY + "vh - " + canvas.height + "px / 2)";
			canvas.style.left = "calc(" + logoX + "vw - " + canvas.height + "px / 2)";
		}
	});
	window.addEventListener("load", function() {
		(function animate() {
			let image = document.getElementById("background-blur");
			let enableLowPowerMode = document.getElementById("low-power-mode").checked;
			let logoSizeIncrease = 1.1;
			if (enableLowPowerMode === false) {
				/* style image parallax based on mouse position */
				image.style.opacity = 1;
				image.style.top = (mouse.position.y - window.window.innerHeight * 0.5) / 64 - window.window.innerHeight * 0.05 + "px";
				image.style.left = (mouse.position.x - window.innerWidth * 0.5) / 64 - window.innerWidth * 0.05 + "px";
				let topBar = document.getElementById("top-bar");
				let bottomBar = document.getElementById("bottom-bar");
				let sidenav = document.getElementById("sidenav");
				/* triangle background moves */
				offset -= 0.25;
				topBar.style.backgroundPositionY = offset + "px";
				bottomBar.style.backgroundPositionY = offset + "px";
				sidenav.style.backgroundPositionY = offset + "px";
				/* beat detection and accumulation */
				bpm = songs[chosenSong].bpm.get(time);
				lastTime = time;
				time = menuAudio.currentTime;
				if (accumulator < 0) {
					accumulator = 0;
				}
				accumulator += time - lastTime;
				let logo = document.getElementById("logo");
				if (accumulator > 1 / (bpm / 60)) {
					while (accumulator > 1 / (bpm / 60)) {
						/* logo pulse*/
						logo.style.transition = "width 0.05s, top 0.05s, left 0.05s, background-size 0.05s, filter 0.5s";
						logo.style.width = logoSize + "vh";
						logo.style.top = "calc(" + logoY + "vh - " + logoSize / 2 + "vh)";
						logo.style.left = "calc(" + logoX + "vw - " + logoSize / 2 + "vh)";
						logo.style.backgroundSize = logoSize + "vh";
						logo.style.backgroundPositionY = offset % (1024 * 0.5) + "px";
						/* logo background pulse, maximum 5 to prevent lag */
						if (document.getElementById("logo-beat").querySelectorAll("img").length <= 5) {
							let logoCircle = document.createElement("img");
							logoCircle.src = "src/images/circle.png";
							logoCircle.style.position = "fixed";
							logoCircle.style.width = logoPulseSize + "vh";
							logoCircle.style.top = "calc(" + logoY + "vh - " + logoPulseSize / 2 + "vh)";
							logoCircle.style.left = "calc(" + logoX + "vw - " + logoPulseSize / 2 + "vh)";
							logoCircle.style.opacity = 0.5;
							document.getElementById("logo-beat").appendChild(logoCircle);
						}
						/* snow only in december, maximum 50 to prevent lag */
						/* last tested:
						 *	
						 *	27/12/2020, works
						 *	9/01/2021, works
						 */
						if (new Date().getMonth() === 11 && document.getElementById("snow").querySelectorAll("img").length <= 50) {
							let snowflake = document.createElement("img");
							snowflake.src = "src/images/snowflake.png";
							snowflake.style.position = "fixed";
							snowflake.style.width = Math.random() * 2 + 1 + "vh";
							snowflake.style.top = -10 + "vh";
							snowflake.style.left = Math.random() * 100 + "vw";
							snowflake.style.opacity = 0.4;
							snowflake.style.zIndex = -5;
							document.getElementById("snow").appendChild(snowflake);
						}
						accumulator -= 1 / (bpm / 60);
					}
				} else {
					logo.style.transition = "width 0.5s, top 0.5s, left 0.5s, background-size 0.5s, filter 0.5s";
					logo.style.backgroundSize = logoSize * logoSizeIncrease + "vh";
					logo.style.width = logoSize * logoSizeIncrease + "vh";
					logo.style.top = "calc(" + logoY + "vh - " + ((logoSize * logoSizeIncrease) / 2) + "vh)";
					logo.style.left = "calc(" + logoX + "vw - " + ((logoSize * logoSizeIncrease) / 2) + "vh)";
					logo.style.backgroundSize = logoSize * logoSizeIncrease + "vh";
					logo.style.backgroundPositionY = offset % (1024 * 0.5) * logoSizeIncrease + "px";
				}
			} else {
				image.style.opacity = 0;
			}
			let logoCircles = document.getElementById("logo-beat").querySelectorAll("img");
			for (let i = 0; i < logoCircles.length; i++) {
				if (parseFloat(logoCircles[i].style.opacity) <= 0) {
					logoCircles[i].remove();
					break;
				}
				logoCircles[i].style.opacity = parseFloat(logoCircles[i].style.opacity) - 0.05;
				logoCircles[i].style.width = parseFloat(logoCircles[i].style.width) + 0.5 + "vh";
				logoCircles[i].style.top = "calc(" + logoY + "vh - " + logoCircles[i].style.width + " / 2)";
				logoCircles[i].style.left = "calc(" + logoX + "vw - " + logoCircles[i].style.width + " / 2)";
			}
			if (new Date().getMonth() === 11) {
				let snow = document.getElementById("snow").querySelectorAll("img");
				for (let i = 0; i < snow.length; i++) {
					if (parseFloat(snow[i].style.top) >= 100) {
						snow[i].remove();
						break;
					}
					snow[i].style.top = parseFloat(snow[i].style.top) + parseFloat(snow[i].style.width) / 10 + "vh";
					snow[i].style.left = parseFloat(snow[i].style.left) + Math.sin(parseFloat(snow[i].style.width) * 9 + parseFloat(snow[i].style.top) / 10) / 25 + "vw";
					snow[i].style.transform = "rotate(" + parseFloat(snow[i].style.top) * parseFloat(snow[i].style.width) + "deg)";
				}
			}
			requestAnimationFrame(animate);
		})();
	});
	document.getElementById("top-bar").addEventListener("mouseenter", function() {
		utils.blurDiv('background-blur', 4);
		utils.brighten('background-dim', 0.75);
		utils.blurDiv('logo', 8);
	});
	document.getElementById("top-bar").addEventListener("mouseleave", function() {
		utils.blurDiv('background-blur', 0);
		utils.brighten('background-dim', 1);
		utils.blurDiv('logo', 0);
	});
	document.getElementById("close-btn").addEventListener("click", function() {
		document.getElementById("sidenav").style.width = "0";
		document.getElementById("sidenav").style.opacity = "0.2";
	});
	document.getElementById("settings-icon").addEventListener("click", function() {
		document.getElementById("sidenav").style.width = "20vw";
		document.getElementById("sidenav").style.opacity = "1";
	});
	document.getElementById("menu-bar-settings").addEventListener("click", function() {
		document.getElementById("sidenav").style.width = "20vw";
		document.getElementById("sidenav").style.opacity = "1";
	});
	document.getElementById("low-power-mode").addEventListener("change", function(event) {
		let enableLowPowerMode = this.checked;
		if (enableLowPowerMode === true) {
			window.localStorage.setItem("use_low_power_mode", 1);
		} else {
			window.localStorage.setItem("use_low_power_mode", 0);
		}
	});
	document.getElementById("bpm").addEventListener("input", function() {
		this.style.background = 'linear-gradient(to right, #FD67AE 0%, #FD67AE ' + utils.map(this.value, this.min, this.max, 0, 100) + '%, #fff ' + utils.map(this.value, this.min, this.max, 0, 100) + '%, white 100%)';
		document.getElementById('bpm-text').innerText = 'BPM ' + this.value;
		bpm = parseInt(this.value);
		currentSources++;
		if (currentSources % 3 === 0) {
			let audio = new Audio("src/audio/sliderbar.mp3");
			audio.volume = 1;
			audio.playbackRate = utils.map(this.value, this.min, this.max, 1, 2);
			audio.play();
			audio.onend = function() {
				currentSources--;
			};
		}
	});
	document.getElementById("volume").addEventListener("input", function() {
		this.style.background = 'linear-gradient(to right, #FD67AE 0%, #FD67AE ' + utils.map(this.value, this.min, this.max, 0, 100) + '%, #fff ' + utils.map(this.value, this.min, this.max, 0, 100) + '%, white 100%)';
		document.getElementById('volume-text').innerText = 'Volume ' + this.value;
		menuAudio.volume = this.value / 100;
		window.localStorage.setItem("volume_music", menuAudio.volume);
		currentSources++;
		if (currentSources % 3 === 0) {
			let audio = new Audio("src/audio/sliderbar.mp3");
			audio.volume = 1;
			audio.playbackRate = utils.map(this.value, this.min, this.max, 1, 2);
			audio.play();
			audio.onend = function() {
				currentSources--;
			};
		}
	});
	document.getElementById("pause").addEventListener("click", function() {
		if (menuAudio.paused) {
			menuAudio.play();
			this.innerHTML = "&#x275A;&#x275A;";
		} else {
			menuAudio.pause();
			this.innerHTML = "&#x25BA;";
		}
	});
	document.getElementById("previous").addEventListener("click", function() {
		menuAudio.pause();
		chosenSong = utils.randomInt(0, songs.length - 1);
		bpm = songs[chosenSong].bpm.get();
		menuAudio.src = `src/audio/${songs[chosenSong].src}`;
		menuAudio.play();
		document.getElementById("bpm").value = bpm;
		document.getElementById("bpm").dispatchEvent(new CustomEvent("input"));
	});
	document.getElementById("next").addEventListener("click", function() {
		menuAudio.pause();
		chosenSong = utils.randomInt(0, songs.length - 1);
		bpm = songs[chosenSong].bpm.get();
		menuAudio.src = `src/audio/${songs[chosenSong].src}`;
		menuAudio.play();
		document.getElementById("bpm").value = bpm;
		document.getElementById("bpm").dispatchEvent(new CustomEvent("input"));
	});
	document.getElementById("splash-screen").addEventListener("click", function() {
		this.style.opacity = 0;
		setTimeout(none, 1000);
	});
	document.getElementById("logo").addEventListener("click", function() {
		logoX = 30;
		logoY = 50;
		logoSize = 25;
		logoPulseSize = 26;
		let canvas = document.getElementById("audio-visualiser");
		canvas.width = 0.5 * window.innerHeight;
		canvas.height = 0.5 * window.innerHeight;
		canvas.style.top = "calc(" + logoY + "vh - " + canvas.height + "px / 2)";
		canvas.style.left = "calc(" + logoX + "vw - " + canvas.height + "px / 2)";
		let menuBar = document.getElementById("menu-bar");
		menuBar.style.opacity = 1;
		let menuBarButtons = document.getElementsByClassName("menu-bar-buttons");
		for (var i = 0; i < menuBarButtons.length; i++) {
			menuBarButtons[i].style.paddingTop = 5 + "vh";
			menuBarButtons[i].style.paddingBottom = 5 + "vh";
		}
		menuBar.style.top = "calc(50vh - 5vh * 1.5)";
	});
	/* Onload events --------------------------------------------------------------------------------------------*/
	utils.blurDiv("background-blur", 0);
	document.getElementById("bpm").dispatchEvent(new CustomEvent("input"));
	document.getElementById("volume").dispatchEvent(new CustomEvent("input"));
	/* Helper -------------------------------------------------------------------------------------------------- */
	function none() {
		document.getElementById("splash-screen").style.display = "none";
	}
	/* Library Stuff ------------------------------------------------------------------------------------------- */
	if (window.origin !== "null" && window.localStorage.getItem("use_low_power_mode") == parseInt(0)) {
		let wave = new Wave();
		wave.fromElement("menu-audio", "audio-visualiser", {
			stroke: 8,
			type: "flower",
			colors: ["#fff5"]
		});
	} else {
		console.warn("offline context, audio visualiser will not work");
	}
});