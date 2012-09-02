this.playground = this.playground || {};
this.playground.Photo = this.playground.Photo || {};

(function ($) {

	/*
	 * @class AbstractPhoto
	 */
	(function() {

		var AbstractPhoto = function(photoID) {
			this.initialize(photoID);	
		};
		
		var p = AbstractPhoto.prototype;

		// PRIVATE VARIABLES
		p._id = null;
		p._$dom = null;
		p._$img = null;
		p._img = null;
		p._progress = 0.0;

		// CONSTRUCTOR
		p.initialize = function(photoID) {
			this._id = photoID;
			this._buildDOM();
		};

		// PUBLIC METHODS
		p.id = function() {
			return this._id;
		}

		p.progress = function() {
			return this._progress;
		};

		p.setProgress = function(progress) {
			// Don't accept progress change when the image is set
			if(this._img) return;
			this._progress = progress;			
		};

		p.loading = function() {
			return this._progress < 1.0;	
		};
		
		p.dom = function() {
			return this._$dom;
		};

		p.imageElement = function() {
			return this._img; 
		}
		
		p.setImage = function(img) {
			this._progress = 1.0;
			this._img = img;
			this._$img = $(img);
		};

		// PRIVATE METHODS
		p._buildDOM = function() {
			
		};

		playground.Photo.DATA_PHOTO_ID = "photoID";
		
		playground.Photo.AbstractPhoto = AbstractPhoto;
	}());

	/*
	 * @class Thumbnail
	 */
	(function() {
		
		var Thumbnail = function(photoID) {
			this.initialize(photoID);
		}

		var p = Thumbnail.prototype = new playground.Photo.AbstractPhoto();

		// CONSTANTS
		Thumbnail.WRAPPER_CLASS = "thumbnail";
		Thumbnail.IMAGE_WRAPPER_CLASS = "thumbnail-image";
		
		// CONSTRUCTOR
		p.AbstractPhoto_initialize = p.initialize;
		p.initialize = function(photoID) {
			this.AbstractPhoto_initialize(photoID);
		};

		// PUBLIC METHODS
		p.AbstractPhoto_setImage = p.setImage;
		p.setImage = function(img) {
			this.AbstractPhoto_setImage(img);
			
			this._$dom.find("." + Thumbnail.IMAGE_WRAPPER_CLASS).html(this._$img);			
		};
		
		// PRIVATE METHODS
		p._AbstractPhoto_buildDOM = p._buildDOM;
		p._buildDOM = function() {
			var $div = $("<div>").addClass(Thumbnail.WRAPPER_CLASS).data(playground.Photo.DATA_PHOTO_ID, this._id);
			$div.append($("<div>").addClass(Thumbnail.IMAGE_WRAPPER_CLASS));
			this._$dom = $div;
		};

		playground.Photo.Thumbnail = Thumbnail;
	}());

	/*
	 * @class Photo
	 */
	(function() {
		
		var Photo = function(photoID) {
			this.initialize(photoID);
		};
		
		var p = Photo.prototype = new playground.Photo.AbstractPhoto();

		// CONSTANTS
		Photo.WRAPPER_CLASS = "thumbnail";
		Photo.IMAGE_WRAPPER_CLASS = "thumbnail-image";

		// CONSTRUCTOR
		p.AbstractPhoto_initialize = p.initialize;
		p.initialize = function(photoID) {
			this.AbstractPhoto_initialize(photoID);
		};

		// PUBLIC METHODS
		p.AbstractPhoto_setImage = p.setImage;
		p.setImage = function(img) {
			this.AbstractPhoto_setImage(img);

			this._$dom.find("." + Photo.IMAGE_WRAPPER_CLASS).html(this._$img);
		};

		// PRIVATE METHODS
		p._AbstractPhoto_buildDOM = p._buildDOM;
		p._buildDOM = function() {
			var $div = $("<div>").addClass(Photo.WRAPPER_CLASS).data(playground.Photo.DATA_PHOTO_ID, this._id);
			$div.append($("<div>").addClass(Photo.IMAGE_WRAPPER_CLASS));
			this._$dom = $div;
		};

		playground.Photo.Photo = Photo;	
	}());
	
}(jQuery));
