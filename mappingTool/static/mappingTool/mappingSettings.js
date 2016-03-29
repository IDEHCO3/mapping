(function() {
    var app = angular.module("settingMap",['formMap']);

    app.factory("settingsMap", ['$rootScope',function($rootScope){
        return function (){
            var that = this;

            var clickOnLayer = function(feature, layer ){
                if(feature && 'properties' in feature)
                    console.log(feature.properties);
                console.log(layer);
            };

            this.setPopupOnLayer = function(feature, layer) {
                var popup = L.popup();
                var result = '';
                if(feature != null && 'properties' in feature){
                    for (property in feature.properties)
                        result += "<p>" + property + ": " + feature.properties[property] + "</p>";
                }
                else{
                    result = "<p> Empty </p>";
                }

                popup.setContent(result);
                layer.bindPopup(popup);

            };

            var editingAttributes = function(layer){
                $rootScope.showForm(layer, $rootScope.currentLayer);
            };

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
                        that.setPopupOnLayer(feature, layer);
                    });
            };

            this.onEachFeatureWithSingleGeometry = function(feature, layer) {
                layer.on('click', function() { clickOnLayer(feature, layer); });
                layer.on('contextmenu', function (){clickOnLayer(feature, layer);});
                binderMenuContextTo(layer);
                that.setPopupOnLayer(feature, layer);
            };

            this.onEachFeature = function(feature, layer) {
                if (layer._layers)
                    return that.onEachFeatureWithMultiGeometry(feature, layer);
                return that.onEachFeatureWithSingleGeometry(feature, layer);
            };
        };
    }]);

})();