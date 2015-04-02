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
		"<div class='image'><img class='cart' style='width: 48px; height: 48px;' alt='Winkelwagen' src='https://raw.githubusercontent.com/Kuret/site-demo/master/images/basket_48.png'></div>" +
		"<div class='text'><div id='cart-count'><span id='shoppingcart_amount'>0</span> product<span id='shoppingcart_text'>en</span></div><div>" +
		"€ <span id='shoppingcart_total'>0.00</span></div></div></div>");
	$(".body .intro.item").append("<div id='basketAddAmount'><div class='label'>Aantal:</div><input id='basketAmount' type='number' value='1' min='1' /></div>");

	$("#submit.cart-button").on("click", function () {
		var amount = $("#basketAmount").val();
		$.getJSON('/Website/Basket/Add', { 'product': guid, 'amount': amount }).done(function () {
			updateClient();
			location.href = "/Website/Pages/Basket";
		});
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
});