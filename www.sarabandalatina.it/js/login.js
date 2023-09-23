var app = angular.module('sarabandalatina', ['ngMaterial']);
app.controller("login", function($scope, $http, $mdDialog, $rootScope) {

    $scope.invia = function() {
        $scope.pl_loading = true;

        var username = $scope.username;
        var password = $scope.password;
        var ricordami = $scope.ricordami;

        $http({
            method : "POST",
            url : url + 'ajax/login.php',
            data : {
                username: username,
                password: password,
                ricordami: ricordami
            }
        }).then(function success(response) {
            if(response.data.status) {
                //$("#username-container").removeClass("md-input-invalid");
                //$("#password-container").removeClass("md-input-invalid");

                window.location = "home.html";
            }
            else {
                $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Attenzione!')
                    .textContent(response.data.response)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Ok!')
                );

                $scope.password = '';
                //$("#username-container").addClass("md-input-invalid");
                //$("#password-container").addClass("md-input-invalid");
            }

            $scope.pl_loading = false;

        }, function error(response) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Errore! :(')
                    .textContent(response.statusText + " \n\n Non c'è connessione!")
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Ok!')
            );

            $scope.pl_loading = false;
        });
    }


    $scope.remember_me = function() {
        $http({
            method : "POST",
            url : url + 'ajax/login_controlla.php'
        }).then(
            function success(response) {
                if(response.data.status) {
                    window.location = "home.html";
                }
            }, 
            function error(response) {
                
            }
        );
    }
    // $scope.remember_me();
});

