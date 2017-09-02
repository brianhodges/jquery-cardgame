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

$(document).on('click touchstart', '#deal-button', function() {
	dealDeck();
});

$(document).on('click touchstart', '#player-1-complete', function() {
	player1_swap = 0;
	decideGameOver();
});

$(document).on('click touchstart', '#player-2-complete', function() {
	player2_swap = 0;
	decideGameOver();
});

//remove card onclick and replace with one from deck
$(document).on('click touchstart', 'li', function() {
	allowed = false;
	if ($(this).hasClass("Player1")) {
		if (player1_swap > 0) {
			player1_swap--;
			allowed = true;
		}
	} else if ($(this).hasClass("Player2")) {
		if (player2_swap > 0) {
			player2_swap--;
			allowed = true;
		}
	}
	if (allowed) {
		shuffleDeck();
		card_rank = /^[a-zA-Z()]+$/.test(deck[0].rank) ? deck[0].rank.substring(0,1) : deck[0].rank;
		$(this).html("<span class='card-item'>" + deck[0].unicode + " " + card_rank + "</span>");
		$(this).css('color', deck[0].color);
		deck.splice(0, 1);
		updateSwapCounts();
	}
	decideGameOver();
});

//clears current game, shuffles, and deals
function dealDeck() {
	buildDeck();
	shuffleDeck();
	$('#player-1').empty();
	$('#player-2').empty();
	updateSwapCounts();
	$('#player-1-complete').show();
	$('#player-2-complete').show();
	displayDeck();
}

function updateSwapCounts() {
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
		el = "<li class='Player1' style='color:" + deck[x].color + "'>" +
				"<span class='card-item'>" + deck[x].unicode + " " + card_rank + "</li>";
		$('#player-1').append(el);
		deck.splice(x, 1);
	}
	shuffleDeck();
	//player2
	for(y = 0; y < 5; y++) {
		card_rank2 = /^[a-zA-Z()]+$/.test(deck[y].rank) ? deck[y].rank.substring(0,1) : deck[y].rank;
		el2 = "<li class='Player2' style='color:" + deck[y].color + "'>" +
				"<span class='card-item'>" + deck[y].unicode + " " + card_rank2 + "</span></li>";
		$('#player-2').append(el2);
		deck.splice(y, 1);
	}
}

//determine if players are done 
function decideGameOver() {
	updateSwapCounts();
	if (player1_swap <= 0)
		$('#player-1-complete').hide();
	if (player2_swap <= 0)
		$('#player-2-complete').hide();
	if (player1_swap <= 0 && player2_swap <= 0)
		analyzePlayerHands();
}

function analyzePlayerHands() {
	player1_hand = [];
	player2_hand = [];
	$('.Player1').each(function (i, obj) {
		card_text = $(obj).text().toString();
		card_pieces = card_text.split(' ');
		unicode = (escape(card_pieces[0])).replace('%', '\\');
		rank = getNumericalRank(card_pieces[1]);
		card = {
			unicode: unicode,
			rank: rank
		};
		player1_hand.push(card);
	});
	$('.Player2').each(function (i, obj) {
		card_text = $(obj).text().toString();
		card_pieces = card_text.split(' ');
		unicode = (escape(card_pieces[0])).replace('%', '\\');
		rank = getNumericalRank(card_pieces[1]);
		card = {
			unicode: unicode,
			rank: rank
		};
		player2_hand.push(card);
	});
	player1_score = evaluateHand(player1_hand);
	player2_score = evaluateHand(player2_hand);
	console.log(player1_score);
	console.log(player2_score);
	alert('Game Over');
}

function getNumericalRank(input) {
	var rank;
	switch (input) {
		case "J":
			rank = 11;
			break;
		case "Q":
			rank = 12;
			break;
		case "K":
			rank = 13;
			break;
		case "A":
			rank = 14;
			break;
		default:
			rank = parseInt(input);
	}
	return rank;
}

function evaluateHand(hand) {
	score = 0;
	if (isPair(hand)) { score = 2; }
	if (isThree(hand)) { score = 3; }
	return score;
}

//pair
function isPair(hand) {
    var i;
	var j;

    for (i = 0; i < 4; i++) {
        for (j = i + 1; j < 5; j++) {
            if (hand[i].rank == hand[j].rank){
                return true;
            }
		}
	}
    return false;
}

//three of a kind
function isThree(hand) {
    if (hand[0].rank == hand[1].rank && hand[1].rank == hand[2].rank) { return true; }
    if (hand[0].rank == hand[1].rank && hand[1].rank == hand[3].rank) { return true; }
    if (hand[0].rank == hand[1].rank && hand[1].rank == hand[4].rank) { return true; }
    if (hand[0].rank == hand[3].rank && hand[3].rank == hand[4].rank) { return true; }
    if (hand[0].rank == hand[2].rank && hand[2].rank == hand[3].rank) { return true; }
    if (hand[0].rank == hand[2].rank && hand[2].rank == hand[4].rank) { return true; }
    if (hand[2].rank == hand[3].rank && hand[3].rank == hand[4].rank) { return true; }
    if (hand[1].rank == hand[2].rank && hand[2].rank == hand[3].rank) { return true; }
    if (hand[1].rank == hand[2].rank && hand[2].rank == hand[4].rank) { return true; }
    if (hand[1].rank == hand[3].rank && hand[3].rank == hand[4].rank) { return true; }
    return false;
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