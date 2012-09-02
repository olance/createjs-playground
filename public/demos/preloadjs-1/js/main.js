this.playground = this.playground || {};
(function ($) {
	
	(function() {
		var PageController = function() {
			this.initialize();
		};
		var p = PageController.prototype;
		
		// PRIVATE MEMBERS
		p._manifestLoader = null;
		p._thumbnailsLoader = null;
		p._thumbnails = null;
		
		p._photosLoader = null;
		p._photos = null;
		p._progressBar = null;
		
		p._currentPhotoID = null;
		
		// Constructor
		p.initialize = function() {
			p._thumbnails = {};
			p._photos = {};
			
			p._progressBar = new playground.ProgressBar();
			p._progressBar.dom().appendTo($("#photo-wrapper #progress"));
			
			$("#photo-wrapper").click(playground.proxy(this.closeFullView, this));
		};
		
		// PUBLIC METHODS
		p.load = function(manifestPath) {
			this._manifestLoader = new playground.FileLoader(manifestPath, 1);
			this._manifestLoader.progress(playground.proxy(this._manifestProgress, this));
			this._manifestLoader.load();
		};
		
		
		p.closeFullView = function() {
			$("#photo-wrapper").fadeOut();
			this._blockScrolling(false);
		};

		p.openFullView = function() {
			if(!this._currentPhotoID) return;
			
			var thumb = this._thumbnails[this._currentPhotoID],
				photo = this._photos[this._currentPhotoID],
				showThumb = (!photo || photo.loading()),
				image = showThumb ? thumb : photo,
				
				$photoWrapper = $("#photo-wrapper"),
				$photoContainer = $photoWrapper.find("#photo");

			// Show progress bar only when we're waiting for the full-size photo
			if(showThumb)
			{
				$("#photo-wrapper #progress").show();
				this._updateProgressBar(photo.progress());
			}
			else
			{
				$("#photo-wrapper #progress").hide();
			}
			
			this._blockScrolling(true);
			$photoWrapper.fadeIn();

			// Place the image in our photo container and clone it when we display its thumbnail, as we don't want it to 
			// disappear from the thumbnails mosaic
			this._placeImage(image, $photoContainer, showThumb);
		};

		// PRIVATE METHODS
		p._manifestProgress = function(event) {
			switch(event.eventType) {
				case playground.FileLoader.EVENT_TYPE.start_loading:
					$("#manifest-load").fadeIn();
					break;

				case playground.FileLoader.EVENT_TYPE.file_loaded:
				{
					// Use a promise on our selector to let the fadeIn animation finish 
					$("#manifest-load").promise().done(function() { this.fadeOut(); });

					// Parse our manifest and move on to loading thumbnails
					this._manifest = $.parseJSON(event.fileData);
					this._loadThumbnails();
					
					// No longer needed
					delete this._manifestLoader;
					this._manifestLoader = null;
					break;
				}
			}
		};
				
		p._blockScrolling = function(block) {
			$("body")[block ? "addClass" : "removeClass"]("no-scroll");
		};
		
		p._placeImage = function(image, $container, clone) {
			clone = clone || false;
			
			var $img = clone ? $(image.imageElement()).clone() : $(image.imageElement());
			
			$container.html($img);
			
			var imgW   = $img.outerWidth(),
				imgH   = $img.outerHeight(),
				width  = $container.width(),
				height = $container.height();
			
			$img.css({
				position: "absolute",
				top: String(Math.round(height / 2 - imgH / 2)) + "px",
				left: String(Math.round(width / 2 - imgW / 2)) + "px" 
			});
		};
		
		/*
		 *  Thumbnails loading/interaction 		
		 */
		p._loadThumbnails = function() {
			var thumbnails = this._manifest['thumbnails'];
			
			// Create a Photo object for each thumbnail and append it to the thumbnails container
			$.each(thumbnails, playground.proxy(function(idx, thumbnail) {
				var thumb = new playground.Photo.Thumbnail(thumbnail.id);
				thumb.dom().appendTo($("#thumbnails"));
				this._thumbnails[thumbnail.id] = thumb;
			}, this));

			$('.' + playground.Photo.Thumbnail.WRAPPER_CLASS).live('click', playground.proxy(this._thumbnailClick, this));
			
			this._thumbnailsLoader = new playground.FileLoader(thumbnails, 3);
			this._thumbnailsLoader.progress(playground.proxy(this._thumbnailsProgress, this));
			this._thumbnailsLoader.load();			
			
			this._loadPhotos();
		};
		
		p._thumbnailsProgress = function(event) {
			var thumb = this._thumbnails[event.fileID];
			
			switch(event.eventType) {
				case playground.FileLoader.EVENT_TYPE.file_progress:
				{
					thumb.setProgress(event.progress);
					break;
				}
					
				case playground.FileLoader.EVENT_TYPE.file_loaded:
				{
					thumb.setImage(event.fileData);
					break;
				}
			}	
		};
		
		p._thumbnailClick = function(event) {
			var photoID = $(event.currentTarget).data(playground.Photo.DATA_PHOTO_ID),
				thumb = this._thumbnails[photoID],
				photo = this._photos[photoID],
				showThumb = (!photo || photo.loading());
				
			if(thumb.loading()) return false;
			
			this._currentPhotoID = thumb.id();
			this.openFullView();

			return false;
		};
		
		
		/*
		 *  Photos loading/interaction
		 */
		p._loadPhotos = function() {
			var photos = this._manifest['images'];
			
			$.each(photos, playground.proxy(function(idx, photo) {
				var p = new playground.Photo.Photo(photo.id);
				this._photos[photo.id] = p;
				this._updatePhotoProgress(p);
			}, this));
			
			this._photosLoader = new playground.FileLoader(photos, 2);
			this._photosLoader.progress(playground.proxy(this._photosProgress, this));
			this._photosLoader.load();
		};
		
		p._photosProgress = function(event) {
			var photo = this._photos[event.fileID];
			
			switch(event.eventType) {
				case playground.FileLoader.EVENT_TYPE.file_progress:
				{
					photo.setProgress(event.progress);
					this._updatePhotoProgress(photo);
					break;
				}
					
				case playground.FileLoader.EVENT_TYPE.file_loaded:
				{
					photo.setImage(event.fileData);
					
					if(this._currentPhotoID === event.fileID)
					{
						this._placeImage(photo, $("#photo-wrapper #photo"));
						$("#photo-wrapper #progress").hide();
					}
					
					break;
				}
			}			
		};
		
		p._updatePhotoProgress = function(photo) {
			var thumb = this._thumbnails[photo.id()],
				$dom = thumb.dom(),
				progress = photo.progress();
			
			// Map photo.progress from [0.0 ; 1.0] into [0.3 ; 1.0]
			// fade = 0.3 + (1.0 - 0.3) * (progress - 0.0) / (1.0 - 0.0)
			$dom.fadeTo(200, 0.3 + 0.7 * progress);
			
			if(this._currentPhotoID === photo.id())
			{
				this._updateProgressBar(progress);
			}
		};
		
		p._updateProgressBar = function(progress) {
			this._progressBar.setProgress(progress);
			$("#photo-wrapper #progress #progress-value").text(String(progress * 100));
		};
		
		
		// NAMESPACE STATIC METHODS
		playground.proxy = function(func, scope) {
			return function() {
				return func.apply(scope, arguments);
			}
		};

		playground.PageController = PageController;
	}());
	
	
	$(document).ready(function () {
		var pageCtrl = new playground.PageController();		
		
		// Load page content
		pageCtrl.load("images/manifest.json");
		
		$("#hide-description").click(function() {
			$("#description").animate({
				left: -1000
			});
			
			return false;
		});
	});

})(jQuery);
