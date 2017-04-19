define([], function() {
    return {
        init: function(app) {
            app.controller('UserCtrl', function($scope, $uibModal, User) {

                $scope.user = User.get();

                $scope.register = function () {
                    console.log("opening");
                    $uibModal.open({
                        templateUrl: 'js/lib/js-common/user/register_modal.html',
                        controller: 'RegistrationCtrl',
                        size: 'sm'
                    });
                };    

                $scope.login = function () {
                    console.log("opening");
                    $uibModal.open({
                        templateUrl: 'js/lib/js-common/user/login_modal.html',
                        controller: 'LoginCtrl',
                        size: 'sm'
                    });
                };

                $scope.logout = function(){
                    User.logout( 
                        function() {}, 
                        function() {}
                    );
                };

                $scope.$on('user:updated', function(event,data) {
                    $scope.user = data;
                });

                angular.element(document).ready(function () {
                    User.authorizeCookie();
                });
            });

            app.controller('LoginCtrl', function ($scope, LoginFactory, $uibModalInstance) {
                
                var close = function(user) {
                    $uibModalInstance.close(user);
                };
                
                var factory = new LoginFactory($scope, close);
                $scope = factory.$scope;
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            });

            app.controller('RegistrationCtrl', function ($scope, RegistrationFactory, $uibModalInstance) {
                
                var close = function(user) {
                    $uibModalInstance.close(user);
                };
                
                var factory = new RegistrationFactory($scope, close);
                $scope = factory.$scope;
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            });
            
            app.factory('RegistrationFactory', ['User', function(User) {
                    return function($s, successCallback) {
                        
                        var $scope = $s;
                        $scope.user = {name: "", pass: "", verified_pass: "", errors: []};
                        $scope.loading = false;

                        $scope.submit = function () {
                            $scope.user.errors = [];
                            var hasError = false;

                            // Username is required
                            if(!$scope.user.name || $scope.user.name.length === 0) {
                                $scope.user.errors.push("Username is required.");
                                hasError = true;
                            }

                            // Password is required
                            if(!$scope.user.pass || $scope.user.pass.length === 0) {
                                $scope.user.errors.push("Password is required.");
                                hasError = true;
                            }

                            // Verification password is required
                            if(!$scope.user.verified_pass || $scope.user.verified_pass.length === 0) {
                                $scope.user.errors.push("Verification password is required.");
                                hasError = true;
                            }

                            // Passwords must match
                            if ($scope.user.pass !== $scope.user.verified_pass) {
                                $scope.user.errors.push("Password missmatch.");
                                hasError = true;
                            }

                            if (!hasError) {
                                $scope.loading = true;
                                User.register(
                                    $scope.user, 
                                    function(user) 
                                    {
                                        if(user.loggedIn) {
                                            $scope.user = {};
                                            if(successCallback) {
                                                successCallback(user);
                                            }
                                        }

                                        $scope.loading = false;
                                    }, 
                                    function(response) 
                                    {
                                        var errors = response["data"]["errors"];
                                        if(errors)
                                        {
                                            $scope.user.errors = errors;
                                        }
                                        else
                                        {

                                        $scope.user.errors = ["Unknown error."];
                                        }

                                        $scope.loading = false;
                                    }
                                );
                            } 
                        };

                        $scope.keypress = function(keyEvent)
                        {
                            if (keyEvent.which === 13)
                            {
                                $scope.submit();
                            }
                        };

                        $scope.$on('user:updated', function(event, data) {
                            $scope.user = angular.extend($scope.user, data);
                        });
                    };
            }]);
            
            app.factory('LoginFactory', ['User', function(User) {
                    
                return function($s, successCallback) {
                    var $scope = $s;
                    $scope.user = {errors: []};
                    $scope.creds = {name: "", pass: ""};
                    $scope.loading = false;

                    $scope.submit = function(){
                        $scope.user.errors = [];
                        var hasError = false;

                        // Username is required
                        if(!$scope.creds.name || $scope.creds.name.length === 0) {
                            $scope.user.errors.push("Username is required.");
                            hasError = true;
                        }

                        // Password is required
                        if(!$scope.creds.pass || $scope.creds.pass.length === 0) {
                            $scope.user.errors.push("Password is required.");
                            hasError = true;
                        }

                        if(!hasError) {
                            $scope.loading = true;
                            User.login(
                                $scope.creds, 
                                function(user) {
                                    if(user.loggedIn) {
                                        if(successCallback) {
                                            successCallback(user);
                                        }
                                    }

                                    $scope.loading = false;
                                }, 
                                function(response) 
                                {
                                    var errors = response["data"]["errors"];
                                    if(errors)
                                    {
                                        $scope.user.errors = errors;
                                    }
                                    else
                                    {
                                        $scope.user.errors = ["Unknown error."];
                                    }

                                    $scope.loading = false;
                                }
                            );
                        }
                    };

                    $scope.keypress = function(keyEvent)
                    {
                        if (keyEvent.which === 13)
                        {
                            $scope.submit();
                        }
                    };

                    $scope.$on('user:updated', function(event,data) {
                        $scope.user = data;
                    });
                };
            }]);

            app.service('User', ['$rootScope', '$http', function($rootScope, $http) {

                var $this = this;
                this.response;
                this.data;
                this.loggedIn = false;
                this.id;
                this.name;
                this.errors;
                this.authorizationFinished = false;
                
                this.get = function()
                {
                    return {
                      loggedIn: this.loggedIn,
                      id: this.id,
                      name: this.name, 
                      errors: this.errors
                    };
                }
                
                this.login = function(creds, success, error) {
                    var data = {user: creds, method: 'login'};
                    $http.post('/api/login', data)
                    .then(function(response) {
                        parseResponse(response);
                        success(response.data);
                        if(response.data.loggedIn)
                        {
                            $rootScope.$broadcast('user:loggedin',$this.data);
                        }
                        
                    }, function(response) {
                        error(response);
                    });
                };
                
                this.logout = function(success, error) {
                    var oData = {user: this.id, method: 'logout'};
                    $http.post('/api/logout', oData)
                        .then(function(response) {
                            parseResponse(response);
                            $rootScope.$broadcast('user:loggedout',$this.data);
                            success(response.data);
                        }, function(response) {
                            error(response);
                    });
                }
                
                this.register = function(user, success, error) {
                    var oData = {user: user};
                    $http.post('/api/register', oData)
                        .then(function(response) {
                            parseResponse(response);
                            if(success)
                            {
                                success(response.data);
                            }
                        }, function(response) {
                            if(error)
                            {
                                error(response);
                            }
                    });
                }

                this.authorizeCookie = function() {
                    
                    if($this.authorizationFinished)
                    {
                        return;
                    }
                    
                    $http.post('/api/authorize')
                    .then(function(response) {
                        parseResponse(response);
                        $this.authorizationFinished = true;
                    }, function() {
                        $this.authorizationFinished = true;
                    });
                };
                
                function parseResponse(response) {
                    $this.data = response.data;
                    $this.id = $this.data.id;
                    $this.name = $this.data.name;
                    $this.loggedIn = $this.data.loggedIn;
                    $this.errors = $this.data.errors;
                    $rootScope.$broadcast('user:updated',$this.data);
                }
            }]);
        }
    };
});