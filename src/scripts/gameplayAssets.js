define(function(require) {
	const AssetLoader = require("./assetLoader.js");
	const skin = "ajax-transparent";
	return {
		/* cursor assets */
		cursor: AssetLoader.image(`./src/images/skins/${skin}/cursor.png`),
		cursorTrail: AssetLoader.image(`./src/images/skins/${skin}/cursortrail.png`),
		/* hit circle assets */
		hitCircle: AssetLoader.image(`./src/images/skins/${skin}/hitcircle.png`),
		hitCircleOverlay: AssetLoader.image(`./src/images/skins/${skin}/hitcircleoverlay.png`),
		approachCircle: AssetLoader.image(`./src/images/skins/${skin}/approachcircle.png`),
		/* slider assets */
		sliderBody: AssetLoader.image(`./src/images/skins/${skin}/sliderb0.png`),
		sliderFollowCircle: AssetLoader.image(`./src/images/skins/${skin}/sliderfollowcircle.png`),
		sliderScorePoint: AssetLoader.image(`./src/images/skins/${skin}/sliderscorepoint.png`),
		reverseArrow: AssetLoader.image(`./src/images/skins/${skin}/reversearrow.png`),
		/* spinner assets */
		spinnerApproachCircle: AssetLoader.image(`./src/images/skins/${skin}/spinner-approachcircle.png`),
		spinnerRPM: AssetLoader.image(`./src/images/skins/${skin}/spinner-rpm.png`),
		spinnerTop: AssetLoader.image(`./src/images/skins/${skin}/spinner-top.png`),
		spinnerClear: AssetLoader.image(`./src/images/skins/${skin}/spinner-clear.png`),
		/* healthbar assets */
		scoreBarBg: AssetLoader.image(`./src/images/skins/${skin}/scorebar-bg.png`),
		scoreBarColour: AssetLoader.image(`./src/images/skins/${skin}/scorebar-colour.png`),
		/* combo number assets */
		comboNumbers: [
			AssetLoader.image(`./src/images/skins/${skin}/fonts/aller/default-0.png`),
			AssetLoader.image(`./src/images/skins/${skin}/fonts/aller/default-1.png`),
			AssetLoader.image(`./src/images/skins/${skin}/fonts/aller/default-2.png`),
			AssetLoader.image(`./src/images/skins/${skin}/fonts/aller/default-3.png`),
			AssetLoader.image(`./src/images/skins/${skin}/fonts/aller/default-4.png`),
			AssetLoader.image(`./src/images/skins/${skin}/fonts/aller/default-5.png`),
			AssetLoader.image(`./src/images/skins/${skin}/fonts/aller/default-6.png`),
			AssetLoader.image(`./src/images/skins/${skin}/fonts/aller/default-7.png`),
			AssetLoader.image(`./src/images/skins/${skin}/fonts/aller/default-8.png`),
			AssetLoader.image(`./src/images/skins/${skin}/fonts/aller/default-9.png`),
		],
		/* hit score number assets */
		scoreNumbers: [
			AssetLoader.image(`./src/images/skins/${skin}/hit300.png`),
			AssetLoader.image(`./src/images/skins/${skin}/hit100.png`),
			AssetLoader.image(`./src/images/skins/${skin}/hit50.png`),
			AssetLoader.image(`./src/images/skins/${skin}/hit0.png`),
		],
	};
});