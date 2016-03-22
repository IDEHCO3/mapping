(function() {
    var app = angular.module("settingMap",[]);

    app.factory("settingsMap", [function(){
        return function (){
            var that = this;

            var clickOnLayer = function(feature, layer ){
                //actuallayer = layer;
                //actualFeature = feature;
                console.log(feature.properties);
                console.log(layer);
                //layer.openPopup();
            };

            var openPopupOnActualLayer = function(feature, layer) {
                var popup = L.popup();
                var result = '';
                for (property in feature.properties)
                    result += "<p>" + property + ": " + feature.properties[property] + "</p>";
                popup.setContent(result);
                layer.bindPopup(popup);

            };

            var editingAttributes = function(layer){};

            var contextMenuItemsTo = function(layer){
                return [
                    {
                        separator: true
                    },
                    {
                        text: 'View attributes ',
                        callback: function (e) { layer.openPopup(); }
                    }, {
                        text: 'Edit attributes',
                        callback: function (e) { editingAttributes(layer); }
                    }, {
                        separator: true
                    }
                ];
            };

            var binderMenuContextTo = function(layer) {
                layer.bindContextMenu({
                    contextmenu: true,
                    contextmenuInheritItems: true,
                    contextmenuItems: contextMenuItemsTo(layer)
                });
            };

            this.onEachFeatureWithMultiGeometry = function(feature, layer){
                    layer.eachLayer(function (l) {
                        l.on('click', function() { clickOnLayer(feature, layer); });
                        l.on('contextmenu', function (){clickOnLayer(feature, layer);});
                        binderMenuContextTo(l);
                        openPopupOnActualLayer(feature, layer);
                    });
            };

            this.onEachFeatureWithSingleGeometry = function(feature, layer) {
                layer.on('click', function() { clickOnLayer(feature, layer); });
                layer.on('contextmenu', function (){clickOnLayer(feature, layer);});
                binderMenuContextTo(layer);
                openPopupOnActualLayer(feature, layer);
            };

            this.onEachFeature = function(feature, layer) {
                if (layer._layers)
                    return that.onEachFeatureWithMultiGeometry(feature, layer);
                return that.onEachFeatureWithSingleGeometry(feature, layer);
            };
        };
    }]);

})();