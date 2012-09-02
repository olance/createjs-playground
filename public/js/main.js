(function($) {
    function updatePlaygroundDimensions()
    {
        $header = $("#header");
        $footer = $("#footer");
        $playground = $("#playground-content");

        $playground.height($(window).outerHeight() - $header.outerHeight() - $footer.outerHeight());
    }

	function openDemoFromHash() 
	{
		if(window.location.hash.length > 0)
		{
			$(window.location.hash).click();
		}
	}
	
    $(document).ready(function() {
        updatePlaygroundDimensions();
        $(window).resize(updatePlaygroundDimensions);

        $("#header #menu li a").click(function() {
            $("#header #menu li").removeClass("active");
            $(this).parent().addClass("active");
	        
	        $("#" + $(this).attr("target")).attr("src", $(this).attr("href"));
	        window.location.hash = "#" + $(this).attr("id");
	        
	        return false;
        });
	    
	    // A *very* simple URL fragment "management" to open the correct sample from window.location
	    openDemoFromHash();
	    if("onhashchange" in window)
	    {
		    window.onhashchange = openDemoFromHash;
	    }
    });
}(jQuery));
