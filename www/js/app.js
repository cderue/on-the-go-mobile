(function() {
	'use strict';
	
	angular
		.module('onthego', ['ionic', 'ngCordova', 'onthego.services', 'onthego.controllers', 'highcharts-ng'])
		.config(function($stateProvider, $urlRouterProvider) {

			$stateProvider
		
		    .state('app', {
		      url: "/app",
		      abstract: true,
		      templateUrl: "templates/tabs.html",
		      controller: "AppController"
		    })
		
		    .state('app.home', {
		      url: '/home',
		      views: {
		        'tab-home': {
		          templateUrl: 'templates/tab-home.html',
		          controller: 'HomeController'
		        }
		      }
		    })
		
		    .state('app.monitor', {
		      url: '/monitor',
		      views: {
		        'tab-monitor': {
		          templateUrl: 'templates/tab-monitor.html',
		          controller: 'MonitorController'
		        }
		      }
		    })
		   
		    .state('app.monitor-issue', {
		      url: '/monitor-issue/:issueId',
		      views: {
		        'tab-monitor': {
		          templateUrl: 'templates/monitor-issue.html',
		          controller: 'MonitorIssueController'
		        }
		      }
		    })
		
		    .state('app.stats', {
		      url: '/stats',
		      views: {
		        'tab-stats': {
		          templateUrl: 'templates/tab-stats.html',
		          controller: 'StatsController'
		        }
		      }
		    })
		    
		    .state('app.about', {
		    	url: '/about',
		    	views: {
		    	  'tab-about': {
		    		  templateUrl: 'templates/tab-about.html',
		    		  controller: 'AboutController'
		    	  }
		    	}
		    });
		
		  // if none of the above states are matched, use this as the fallback
		  $urlRouterProvider.otherwise('/app/home');
		
		}).config(function($httpProvider) {
		    $httpProvider.interceptors.push(function($rootScope) {
		        return {
		            request: function(config) {
		                $rootScope.$broadcast('loading:show');
		                return config;
		            },
		            response: function(response) {
		                $rootScope.$broadcast('loading:hide');
		                return response;
		            }
		        }
		    });
		}).run(function($rootScope, $ionicLoading, $ionicPlatform, $cordovaSplashscreen) {
			$ionicPlatform.ready(function() {
				StatusBar.styleDefault();
			});
		    setTimeout(function() {
		        $cordovaSplashscreen.hide()
		    }, 3000);
			
		    $rootScope.$on('loading:show', function() {
		        $ionicLoading.show({template: 'Loading...'});
		    });
		
		    $rootScope.$on('loading:hide', function() {
		        $ionicLoading.hide();
		    });
		    if (Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) {
		  	  Browser.ie = true;
		  	  Browser.version = document.documentMode;
		  	}
		});
		
		angular.module('onthego.controllers', []);
		angular.module('onthego.services', ['http-auth-interceptor']);
})();
