$(document).ready(function () {

	for (var elem in document.getElementsByTagName("link")) {
		var node = document.getElementsByTagName("link")[elem];
		if (typeof node == "object") {
			if (node.getAttribute("href") == "/Website/CSS/Product-detail") {
				node.parentNode.removeChild(node);
			}
		}
	}
	var guid = WebPage.Data.productGuid;
	$("#header .content").append("<div title='Ga naar uw winkelwagen' class='cart-wrap' id='shoppingCart'>" +
		"<div class='image'><img class='cart' style='width: 48px; height: 48px;' alt='Winkelwagen' src='https://raw.githubusercontent.com/Hybrid-SaaS/site-demo/master/images/basket_48.png'></div>" +
		"<div class='text'><div id='cart-count'><span id='shoppingcart_amount'>0</span> product<span id='shoppingcart_text'>en</span></div><div>" +
		"€ <span id='shoppingcart_total'>0.00</span></div></div></div>").addClass("clearfix");
	$(".body .intro.item").append("<div id='basketAddAmount'><div class='label'>Aantal:</div><input id='basketAmount' type='number' value='1' min='1' /></div>");

	$("#submit.cart-button").one("click", function () {
		var amount = $("#basketAmount").val();
		if (WebPage.Data.basketGuid) {
			var bId = WebPage.Data.basketGuid;
			updateAmount(bId, amount, function() {
				location.href = "/Website/Pages/Basket";
			});
		} else {
			$.getJSON('/Website/Basket/Add', { 'product': guid, 'amount': amount }).done(function () {
				updateClient();
				location.href = "/Website/Pages/Basket";
			});
		}
		return false;
	});

	var basket = $('#shoppingCart');
	var amount = $('#shoppingcart_amount');
	var total = $('#shoppingcart_total');
	updateClient(true);

	function updateClient(init) {
		if (typeof init === "undefined") { init = false; }
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: '/Website/Basket/Update-client',
			cache: false
		}).done(function (data) {
			if (data) {
				total.text(data.total);
				amount.text(data.count);
				if (!init) {
					$('.basket-total').text(data.total);
					$('.basket-total-incl').text(data.totalIncl);
					$('.basket-total-excl').text(data.totalExcl);
				}
				if (data.count == 1) {
					$("#shoppingcart_text").hide();
				} else {
					$("#shoppingcart_text").show();
				}
			}
		});
	}

	function updateAmount(id, amount, callBack) {
		if (typeof callBack === "undefined") { callBack = null; }
		var data = {};
		data["property"] = 'amount';
		data["id"] = id;
		data["amount"] = amount;

		$.ajax({
			type: 'POST',
			data: data,
			dataType: 'json',
			url: '/Website/Basket/Update',
			cache: false
		}).done(function (result) {
			if (callBack != null) {
				callBack.call(result);
			}
			updateClient();
		});
	}

	function remove(id) {
		var data = {};
		data["property"] = 'remove';
		data["id"] = id;

		$.ajax({
			type: 'POST',
			data: data,
			dataType: 'text',
			url: '/Website/Basket/Update',
			cache: false
		}).done(function () {
			return updateClient();
		});
	}

	$('.remove').off('click');
	$('.remove').click(function () {
		var $this = $(this);
		var $row = $this.closest('.line');
		var id = $row.attr('id');

		remove(id);

		$row.fadeOut('fast');

		return false;
	});

	$('.edit').off('click');
	$('.edit').click(function () {
		var $this = $(this);
		var $row = $this.closest('.line');
		var id = $row.attr('id');

		document.location.href = '/Basket/' + encodeURIComponent(id);

		return false;
	});

	$('#shoppingCart').click(function () {
		document.location.href = "/Website/Pages/Basket";
	});

	//related products
	$.getJSON('/data/product/guid/' + encodeURIComponent(WebPage.Data.productGuid) + '/related-products').done(function(data) {
		//has related
		if (data.related) {
			//append to options box
			var $related = $('<div class="related-container"></div>');
			$('.product-detail').append($related);

			var handler = function(products, title) {
				if (typeof products != 'undefined') {
					var $color = $('<div class="related color"><div class="imageFrame"><div class="label">' + title + '</div><div class="images"></div></div></div>');
					$color.on('click', function(event) {
						event.stopPropagation();
						//andere dicht
						$('.related').removeClass('open');
						$color.addClass('open');

						WebPage.References.$body.one('click', function() {
							$color.removeClass('open');
						});
					});

					var $container = $color.find('.images');
					if (title != 'Size' && title != 'Maat') {
						for (var x = 0; x < products.length; x++) {
							var product = products[x];
							var $img = $('<img src="/image/product/guid/' + encodeURIComponent(product.guid) + '?width=135&height=94" />');
							$img.attr({ 'title': product.productcode + '\n' + product.description });
							$img.data('url', product.url);
							$container.append($img);
						}

						$container.find('img').on('click', function(event) {
							var $this = $(event.target);
							if ($this.closest('.related.open').length) {
								location.href = $this.data('url');
							}
						});
					} else {
						// Create product dictionary and remove duplicates
						var productDict = {};
						for (var x = 0; x < products.length; x++) {
							if (typeof productDict[products[x]['dimensions']] == 'undefined') {
								productDict[products[x]['dimensions']] = products[x];
							}
						}

						// Empty products object
						products = [];
						// Fill products with filtered values
						for (var key in productDict) {
							products.push(productDict[key]);

						}

						products.sort(function(a, b) {
							var x = a['dimensions'];
							var y = b['dimensions'];

							if (typeof x == "string") {
								x = x.toLowerCase();
								y = y.toLowerCase();
							}

							return ((x < y) ? -1 : ((x > y) ? 1 : 0));
						});

						for (var x = 0; x < products.length; x++) {
							var product = products[x];
							var $sizes = $('<div class="size">' + product.dimensions + '</div>');
							$sizes.data('url', product.url);
							$container.append($sizes);
						}

						$container.find('div.size').on('click', function(event) {
							var $this = $(event.target);
							if ($this.closest('.related.open').length) {
								location.href = $this.data('url');
							}
						});
					}
					$related.append($color);
				}
			};
			for (var key in data.related) {
				handler(data.related[key], key.toString());
			}
			//handler(data.related["Size"], 'Size');
			//handler(data.related["Color"], 'Color');
		}
	});
});