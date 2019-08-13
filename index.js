var game = {}

function initialize(numDoors) {
    game = {
        doors: [],
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
    for (var i = 0; i < numDoors; i++) {
        game.doors.push({ contains: null })     
        byId("doors").appendChild(createDoor(i));
    }
}

function resetInitialization() {
    var numberOfDoors = parseInt(byId("doorNumber").value)
    if (numberOfDoors < 3) { 
        return;
    }

    var doors = byId("doors");
    while(doors.firstChild && doors.removeChild(doors.firstChild));
    initialize(numberOfDoors);
    updateScore(game);
    resetAll(game);
}

function byId(elementId) {
    return document.getElementById(elementId);
}

function createDoor(index) {
    var door = document.createElement("div");
    var id = "door" + index;
    door.classList.add("door")
    door.classList.add("unknown");
    door.setAttribute("id", id);
    door.onclick = pickDoor.bind(null, id);
    return door;
}

function play1kSwitch() {
    for (var i = 0; i < 1000; i++) {
        pickDoor("door" + getRandomInt(0, game.doors.length));
        byId("switch-button").click()
    }
}

function play1kStay() {
    for (var i = 0; i < 1000; i++) {
        pickDoor("door" + getRandomInt(0, game.doors.length));
        byId("stay-button").click()
    }
}

function pickDoor(doorId) {
    game.selected = parseInt(doorId.replace("door", ""));
    determineContents(game);
    revealGoat();

    byId("switch-stay").classList.remove("hidden");
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function determineContents(game) {
    var doors = game.doors.length;
    var carIndex = getRandomInt(0, doors);
    var goatIndexes = Array.from(Array(doors).keys());

    goatIndexes.splice(carIndex, 1);

    game.doors[carIndex].contains = "car";
    for (var i = 0; i < goatIndexes.length; i++) {
        game.doors[goatIndexes[i]].contains = "goat";
    }
}

function revealGoat() {
    goatIndexes = [];                
    for (var i = 0; i < game.doors.length; i++) {
        if (game.doors[i].contains === "goat") {
            goatIndexes.push(i);
        }
    }

    game.revealed = goatIndexes.filter(goatIndex => goatIndex !== game.selected)[0];
    byId("door" + game.revealed).classList.add("goat");
}

function switchDoor(game) {
    var possible = Array.from(game.doors.keys()).filter(index => {
        return (index !== game.revealed &&
                index !== game.selected)
    });
    game.selected = possible[getRandomInt(0, possible.length)];
}

function stay() {}

function revealDoor(game, switchingStrategy, incrementField) {
    switchingStrategy(game)
    if (game.doors[game.selected].contains === "car") {
        game[incrementField].won += 1;
    } else {
        game[incrementField].lost += 1;
    }
    updateScore(game);
    resetAll(game);
}

function updateScore(game) {
    byId("switched-won").innerHTML = game.switched.won
    byId("switched-lost").innerHTML = game.switched.lost
    byId("stayed-won").innerHTML = game.stayed.won
    byId("stayed-lost").innerHTML = game.stayed.lost

    byId("probability-winning-stayed").innerHTML = game.stayed.won / (game.stayed.won + game.stayed.lost)
    byId("probability-winning-switched").innerHTML = game.switched.won / (game.switched.won + game.switched.lost)
}

function resetAll(game) {
    for (var i = 0; i < game.doors.length; i++) {
        reset("door" + i);
    }
    byId("switch-stay").classList.add("hidden");
}

function reset(doorId) {
    var door = byId(doorId);
    door.classList.remove("goat");
    door.classList.add("unknown");
}
