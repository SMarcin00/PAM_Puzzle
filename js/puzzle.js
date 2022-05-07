let moves = 0;
let interval;
let muted = false;

$(document).ready(function () {
    let pieces = createPieces(true);
    console.log(pieces);
    $("#puzzleContainer").html(pieces);
    $("#btnStart").click(function () {
        let pieces = $("#puzzleContainer div");
        pieces.each(function () {
            let leftPosition = Math.floor(Math.random() * 290) + "px";
            let topPosition = Math.floor(Math.random() * 290) + "px";
            $(this).addClass("draggablePiece").css( {
                position: "absolute",
                left: leftPosition,
                top: topPosition
            })
            $("#pieceContainer").append($(this));
        });

        let pieces2 = createPieces(false);
        $("#puzzleContainer").html(pieces2);
        $(this).hide();
        $("#btnReset").show();

        implementLogic();
        let start = Date.now();
        let minutes = 0
            interval = setInterval(function () {
            let delta = Date.now() - start;
            // console.log(delta);
            let second = Math.floor(delta / 1000) % 60;
            if (second === 0 && delta > 0)
                minutes++;
            let timeText;
            if (second < 10) {
                timeText = minutes + ":0" + second;
            }
            else {
                timeText = minutes + ":" + second;
            }
            let resultText = "Time: " + timeText
            $("#timeContainer").text(resultText);
        }, 1000)

    });
    $("#btnReset").click(function () {
        moves = 0
        let newPieces = createPieces(true);
        $("#puzzleContainer").html(newPieces);
        $(this).hide();
        $("#btnStart").show();
        $("#pieceContainer").empty();
        clearInterval(interval);
        $("#timeContainer").text("Time: 0:00");
    });

    $("#btnMute").click(function () {
        if (muted === false) {
            muted = true;
            $(this).css({
                background:  "url(\"./img/Mute.png\") no-repeat",
                "background-size": "cover",
                width: "25px",
                height: "25px",
                float: "left",
                border: "none",
                cursor: "pointer"
            })

        }
        else {
            muted = false;
            $(this).css({
                background: "url(\"./img/Sound.png\") no-repeat",
                "background-size": "cover",
                width: "25px",
                height: "25px",
                float: "left",
                border: "none",
                cursor: "pointer"
            })

        }
    })
});

function implementLogic() {
    $(".startSpace").droppable({

    });

    $(".draggablePiece").draggable({
        revert: "invalid",
        start: function () {
            if($(this).hasClass("droppedPiece"))
            {
                $(this).removeClass("droppedPiece")
                $(this).parent().removeClass("piecePresent")
            }
        }
    });
    $(".droppableSpace").droppable({
        hoverClass: "ui-state-highlight",
        accept:function (draggable) {
            // return (!$(this).hasClass("piecePresent") || $(this).data("dropped") && $(this).data("dropped").is(draggable))
            return (!$(this).hasClass("piecePresent"))
        },
        drop:function (event, ui) {
            moves++;
            let draggableElement = ui.draggable;
            let droppedOn = $(this);
            droppedOn.addClass("piecePresent");
            $(draggableElement)
                .addClass("droppedPiece")
                .css({
                    top:-1,
                    left:-1,
                    position: "relative"
                }).prependTo(droppedOn);
            $(this).data('dropped', draggableElement);

            // checkIfPuzzleFits

            let orderElement = draggableElement.data("order");
            let orderSpace = $(this).data("order");
            console.log('element' + orderElement);
            console.log('space' + orderSpace);
            if (orderElement === orderSpace) {
                 draggableElement.draggable('disable');
                 let audio = new Audio('./sound/correct.mp3')
                 if (!muted)
                     audio.play();
            }
            else {
                let audio = new Audio('./sound/wrong.mp3')
                if (!muted)
                    audio.play();


            }
            checkIfPuzzleSolved();
        },
        out: function (event, ui) {
            $(this).removeClass("piecePresent");
            $(this).data("dropped", null);
            ui.draggable.removeClass("droppedPiece");
            $(this)
        }
    });

}

function createPieces(widthImage) {
    let rows = 4;
    let columns = 4;
    let pieces = "";
        for (let i=0, top=0, order=0; i<rows; i++, top-=100) {
            for (let j=0, left=0; j<columns; j++, left-=100, order++) {
                if (widthImage) {
                    pieces += "<div style='background-position:" + left + "px " + top + "px;' class='piece' data-order=" + order + "></div>";
                }
                else {
                    pieces += "<div style='background-image: none' class='piece droppableSpace' data-order=" + order +"></div>";
                }
            }
        }
    return pieces
}

function checkIfPuzzleSolved() {
    if ($("#puzzleContainer .droppedPiece").length !== 16) {
        return false;
    }
    for (let i = 0; i < 16; i++) {
        let item = $("#puzzleContainer .droppedPiece:eq(" + i + ")");
        let order = item.data("order");
        if (i !== order) {
            return false;
        }
    }
    $("#pieceContainer").text("Victiory, Moves: " + moves);
    clearInterval(interval);
    let audio = new Audio('./sound/solved.mp3');
    if (!muted)
        audio.play();
    for (let i = 0; i < 16; i++) {
        let item = $("#puzzleContainer .droppedPiece:eq(" + i + ")");
        item.css({
            "-webkit-box-shadow":"",
            "-moz-box-shadow":"",
            "box-shadow":"",
            "width": "102px",
            "height": "102px",
            "border": "",
        })
        let item2 = $("#puzzleContainer .droppableSpace:eq(" + i + ")");
        item2.css({
            "border": "",
        });
    }
    return true;
}