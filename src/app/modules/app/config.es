
  angular.module('DataStudioWebui')
    .config(appDefaultRoute)
    .config(appEnvironment)
    .config(appLocation)
    .config(appThemes)
    .run(appInit)

  appEnvironment.$inject = ['$appEnvironmentProvider'];
  function appEnvironment (  $appEnvironmentProvider) {

    $appEnvironmentProvider
      .setDefaults({
        titlePrefix: '??? :: ',
        apiUrl: 'http://localhost:3000',
      })
      .addEnvironment('local', ['127.0.0.1', 'localhost', /\.localhost$/i], {
        titlePrefix: 'LOCAL :: ',
        apiUrl: 'http://api.datastudio.localhost',
      })
      .addEnvironment('prod', 'webui.datastudio.eviratec.software', {
        titlePrefix: '',
        apiUrl: 'https://api.datastudio.eviratec.software',
      })
      .defaultEnvironmentName('local');

  }

  appLocation.$inject = ['$locationProvider'];
  function appLocation (  $locationProvider) {
    $locationProvider.html5Mode(true);
  }

  appDefaultRoute.$inject = ['$urlRouterProvider'];
  function appDefaultRoute (  $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');
  }

  appThemes.$inject = ['$mdThemingProvider'];
  function appThemes (  $mdThemingProvider) {

    var dsPurpleMap = $mdThemingProvider.extendPalette('purple', {
      '500': '#8E24AA',
      'contrastDefaultColor': 'light'
    });

    $mdThemingProvider.definePalette('dsPurple', dsPurpleMap);

    $mdThemingProvider.theme('default')
      .primaryPalette('dsPurple');

    var sidebarBlueGreyMap = $mdThemingProvider.extendPalette('blue-grey', {
      // 'contrastDefaultColor': 'dark',
    });

    $mdThemingProvider.definePalette('sidebarBlueGrey', sidebarBlueGreyMap);

    $mdThemingProvider.theme('darknav')
      .primaryPalette('dsPurple')
      .dark();

    $mdThemingProvider.theme('sidenavTheme')
      .primaryPalette('grey')
      .dark();

  }

  appInit.$inject = ['$appEnvironment', '$document'];
  function appInit (  $appEnvironment,   $document) {

    $document[0].title = $appEnvironment.config.titlePrefix
      + 'DataStudio Web UI';

    let robotoFontSrc = "https://fonts.googleapis.com/css?family=Roboto:200,300,400,500";
    let linkEl = $document[0].createElement('link');

    linkEl.setAttribute("rel", "stylesheet");
    linkEl.setAttribute("href", robotoFontSrc);

    $document[0].body.appendChild(linkEl);

  }
