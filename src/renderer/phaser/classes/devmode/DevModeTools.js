var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var DevModeTools = /** @class */ (function (_super) {
    __extends(DevModeTools, _super);
    function DevModeTools(scene) {
        var _this = _super.call(this, scene) || this;
        _this.scene = scene;
        var palette = _this.palette = new TilePalette(_this.scene, _this.scene.tileset, _this.scene.rexUI);
        _this.tileEditor = new TileEditor(_this.scene.gameScene, _this.scene, _this);
        _this.regionEditor = new RegionEditor(_this.scene.gameScene, _this.scene, _this);
        _this.gameEditorWidgets = [];
        _this.keyBindings();
        _this.COLOR_PRIMARY = palette.COLOR_PRIMARY;
        _this.COLOR_LIGHT = palette.COLOR_LIGHT;
        _this.COLOR_WHITE = palette.COLOR_WHITE;
        _this.COLOR_GRAY = palette.COLOR_GRAY;
        _this.scene.scale.on(Phaser.Scale.Events.RESIZE, function () {
            layerButtonsContainer.x = palette.camera.x + palette.paletteWidth - 98;
            layerButtonsContainer.y = palette.camera.y - 170;
            toolButtonsContainer.x = palette.camera.x + palette.paletteWidth - 98;
            toolButtonsContainer.y = palette.camera.y - layerButtonsContainer.height - 170;
        });
        new DevToolButton(_this, '+', '+', 'Zoom in (+)', null, 0, -34, 30, palette.scrollBarContainer, palette.zoom.bind(palette), -1);
        new DevToolButton(_this, '-', '-', 'Zoom out (-)', null, 34, -34, 30, palette.scrollBarContainer, palette.zoom.bind(palette), 1);
        var layerButtonsContainer = _this.layerButtonsContainer = new Phaser.GameObjects.Container(scene);
        layerButtonsContainer.width = 120;
        layerButtonsContainer.height = 204;
        layerButtonsContainer.x = palette.camera.x + palette.paletteWidth - 98;
        layerButtonsContainer.y = palette.camera.y - 204;
        scene.add.existing(layerButtonsContainer);
        _this.paletteButton = new DevToolButton(_this, 'palette', 'Palette', 'show/hide palette', null, 0, 170, 120, layerButtonsContainer, palette.toggle.bind(palette));
        _this.layerButtons = [];
        _this.layerButtons.push(new DevToolButton(_this, 'floor', 'Layer (1)', 'select the Floor layer', null, 30, 102, 85, layerButtonsContainer, _this.switchLayer.bind(_this), 0), new DevToolButton(_this, 'floor2', 'Layer (2)', 'select the Floor 2 layer', null, 30, 68, 85, layerButtonsContainer, _this.switchLayer.bind(_this), 1), new DevToolButton(_this, 'walls', 'Layer (3)', 'select the Walls layer', null, 30, 34, 85, layerButtonsContainer, _this.switchLayer.bind(_this), 2), new DevToolButton(_this, 'trees', 'Layer (4)', 'select the Trees layer', null, 30, 0, 85, layerButtonsContainer, _this.switchLayer.bind(_this), 3));
        _this.layerButtons[0].highlight('active');
        _this.layerHideButtons = [];
        _this.layerHideButtons.push(new DevToolButton(_this, '', 'Layer visibility (shift-1)', 'show/hide floor layer', 'eyeopen', 0, 102, 35, layerButtonsContainer, _this.hideLayer.bind(_this), 0), new DevToolButton(_this, '', 'Layer visibility (shift-2)', 'show/hide floor 2 layer', 'eyeopen', 0, 68, 35, layerButtonsContainer, _this.hideLayer.bind(_this), 1), new DevToolButton(_this, '', 'Layer visibility (shift-3)', 'show/hide walls layer', 'eyeopen', 0, 34, 35, layerButtonsContainer, _this.hideLayer.bind(_this), 2), new DevToolButton(_this, '', 'Layer visibility (shift-4)', 'show/hide trees layer', 'eyeopen', 0, 0, 35, layerButtonsContainer, _this.hideLayer.bind(_this), 3));
        _this.layerHideButtons[0].highlight('active');
        var toolButtonsContainer = _this.toolButtonsContainer = new Phaser.GameObjects.Container(scene);
        toolButtonsContainer.x = palette.camera.x + palette.paletteWidth - 98;
        toolButtonsContainer.y = palette.camera.y - layerButtonsContainer.height - 204;
        toolButtonsContainer.width = 120;
        toolButtonsContainer.height = 170;
        scene.add.existing(toolButtonsContainer);
        _this.modeButtons = [];
        _this.modeButtons.push(new DevToolButton(_this, '', 'Cursor Tool (C)', 'interact with regions and entities', 'cursor', 0, 0, 56, toolButtonsContainer, _this.cursor.bind(_this)), new DevToolButton(_this, '', 'Region Tool (R)', 'draw new region', 'region', 60, 0, 56, toolButtonsContainer, _this.drawRegion.bind(_this)), new DevToolButton(_this, '', 'Stamp Brush (B)', 'LMB: place selected tiles. RMB: copy tiles', 'stamp', 0, 34, 56, toolButtonsContainer, _this.brush.bind(_this)), new DevToolButton(_this, '', 'Eraser (E)', 'delete tiles from selected layer', 'eraser', 60, 34, 56, toolButtonsContainer, _this.emptyTile.bind(_this)), new DevToolButton(_this, '', 'Bucket Fill (F)', 'fill an area with the selected tile', 'fill', 0, 68, 56, toolButtonsContainer, _this.fill.bind(_this)));
        _this.cursorButton = _this.modeButtons[0];
        _this.highlightModeButton(0);
        _this.brushButtons = [];
        _this.brushButtons.push(new DevToolButton(_this, '1x1', '1x1', 'changes the brush size to 1x1', null, 0, 136, 56, toolButtonsContainer, _this.selectSingle.bind(_this)), new DevToolButton(_this, '2x2', '2x2', 'changes the brush size to 2x2', null, 60, 136, 56, toolButtonsContainer, _this.selectArea.bind(_this)));
        _this.brushButtons[0].highlight('active');
        _this.tooltip = new DevTooltip(_this.scene);
        _this.palette.hide();
        _this.layerButtonsContainer.setVisible(false);
        _this.toolButtonsContainer.setVisible(false);
        _this.regionEditor.hideRegions();
        var ctrlKey = _this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL, false);
        _this.scene.input.on('pointermove', function (p) {
            if (taro.developerMode.active && taro.developerMode.activeTab !== 'play' && scene.tileEditor.startDragIn !== 'palette' && (p.rightButtonDown() || (p.isDown && ctrlKey.isDown))) {
                var camera = _this.scene.gameScene.cameras.main;
                var scrollX_1 = (p.x - p.prevPosition.x) / camera.zoom;
                var scrollY_1 = (p.y - p.prevPosition.y) / camera.zoom;
                camera.scrollX -= scrollX_1;
                camera.scrollY -= scrollY_1;
            }
            ;
        });
        return _this;
    }
    DevModeTools.prototype.enterMapTab = function () {
        this.layerButtonsContainer.setVisible(true);
        this.toolButtonsContainer.setVisible(true);
        this.palette.show();
        this.regionEditor.showRegions();
    };
    DevModeTools.prototype.leaveMapTab = function () {
        this.regionEditor.cancelDrawRegion();
        this.palette.hide();
        this.layerButtonsContainer.setVisible(false);
        this.toolButtonsContainer.setVisible(false);
        this.regionEditor.hideRegions();
    };
    DevModeTools.prototype.queryWidgets = function () {
        this.gameEditorWidgets = Array.from(document.querySelectorAll('.game-editor-widget'))
            .map(function (widget) { return widget.getBoundingClientRect(); });
    };
    DevModeTools.prototype.checkIfInputModalPresent = function () {
        var customModals = document.querySelectorAll(".winbox, .modal, .custom-editor-modal");
        for (var _i = 0, customModals_1 = customModals; _i < customModals_1.length; _i++) {
            var customModal = customModals_1[_i];
            var inputs = customModal.querySelectorAll("input, select, textarea, button");
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i] === document.activeElement) {
                    return true;
                }
            }
        }
        return false;
    };
    DevModeTools.prototype.keyBindings = function () {
        var _this = this;
        var gameScene = this.scene.gameScene;
        var keyboard = this.scene.input.keyboard;
        var altKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT, false);
        var shiftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT, false);
        var tabKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB, false);
        tabKey.on('down', function (key) {
            var isInputModalPresent = _this.checkIfInputModalPresent();
            if (!isInputModalPresent) {
                key.originalEvent.preventDefault();
            }
            if (!isInputModalPresent && taro.developerMode.active && taro.developerMode.activeTab === 'map') {
                if (_this.palette.visible) {
                    _this.palette.hide();
                }
                else {
                    _this.palette.show();
                }
            }
        });
        var plusKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS, false);
        plusKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map') {
                var zoom = (gameScene.zoomSize / 2.15) / 1.1;
                taro.client.emit('zoom', zoom);
            }
        });
        var minusKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS, false);
        minusKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map') {
                var zoom = (gameScene.zoomSize / 2.15) * 1.1;
                taro.client.emit('zoom', zoom);
            }
        });
        var cKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C, false);
        cKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map') {
                _this.cursor();
            }
        });
        var rKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R, false);
        rKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map') {
                _this.drawRegion();
            }
        });
        var bKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B, false);
        bKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map') {
                _this.brush();
            }
        });
        var eKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E, false);
        eKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map') {
                _this.emptyTile();
            }
        });
        var fKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F, false);
        fKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map') {
                _this.fill();
            }
        });
        var oneKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE, false);
        oneKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map' && !altKey.isDown) {
                if (shiftKey.isDown) {
                    _this.hideLayer(0);
                }
                else {
                    _this.switchLayer(0);
                }
            }
        });
        var twoKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO, false);
        twoKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map' && !altKey.isDown) {
                if (shiftKey.isDown) {
                    _this.hideLayer(1);
                }
                else {
                    _this.switchLayer(1);
                }
            }
        });
        var threeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE, false);
        threeKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map' && !altKey.isDown) {
                if (shiftKey.isDown) {
                    _this.hideLayer(2);
                }
                else {
                    _this.switchLayer(2);
                }
            }
        });
        var fourKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR, false);
        fourKey.on('down', function () {
            if (taro.developerMode.active && taro.developerMode.activeTab === 'map' && !altKey.isDown) {
                if (shiftKey.isDown) {
                    _this.hideLayer(3);
                }
                else {
                    _this.switchLayer(3);
                }
            }
        });
    };
    DevModeTools.prototype.cursor = function () {
        this.highlightModeButton(0);
        this.scene.regionEditor.regionTool = false;
        this.tileEditor.activateMarkers(false);
    };
    DevModeTools.prototype.drawRegion = function () {
        this.tileEditor.activateMarkers(false);
        this.highlightModeButton(1);
        this.scene.regionEditor.regionTool = true;
    };
    DevModeTools.prototype.brush = function () {
        if (this.modeButtons[3].active) {
            this.tileEditor.selectedTile = this.tileEditor.lastSelectedTile;
            this.tileEditor.selectedTileArea = this.tileEditor.lastSelectedTileArea;
        }
        this.tileEditor.activateMarkers(true);
        this.tileEditor.marker.changePreview();
        this.scene.regionEditor.regionTool = false;
        this.highlightModeButton(2);
    };
    DevModeTools.prototype.emptyTile = function () {
        if (!this.modeButtons[3].active) {
            this.tileEditor.lastSelectedTile = this.tileEditor.selectedTile;
            this.tileEditor.lastSelectedTileArea = this.tileEditor.selectedTileArea;
            var copy = __assign({}, this.tileEditor.selectedTile);
            copy.index = 0;
            this.tileEditor.selectedTile = copy;
            this.tileEditor.selectedTileArea = [[copy, copy], [copy, copy]];
            this.tileEditor.activateMarkers(true);
            this.tileEditor.marker.changePreview();
            this.scene.regionEditor.regionTool = false;
            this.highlightModeButton(3);
        }
    };
    DevModeTools.prototype.fill = function () {
        if (this.modeButtons[3].active) {
            this.tileEditor.selectedTile = this.tileEditor.lastSelectedTile;
            this.tileEditor.selectedTileArea = this.tileEditor.lastSelectedTileArea;
        }
        this.tileEditor.activateMarkers(true);
        this.tileEditor.marker.changePreview();
        this.scene.regionEditor.regionTool = false;
        this.selectSingle();
        this.highlightModeButton(4);
    };
    DevModeTools.prototype.highlightModeButton = function (n) {
        this.modeButtons.forEach(function (button, index) {
            if (index === n)
                button.highlight('active');
            else
                button.highlight('no');
        });
    };
    DevModeTools.prototype.selectSingle = function () {
        for (var i = 0; i < this.tileEditor.area.x; i++) {
            for (var j = 0; j < this.tileEditor.area.y; j++) {
                if (this.tileEditor.selectedTileArea[i][j])
                    this.tileEditor.selectedTileArea[i][j].tint = 0xffffff;
            }
        }
        this.tileEditor.area = { x: 1, y: 1 };
        this.brushButtons[0].highlight('active');
        this.brushButtons[1].highlight('no');
        this.tileEditor.activateMarkers(true);
        this.tileEditor.marker.changePreview();
        this.tileEditor.paletteMarker.changePreview();
        if (!this.modeButtons[3].active) {
            this.brush();
        }
    };
    DevModeTools.prototype.selectArea = function () {
        if (this.tileEditor.selectedTile)
            this.tileEditor.selectedTile.tint = 0xffffff;
        this.tileEditor.area = { x: 2, y: 2 };
        this.brushButtons[1].highlight('active');
        this.brushButtons[0].highlight('no');
        this.tileEditor.activateMarkers(true);
        this.tileEditor.marker.changePreview();
        this.tileEditor.paletteMarker.changePreview();
        if (!this.modeButtons[3].active) {
            this.brush();
        }
    };
    DevModeTools.prototype.switchLayer = function (value) {
        var scene = this.scene;
        var gameMap = scene.gameScene.tilemap;
        gameMap.currentLayerIndex = value;
        this.layerButtons.forEach(function (button) {
            button.highlight('no');
            button.increaseSize(false);
        });
        this.layerHideButtons.forEach(function (button) {
            button.highlight('no');
            button.increaseSize(false);
        });
        if (this.layerButtons[value] && this.layerHideButtons[value]) {
            this.layerHideButtons[value].image.setTexture('eyeopen');
            this.layerButtons[value].highlight('no');
            this.layerHideButtons[value].highlight('no');
            scene.gameScene.tilemapLayers[value].setVisible(true);
            this.layerButtons[value].highlight('active');
            this.layerButtons[value].increaseSize(true);
            this.layerHideButtons[value].highlight('active');
            this.layerHideButtons[value].increaseSize(true);
        }
    };
    DevModeTools.prototype.hideLayer = function (value) {
        var scene = this.scene;
        if (scene.gameScene.tilemap.currentLayerIndex === value) {
            this.switchLayer(-1);
            this.tileEditor.marker.graphics.setVisible(false);
        }
        var tilemapLayers = scene.gameScene.tilemapLayers;
        if (this.layerHideButtons[value].image.texture.key === 'eyeopen') {
            this.layerHideButtons[value].image.setTexture('eyeclosed');
            this.layerButtons[value].highlight('hidden');
            this.layerHideButtons[value].highlight('hidden');
            tilemapLayers[value].setVisible(false);
        }
        else {
            this.layerHideButtons[value].image.setTexture('eyeopen');
            this.layerButtons[value].hidden = false;
            this.layerButtons[value].highlight('no');
            this.layerHideButtons[value].hidden = false;
            this.layerHideButtons[value].highlight('no');
            tilemapLayers[value].setVisible(true);
        }
    };
    return DevModeTools;
}(Phaser.GameObjects.Container));
//# sourceMappingURL=DevModeTools.js.map