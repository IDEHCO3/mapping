(function() {
    var app = angular.module("editMap",[]);

    app.controller("editMapController", ["$rootScope", function($rootScope){
        this.map = $rootScope.map;

        var that = this;

        this.created = function(e){
            console.log("created-----",$rootScope.featureGroup, $rootScope.layers);
            $rootScope.featureGroup.addLayer(e.layer);
            $rootScope.layers[0].data.addLayer(e.layer);
        };

        this.edited = function(e){
            console.log("edited-----");
        };

        this.deleted = function(e){
            console.log("deleted-----");
        };

        this.map.on('draw:created', this.created);
        this.map.on('draw:edited', this.edited);
        this.map.on('draw:deleted', this.deleted);
    }]);

})();