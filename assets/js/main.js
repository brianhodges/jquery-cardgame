//Build a standard deck of cards
deck = [];
var suits = [
	{ name: "Spades", unicode: "\u2664", color: "black" },
	{ name: "Diamonds", unicode: "\u2662", color: "red" },
	{ name: "Clubs", unicode: "\u2667", color: "black" },
	{ name: "Hearts", unicode: "\u2661", color: "red" }
];
var ranks = ["Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

for(x = 0; x < suits.length; x++) {
	for(y = 0; y < ranks.length; y++) {
		var card = {
			color: suits[x].color,
			unicode: suits[x].unicode,
			suit: suits[x].name,
			rank: ranks[y]
		};
		deck.push(card);
	}
}

//Events for Displaying Cards
$(function() {
	displayDeck();
	$('#deck-size').text(deck.length);
});

$(document).on('click', '#shuffle-button', function() {
	shuffleDeck();
});

//clears current list, shuffles, and redisplays
function shuffleDeck() {
	$("ul").empty();
	deck = shuffle(deck);
	displayDeck();
}

//displays current deck to list
function displayDeck() {
	for(i = 0; i < deck.length; i++) {
		var card_rank = /^[a-zA-Z()]+$/.test(deck[i].rank) ? deck[i].rank.substring(0,1) : deck[i].rank;
		var el = "<li style='color:" + deck[i].color + "'>" + deck[i].unicode + card_rank + "</li>";
		$('#deck-list').append(el);
	}
}

//shuffles array
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}