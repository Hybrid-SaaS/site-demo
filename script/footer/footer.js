$(document).ready(function() {
	var windowHeight = $(window).height();
	var testHeight = $(".test-mode").first().outerHeight(true);
	var headerHeight = $("#header").outerHeight(true);
	var bottomHeight = $("#bottommenu").outerHeight(true);
	var bottomHeight2 = $("#bottommenu2").outerHeight(true);
	var diff = $(".maincontent").first().outerHeight(true) - $(".maincontent").first().height();
	var minheight = testHeight + headerHeight + bottomHeight + bottomHeight2 + diff + 10;
	$(".maincontent").first().css("min-height", (windowHeight - minheight) + "px");

	$(window).resize(function () {
		windowHeight = $(window).height();
		$(".maincontent").first().css("min-height", (windowHeight - minheight) + "px");
	});
});