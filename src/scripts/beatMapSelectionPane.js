define(function(require) {
	const utils = require("src/scripts/utils.js")
	const Formulas = require("src/scripts/formulas.js");
	const starRating = require("src/scripts/starRating.js");
	return {
		group: function(maps, i) {
			let mapsHTML = "";
			let iconsHTML = "";
			for (let j = 0; j < maps.length; j++) {
				let mapStarRating = starRating.calculate(maps[j]);
				iconsHTML += `<img class="beatmap-selection-group-pane-difficulties-icon" src="./src/images/difficulty-icons/${Formulas.beatmapDifficultyIcon(mapStarRating)}-difficulty.png">`
				mapsHTML += this.map(maps[j], i, j, mapStarRating);
			}
			return `<div class="beatmap-selection-group">
						<div data-audiosource="${maps[0].Creator + maps[0].Title + maps[0].AudioFilename}" class="beatmap-selection-group-pane triangle-background">
							<div>${maps[0].Title}</div>
							<div class="beatmap-selection-group-pane-artist-name">${maps[0].Artist}</div>
							${iconsHTML}
						</div>
						<div class="beatmap-selection-group-pane-maps" style="display: none;">
							${mapsHTML}
						</div>
					</div>`;
		},
		map: function(beatmap, groupIndex, mapIndex, mapStarRating) {
			let stars = "";
			if (mapStarRating < 10) {
				for (let i = 0; i < mapStarRating; i++) {
					let size = Math.round(utils.map(mapStarRating - i, 1, 0, 1, 0.5) * 100) / 100;
					if (size >= 1) {
						size = 1;
					}
					if (size <= 0.5) {
						size = 0.5;
					}
					stars += `<img style="transform: scale(${size}); opacity: ${(size > 0.5) ? 1 : 0.5}; width: 3.5vh;" src="./src/images/star.png">`;
				}
			} else {
				stars = `<img src="./src/images/star.png" style="width: 3.5vh;"><p style="display: inline;">${"x" + (Math.round(mapStarRating * 100) / 100)}</p>`
			}
			return `<div data-group-index="${groupIndex}" data-map-index="${mapIndex}" class="beatmap-selection-map-pane triangle-background">
						<img class="beatmap-selection-map-pane-difficulty-icon" src="./src/images/difficulty-icons/${Formulas.beatmapDifficultyIcon(mapStarRating)}-difficulty.png">
							<div>
								<b class="beatmap-selection-group-map-difficulty-name">${beatmap.Version}</b>
								<div class="beatmap-selection-map-pane-mapper-name">mapped by ${beatmap.Creator}</div>
							</div>
							${stars}						
					</div>`;
		},
	};
});