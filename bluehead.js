class Bluehead {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._läuft = 0;
        this._springen = false;
        this._imSprung = 0;
        this._sprungLänge = 0;
        this._hatBoden = true;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set hatBoden(wert) {
        this._hatBoden = wert;
    }

    start_Sprung() {
        if (this._hatBoden) {
            this._springen = true;
        }
    }

    stop_Sprung() {
        this._springen = false;
    }

    start_vor() {
        this._läuft = 10;
    }

    stop_vor() {
        this._läuft = 0;
    }

    start_zurück() {
        this._läuft = -20;
    }

    stop_zurück() {
        this._läuft = 0;
    }

    fallen() {
        if (this._hatBoden) { return; }
        if (this._imSprung) { return; }
        this._y -= 10;
    }

    weiter() {
        this._x += this._läuft;

        if (this._springen) {
            if (this._sprungLänge < 10) {
                this._sprungLänge += 2;
            }
        }

        if (this._sprungLänge) {
            this._y += 20;
            this._imSprung += 1;

            if (this._imSprung == this._sprungLänge) {
                this._imSprung = this._sprungLänge = 0;
                this._springen = false;
            }
        }
    }
}

const BLOCK_WIDTH = 60, BLOCK_HEIGHT = 50;

class Block {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}

class Welt {
    constructor(blöcke, bluehead, weltBeschreibung) {
        this._blöcke = blöcke;
        this._bluehead = bluehead;
        this._weltBeschreibung = weltBeschreibung;
        this._x = 0;
    }

    static aufbauen(weltBeschreibung) {
        var blöcke = [], bluehead;

        for (var i = 0; i < weltBeschreibung.length; i++) {
            blöcke.push([]);

            for (var j = 0; j < weltBeschreibung[i].length; j++) {
                var feld = weltBeschreibung[i].charAt(j),
                    x = j * BLOCK_WIDTH,
                    y = (weltBeschreibung.length - i - 1) * BLOCK_HEIGHT;

                switch (feld) {
                    case 'x':
                        var block = new Block(x, y);
                        blöcke.push(block);
                        break;

                    case 'B':
                        bluehead = new Bluehead(x, y);
                        break;
                }
            }
        }

        return new Welt(blöcke, bluehead, weltBeschreibung);
    }

    get x() {
        return this._x;
    }

    get bluehead() {
        return this._bluehead;
    }

    get blöcke() {
        return this._blöcke;
    }

    bluehead_fallen() {
        var x = this._bluehead.x,
            y = this._bluehead.y,
            iDec = -(y / BLOCK_HEIGHT - this._weltBeschreibung.length),
            jDec = x / BLOCK_WIDTH,
            iMin = Math.floor(iDec),
            jMin = Math.floor(jDec),
            iMax = iMin,
            jMax = jMin + 1;

        if (iMin < 0) { iMin = 0; }
        if (iMax >= this._weltBeschreibung.length) { iMax = this._weltBeschreibung.length - 1; }
        if (jMin < 0) { jMin = 0; }
        if (jMax >= this._weltBeschreibung[0].length) { jMax = this._weltBeschreibung[0].length - 1; }

        if (iDec > iMin) {
            // Wenn Bluehead nicht genau auf einer Linie ist, fällt er sowieso
            this._bluehead.hatBoden = false;
            this._bluehead.fallen();
        } else {
            // Schauen, ob unter Blueheads Füssen ein Block ist

            for (var i = iMin; i <= iMax; i++) {
                for (var j = jMin; j <= jMax; j++) {
                    var feld = this._weltBeschreibung[i].charAt(j);

                    switch (feld) {
                        case 'x':
                            this._bluehead.hatBoden = true;
            this._bluehead.fallen();
                            return; // nicht fallen
                    }
                }
            }

            this._bluehead.hatBoden = false;
            this._bluehead.fallen();
        }

    }

    weiter() {
        this._x -= 5;
        this.bluehead_fallen();
    }
}


const AM_LAUFEN = 0;
const PAUSE = 10;
const GAME_OVER = 20;

class Spiel {
    constructor(welt) {
        this._welt = welt;
        this._bluehead = welt.bluehead;
        this._status = PAUSE;
    }

    get bluehead() {
        return this._bluehead;
    }

    get welt() {
        return this._welt;
    }

    get status() {
        return this._status;
    }

    weiter() {
        this._bluehead.weiter();
        this._welt.weiter();
    }

    pausieren() {
        switch (this._status) {
            case AM_LAUFEN: this._status = PAUSE; break;
        }
    }

    weitermachen() {
        switch (this._status) {
            case PAUSE: this._status = AM_LAUFEN; break;
        }
    }

}