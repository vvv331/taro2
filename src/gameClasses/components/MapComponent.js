var MapComponent = IgeEntity.extend({
	classId: 'MapComponent',
	componentId: 'map',

	init: function () {
		//
	},

	load: function (data) {
		var self = this;

		self.data = data;

		if (ige.isServer) {
			ige.addComponent(IgeTiledComponent)
				.tiled.loadJson(data, function (layerArray, layersById) {

					ige.physics.staticsFromMap(layersById.walls);

					self.createRegions();
				});

		} else if (ige.isClient) {
			$.when(ige.client.igeEngineStarted).done(function () {
				ige.addComponent(IgeTiledComponent)
					.tiled.loadJson(data, function (IgeLayerArray, IgeLayersById) {

						if (ige.physics) {
							ige.physics.staticsFromMap(IgeLayersById.walls);
						}

						ige.client.mapLoaded.resolve();
					});
			});
		}
	},
	createRegions: function () {
		var regions = {};
		for (var i in ige.game.data.variables) {
			var variable = ige.game.data.variables[i];
			if (variable.dataType == 'region') regions[i] = variable;
		}
		ige.$$('region').forEach((region) => {
			region.deleteRegion();
		});
		for (var regionName in regions) {
			if (!ige.regionManager.getRegionById(regionName)) {
				var data = regions[regionName];
				if (data) {
					data.id = regionName;
					new Region(data);
				}
			}
		}
	},

	getDimensions: function () {
		return {

		};
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = MapComponent;
}
