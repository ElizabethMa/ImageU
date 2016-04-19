MyAPP.controller('ChessCtrl', ['$scope', '$log', function($scope, $log) {
    $scope.$on('$ionicView.enter', function(e) {
    });

	$scope.cmdRestart = 0;
	$scope.gridWidth = 20;
	$scope.cmdTwoPerson = false;

	$scope.restart = function(){
		$scope.cmdRestart++;
	};

}]);
