MyAPP.directive('chessBox', function ($document) {
  return {
    restrict: 'AE',
    scope: {},
    controller: function ($scope, $element, $attrs) {

    },
    compile: function compile(tElement, tAttrs) {
      tElement.addClass('chessbox');
      var chess = tElement[0];
      chess.height = 450;
      chess.width = 450;
      var context = chess.getContext('2d');
      context.strokeStyle = "#BFBFBF";
      for (var i = 0; i < 15; i++) {
        context.moveTo(15 + 30 * i, 15);
        context.lineTo(15 + 30 * i, 435);
        context.stroke();
        context.moveTo(15, 15 + 30 * i);
        context.lineTo(435, 15 + 30 * i);
        context.stroke();
      }
      return function (scope, iElement, iAttrs) {
        var context = iElement[0].getContext('2d');
        scope.me = true;
        scope.over = false;

        // 初始化棋盘
        scope.chessBoard = [];
        for (var i = 0; i < 15; i++) {
          scope.chessBoard[i] = [];
          for (var j = 0; j < 15; j++) {
            scope.chessBoard[i][j] = 0;
          }
        }
        ;

        // 赢法数组 初始化
        scope.wins = [];
        for (var i = 0; i < 15; i++) {
          scope.wins[i] = [];
          for (var j = 0; j < 15; j++) {
            scope.wins[i][j] = [];
          }
        }
        ;

        // 赢法的统计数组
        scope.myWin = [];
        scope.computerWin = [];

        var count = 0;
        // 竖线
        for (var i = 0; i < 15; i++) {
          for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
              scope.wins[i][j + k][count] = true;
            }
            count++;
          }
        }
        ;
        // 横线
        for (var i = 0; i < 15; i++) {
          for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
              scope.wins[j + k][i][count] = true;
            }
            count++;
          }
        }
        ;
        // 斜线
        for (var i = 0; i < 11; i++) {
          for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
              scope.wins[i + k][j + k][count] = true;
            }
            count++;
          }
        }
        ;
        // 反斜线
        for (var i = 0; i < 11; i++) {
          for (var j = 14; j > 3; j--) {
            for (var k = 0; k < 5; k++) {
              scope.wins[i + k][j - k][count] = true;
            }
            count++;
          }
        }
        ;
        $log.info("总共有:" + count + "种赢法");

        for (var i = 0; i < count; i++) {
          scope.myWin[i] = 0;
          scope.computerWin[i] = 0;
        }

        var computerAI = function () {
          var myScore = [];
          var computerScore = [];
          //最高分
          var max = 0;
          //最高分坐标
          var u = 0, v = 0;
          for (var i = 0; i < 15; i++) {
            myScore[i] = [];
            computerScore[i] = [];
            for (var j = 0; j < 15; j++) {
              myScore[i][j] = 0;
              computerScore[i][j] = 0;
            }
          }

          for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
              if (scope.chessBoard[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                  if (scope.wins[i][j][k]) {
                    if (scope.myWin[k] == 1) {
                      myScore[i][j] += 200;
                    } else if (scope.myWin[k] == 2) {
                      myScore[i][j] += 400;
                    } else if (scope.myWin[k] == 3) {
                      myScore[i][j] += 2000;
                    } else if (scope.myWin[k] == 4) {
                      myScore[i][j] += 10000;
                    }
                    if (scope.computerWin[k] == 1) {
                      computerScore[i][j] += 220;
                    } else if (scope.computerWin[k] == 2) {
                      computerScore[i][j] += 420;
                    } else if (scope.computerWin[k] == 3) {
                      computerScore[i][j] += 2100;
                    } else if (scope.computerWin[k] == 4) {
                      computerScore[i][j] += 20000;
                    }
                  }
                  if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    u = i;
                    v = j;
                  } else if (myScore[i][j] == max) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                      u = i;
                      v = j;
                    }
                  }
                  if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                  } else if (computerScore[i][j] == max) {
                    if (myScore[i][j] > myScore[u][v]) {
                      u = i;
                      v = j;
                    }
                  }
                }
              }

            }
          }
          ;
          return [u, v];
        }

        // 下一子 me{true:黑子;false:百子}
        var oneStep = function (i, j, me) {
          context.beginPath();
          context.arc(15 + i * 30, 15 + j * 30, 15, 0, 2 * Math.PI);
          context.closePath();
          var gradient = context.createRadialGradient(15 + i * 30, 15 + j * 30, 12, 15 + i * 30, 15 + j * 30, 4);
          if (me) {
            gradient.addColorStop(0, "#0A0A0A");
            gradient.addColorStop(1, "#636766");
          } else {
            gradient.addColorStop(0, "#D1D1D1");
            gradient.addColorStop(1, "#F9F9F9");
          }
          context.fillStyle = gradient;
          context.fill();
        };

        iElement[0].onclick = function (e) {
          if (scope.over) {
            return;
          }
          var x = e.offsetX;
          var y = e.offsetY;
          var i = Math.floor(x / 30);
          var j = Math.floor(y / 30);
          if (scope.chessBoard[i][j] == 0) {
            if (scope.me) {
              scope.chessBoard[i][j] = 1;
            } else {
              scope.chessBoard[i][j] = 2;
            }
            oneStep(i, j, scope.me);
            //scope.me = !scope.me;
            //
            for (var k = 0; k < count; k++) {
              if (scope.wins[i][j][k]) {
                scope.myWin[k]++;
                scope.computerWin[k] = 6;
                if (scope.myWin[k] == 5) {
                  alert('You Win!');
                  scope.over = true;
                }
              }
            }
            if (!scope.over) {
              scope.me = !scope.me;
              var computerStep = computerAI();
              oneStep(computerStep[0], computerStep[1], false);
              scope.chessBoard[computerStep[0]][computerStep[1]] = 2;
              for (var k = 0; k < count; k++) {
                if (scope.wins[computerStep[0]][computerStep[1]][k]) {
                  scope.computerWin[k]++;
                  scope.myWin[k] = 6;
                  if (scope.computerWin[k] == 5) {
                    alert('computer Win!');
                    scope.over = true;
                  }
                }
              }
              if (!scope.over) {
                scope.me = !scope.me;
              }
            }
          }

        };
      }
    }
  };
});

MyAPP.directive('yqChessbox', function ($document, $log) {
	return {
		restrict: 'AE',
		scope: {
			gridWidth: '@',
			cmdRestart: "=",
			cmdTwoPerson: "=twoPerson"
		},
		transclude: true,
		controller: function ($scope, $element, $attrs) {

		},
		link: function (scope, iElement, iAttrs) {
			var deviceWidth = window.innerWidth; //>600?600:window.innerWidth;
			// 棋盘边长
			var chessboxWidth = deviceWidth - 10;
			// 每个格子边长
			var gridWidth = 20;
			// 两倍留白边长
			var borderWidth = 0;
			// 每行格子数量
			var numChessLines = 0;

			// 棋盘
			var chessBoard = [];
			// 赢法数组
			var wins = [];
			// 全部赢法
			var count = 0;

			// 赢法的统计数组
			var myWin = [];
			var computerWin = [];


			var F_MY_TRUN = true;
			var F_OVER = false;

			scope.$watch('gridWidth', function (r) {
				if(r == 0){
					return;
				}
				initUI();
				initAI();
			});

			scope.$watch('cmdRestart', function (r) {
				if(r == undefined){
					return;
				}
				console.log("cmdRestart : " + r);
				clearAllChess();
				initAI();
				F_MY_TRUN = true;
				F_OVER = false;
			});

			scope.$watch('cmdTwoPerson', function (r) {
				if(r == undefined){
					return;
				}
				console.log("cmdTwoPerson : " + r);
				if (scope.cmdTwoPerson) {
				  // 双人
					clearAllChess();
          initAI();
          F_MY_TRUN = true;
          F_OVER = false;
				} else {
				  // 人机
					clearAllChess();
          initAI();
          F_MY_TRUN = true;
          F_OVER = false;
				}
			});


			var clearAllChess = function () {
				var chessList = document.getElementsByClassName("chess");
				for (var i = 0; i < chessList.length;) {
				    chessList[i].remove();
				}
			};

			var clearAllLines = function () {
				var chessLineList = document.getElementsByClassName("chess-line");
				for (var i = 0; i < chessLineList.length;) {
					chessLineList[i].remove();
				}
			};

			var initUI = function () {
				clearAllChess();
				clearAllLines();

				gridWidth = Number(scope.gridWidth);
				borderWidth = chessboxWidth % gridWidth;
				numChessLines = (chessboxWidth - borderWidth) / gridWidth;
				if (borderWidth < gridWidth) {
				    borderWidth += gridWidth;
				    numChessLines--;
				}

				var chessbox = iElement[0];
				chessbox.style.width = chessboxWidth + "px";
				chessbox.style.height = chessboxWidth + "px";
				chessbox.style.display = "block";
				chessbox.style.margin = "20px 10px 20px 4px";
				chessbox.style.boxShadow = "-2px -2px 2px #EFEFEF, 5px 5px 5px #B9B9B9";
				chessbox.style.padding = (borderWidth / 2 - 1) + "px";
				chessbox.style.position = "absolute";

				for (var i = 0; i < numChessLines; i++) {
					for (var j = 0; j < numChessLines; j++) {
						var line = angular.element("<div class='chess-line' yqX='" + j + "' yqY='" + i + "'></div>");
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
						if (i == 0) {
							line.css({
								borderTop: "1px solid #BFBFBF",
								height: (gridWidth + 1) + "px",
							});
						}
						if (j == 0) {
							line.css({
								borderLeft: "1px solid #BFBFBF",
								width: (gridWidth + 1) + "px",
							});
						}
						iElement.append(line);
					}
				}

			};

			var initAI = function() {
				chessBoard = [];
				wins = [];

				for (var i = 0; i < numChessLines+1; i++) {
					chessBoard[i] = [];
					for (var j = 0; j < numChessLines+1; j++) {
						chessBoard[i][j] = 0;
					}
				};
				for (var i = 0; i < numChessLines+1; i++) {
					wins[i] = [];
					for (var j = 0; j < numChessLines+1; j++) {
						wins[i][j] = [];
					}
				};

				count = 0;
				// 竖线
				for (var i = 0; i < numChessLines+1; i++) {
					for (var j = 0; j < numChessLines-3; j++) {
						for (var k = 0; k < 5; k++) {
							wins[i][j + k][count] = true;
						}
						count++;
					}
				};
				// 横线
				for (var i = 0; i < numChessLines+1; i++) {
					for (var j = 0; j < numChessLines-3; j++) {
						for (var k = 0; k < 5; k++) {
							wins[j + k][i][count] = true;
						}
						count++;
					}
				};
				// 斜线
				for (var i = 0; i < numChessLines-3; i++) {
					for (var j = 0; j < numChessLines-3; j++) {
						for (var k = 0; k < 5; k++) {
							wins[i + k][j + k][count] = true;
						}
						count++;
					}
				};
				// 反斜线
				for (var i = 0; i < numChessLines-3; i++) {
					for (var j = numChessLines; j > 3; j--) {
						for (var k = 0; k < 5; k++) {
							wins[i + k][j - k][count] = true;
						}
						count++;
					}
				};
				$log.info("总共有:" + count + "种赢法");

				for (var i = 0; i < count; i++) {
					myWin[i] = 0;
					computerWin[i] = 0;
				}
			}

			var oneStep = function (i, j, me) {
				if (me) {
				    var backcolor = "radial-gradient(#636766 5%, #0A0A0A 60%)";
				} else {
				    var backcolor = "radial-gradient(#F9F9F9 5%, #D1D1D1 60%)";
				}

				// 下一子 me{true:黑子;false:百子}
				// (i,j) 圆心
				var circle = angular.element("<div class='chess'></div>");
				circle.css({
					width: gridWidth + "px",
					height: gridWidth + "px",
					//background: "radial-gradient(red, green, blue);",
					borderRadius: (gridWidth / 2) + "px",
					top: (j * gridWidth - gridWidth / 2 + borderWidth / 2) + "px",
					left: (i * gridWidth - gridWidth / 2 + borderWidth / 2) + "px",
					position: "absolute",
					display: "inline-block",
					background: backcolor
				});
				iElement.append(circle);
			};

			iElement.bind('click', function (e){
				if (F_OVER) {
					return;
				}
				if (e.target.attributes['yqx'] == undefined || e.target.attributes['yqy'] == undefined) {
				    return;
				}
				var gridX = e.target.attributes['yqx'].nodeValue;
				var gridY = e.target.attributes['yqy'].nodeValue;
				if (e.offsetX > gridWidth / 2) {
					gridX++;
				}
				if (e.offsetY > gridWidth / 2) {
					gridY++;
				}

				if(chessBoard[gridX][gridY] == 0){
					if(scope.cmdTwoPerson){
						oneStep(gridX, gridY, F_MY_TRUN);
						if(F_MY_TRUN){
							chessBoard[gridX][gridY] = 1;
							checkMyWin(gridX, gridY);
						} else {
							chessBoard[gridX][gridY] = 2;
							checkComputerWin(gridX, gridY);
						}
						F_MY_TRUN = !F_MY_TRUN;
					} else {
						// 人机
						oneStep(gridX, gridY, true);
						chessBoard[gridX][gridY] = 1;
						checkMyWin(gridX, gridY);
						computerAI(function(u, v){
							chessBoard[u][v] = 2;
              oneStep(u, v, false);
							checkComputerWin(u, v);
						});
					}
				}
			});

			var checkMyWin = function(i , j) {
				for (var k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						myWin[k]++;
						computerWin[k] = 6;
						if (myWin[k] == 5) {
              if(scope.cmdTwoPerson){
                alert('Black Win!');
              } else {
                alert('You Win!');
              }
							F_OVER = true;
						}
					}
				}
			};

			var checkComputerWin = function(i, j) {
				for (var k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						computerWin[k]++;
						myWin[k] = 6;
						if (computerWin[k] == 5) {
              if(scope.cmdTwoPerson){
                alert('White Win!');
              } else {
                alert('Computer Win!');
              }
							F_OVER = true;
						}
					}
				}
			};

			var computerAI = function (fun) {
				var myScore = [];
				var computerScore = [];
				//最高分
				var max = 0;
				//最高分坐标
				var u = 0, v = 0;
				for (var i = 0; i < (numChessLines+1); i++) {
					myScore[i] = [];
					computerScore[i] = [];
					for (var j = 0; j < (numChessLines+1); j++) {
						myScore[i][j] = 0;
						computerScore[i][j] = 0;
					}
				}

				for (var i = 0; i < (numChessLines+1); i++) {
					for (var j = 0; j < (numChessLines+1); j++) {
						if (chessBoard[i][j] == 0) {
							for (var k = 0; k < count; k++) {
								if (wins[i][j][k]) {
									if (myWin[k] == 1) {
										myScore[i][j] += 200;
									} else if ( myWin[k] == 2) {
										myScore[i][j] += 400;
									} else if ( myWin[k] == 3) {
										myScore[i][j] += 2000;
									} else if ( myWin[k] == 4) {
										myScore[i][j] += 10000;
									}
									if ( computerWin[k] == 1) {
										computerScore[i][j] += 220;
									} else if ( computerWin[k] == 2) {
										computerScore[i][j] += 420;
									} else if ( computerWin[k] == 3) {
										computerScore[i][j] += 2100;
									} else if ( computerWin[k] == 4) {
										computerScore[i][j] += 20000;
									}
								}
								if (myScore[i][j] > max) {
									max = myScore[i][j];
									u = i;
									v = j;
								} else if (myScore[i][j] == max) {
									if (computerScore[i][j] > computerScore[u][v]) {
										u = i;
										v = j;
									}
								}
								if (computerScore[i][j] > max) {
									max = computerScore[i][j];
									u = i;
									v = j;
								} else if (computerScore[i][j] == max) {
									if (myScore[i][j] > myScore[u][v]) {
										u = i;
										v = j;
									}
								}
							}
						}

					}
				};
				console.log(u+ ","+v);
				fun(u, v);
			}
		}//link end

	};
});
