class Element {
    constructor() {
        this.elements = [];
        this.classList = new ClassList();
    }
    appendChild(element) {
        this.elements.push(element);
    }
}

class ClassList {
    constructor() {
        this._l = [];
    }
    add(className) {
        this._l.push(className)
    }
    remove(className) {
        this._l = this._l.filter(item => item !== className);
    }
    values() { return this._l }
}

var _elementCache = {}
byId = function(elementId) {
    if (!_elementCache[elementId]) {
        _elementCache[elementId] = new Element();
    }
    return _elementCache[elementId];
}

QUnit.testStart(function() {
    _elementCache = {};
});

QUnit.module("Characterization tests")

QUnit.test("5k stay yields a P(Win) of around .33", function( assert ) {
    initialize(3);
    for (var i = 0; i < 5000; i++) {
        pickDoor("door" + getRandomInt(0, 3));
        revealDoor(game, stay, "stayed");
    }
    var pWin = Math.abs(game.stayed.won / 5000)
    assert.ok((pWin - .33) < .03, "p(win) was actually " + pWin)
});

QUnit.test("5k switch yields a P(Win) of around .66", function( assert ) {
    initialize(3);
    for (var i = 0; i < 5000; i++) {
        pickDoor("door" + getRandomInt(0, 3));
        revealDoor(game, switchDoor, "switched");
    }
    var pWin = Math.abs(game.switched.won / 5000)
    assert.ok((pWin - .66) < .03, "p(win) was actually " + pWin);
});

QUnit.module("determineContents")

QUnit.test("Will only select one car", function( assert) {
    var game = { doors: [
        {contains: null},
        {contains: null},
        {contains: null}
    ] }
    determineContents(game);

    var carCount = 0;
    for (var i = 0; i < game.doors.length; i++) {
        carCount += game.doors[i].contains === "car" ? 1 : 0;
    }
    assert.equal(carCount, 1, carCount + " cars actually found");
})

QUnit.test("Will select two goats when there are three doors", function( assert) {
    var game = { doors: [
        {contains: null},
        {contains: null},
        {contains: null}
    ] }
    determineContents(game);

    var goatCount = 0;
    for (var i = 0; i < game.doors.length; i++) {
        goatCount += game.doors[i].contains === "goat" ? 1 : 0;
    }
    assert.equal(goatCount, 2, goatCount + " goats actually found");
})

QUnit.test("Will select n-1 goats when there are n doors", function(assert) {
    var game = { doors: [
        {contains: null},
        {contains: null},
        {contains: null},
        {contains: null},
        {contains: null}
    ] }
    determineContents(game);

    var goatCount = 0;
    for (var i = 0; i < game.doors.length; i++) {
        goatCount += game.doors[i].contains === "goat" ? 1 : 0;
    }
    assert.equal(goatCount, 4, goatCount + " goats actually found");
})

QUnit.module("Switch door")

QUnit.test("Will switch to something other than selected", function(assert) {
    var game = {
        doors: [
            {contains: "goat"},
            {contains: "goat"},
            {contains: "car"},
        ],
        selected: 2,
        revealed: 0,
        switched: { won: 0, lost: 0},
        stayed: { won: 0, lost: 0}
    }
    revealDoor(game, switchDoor, "switched");
    assert.equal(game.selected, 1, game.selected + " was actually selected");
})

QUnit.test("Will update switched won if the car was won", function(assert) {
    var game = {
        doors: [
            {contains: "goat"},
            {contains: "car"},
            {contains: "goat"},
        ],
        selected: 2,
        revealed: 0,
        switched: { won: 0, lost: 0},
        stayed: { won: 0, lost: 0}
    }
    revealDoor(game, switchDoor, "switched");
    assert.equal(game.switched.won, 1);
})

QUnit.test("Will update switched lost if the car was lost", function(assert) {
    var game = {
        doors: [
            {contains: "goat"},
            {contains: "goat"},
            {contains: "car"},
        ],
        selected: 2,
        revealed: 0,
        switched: { won: 0, lost: 0},
        stayed: { won: 0, lost: 0}
    }
    revealDoor(game, switchDoor, "switched");
    assert.equal(game.switched.lost, 1);
})

QUnit.test("Will switch to something other than selected when there are more than 3 doors", function(assert) {
    var game = {
        doors: [
            {contains: "goat"},
            {contains: "goat"},
            {contains: "car"},
            {contains: "goat"},
            {contains: "goat"}
        ],
        selected: 2,
        revealed: 0,
        switched: { won: 0, lost: 0},
        stayed: { won: 0, lost: 0}
    }
    revealDoor(game, switchDoor, "switched");
    assert.ok(game.selected != 2, game.selected + " was actually selected");
})

QUnit.module("UI tests");

QUnit.test("resetAll will reset 3 doors", function(assert) {
    resetAll(game);
    assert.deepEqual(byId("door0").classList.values(), ["unknown"])
    assert.deepEqual(byId("door1").classList.values(), ["unknown"])
    assert.deepEqual(byId("door2").classList.values(), ["unknown"])
})

QUnit.test("resetAll will reset with many doors", function(assert) {
    var game = { doors: [
        {contains: null},
        {contains: null},
        {contains: null},
        {contains: null},
        {contains: null}
    ] }
    resetAll(game);
    assert.deepEqual(byId("door0").classList.values(), ["unknown"])
    assert.deepEqual(byId("door1").classList.values(), ["unknown"])
    assert.deepEqual(byId("door2").classList.values(), ["unknown"])
    assert.deepEqual(byId("door3").classList.values(), ["unknown"])
    assert.deepEqual(byId("door4").classList.values(), ["unknown"])
})

QUnit.test("Initialize will generate elements for doors", function(assert) {
    initialize(5);
    var classList = byId("doors").elements[4].classList;
    assert.ok(classList.contains("door"))
    assert.ok(classList.contains("unknown"));
})
