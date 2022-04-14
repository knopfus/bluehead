class ObjektDarsteller {
    constructor(objekt, div) {
        this._objekt = objekt;
        this._div = div;
    }

    stelleDar() {
        this._div.style.left = this._objekt.x;
        this._div.style.bottom = this._objekt.y;
    }

    static vonVorlage(objekt, divVorlage) {
        var div = divVorlage.cloneNode(true);
        div.removeAttribute("id");
        var darsteller = new ObjektDarsteller(objekt, div);
        darsteller.stelleDar();
        divVorlage.parentElement.appendChild(div);
        return darsteller;
    }
}

class WeltDarsteller {
    constructor(welt, blueheadDarsteller, blockDarstellers, div) {
        this._welt = welt;
        this._blueheadDarsteller = blueheadDarsteller;
        this._blockDarstellers = blockDarstellers;
        this._div = div;
    }

    static vonVorlage(welt, divBluehead, divVorlage, divWelt) {
        var blueheadDarsteller = new ObjektDarsteller(welt.bluehead, divBluehead),
            blockDarstellers = [];

        for (var i = 0; i < welt.blöcke.length; i++) {
            var block = welt.blöcke[i],
                blockDarsteller = ObjektDarsteller.vonVorlage(block, divVorlage);
            blockDarstellers.push(blockDarsteller);
        }

        return new WeltDarsteller(welt, blueheadDarsteller, blockDarstellers, divWelt);
    }

    stelleDar() {
        this._blueheadDarsteller.stelleDar();
        this._div.style.left = this._welt.x;
    }
}

var welt = Welt.aufbauen(Welt1Beschreibung),
    spiel = new Spiel(welt),
    blueheadDiv = document.querySelector("#Bluehead"),
    blockVorlageDiv = document.querySelector("#Block-Vorlage"),
    weltDiv = document.querySelector("#Welt"),
    weltDarsteller = WeltDarsteller.vonVorlage(welt, blueheadDiv, blockVorlageDiv, weltDiv),
    spielDarsteller = weltDarsteller;

const NOOP = function() {};



window.onkeydown = function(event) {
    switch (event.key) {
        case "ArrowLeft":  spiel.weitermachen();
                           spiel.bluehead.start_zurück(); break;
        case "ArrowRight": spiel.weitermachen();
                           spiel.bluehead.start_vor(); break;
        case " ":          spiel.weitermachen();
                           spiel.bluehead.start_Sprung(); break;
        case "p":          spiel.pausieren();
                           spielDarsteller.stelleDar(); break;
    }
};

window.onkeyup = function(event) {
    switch (event.key) {
        case "ArrowLeft":  spiel.weitermachen();
                           spiel.bluehead.stop_zurück(); break;
        case "ArrowRight": spiel.weitermachen();
                           spiel.bluehead.stop_vor(); break;
        case " ":          spiel.weitermachen();
                           spiel.bluehead.stop_Sprung(); break;
    }
};


spiel.weiter();
spielDarsteller.stelleDar();

(function wiederhole() { window.setTimeout(function() {
    if (spiel.status == AM_LAUFEN) {
        spiel.weiter();
        spielDarsteller.stelleDar();
    }

    wiederhole();
}, 50);})();
