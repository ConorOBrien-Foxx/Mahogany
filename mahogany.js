//z
class GameInstance {

};
class Map {

};
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

window.addEventListener("load", function () {
    const game = document.getElementById("game");
    const width = 960;
    const height = 540;

    game.width = width;
    game.height = height;

    window.addEventListener("keydown", function (ev) {
        console.log(ev);
    })
});
