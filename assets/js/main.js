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
	if (player1_swap <= 0) { $('#player-1-complete').hide(); }
	if (player2_swap <= 0) { $('#player-2-complete').hide(); }
	if (player1_swap <= 0 && player2_swap <= 0) { analyzePlayerHands(); }
}

function analyzePlayerHands() {
	player1_hand = [];
	player2_hand = [];
	$('.Player1').each(function (i, obj) {
		card_pieces = $(obj).text().toString().split(' ');
		unicode = (escape(card_pieces[0])).replace('%', '\\');
		rank = getNumericalRank(card_pieces[1]);
		card = {
			unicode: unicode,
			rank: rank
		};
		player1_hand.push(card);
	});
	$('.Player2').each(function (i, obj) {
		card_pieces = $(obj).text().toString().split(' ');
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
	determineWinner(player1_score, player2_score);
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
	if (isTwoPair(hand)) { score = 3; }
	if (isThree(hand)) { score = 4; }
	if (isFour(hand)) { score = 8; }
	if (isFlush(hand)) { score = 6; }
	if (isFullHouse(hand)) { score = 7; }
	if (isStraight(hand)) { score = (isStraightFlush(hand)) ? ((isRoyal(hand)) ? 10 : 9) : 5; }
	return score;
}

//search hand
function search(hand, n) {
    var i;
    for (i = 0; i < 5; i++) {
        if (hand[i].rank == n) { return true; }
    }
    return false;
}

//high card
function highCard(hand) {
	var rank = 0;
	for (i = 0; i < hand.length; i++) {
		if (hand[i].rank > rank) { rank = hand[i].rank; }
	}
	return rank;
}

//pair
function isPair(hand) {
    var i, j;
    for (i = 0; i < 4; i++) {
        for (j = i + 1; j < 5; j++) {
            if (hand[i].rank == hand[j].rank) { return true; }
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

//four of a kind
function isFour(hand) {
    if (hand[0].rank == hand[1].rank && hand[1].rank == hand[2].rank && hand[2].rank == hand[3].rank) { return true; }
    if (hand[0].rank == hand[1].rank && hand[1].rank == hand[2].rank && hand[2].rank == hand[4].rank) { return true; }
    if (hand[0].rank == hand[1].rank && hand[1].rank == hand[3].rank && hand[3].rank == hand[4].rank) { return true; }
    if (hand[0].rank == hand[2].rank && hand[2].rank == hand[3].rank && hand[3].rank == hand[4].rank) { return true; }
    if (hand[1].rank == hand[2].rank && hand[2].rank == hand[3].rank && hand[3].rank == hand[4].rank) { return true; }
    return false;
}

//two pair
function isTwoPair(hand) {
	pairs = [];
	for (i = 0; i < hand.length; i++) {
		pairs.push(hand[i].rank);
	}
	grouping = groupBy(pairs);
	return (Object.keys(grouping).length == 3) ? true : false;
}

//fullhouse
function isFullHouse(hand) {
	pairs = [];
	success = true;
	for (i = 0; i < hand.length; i++) {
		pairs.push(hand[i].rank);
	}
	grouping = groupBy(pairs);
	if (Object.keys(grouping).length == 2) {
		Object.values(grouping).forEach(function(value) {
			if (value < 2) { success = false; }
		});
	} else { success = false; }
	return success;
}

//flush - all same suit
function isFlush(hand) {
    var i, suit;
    suit = hand[0].unicode;
    for (i = 1; i < 5; i++) {
        if (hand[i].unicode != suit) { return false; }
	}
    return true;
}

//straight - ranks chronological
function isStraight(hand) {
    var i, min;
	min = 20;
    for (i = 0; i < 5; i++) {
        if (hand[i].rank < min) { min = hand[i].rank; }
	}
    if (search(hand, min + 1)) {
        if (search(hand, min + 2)) {
            if (search(hand, min + 3)) {
                if (search(hand, min + 4)) { return true; }
			}
		}
	}
    return false;
}

//straight flush - ranks chronological and same suit
function isStraightFlush(hand) {
    var suit = hand[0].unicode;
    var i;
    for (i = 1; i < 5; i++) {
        if (hand[i].unicode != suit) { return false; }
	}
    return true;
}

//straight flush but with Ace, King, Queen, Jack, 10
function isRoyal(hand) {
    if (search(hand, 14)) { return true; }
    return false;
}

function determineWinner(player1_score, player2_score) {
	if (player1_score > player2_score) {
		alert("Player 1 Won with a " + scoreToString(player1_score));
	} else if (player2_score > player1_score) {
		alert("Player 2 Won with a " + scoreToString(player2_score));
	} else {
		player1_highcard = highCard(player1_hand);
		player2_highcard = highCard(player2_hand);
		if (player1_highcard > player2_highcard) {
			alert("Player 1 Won with a " + scoreToString(player1_score));
		} else if (player2_highcard > player1_highcard) {
			alert("Player 2 Won with a " + scoreToString(player2_score));
		} else {
			alert("Draw");
		}
	}
}

function scoreToString(score) {
	switch (score) {
		case 2:
			return "Pair";
		case 3:
			return "Two Pair";
		case 4:
			return "Three Of A Kind";
		case 5:
			return "Straight";
		case 6:
			return "Flush";
		case 7:
			return "Full House";
		case 8:
			return "Four Of A Kind";
		case 9:
			return "Straight Flush";
		case 10:
			return "Royal Flush";
		default:
			return "High Card";
	}
}

function groupBy(arr) {
	var hist = {};
	arr.map( function (a) { if (a in hist) hist[a] ++; else hist[a] = 1; } );
	return hist;
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