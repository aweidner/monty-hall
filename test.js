
QUnit.module("Characterization tests")

QUnit.test("5k stay yields a P(Win) of around .33", function( assert ) {
    initialize(3);
    for (var i = 0; i < 5000; i++) {
        pickDoor("door" + getRandomInt(0, 3));
        stay();
    }
    var pWin = Math.abs(game.stayed.won / 5000)
    assert.ok((pWin - .33) < .02, "p(win) was actually " + pWin)
});

QUnit.test("5k switch yields a P(Win) of around .66", function( assert ) {
    initialize(3);
    for (var i = 0; i < 5000; i++) {
        pickDoor("door" + getRandomInt(0, 3));
        switchDoor();
    }
    var pWin = Math.abs(game.switched.won / 5000)
    assert.ok((pWin - .66) < .02, "p(win) was actually " + pWin);
});
