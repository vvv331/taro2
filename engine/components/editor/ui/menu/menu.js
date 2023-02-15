var UiMenu = TaroEventingClass.extend({
	classId: 'UiMenu',

	init: function () {
		var self = this;
		self._menus = {};
		taro.requireStylesheet(`${taroRoot}components/editor/ui/menu/menu.css`);

		// Pre-load the template we need
		taro.editor.template(
			`${taroRoot}components/editor/ui/menu/templates/menuButton.html`,
			function () {
				self.add({
					id: 'fileMenu',
					text: 'Project',
					menu: {}
				});

				self.add({
					id: 'toolsMenu',
					text: 'Tools',
					menu: {}
				});

				self.add({
					id: 'insertMenu',
					text: 'Insert',
					menu: {}
				});
			}
		);
	},

	ready: function () {
		var self = this;
	},

	addMenuGroup: function (menuId, groupId) {
		this._menus[menuId].menu[groupId] = this._menus[menuId].menu[groupId] || [];
	},

	addMenuItem: function (menuId, groupId, item) {
		this._menus[menuId].menu[groupId].push(item);
	},

	create: function (menuData, callback) {
		var self = this;

		self.closeAll();

		taro.editor.renderTemplate(
			`${taroRoot}components/editor/ui/menu/templates/menu.html`,
			menuData,
			function (err, htmlElem) {
				if (!err) {
					self._elem = htmlElem;
					$('body').append(htmlElem);

					// Hook underlay click if blur was passed
					if (menuData.blur) {
						$('<div class="editorElem toggleHide shown menuUnderlay"></div>')
							.on('click', function () {
								menuData.blur($(this));
							})
							.appendTo('body');
					}

					htmlElem.attr('id', `menu_${menuData.id || taro.newIdHex()}`);

					if (menuData.left !== undefined) {
						htmlElem.css('left', menuData.left);
					}

					if (menuData.top !== undefined) {
						htmlElem.css('top', menuData.top);
					}

					if (menuData.search) {
						// Assign callback to clear button if search enabled
						htmlElem.find('.searchClear').click(function () {
							htmlElem.find('.searchInput').val('');
							htmlElem.find('ul.items li').show();
						});

						// Perform search when text entered in search box
						htmlElem.find('.searchInput').keyup(function () {
							var list = htmlElem.find('ul.items');
							var items = list.find('li');
							var searchTerm = $(this).val();

							if (searchTerm) {
								// Loop the list items and check if the text matches the search
								items.each(function (index, elem) {
									elem = $(elem);

									if (elem.attr('data-val').toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
										elem.show();
									} else {
										elem.hide();
									}
								});
							} else {
								htmlElem.find('ul.items li').show();
							}
						});

						// Set the search box with focus
						htmlElem.find('.searchInput').focus();
					}

					if (callback) { callback(htmlElem); }
				}
			}
		);
	},

	add: function (obj) {
		var self = this;

		self._menus[obj.id] = obj;

		taro.editor.renderTemplate(
			`${taroRoot}components/editor/ui/menu/templates/menuButton.html`,
			obj,
			function (err, htmlElem) {
				if (!err) {
					var lastMenu = $('.dropMenuContainer .menuButtons').last();

					if (!lastMenu.length) {
						htmlElem.appendTo('.dropMenuContainer');
					} else {
						htmlElem.insertAfter(lastMenu);
					}

					// Enable the button to toggle menu by id
					htmlElem
						.off('click')
						.on('click', function () {
							self.toggle(obj.id);
						});
				}
			}
		);
	},

	buttonOff: function (id) {
		var self = this;
		var obj = self._menus[id];
		var menuButton = $(`.dropMenuContainer #${id}`);

		if (menuButton.hasClass('active')) {
			// Deactivate the menu
			$('.dropMenuContainer .menuButton').removeClass('active');
			taro.editor.ui.menus.closeAll();

			if (self._editorTool) {
				taro.editor.ui.toolbox.select(self._editorTool);
				delete self._editorTool;
			}
		}
	},

	buttonOn: function (id) {
		var self = this;
		var obj = self._menus[id];
		var menuButton = $(`.dropMenuContainer #${id}`);

		// Store the current selected editor tool and then deactivate the tool
		self._editorTool = taro.editor.ui.toolbox._currentTool ? taro.editor.ui.toolbox._currentTool : self._editorTool;
		taro.editor.ui.toolbox.deselect();

		// Toggle all other menus off
		$('.dropMenuContainer .menuButton').removeClass('active');
		taro.editor.ui.menus.closeAll();

		// Activate the menu
		if (obj) {
			menuButton.addClass('active');

			// Display menu
			var position = menuButton.offset();
			var left = position.left;
			var top = position.top;
			var height = $('body').height();

			taro.editor.ui.menus.create({
				groups: obj.menu,
				search: false,
				blur: function (underlayElem) {
					self.toggle(id);
					underlayElem.remove();
				}
			}, function (elem) {
				// Now position the menu
				var menuHeight = elem.height();

				top -= menuHeight / 2;

				if (top + menuHeight > height) {
					top = height - menuHeight - 10;
				}

				if (top - menuHeight < 25) {
					top = 25;
				}

				elem.css('left', left)
					.css('top', top);
			});
		}
	},

	toggle: function (id) {
		if (!id) {
			id = $('.dropMenuContainer .menuButton.active').attr('id');
		}

		if (id) {
			var self = this;
			var menuButton = $(`.dropMenuContainer #${id}`);

			// Check if the menu to toggle is already active
			if (menuButton.hasClass('active')) {
				self.buttonOff(id);
			} else {
				self.buttonOn(id);
			}
		}
	},

	closeAll: function () {
		$('.menu').remove();
		$('.menuUnderlay').remove();
	},

	destroy: function (id) {
		$(`#menu_${id}`).remove();
	}
});

taro.editor.ui.menus = new UiMenu();
