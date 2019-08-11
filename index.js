var game = {
    doors: [{
        contains: null
    }, {
        contains: null
    }, {
        contains: null
    }],
    switched: {
        won: 0,
        lost: 0,
    },
    stayed: {
        won: 0,
        lost: 0
    },
    selected: null,
    revealed: null
}

function play1kSwitch() {
    for (var i = 0; i < 1000; i++) {
        document.getElementById("door" + getRandomInt(0, 3) + "button").click()
        document.getElementById("switch-button").click()
    }
}

function play1kStay() {
    for (var i = 0; i < 1000; i++) {
        document.getElementById("door" + getRandomInt(0, 3) + "button").click()
        document.getElementById("stay-button").click()
    }
}

function pickDoor(doorId) {
    game.selected = parseInt(doorId.replace("door", ""));
    determineContents();
    revealGoat();

    document.getElementById("choose-door").classList.add("hidden");
    document.getElementById("switch-stay").classList.remove("hidden");
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function determineContents() {
    var carIndex = getRandomInt(0, 3);
    var goatIndexes = [0, 1, 2];
    goatIndexes.splice(carIndex, 1);

    game.doors[carIndex].contains = "car";
    game.doors[goatIndexes[0]].contains = "goat";
    game.doors[goatIndexes[1]].contains = "goat";
}

function revealGoat() {
    goatIndexes = [];                
    for (var i = 0; i < game.doors.length; i++) {
        if (game.doors[i].contains === "goat") {
            goatIndexes.push(i);
        }
    }

    game.revealed = goatIndexes.filter(goatIndex => goatIndex !== game.selected)[0];
    document.getElementById("door" + game.revealed).classList.add("goat");
}

function switchDoor() {
    game.selected = [0, 1, 2].filter(index => index !== game.revealed && index !== game.selected)[0];

    if (game.doors[game.selected].contains === "car") {
        game.switched.won += 1;
    } else {
        game.switched.lost += 1;
    }
    updateScore();
    resetAll();
}

function stay() {
    if (game.doors[game.selected].contains === "car") {
        game.stayed.won += 1;
    } else {
        game.stayed.lost += 1;
    }
    updateScore();
    resetAll();
}

function updateScore() {
    document.getElementById("switched-won").innerHTML = game.switched.won
    document.getElementById("switched-lost").innerHTML = game.switched.lost
    document.getElementById("stayed-won").innerHTML = game.stayed.won
    document.getElementById("stayed-lost").innerHTML = game.stayed.lost

    document.getElementById("probability-winning-stayed").innerHTML = game.stayed.won / (game.stayed.won + game.stayed.lost)
    document.getElementById("probability-winning-switched").innerHTML = game.switched.won / (game.switched.won + game.switched.lost)
}

function resetAll() {
    reset("door0");
    reset("door1");
    reset("door2");
    document.getElementById("switch-stay").classList.add("hidden");
    document.getElementById("choose-door").classList.remove("hidden");
}

function reset(doorId) {
    var door = document.getElementById(doorId);
    door.classList.remove("goat");
    door.classList.add("unknown");
}