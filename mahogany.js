//z
const Draw = {
    clear: function (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}


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
    }
}

class GameInstance extends Renderable {
    constructor() {
        super();
        this.background = null;
        this.objects = [];
        this.party = [];
    }

    render(ctx) {
        Draw.clear(ctx);

        if(this.background) {
            ctx.drawImage(this.background, 0, 0);
        }

        for(let object of this.objects) {
            object.render(ctx);
        }
    }
}

const readImage = function (url) {
    let img = document.createElement("img");
    img.src = url;
    return img;
}

window.addEventListener("load", function () {
    const game = document.getElementById("game");
    const ctx = game.getContext("2d");
    const width = 960;
    const height = 540;

    game.width = width;
    game.height = height;

    const instance = new GameInstance(ctx);
    // fetch("./map-01.png")
    //     .then(img => { instance.background = img });
    instance.background = readImage("./map-01.png");

    let player = new Player("john", 529, 279);
    player.sprite = readImage("./player.png");

    instance.objects.push(player);

    let render = function () {
        instance.render(ctx);
    }
    let renderInterval = setInterval(render, 100);
    window.addEventListener("keydown", function (ev) {
        console.log(ev);
    })
});
