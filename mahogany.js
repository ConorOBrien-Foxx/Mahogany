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

class GameInstance extends Renderable {
    constructor() {
        super();
        this.background = null;
        this.objects = [];
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
};

window.addEventListener("load", function () {
    const game = document.getElementById("game");
    const ctx = game.getContext("2d");
    const width = 960;
    const height = 540;

    game.width = width;
    game.height = height;

    const instance = new GameInstance(ctx);
    fetch("./map-01.png")
        .then(img => { instance.background = img });

    let render = function () {
        instance.render(ctx);
    }
    let renderInterval = setInterval(render, 100);
    window.addEventListener("keydown", function (ev) {
        console.log(ev);
    })
});
