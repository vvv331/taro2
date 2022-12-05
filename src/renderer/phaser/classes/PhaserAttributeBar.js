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
var PhaserAttributeBar = /** @class */ (function (_super) {
    __extends(PhaserAttributeBar, _super);
    function PhaserAttributeBar(unit) {
        var _this = this;
        var scene = unit.scene;
        _this = _super.call(this, scene) || this;
        _this.unit = unit;
        _this.barImages = [];
        // Bar
        var stroke = scene.add.image(0, 0, 'stroke');
        stroke.setOrigin(0.5);
        var filLeft = scene.add.image(-stroke.width / 2, 0, 'fill-side');
        filLeft.setOrigin(0, 0.5);
        filLeft.visible = false;
        var fill = scene.add.image(filLeft.x + filLeft.width - 1, 0, 'fill');
        fill.setOrigin(0, 0.5);
        fill.setScale(1, filLeft.height);
        fill.visible = false;
        var fillRight = scene.add.image(fill.x + fill.displayWidth - 1, 0, 'fill-side');
        fillRight.setOrigin(0, 0.5);
        fillRight.flipX = true;
        fillRight.visible = false;
        _this.barImages.push(filLeft, fill, fillRight, stroke);
        _this.add(_this.barImages);
        // Label
        var text = _this.bitmapText = scene.add.bitmapText(0, 0, BitmapFontManager.font(scene, 'Arial', true, false, '#000000'));
        text.setCenterAlign();
        text.setFontSize(14);
        text.setOrigin(0.5);
        text.letterSpacing = -0.8;
        text.visible = false;
        _this.add(text);
        if (scene.renderer.type === Phaser.CANVAS) {
            var rt = _this.rtText = scene.add.renderTexture(0, 0);
            rt.setOrigin(0.5);
            rt.visible = false;
            _this.add(rt);
        }
        // TODO batch entire attribute bar, not only text
        unit.attributesContainer.add(_this);
        return _this;
    }
    PhaserAttributeBar.get = function (unit) {
        if (!this.pool) {
            this.pool = unit.scene.make.group({});
        }
        var bar = this.pool.getFirstDead(false);
        if (!bar) {
            bar = new PhaserAttributeBar(unit);
            this.pool.add(bar);
        }
        bar.setActive(true);
        bar.unit = unit;
        unit.attributesContainer.add(bar);
        bar.setVisible(true);
        return bar;
    };
    PhaserAttributeBar.release = function (bar) {
        bar.resetFadeOut();
        bar.setVisible(false);
        bar.unit.attributesContainer.remove(bar);
        bar.unit = null;
        bar.name = null;
        bar.setActive(false);
    };
    PhaserAttributeBar.prototype.render = function (data) {
        var color = data.color, value = data.value, max = data.max, displayValue = data.displayValue, index = data.index, showWhen = data.showWhen, decimalPlaces = data.decimalPlaces;
        this.name = data.type || data.key;
        // Bar
        var images = this.barImages;
        var fillLeft = images[0];
        var fill = images[1];
        var fillRight = images[2];
        var stroke = images[3];
        // TODO implement support for custom bar color, similar to how it's done with bitmap fonts
        // ideally, texture cloning logic could be extracted into a separate class TextureManager
        // and used both for bitmap fonts and attribute bar textures
        /*bar.fillStyle(Phaser.Display.Color
            .HexStringToColor(color)
            .color);*/
        // TODO pack ui textures (including chat bubble) into a single atlas for perf improvement
        if (value !== 0) {
            var w = stroke.width - 2 * fillLeft.width + 2;
            fill.scaleX = w * value / max;
            fillRight.x = fill.x + fill.displayWidth - 1;
            fillLeft.visible =
                fill.visible =
                    fillRight.visible = true;
        }
        else {
            fillLeft.visible =
                fill.visible =
                    fillRight.visible = false;
        }
        // Label
        var text = this.bitmapText;
        var rt = this.rtText;
        if (displayValue) {
            text.setText(value.toFixed(decimalPlaces));
            text.visible = !rt;
            if (rt) { // TODO batch enitre container instead of only label
                rt.resize(text.width, text.height);
                rt.clear();
                rt.draw(text, text.width / 2, text.height / 2);
                rt.visible = true;
            }
        }
        else {
            text.setText('');
            text.visible = false;
            rt && (rt.visible = false);
        }
        this.y = (index - 1) * stroke.height;
        this.resetFadeOut();
        if ((showWhen instanceof Array &&
            showWhen.indexOf('valueChanges') > -1) ||
            showWhen === 'valueChanges') {
            this.fadeOut();
        }
    };
    PhaserAttributeBar.prototype.fadeOut = function () {
        var _this = this;
        var scene = this.scene;
        this.fadeTimerEvent = scene.time.delayedCall(1000, function () {
            _this.fadeTimerEvent = null;
            _this.fadeTween = scene.tweens.add({
                targets: _this,
                alpha: 0,
                duration: 500,
                onComplete: function () {
                    _this.fadeTween = null;
                    var unit = _this.unit;
                    if (unit) {
                        var attributes = unit.attributes;
                        var index = attributes.indexOf(_this);
                        if (index !== -1) {
                            attributes.splice(index, 1);
                            PhaserAttributeBar.release(_this);
                        }
                    }
                }
            });
        });
    };
    PhaserAttributeBar.prototype.resetFadeOut = function () {
        // reset fade timer and tween
        if (this.fadeTimerEvent) {
            this.scene.time.removeEvent(this.fadeTimerEvent);
            this.fadeTimerEvent = null;
        }
        if (this.fadeTween) {
            this.fadeTween.remove();
            this.fadeTween = null;
        }
        this.alpha = 1;
    };
    return PhaserAttributeBar;
}(Phaser.GameObjects.Container));
//# sourceMappingURL=PhaserAttributeBar.js.map