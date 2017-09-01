//Build a standard deck of cards
function buildDeck() {
	deck = [];
	player1_swap = 3;
	player2_swap = 3;
	suits = [
		{ name: "Spades", unicode: "\u2664", color: "black" },
		{ name: "Diamonds", unicode: "\u2662", color: "red" },
		{ name: "Clubs", unicode: "\u2667", color: "black" },
		{ name: "Hearts", unicode: "\u2661", color: "red" }
	];
	ranks = ["Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
	
	for(x = 0; x < suits.length; x++) {
		for(y = 0; y < ranks.length; y++) {
			card = {
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

//Events for Game
$(function() {
	dealDeck();
});

$(document).on('click', '#deal-button', function() {
	dealDeck();
});

//remove card onclick and replace with one from deck
$(document).on('click', 'li', function() {
	id = this.id;
	allowed = false;
	if (id.indexOf("Player1") >= 0) {
		if (player1_swap > 0) {
			player1_swap--;
			allowed = true;
		}
	} else {
		if (player2_swap > 0) {
			player2_swap--;
			allowed = true;
		}
	}
	if (deck.length > 0 && allowed) {
		shuffleDeck();
		card_rank = /^[a-zA-Z()]+$/.test(deck[0].rank) ? deck[0].rank.substring(0,1) : deck[0].rank;
		$(this).html("<span class='card-item'>" + deck[0].unicode + card_rank + "</span>");
		$(this).css('color', deck[0].color);
		deck.splice(0, 1);
		$('#player-1-swap').text(player1_swap);
		$('#player-2-swap').text(player2_swap);
	}
});

//clears current game, shuffles, and deals
function dealDeck() {
	buildDeck();
	shuffleDeck();
	$('#player-1').empty();
	$('#player-2').empty();
	displayDeck();
	$('#player-1-swap').text(player1_swap);
	$('#player-2-swap').text(player2_swap);
}

//shuffles the deck 10 times
function shuffleDeck() {
	for (i = 0; i < 10; i++) {
		deck = shuffle(deck);
	}
}

//displays current deck to list
function displayDeck() {
	//player1
	for(x = 0; x < 5; x++) {
		card_rank = /^[a-zA-Z()]+$/.test(deck[x].rank) ? deck[x].rank.substring(0,1) : deck[x].rank;
		el = "<li id='Player1-" + deck[x].id + "' style='color:" + deck[x].color + "'>" +
				"<span class='card-item'>" + deck[x].unicode + card_rank + "</li>";
		$('#player-1').append(el);
		deck.splice(x, 1);
	}
	shuffleDeck();
	//player1
	for(y = 0; y < 5; y++) {
		card_rank2 = /^[a-zA-Z()]+$/.test(deck[y].rank) ? deck[y].rank.substring(0,1) : deck[y].rank;
		el2 = "<li id='Player2-" + deck[y].id + "' style='color:" + deck[y].color + "'>" +
				"<span class='card-item'>" + deck[y].unicode + card_rank2 + "</span></li>";
		$('#player-2').append(el2);
		deck.splice(y, 1);
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