(function(ns) {

    var Circles = function(circlesCount) {
        this.initialize(circlesCount);
    };
    var p = Circles.prototype = new createjs.Container();

    // PUBLIC PROPERTIES
    p.strokeWidth = 15;

    // PRIVATE PROPERTIES
    p._circlesCount = 25;
    p._tweens = null;


    // CONSTRUCTOR
    p.Container_initialize = p.initialize;
    p.initialize = function(circlesCount) {
        this.Container_initialize(); // -> super.initialize

        if(circlesCount) this._circlesCount = circlesCount;
        this._tweens = [];

        this._initCircles();
    };


    // PUBLIC METHODS
    p.moveTo = function(x, y) {
        for(var idx = 0; idx < this._circlesCount; idx++)
        {
            // Push next coordinates for circle
            // Don't create the Tween object right away as we want it to start from the completed coordinates of its
            // previous tween (if any)
            this._tweens[idx].push({ x: x, y: y });

            // Run tween now if no other tween are already present
            if(this._tweens[idx].length == 1)
            {
                this._startFirstTween(idx);
            }
        }
    };

    // PRIVATE METHODS
    p._initCircles = function() {
        // Create as many concentric circles as requested in the constructor
        for(var idx = 0; idx < this._circlesCount; idx++)
        {
            var circle = new createjs.Shape();
            circle.graphics.setStrokeStyle(this.strokeWidth);
            circle.graphics.beginStroke("#113355");
            circle.graphics.drawCircle(0, 0, (idx + 1) * 4); // From the smallest to the largest
            circle.alpha = 1 - idx * 0.02;
            circle.x = circle.y = this._circlesCount * 4 + this.strokeWidth;
            circle.compositeOperation = "lighter";

            // Add an empty coordinates array for each circle
            this._tweens.push([]);

            // And finally, add the circle as a child to our container
            this.addChild(circle);
        }
    };

    // Start moving the circle at given index
    p._startFirstTween = function(circleIdx) {
        // Stop there if we have no new coordinates
        if(this._tweens[circleIdx].length == 0) return;

        // Otherwise, create and start (automatically) a new tween with the next position to go to
        var to = this._tweens[circleIdx][0];
        createjs.Tween.get(this.children[circleIdx]).to(to, (0.5 + circleIdx * 0.04) * 1000, createjs.Ease.cubicInOut).call(this._tweenComplete, [circleIdx], this);
    };

    // Proceed to next move for the circle at given index
    p._startNextTween = function(circleIdx) {
        this._tweens[circleIdx].shift();
        this._startFirstTween(circleIdx);
    };

    // Completion callback for circles tweens
    p._tweenComplete = function(circleIdx) {
        this._startNextTween(circleIdx);
    };


/* Circles is namespaced into playground */
    ns.Circles = Circles;
}(playground || (playground = {})));
var playground;
