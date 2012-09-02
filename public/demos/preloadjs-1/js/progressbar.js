this.playground = this.playground || {};

(function ($) {

	/*
	 * @class ProgressBar
	 */
	(function() {

		var ProgressBar = function(photoID) {
			this.initialize(photoID);
		};

		var p = ProgressBar.prototype;

		// CONSTANTS
		ProgressBar.WRAPPER_CLASS = "playground-progressbar";
		ProgressBar.PROGRESS_VALUE_CLASS = "playground-progress-value";
		
		// PRIVATE VARIABLES
		p._$dom = null;
		p._$progressDiv = null;
		p._progress = 0.0;

		// CONSTRUCTOR
		p.initialize = function(photoID) {
			this._buildDOM();
		};

		// PUBLIC METHODS
		p.progress = function() {
			return this._progress;
		};

		p.setProgress = function(progress) {
			this._progress = progress;
			
			this._updateProgressDiv();
		};

		p.dom = function() {
			return this._$dom;
		};

		// PRIVATE METHODS
		p._buildDOM = function() {
			this._$dom = $("<div>").addClass(ProgressBar.WRAPPER_CLASS);
			this._$progressDiv = $("<div>").addClass(ProgressBar.PROGRESS_VALUE_CLASS).appendTo(this._$dom);
			
			this._updateProgressDiv();
		};
		
		p._updateProgressDiv = function() {
			this._$progressDiv.css({
				height: String(this._$dom.height()) + "px",
				width: String(this._$dom.width() * this._progress) + "px"
			});
		};

		playground.ProgressBar = ProgressBar;
	}());

}(jQuery));
