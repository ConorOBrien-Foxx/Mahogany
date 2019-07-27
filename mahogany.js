//z
const Draw = {
    clear: function (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}
const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

class Renderable {
    constructor() {

    }

    render(ctx) {

    }
}

class Entity extends Renderable {
    constructor(name, x = 0, y = 0) {
        super();
        this.name = name;
        this.x = x;
        this.y = y;
        this.sprite = null;
    }

    render(ctx) {
        if(this.sprite) {
            ctx.drawImage(this.sprite, this.x, this.y);
        }
    }
}

class Player extends Entity {
    constructor(name, x = 0, y = 0) {
        super(name, x, y);
        this.dxs = new Set();
        this.dys = new Set();
    }

    render(ctx) {
        super.render(ctx);
    }
}

const GAME_TICK_FREQUENCY = 30;
class GameInstance extends Renderable {
    constructor() {
        super();
        this.background = null;
        this.contactMap = document.createElement("canvas");
        this.contactMap.width = GAME_WIDTH;
        this.contactMap.height = GAME_HEIGHT;
        document.body.appendChild(this.contactMap);
        this.contactMapCtx = this.contactMap.getContext("2d");
        this.walk = null;
        this.objects = [];
        this.party = [];
        this.runInterval = null;
    }

    setWalk(newWalk) {
        this.walk = newWalk;
        console.log(this.walk);
    }

    walkPixelAt(x, y) {
        let data = this.contactMapCtx.getImageData(x, y, 1, 1).data;
        // console.log(data);
        return data;
    }

    render(ctx) {
        Draw.clear(ctx);

        Draw.clear(this.contactMapCtx);
        if(this.walk && this.walk.ready) {
            this.contactMapCtx.drawImage(this.walk, 0, 0);
        }

        if(this.background) {
            ctx.drawImage(this.background, 0, 0);
        }

        for(let object of this.objects) {
            object.render(ctx);
        }

        for(let object of this.party) {
            object.render(ctx);
        }
    }

    start() {
        if(this.runInterval) {
            console.error("already running");
            return false;
        }
        console.log("starting...");
        this.runInterval = setInterval(
            this.update.bind(this),
            GAME_TICK_FREQUENCY
        );
    }

    stop() {
        clearInterval(this.runInterval);
        this.runInterval = null;
    }

    isValidCoordinate(x, y) {
        // read from walk map
        let [r, g, b, a] = this.walkPixelAt(x, y)
        if(r == 255 && g == 255 && b == 255) {
            return true;
        }
    }

    // runs on a tick system
    update() {
        for(let player of this.party) {
            let nextX = player.x;
            let nextY = player.y;
            for(let dx of player.dxs) {
                nextX += dx;
            }
            for(let dy of player.dys) {
                nextY += dy;
            }
            // TODO: raycast to make sure out of bounds glitches do not occur
            if(this.isValidCoordinate(nextX, nextY)) {
                player.x = nextX;
                player.y = nextY;
            }
        }
    }

    addPartyDirection(dir) {
        let player = this.party[0];
        player.dxs.add(dir[0]);
        player.dys.add(dir[1]);
    }

    removePartyDirection(dir) {
        let player = this.party[0];
        player.dxs.delete(dir[0]);
        player.dys.delete(dir[1]);
    }
}

const readImage = function (url, cb = null) {
    let img = document.createElement("img");
    img.onload = function () {
        img.crossOrigin = "anonymous";
        img.ready = true;
        if(cb) {
            cb(img);
        }
    }
    img.src = url;
    return img;
}

window.addEventListener("load", function () {
    const game = document.getElementById("game");
    const ctx = game.getContext("2d");

    game.width = GAME_WIDTH;
    game.height = GAME_HEIGHT;

    const instance = new GameInstance(ctx);
    // fetch("./map-01.png")
    //     .then(img => { instance.background = img });
    instance.background = readImage("./map-01.png");
    readImage("./map-01-walk.png", function (img) {
        // instance.setWalk(img);
    });

    let player = new Player("john", 529, 279);
    player.sprite = readImage("./player.png");

    instance.party.push(player);

    let render = function () {
        instance.render(ctx);
    }
    let renderInterval = setInterval(render, 10);
    let keyMap = {
        'a': [-2, 0],
        's': [0,  2],
        'd': [2,  0],
        'w': [0, -2],
    };
    window.addEventListener("keydown", function (ev) {
        let key = ev.key.toLowerCase();
        let dir = keyMap[key];
        if(dir) {
            instance.addPartyDirection(dir);
        }
    });
    window.addEventListener("keyup", function (ev) {
        let key = ev.key.toLowerCase();
        let dir = keyMap[key];
        if(dir) {
            instance.removePartyDirection(dir);
        }
    });

    instance.start();
});
