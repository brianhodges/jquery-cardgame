//Build a standard deck of cards
function buildDeck() {
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
				id: guid(),
				color: suits[x].color,
				unicode: suits[x].unicode,
				suit: suits[x].name,
				rank: ranks[y]
			};
			deck.push(card);
		}
	}
}

//Events for Cards
$(function() {
	dealDeck();
});

$(document).on('click', '#deal-button', function() {
	dealDeck();
});

$(document).on('click', 'li', function() {
	console.log(this.id);
});

//clears current game, shuffles, and deals
function dealDeck() {
	buildDeck();
	shuffleDeck();
	$('#player-1').empty();
	$('#player-2').empty();
	displayDeck();
}

function shuffleDeck() {
	for (i = 0; i < 10; i++) {
		deck = shuffle(deck);
	}
}

//displays current deck to list
function displayDeck() {
	for(x = 0; x < 5; x++) {
		var card_rank = /^[a-zA-Z()]+$/.test(deck[x].rank) ? deck[x].rank.substring(0,1) : deck[x].rank;
		var el = "<li id='" + deck[x].id + "' style='color:" + deck[x].color + "'>" +
				"<span class='card-item'>" + deck[x].unicode + card_rank + "</li>";
		$('#player-1').append(el);
		deck.splice(x, 1);
	}
	shuffleDeck();
	for(y = 0; y < 5; y++) {
		var card_rank2 = /^[a-zA-Z()]+$/.test(deck[y].rank) ? deck[y].rank.substring(0,1) : deck[y].rank;
		var el2 = "<li id='" + deck[y].id + "' style='color:" + deck[y].color + "'>" +
				"<span class='card-item'>" + deck[y].unicode + card_rank2 + "</span></li>";
		$('#player-2').append(el2);
		deck.splice(y, 1);
	}
	$('#deck-size').text(deck.length);
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

//generates random GUID
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}