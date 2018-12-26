var app = angular.module("test", ["ngAria", "ngAnimate", "ngMaterial"]);

app.controller("testController", function($scope, $mdDialog) {
      return ($scope.showDialog = function(evt) {
        return $mdDialog.show({
          controller: function($scope) {
            return angular.extend($scope, {
              user: {
                Name: "",
                email: "",
                visibility: "",
                Email: "",
                Owner:"",
                role:"",
                state:""
              },
              closeDialog: function() {
                return $mdDialog.hide();
              }
            });
          },
          templateUrl: "dialogContent.tmpl.html",
          clickOutsideToClose:true,
          targetEvent: evt
        });
      });
});