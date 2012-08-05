(function($) {
    function updatePlaygroundDimensions()
    {
        $header = $("#header");
        $footer = $("#footer");
        $playground = $("#playground-content");

        $playground.height($(window).outerHeight() - $header.outerHeight() - $footer.outerHeight());
    }

    $(document).ready(function() {
        updatePlaygroundDimensions();
        $(window).resize(updatePlaygroundDimensions);

        $("#header #menu li a").click(function() {
            $("#header #menu li").removeClass("active");
            $(this).parent().addClass("active");
        });
    });
}(jQuery));
