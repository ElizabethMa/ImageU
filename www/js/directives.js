MyAPP.directive('chessBox', function($document) {
  return {
  	restrict: 'AE',
  	scope: {},
  	controller: function($scope, $element, $attrs) {

  	},
  	compile: function compile(tElement, tAttrs) {
      tElement.addClass('chessbox');
  		var chess = tElement[0];
      chess.height = 450;
      chess.width = 450;
  		var context = chess.getContext('2d');
  		context.strokeStyle = "#BFBFBF";
      for(var i=0; i<15; i++){
        context.moveTo(15 + 30*i, 15);
        context.lineTo(15 + 30*i, 435);
        context.stroke();
        context.moveTo(15, 15 + 30*i);
        context.lineTo(435, 15 + 30*i);
        context.stroke();
      }
      return function (scope, iElement, iAttrs){
        var context = iElement[0].getContext('2d');
        scope.me = true;
        scope.over = false;

        // 初始化棋盘
        scope.chessBoard = [];
        for (var i=0; i<15; i++){
          scope.chessBoard[i] = [];
          for( var j=0; j<15; j++){
            scope.chessBoard[i][j] = 0;
          }
        };

        // 赢法数组 初始化
        scope.wins = [];
        for (var i=0; i<15; i++){
          scope.wins[i] = [];
          for( var j=0; j<15; j++){
            scope.wins[i][j] = [];
          }
        };

        // 赢法的统计数组
        scope.myWin = [];
        scope.computerWin = [];

        var count = 0;
        // 竖线
        for (var i=0; i<15; i++){
          for( var j=0; j<11; j++){
            for(var k=0; k<5; k++){
              scope.wins[i][j+k][count] = true;
            }
            count ++;
          }
        };
        // 横线
        for (var i=0; i<15; i++){
          for( var j=0; j<11; j++){
            for(var k=0; k<5; k++){
              scope.wins[j+k][i][count] = true;
            }
            count ++;
          }
        };
        // 斜线
        for (var i=0; i<11; i++){
          for( var j=0; j<11; j++){
            for(var k=0; k<5; k++){
              scope.wins[i+k][j+k][count] = true;
            }
            count ++;
          }
        };
        // 反斜线
        for (var i=0; i<11; i++){
          for( var j=14; j>3; j--){
            for(var k=0; k<5; k++){
              scope.wins[i+k][j-k][count] = true;
            }
            count ++;
          }
        };
        console.log("总共有:"+count+"种赢法");

        for(var i=0; i<count; i++){
          scope.myWin[i] = 0;
          scope.computerWin[i] = 0;
        }

        var computerAI = function(){
          var myScore = [];
          var computerScore = [];
          //最高分
          var max = 0;
          //最高分坐标
          var u = 0, v = 0;
          for (var i=0; i<15; i++){
            myScore[i] = [];
            computerScore[i] = [];
            for(var j=0; j<15; j++){
              myScore[i][j] = 0;
              computerScore[i][j] = 0;
            }
          }

          for (var i=0; i<15; i++){
            for( var j=0; j<15; j++){
              if(scope.chessBoard[i][j] == 0){
                for(var k=0; k<count; k++){
                  if(scope.wins[i][j][k]){
                    if(scope.myWin[k] == 1){
                      myScore[i][j] += 200;
                    }else if(scope.myWin[k] == 2){
                      myScore[i][j] += 400;
                    }else if(scope.myWin[k] == 3){
                      myScore[i][j] += 2000;
                    } else if(scope.myWin[k] == 4){
                      myScore[i][j] += 10000;
                    }
                    if(scope.computerWin[k] == 1){
                      computerScore[i][j] += 220;
                    }else if(scope.computerWin[k] == 2){
                      computerScore[i][j] += 420;
                    }else if(scope.computerWin[k] == 3){
                      computerScore[i][j] += 2100;
                    } else if(scope.computerWin[k] == 4){
                      computerScore[i][j] += 20000;
                    }
                  }
                  if(myScore[i][j] > max){
                    max = myScore[i][j];
                    u = i;
                    v = j;
                  }else if(myScore[i][j] == max){
                    if(computerScore[i][j] > computerScore[u][v]){
                      u = i;
                      v = j;
                    }
                  }
                  if(computerScore[i][j] > max){
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                  }else if(computerScore[i][j] == max){
                    if(myScore[i][j] > myScore[u][v]){
                      u = i;
                      v = j;
                    }
                  }
                }
              }

            }
          };
          return [u, v];
        }

        // 下一子 me{true:黑子;false:百子}
        var oneStep =  function(i, j, me){
          context.beginPath();
          context.arc(15+i*30, 15+j*30, 15, 0, 2*Math.PI);
          context.closePath();
          var gradient = context.createRadialGradient(15+i*30, 15+j*30, 12, 15+i*30, 15+j*30, 4);
          if(me){
            gradient.addColorStop(0, "#0A0A0A");
            gradient.addColorStop(1, "#636766");
          }else{
            gradient.addColorStop(0, "#D1D1D1");
            gradient.addColorStop(1, "#F9F9F9");
          }
          context.fillStyle = gradient;
          context.fill();
        };

        iElement[0].onclick = function(e){
          if(scope.over){
            return;
          }
          var x = e.offsetX;
          var y = e.offsetY;
          var i = Math.floor(x/30);
          var j = Math.floor(y/30);
          if(scope.chessBoard[i][j] == 0){
            if(scope.me){
              scope.chessBoard[i][j] = 1;
            }else{
              scope.chessBoard[i][j] = 2;
            }
            oneStep(i, j, scope.me);
            //scope.me = !scope.me;
            //
            for(var k=0; k<count; k++){
              if(scope.wins[i][j][k]){
                scope.myWin[k]++;
                scope.computerWin[k] = 6;
                if(scope.myWin[k] == 5){
                  alert('You Win!');
                  scope.over = true;
                }
              }
            }
            if(!scope.over ){
              scope.me = !scope.me;
              var computerStep = computerAI();
              oneStep(computerStep[0], computerStep[1], false);
              scope.chessBoard[computerStep[0]][computerStep[1]] = 2;
              for(var k=0; k<count; k++){
                if(scope.wins[computerStep[0]][computerStep[1]][k]){
                  scope.computerWin[k]++;
                  scope.myWin[k] = 6;
                  if(scope.computerWin[k] == 5){
                    alert('computer Win!');
                    scope.over = true;
                  }
                }
              }
              if(!scope.over ){
                scope.me = !scope.me;
              }
            }
          }

        };
      }
    }
  };
});

MyAPP.directive('yqChessbox', function($document) {
  return {
    restrict: 'AE',
    scope: {
    },
    transclude: true,
    controller: function($scope, $element, $attrs) {
      console.log('controller');
    },
    compile: function compile(tElement, tAttrs) {
      var deviceWidth = window.innerWidth;
      // 棋盘边长
      var chessboxWidth = deviceWidth - 10;
      // 每个格子边长
      var gridWidth = Number(tAttrs.gridwidth);

      console.log(tAttrs);

      //每个格子20px
      var borderWidth = chessboxWidth % gridWidth;
      var numChessLines = (chessboxWidth - borderWidth) / gridWidth;
      console.log(borderWidth + "," + numChessLines);
      if(borderWidth < gridWidth){
        borderWidth += gridWidth;
        numChessLines --;
      }
      console.log(borderWidth + "," + numChessLines);

      var chessbox = tElement[0];
      chessbox.style.width = chessboxWidth + "px";
      chessbox.style.height = chessboxWidth + "px";
      chessbox.style.display = "block";
      chessbox.style.margin = "50px auto";
      chessbox.style.boxShadow = "-2px -2px 2px #EFEFEF, 5px 5px 5px #B9B9B9";
      chessbox.style.padding = (borderWidth/2-1) + "px";
      chessbox.style.position = "absolute";

      for(var i=0; i<numChessLines; i++){
        for(var j=0; j<numChessLines; j++) {
          var line = angular.element("<div yqX='"+j+"' yqY='"+i+"'></div>");
          line.css({
            position: "relative",
            display: "inline-block",
            float: "left",
            borderRight: "1px solid #BFBFBF",
            borderBottom: "1px solid #BFBFBF",
            width: gridWidth + "px",
            height: gridWidth + "px",
            padding: "0px",
            margin: "0px",
          });
          if(i == 0){
            line.css({
              borderTop: "1px solid #BFBFBF",
              height: (gridWidth+1) + "px",
            });
          }
          if(j == 0){
            line.css({
              borderLeft: "1px solid #BFBFBF",
              width: (gridWidth+1) + "px",
            });
          }
          tElement.append(line);
        }
      }

      //link start
      return function(scope, iElement, iAttrs){
        // 棋盘边长
        var chessboxWidth = window.innerWidth - 10;
        // 每个格子边长
        var gridWidth = Number(iAttrs.gridwidth);
        // 两倍空白边距
        var borderWidth = chessboxWidth % gridWidth;
        // 格数
        var numChessLines = (chessboxWidth - borderWidth) / gridWidth;
        if(borderWidth < gridWidth){
          borderWidth += gridWidth;
          numChessLines --;
        }
        console.log(borderWidth + "," + numChessLines);

        var oneStep =  function(i, j, x, y){
          if(x > gridWidth/2){
            i ++;
          }
          if(y > gridWidth/2){
            j ++;
          }
          Step(i, j, true);
        }
        var Step =  function(i, j, me){
          if(me){
            var backcolor = "radial-gradient(#636766 5%, #0A0A0A 60%)";
          }else{
            var backcolor = "radial-gradient(#F9F9F9 5%, #D1D1D1 60%)";
          }
          console.log(i + " , " + j);
          // 下一子 me{true:黑子;false:百子}
          // (i,j) 圆心
          var circle = angular.element("<div class='chess'></div>");
          circle.css({
            width: gridWidth + "px",
            height: gridWidth + "px",
            //background: "radial-gradient(red, green, blue);",
            borderRadius: (gridWidth/2) + "px",
            top: (j*gridWidth - gridWidth/2 + borderWidth/2) + "px",
            left: (i*gridWidth - gridWidth/2 + borderWidth/2) + "px",
            position: "absolute",
            display: "inline-block",
            background: backcolor
          });
          console.log(iElement);
          iElement.append(circle);
        };

        iElement.bind('click', function(e){
          if(e.target.attributes['yqx'] == undefined || e.target.attributes['yqy'] == undefined ){
            return;
          }
          var gridX = e.target.attributes['yqx'].nodeValue;
          var gridY = e.target.attributes['yqy'].nodeValue;

          oneStep(gridX, gridY, e.offsetX, e.offsetY);

        });//click event end
      };//link end
    }
  };
});
