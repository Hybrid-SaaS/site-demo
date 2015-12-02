var WebPage;
(function (WebPage) {
	var References;
	(function (References) {
		var MessageBox;
		(function (MessageBox) {
			MessageBox.$messageLayer;
			MessageBox.$message;
			MessageBox.$messageHeader;
			MessageBox.$messageBody;
		})(MessageBox = References.MessageBox || (References.MessageBox = {}));
		References.$document;
		References.$html;
		References.$body;
	})(References = WebPage.References || (WebPage.References = {}));
	var Data;
	(function (Data) {
		Data.language;
		Data.country;
		Data.productGuid;
		Data.basketGuid;
	})(Data = WebPage.Data || (WebPage.Data = {}));
	var Event = (function () {
		function Event(eventType, data) {
			this.eventType = eventType;
			this.data = data;
		}
		return Event;
	})();
	WebPage.Event = Event;
	(function (EventType) {
		EventType[EventType["BeforeLoad"] = 0] = "BeforeLoad";
		EventType[EventType["Load"] = 1] = "Load";
	})(WebPage.EventType || (WebPage.EventType = {}));
	var EventType = WebPage.EventType;
	var Events;
	(function (Events) {
		var Handlers;
		(function (Handlers) {
			Handlers.onBeforeLoad = [];
			Handlers.onLoad = [];
		})(Handlers = Events.Handlers || (Events.Handlers = {}));
		function fire(eventType, data) {
			if (data === void 0) { data = null; }
			var handlers = getHandlers(eventType);
			for (var x = 0; x < handlers.length; x++) {
				handlers[x].call(new Event(eventType, data));
			}
		}
		Events.fire = fire;
		function getHandlers(eventType) {
			switch (eventType) {
				case 1 /* Load */:
					return Handlers.onLoad;
				case 0 /* BeforeLoad */:
					return Handlers.onBeforeLoad;
			}
			return null;
		}
		function on(eventType, handler) {
			getHandlers(eventType).push(handler);
		}
		Events.on = on;
	})(Events = WebPage.Events || (WebPage.Events = {}));
	//wil be overridden
	function resourceString(name) {
		return 'no translation: ' + name;
	}
	WebPage.resourceString = resourceString;
	//init the page (onload)
	function load() {
		Events.fire(0 /* BeforeLoad */);
		References.$document = $(document);
		References.$html = $('html');
		References.$body = $(document.body);
		//set language
		Data.language = References.$html.attr('lang');
		Data.country = References.$html.data('country');
		//init basket
		Basket.init();
		//verplichte velden
		$('.required').change(function (event) {
			var $this = $(event.target);
			if ($this.val().length) {
				$this.addClass('ok');
			}
			else {
				$this.removeClass('ok');
			}
		});
		Events.fire(1 /* Load */);
	}
	WebPage.load = load;
	var Basket;
	(function (Basket) {
		var References;
		(function (References) {
			References.$basket;
			References.$amount;
			References.$total;
		})(References = Basket.References || (Basket.References = {}));
		var Events;
		(function (Events) {
			Events.onChange;
		})(Events = Basket.Events || (Basket.Events = {}));
		function init() {
			References.$basket = $('#shoppingCart');
			References.$amount = $('#shoppingcart_amount');
			References.$total = $('#shoppingcart_total');
			updateClient(true);
		}
		Basket.init = init;
		function updateClient(init) {
			var _this = this;
			if (init === void 0) { init = false; }
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: '/Website/Basket/Update-client',
				cache: false
			}).done(function (data) {
				if (Events.onChange) {
					var result = Events.onChange.call(_this, data);
					if (result === false)
						return;
				}
				References.$total.text(data.total);
				References.$amount.text(data.count);
				if (!init) {
					$('.basket-total').text(data.total);
					$('.basket-total-incl').text(data.totalIncl);
					$('.basket-total-excl').text(data.totalExcl);
				}
			});
		}
		Basket.updateClient = updateClient;
		function updateAmount(id, amount, callBack) {
			var _this = this;
			if (callBack === void 0) { callBack = null; }
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
					callBack.call(_this, result);
				}
				updateClient();
			});
		}
		Basket.updateAmount = updateAmount;
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
			}).done(function () { return updateClient(); });
		}
		Basket.remove = remove;
	})(Basket = WebPage.Basket || (WebPage.Basket = {}));
	var Message;
	(function (Message) {
		(function (MessageType) {
			MessageType[MessageType["Information"] = 0] = "Information";
			MessageType[MessageType["Warning"] = 1] = "Warning";
			MessageType[MessageType["Success"] = 2] = "Success";
			MessageType[MessageType["Error"] = 3] = "Error";
		})(Message.MessageType || (Message.MessageType = {}));
		var MessageType = Message.MessageType;
		var Settings = (function () {
			function Settings() {
				this.type = 0 /* Information */;
			}
			return Settings;
		})();
		Message.Settings = Settings;
		function show(messagesettings, callbackFunction) {
			if (callbackFunction === void 0) { callbackFunction = null; }
			if (!References.MessageBox.$messageLayer) {
				References.MessageBox.$messageLayer = $('<div id="message-container"><div class="message">' + '<div class="message-header"></div>' + '<div class="message-body"></div>' + '</div></div>');
				References.MessageBox.$messageLayer.appendTo(References.$body);
				References.MessageBox.$message = References.MessageBox.$messageLayer.find('.message');
				References.MessageBox.$messageHeader = References.MessageBox.$message.find('.message-header');
				References.MessageBox.$messageBody = References.MessageBox.$message.find('.message-body');
				References.MessageBox.$messageLayer.bind('click', function () {
					References.MessageBox.$message.animate({ 'top': '150%' }, 200, function () {
						References.MessageBox.$messageLayer.fadeOut(200);
						if (callbackFunction != null) {
							callbackFunction.call(this);
						}
					});
				});
			}
			References.MessageBox.$messageLayer.focus();
			setTimeout(function () {
				References.MessageBox.$messageLayer.trigger('click');
			}, 2500);
			References.MessageBox.$messageHeader.text(messagesettings.header);
			References.MessageBox.$messageBody.text(messagesettings.body);
			References.MessageBox.$message.removeClass();
			switch (messagesettings.type) {
				case 3 /* Error */:
					References.MessageBox.$message.addClass('message error');
					break;
				case 2 /* Success */:
					References.MessageBox.$message.addClass('message success');
					break;
				case 1 /* Warning */:
					References.MessageBox.$message.addClass('message erwarningror');
					break;
				default:
					References.MessageBox.$message.addClass('message info');
					break;
			}
			References.MessageBox.$messageLayer.fadeIn(200);
			var $window = $(window);
			var top = Math.abs((($window.height() - References.MessageBox.$message.outerHeight()) / 2));
			//top = $window.scrollTop();
			References.MessageBox.$message.css('top', 0).animate({ 'top': top }, 200);
		}
		Message.show = show;
	})(Message = WebPage.Message || (WebPage.Message = {}));
})(WebPage || (WebPage = {}));
//Load website
$(function () { return WebPage.load(); });
//onload
$(function () {
	$.getScript("/Website/JScript/language-strings");
	//verplaats menus naar juiste element
	$('#bottommenu').children().appendTo($('#menulocation'));
	$('#bottommenu2').children().appendTo($('#menulocation2'));
	//link naar shoppingcart
	$('#shoppingCart').click(function () {
		document.location.href = "/Website/Pages/Basket";
	});
	var $shopText = $('#shoppingcart_text');
	WebPage.Basket.Events.onChange = function (data) {
		if (data.count == 1)
			$shopText.hide();
		else
			$shopText.show();
	};
	//alleen bij de checkout pagina
	var webData = WebPage.Data;
});
