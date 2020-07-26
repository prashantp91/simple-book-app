myApp.controller('LoginController', function($scope, $location, $http){
	
	$scope.login = function(username, password){
		
		$http.get("admin.json")
			.then(function(response) {
				$scope.user = response.data;
				if($scope.user.username==username && $scope.user.password==password){
					$location.path('/home');
				}else{
					$scope.error = "Invalid Username and password";
				}
		});
	}
});
