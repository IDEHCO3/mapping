(function() {
    var app = angular.module("editMap",['settingMap']);

    app.controller("editMapController", ["$rootScope","settingsMap", function($rootScope,settingsMap){
        this.map = $rootScope.map;
        var that = this;
        var setting = new settingsMap();

        var insertLayer = function(layer){
            setting.onEachFeature(layer.feature,layer);
            if($rootScope.currentLayer.activated)
                $rootScope.featureGroup.addLayer(layer);
            $rootScope.currentLayer.data.addLayer(layer);
        };

        this.created = function(e){
            console.log("created-----",$rootScope.featureGroup, $rootScope.layers);
            insertLayer(e.layer);
            $rootScope.showForm(e.layer, $rootScope.currentLayer);
        };

        this.edited = function(e){
            console.log("edited-----");
        };

        this.editStart = function(e){
            console.log("edit start-----",e);
        };

        this.deleted = function(e){
            console.log("deleted-----");
        };

        this.deleteStart = function(e){
            console.log("delete start-----");
        };

        this.map.on('draw:created', this.created);
        this.map.on('draw:edited', this.edited);
        this.map.on('draw:editstart', this.editStart);
        this.map.on('draw:deleted', this.deleted);
        this.map.on('draw:deletestart', this.deleteStart);
    }]);

})();