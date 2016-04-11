MyAPP.controller('ChessCtrl', function($scope) {
    $scope.$on('$ionicView.enter', function(e) {
        $scope.cmdRestart = "";
        $scope.cmdTwoPerson = "";
        $scope.cmdPersonComputer = "";
    });
  $scope.gridWidth = 20;
    $scope.cmdRestart = "h";

    console.log("ChessCtrl start");
});
