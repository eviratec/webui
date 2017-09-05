
  angular.module('DataStudioWebui.ApiManager')
    .controller('ApiManagerController', ApiManagerController);

  ApiManagerController.$inject = ['$api', '$timeout', '$scope', '$state', '$mdDialog'];
  function ApiManagerController (  $api,   $timeout,   $scope,   $state,   $mdDialog) {

    $scope.apis = [
      {
        Id: "user-api.starmicro.services",
        Name: "User Api",
        Host: "user-api.starmicro.services"
      },
      {
        Id: "app-api.starmicro.services",
        Name: "App Api",
        Host: "app-api.starmicro.services"
      }
    ];

  }
