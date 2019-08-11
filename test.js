
QUnit.module("Characterization tests")

QUnit.test("5k stay yields a P(Win) of around .33", function( assert ) {
    for (var i = 0; i < 5000; i++) {
        pickDoor("door" + getRandomInt(0, 3));
        stay();
    }
    assert.ok((Math.abs(game.stayed.won / 5000 - .33)) < .01)
});

QUnit.test("5k switch yields a P(Win) of around .66", function( assert ) {
    for (var i = 0; i < 5000; i++) {
        pickDoor("door" + getRandomInt(0, 3));
        switchDoor();
    }
    assert.ok((Math.abs(game.switched.won / 5000 - .66)) < .01)
});


