$(document).ready(function() {
	var windowHeight = $(window).height();
	var testHeight = $(".test-mode").first().outerHeight();
	var headerHeight = $("#header").outerHeight();
	var bottomHeight = $("#bottommenu").outerHeight();
	var bottomHeight2 = $("#bottommenu2").outerHeight();
	var minheight = windowHeight - (testHeight + headerHeight + bottomHeight + bottomHeight2);
	$("#maincontent").css("min-height", minheight + "px");
});