// Fisher-Yates/Knuth Shuffle

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// while there remain elements to shuffle...
	while (0 !== currentIndex) {
		// pick remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// ...and swap it with current element
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	};

	return array;
};