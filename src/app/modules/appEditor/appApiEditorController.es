
  angular.module('DataStudioWebui.AppEditor')
    .controller('AppApiEditorController', AppApiEditorController);

  AppApiEditorController.$inject = ['$api', '$timeout', '$scope', '$state', '$mdDialog', 'api', 'routes', 'operations'];
  function AppApiEditorController (  $api,   $timeout,   $scope,   $state,   $mdDialog,   api,   routes,   operations) {

    let originatorEv;

    let $apiCtrl = this;

    $apiCtrl.api = api;

    $apiCtrl.operations = operations;
    $apiCtrl.routes = routes;

    $apiCtrl.openMenu = function ($mdMenu, $event) {
      originatorEv = $event;
      $mdMenu.open($event);
    };

    $apiCtrl.switchApi = function (apiId) {
      if (!apiId) {
        return;
      }
      $state.go('app.user.app.api', { apiId: apiId });
    };

    $apiCtrl.deleteOperation = function (operation) {
      let operationId = operation.Id;
      if (!operationId) {
        return;
      }
      $api.apiDelete('/operation/' + operationId)
        .then(function (res) {
          $timeout(function () {
            let routeId = operation.RouteId;
            let i = $apiCtrl.operations.all.indexOf(operation);
            let l = $apiCtrl.operations.byRouteId[routeId].indexOf(operation);
            $apiCtrl.operations.all.splice(i, 1);
            $apiCtrl.operations.byRouteId[routeId].splice(l, 1);
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    $apiCtrl.showSchemaView = function ($event) {

      let schemaView = {
        controller: 'AppApiSchemaDialogController',
        templateUrl: 'modules/appEditor/html/dialog/viewApiSchema.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose: true,
        fullscreen: true,
        locals: {
          operations: operations,
          routes: routes,
        },
      };

      $mdDialog.show(schemaView).then(function() {

      }, function() {

      });

    }

    $apiCtrl.createOperation = function ($event, route) {

      let createApiOperation = {
        controller: 'CreateApiOperationDialogController',
        templateUrl: 'modules/appEditor/html/dialog/createApiOperation.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose: true,
        fullscreen: true,
        locals: {
          apiRoute: route,
        },
      };

      $mdDialog.show(createApiOperation).then(function(data) {
        createOperation(data);
      }, function() {

      });

    }

    function createOperation (data) {

      data = data || {};

      let route = data._apiRoute;
      let name = data.Name;
      let method = data.Method;

      let routeId = route.Id || null;
      let newOperation = {
        RouteId: routeId,
        Name: name,
        Method: method,
      };

      $api.apiPost('/api/' + apiId() + '/operations', newOperation)
        .then(function (res) {
          $timeout(function () {
            Object.assign(newOperation, res.data);
            newOperation.Id = res.data.Id;

            if (null === routeId) {
              return $apiCtrl.operations.orphaned.push(newOperation);
            }

            $apiCtrl.operations.byRouteId[routeId] = $apiCtrl.operations.byRouteId[routeId] || [];
            $apiCtrl.operations.byRouteId[routeId].push(newOperation);
          });
        })
        .catch(function (err) {
          console.log(err);
        });

    }

    $apiCtrl.createRoute = function ($event) {

      var confirm = $mdDialog.prompt()
        .title('Specify the Route Path')
        .placeholder('/object/:objectId')
        .ariaLabel('Route Path')
        .initialValue('')
        .targetEvent($event)
        .ok('Create Route')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(path) {
        createRoute(path);
      }, function() {

      });

    };

    function createRoute (path) {

      let newRoute = {
        Path: path,
      };

      $api.apiPost('/api/' + apiId() + '/routes', newRoute)
        .then(function (res) {
          $timeout(function () {
            Object.assign(newRoute, res.data);
            newRoute.Id = res.data.Id;
          });
        })
        .catch(function (err) {
          console.log(err);
        });

      $apiCtrl.routes.push(newRoute);

    }

    function apiId () {
      return $apiCtrl.api.Id;
    }

  }
