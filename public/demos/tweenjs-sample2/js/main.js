(function ($) {

    var $canvas = null;
    var stage = null;

    function updateCanvasSize() {
        $canvas.attr("width", $(window).outerWidth());
        $canvas.attr("height", $(window).outerHeight());
    }

    $(document).ready(function () {
        $canvas = $("#stage");
        updateCanvasSize();

        // Create new EaselJS stage from canvas
        stage = new createjs.Stage($canvas[0]);


        // Create our circles compound object (see js/circles.js) and add it to the stage
        var circles = new playground.Circles(25);
        stage.addChild(circles);

        // Position the description div as an EaselJS DOM element
        var $desc = $("#description");
        var desc = new createjs.DOMElement($desc[0]);
        desc.x = 30;
        desc.y = 30;
        desc.alpha = 0.75;
        stage.addChild(desc);

        stage.onMouseUp = function (event) {
            circles.moveTo(stage.mouseX, stage.mouseY);

            // Just for fun — Move the description to the other side of the screen when
            // the user set the circles center below the div
            var pos = $desc.position();
            var dim = { width:$desc.outerWidth(), height:$desc.outerHeight() };
            if (stage.mouseX >= pos.left && stage.mouseX <= pos.left + dim.width &&
                stage.mouseY >= pos.top && stage.mouseY <= pos.top + dim.height) {
                var to = {x:30, y:30};
                if (pos.left === 30) {
                    to = {
                        x:$(window).outerWidth() - dim.width - 30,
                        y:$(window).outerHeight() - dim.height - 30
                    }
                }

                createjs.Tween.get(desc, { override:true }).to(to, 500, createjs.Ease.cubicInOut);
            }
        };

        // Set the stage as listener on the Ticker, so that stage.update() is called periodically
        createjs.Ticker.addListener(stage);
    });

    $(window).resize(function () {
        updateCanvasSize();
        stage.update();
    });

})(jQuery);
