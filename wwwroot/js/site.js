$(document).ready(function () {
    hide();

    document.getElementById("display-modal").addEventListener("click", function () {
        $('#modal-add-player').modal("show");
    });
    document.getElementById("checkLocal").addEventListener("change", function () {
        document.getElementById("checkRemote").checked = false;
    });
    document.getElementById("checkRemote").addEventListener("change", function () {
        document.getElementById("checkLocal").checked = false;
    });
    document.getElementById("Add-player").addEventListener("click", function () {
        addPlayer();
    });

    document.getElementById("StarGame").addEventListener("click", function () {
        startGame();
    });
    document.getElementById("startRemoteGame").addEventListener("click", function () {
        startRemoteGame();
    });

    document.getElementById("localGame-btn").addEventListener("click", function () {
        $('#create-Game-Sect').show();
        $('#localRemoteGames').hide();
    });
    document.getElementById("btn-endpoint").addEventListener("click", function () {
        changeEndpoint();
    });
    document.getElementById("btn-RemoteGame").addEventListener("click", function () {
        showGamesTable();
    });
    document.getElementById("joinRemoteGame").addEventListener("click", function () {
        addPlayerRemote();
    });
    $(document).on('submit', '#game-form', function () {
        createGame();
        return false;
    });

});
var playerAmount;
var endpoint = "https://contaminados.meseguercr.com/api/games/";
var localGameId;
var gameId;
var playerCount = 1;
var gameOwner;
var gamePassw;
var playersSelected = [];
var proposedGroup = [];
var round = 0;
var path;
var countSendPaths = 0;
var psychoWin = 0;
var psychoLost = 0;
var remotePlayersQ = 0;
var verifyLocalSend = 0
var status;

function getEndPoint() {
    return endpoint;
}

function startGame() {

    var gameStart = gameId + "/start"
    $('#participants-list').hide();
    $.ajax({
        url: endpoint + gameStart,
        headers: { password: gamePassw, player: gameOwner },
        type: "HEAD",
        dataType: "json",
        success: function (result) {
            var gameInfo = getGame();
            var html = '';
            var count = 0;
            $.each(gameInfo.players, function (key, item) {
                html += '<div class="col-lg-4 mb-4"> <div class="card"> <div class="card-header">';
                html += '<div class="d-flex justify-content-center"> <h3 id="h3' + item + '" value="' + item + '">' + item + '</h3> </div></div>';
                html += '<div class="card-body" id="card' + item + '"> <div class="flex-md-column"> <div class="container" id="player' + item + 'buttons"> ';
                $.each(gameInfo.players, function (key, element) {

                    if (gameInfo.psychos.includes(item) == true) {
                        if (gameInfo.psychos.includes(element) == true) {
                            html += '<div class="mb-1">';
                            html += '<button type="button" class="btn-player" id="btn' + item + count + '" value="' + element + '" onclick="return getPlayer(\'' + element + '\',\'' + count + '\',\'' + item + '\')" style="color:red;width:100px">' + element + '</button>';
                            html += '</div>';
                            count = count + 1;
                        } else {
                            html += '<div class="mb-1">';
                            html += '<button type="button" class="btn-player" id="btn' + item + count + '" value="' + element + '" onclick="return getPlayer(\'' + element + '\',\'' + count + '\',\'' + item + '\')" style="color:green;width:100px">' + element + '</button>';
                            html += '</div>';
                            count = count + 1;
                        }

                    } else {
                        html += '<div class="mb-1">';
                        html += '<button type="button" class="btn-player" id="btn' + item + count + '" value="' + element + '" onclick="return getPlayer(\'' + element + '\',\'' + count + '\',\'' + item + '\')" style="width:100px;">' + element + '</button>';
                        html += '</div>';
                        count = count + 1;
                    }

                });
                html += '</div></div><div class="flex-md-column"><div class="container" id="path' + item + 'buttons">';


                html += '<div class="mb-1">';
                html += '<h5 id="' + item + 'waitingPath">Esperando la selección de caminos</h5>';
                html += '</div>';
                html += '<div class="mb-1">';
                html += '<h5 id="' + item + 'waitSelection">Esperando la selección de grupos</h5>';
                html += '</div>';
                html += '<div class="mb-1">';
                html += '<h5 id="' + item + 'roundGroup"></h5>';
                html += '</div>';
                html += '<div class="mb-1">';
                html += '<button type="button" class="btn-primary" id="' + item + 'goodPath" onclick="goodPath()" value="Camino Seguro"> Camino Seguro</button>';
                html += '</div>';
                if (gameInfo.psychos.includes(item) == true) {
                    html += '<div class="mb-1">';
                    html += '<button type="button" class="btn-primary" id="' + item + 'badPath" onclick="return badPath()" value="Camino Inseguro"> Camino Inseguro</button>';
                    html += '</div>';
                }
                html += '</div></div></div>';
                html += '<div class="card-footer"> <div class="d-flex justify-content-center">';
                html += '<button type="button" class="btn-primary" id="' + item + 'sendGroup"  onclick="sendGroup(\'' + item + '\')"> Enviar Grupo</button>';
                html += '<button type="button" class="btn-primary" id="' + item + 'sendPath"  onclick="sendPath(\'' + item + '\')"> Enviar Camino</button>';
                html += '</div></div></div></div>';

            });
            $('#row-cardGame').html(html);

            $.each(gameInfo.players, function (key, item) {
                var player = $('#h3' + item).text();
                if (player != gameInfo.rounds[0].leader) {
                    $('#player' + item + 'buttons').hide();
                    $('#' + item + 'sendPath').hide();
                    $('#' + item + 'sendGroup').hide();
                    $('#' + item + 'waitingPath').hide();
                    $('#' + item + 'goodPath').hide();
                    if (gameInfo.psychos.includes(item) == true) {
                        $('#' + item + 'badPath').hide();
                    }
                    $('#' + item + 'roundGroup').hide();


                } else {
                    $('#' + item + 'sendPath').hide();
                    $('#' + item + 'waitingPath').hide();
                    $('#' + item + 'goodPath').hide();
                    $('#' + item + 'waitSelection').hide();
                    if (gameInfo.psychos.includes(item) == true) {
                        $('#' + item + 'badPath').hide();
                    }
                }


            });
            $('#container-game-cards').show();
            $('#game-score').show();
            $('#participants-list').hide();


        }, error: function (errorMessage) {
            if (errorMessage.status == 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unauthorized',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Forbidden',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Game not found',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 409) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Game already started',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 428) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Need 5 players to start',
                    showConfirmButton: false,
                    timer: 1800
                });

            }

        }
    });
}

function hide() {
    $('#game-score').hide();
    $('#create-Game-Sect').hide();
    $('#container-game-cards').hide();
    $('#participants-list').hide();
    $('#remoteParticipants-list').hide();
    $('#row-remoteCardGame').hide();
    $('#gamesLobbyTable').hide();
}

function getPlayer(namePlayer, count, leaderName) {
    var findElem = leaderName + count;
    if (playersSelected.includes(findElem) == true) {
        playersSelected = arrayRemove(playersSelected, findElem);
        proposedGroup = arrayRemove(proposedGroup, namePlayer);
        document.getElementById("btn" + findElem).style.background = "transparent";


    } else {
        document.getElementById("btn" + findElem).style.background = "blue";
        playersSelected.push(findElem);
        proposedGroup.push(namePlayer);


    }


}

function goodPath() {
    path = false;
}
function badPath() {
    path = true;
}
function clearcontent(html) {
    document.getElementById(html).innerHTML = "";
}

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });
}

function sendProposal(playerName) {
    var json = '{"group":[]}';
    var playersGroup = JSON.parse(json);
    $.each(proposedGroup, function (key, item) {
        playersGroup.group.push(item);
    })
    $.each(playersSelected, function (key, item) {
        document.getElementById("btn" + item).style.background = "transparent";
        playersSelected = arrayRemove(playersSelected, item);
    })

    $.ajax({
        url: endpoint + gameId + "/group",
        headers: { name: playerName, password: gamePassw },
        type: "POST",
        data: JSON.stringify(playersGroup),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var gameInfo = getGame();
            $('#player' + getGame().rounds[round].leader + 'buttons').hide();
            $('#' + getGame().rounds[round].leader + 'sendGroup').hide();
            $.each(proposedGroup, function (key, item) {
                $('#player' + item + 'buttons').hide();
                $('#' + item + 'sendPath').show();
                if (gameInfo.psychos.includes(item) == true) {
                    $('#' + item + 'goodPath').show();
                    $('#' + item + 'badPath').show();
                } else {
                    $('#' + item + 'goodPath').show();

                }
            });
            $.each(gameInfo.players, function (key, item) {
                if (proposedGroup.includes(item) == false) {
                    $('#' + item + 'waitingPath').show();
                    $('#' + item + 'waitSelection').hide();
                }
            });


        },
        error: function (errorMessage) {
            if (errorMessage.status == 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La contraseña es incorrecta',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No eres parte de la lista de jugadores',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El id del juego es inválido',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 406) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La información provista es incorrecta',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 409) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ya se añadio un grupo al juego',
                    showConfirmButton: false,
                    timer: 1800
                });

            }

        }
    });
}

function sendGroup(playerName) {
    if (playerCount == 5) {
        if (round == 0 && proposedGroup.length == 2) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 1 && proposedGroup.length == 3) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 2 && proposedGroup.length == 2) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 3 && proposedGroup.length == 3) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 4 && proposedGroup.length == 3) {
            sendProposal(playerName);
            groupSelected();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad de jugadores propuestos no es correcta',
                showConfirmButton: false,
                timer: 1800
            });
        }
    }
    if (playerCount == 6) {
        if (round == 0 && proposedGroup.length == 2) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 1 && proposedGroup.length == 3) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 2 && proposedGroup.length == 4) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 3 && proposedGroup.length == 3) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 4 && proposedGroup.length == 4) {
            sendProposal(playerName);
            groupSelected();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad de jugadores propuestos no es correcta',
                showConfirmButton: false,
                timer: 1800
            });
        }
    }
    if (playerCount == 7) {
        if (round == 0 && proposedGroup.length == 2) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 1 && proposedGroup.length == 3) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 2 && proposedGroup.length == 3) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 3 && proposedGroup.length == 4) {
            sendProposal(playerName);
            groupSelected();
        }
        else if (round == 4 && proposedGroup.length == 4) {
            sendProposal(playerName);
            groupSelected();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad de jugadores propuestos no es correcta',
                showConfirmButton: false,
                timer: 1800
            });
        }
    }
    if (playerCount > 7) {
        if (round == 0 && proposedGroup.length == 3) {
            sendProposal(playerName);
        }
        else if (round == 1 && proposedGroup.length == 4) {
            sendProposal(playerName);
        }
        else if (round == 2 && proposedGroup.length == 4) {
            sendProposal(playerName);
        }
        else if (round == 3 && proposedGroup.length == 5) {
            sendProposal(playerName);
        }
        else if (round == 4 && proposedGroup.length == 5) {
            sendProposal(playerName);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad de jugadores propuestos no es correcta',
                showConfirmButton: false,
                timer: 1800
            });
        }
    }

}

function groupSelected() {
    var gameInfo = getGame();
    $.each(gameInfo.players, function (key, item) {
        var html = 'El grupo seleccionado es: ';
        $.each(proposedGroup, function (key, element) {
            if (key == (proposedGroup.length - 1)) {
                html += element;
            } else {
                html += element + ', ';
            }

        });
        $('#' + item + 'roundGroup').text(html)
        $('#' + item + 'roundGroup').show()



    });

}
function sendPath(playerName) {
    $.ajax({
        url: endpoint + gameId + "/go",
        headers: { name: playerName, password: gamePassw },
        type: "POST",
        data: JSON.stringify({ psycho: path }),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var gameInfo = getGame();
            countSendPaths = countSendPaths + 1;

            if (countSendPaths < proposedGroup.length) {
                $('#' + playerName + 'sendPath').hide();
                if (gameInfo.psychos.includes(playerName) == true) {
                    $('#' + playerName + 'goodPath').hide();
                    $('#' + playerName + 'badPath').hide();
                } else {
                    $('#' + playerName + 'goodPath').hide();

                }
                $('#' + playerName + 'waitingPath').show();

            } else {
                $('#' + playerName + 'sendPath').hide();
                if (gameInfo.psychos.includes(playerName) == true) {
                    $('#' + playerName + 'goodPath').hide();
                    $('#' + playerName + 'badPath').hide();
                } else {
                    $('#' + playerName + 'goodPath').hide();

                }
                if (gameInfo.psychoWin[round] == true) {
                    psychoWin = psychoWin + 1;
                    $('#PsychoScore').text(psychoWin);

                } else {
                    psychoLost = psychoLost + 1;
                    $('#ExeScore').text(psychoLost);
                }
                round = round + 1;
                if (psychoWin == 3) {
                    $.each(gameInfo.players, function (key, item) {
                        clearcontent("card" + item);
                        document.getElementById("card" + item).innerHTML = "<h4>El juego ha terminado, los psicopatas ganaron la partida</h4>";
                    });
                }
                else if (psychoLost == 3) {
                    $.each(gameInfo.players, function (key, item) {
                        clearcontent("card" + item);
                        document.getElementById("card" + item).innerHTML = "<h4>El juego ha terminado, los ciudadanos ejemplares ganaron la partida</h4>";
                    });
                } else {
                    $.each(gameInfo.players, function (key, item) {
                        if (gameInfo.rounds[round].leader == item) {
                            $('#player' + item + 'buttons').show();
                            $('#' + item + 'sendGroup').show();
                            $('#' + item + 'roundGroup').hide();
                            $('#' + item + 'waitingPath').hide();
                        } else {
                            $('#' + item + 'waitSelection').show();
                            $('#' + item + 'roundGroup').hide();
                            $('#' + item + 'waitingPath').hide();

                        }
                    });
                    countSendPaths = 0;

                }
                $.each(playersSelected, function (key, item) {
                    document.getElementById("btn" + item).style.background = "transparent";
                    playersSelected = arrayRemove(playersSelected, item);
                });
                $.each(proposedGroup, function (key, item) {
                    proposedGroup = arrayRemove(proposedGroup, item);
                });


            }


        },
        error: function (errorMessage) {
            if (errorMessage.status == 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La contraseña es incorrecta',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No eres parte de la lista de jugadores',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El id del juego es inválido',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 406) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La información provista es incorrecta',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 409) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ya se añadio un grupo al juego',
                    showConfirmButton: false,
                    timer: 1800
                });

            }

        }
    });

}

//GET public
//function getGame() {
//    return JSON.parse($.ajax({
//        type: 'GET',
//        url: endpoint,
//        dataType: 'json',
//        global: false,
//        async: false,
//        success: function (data) {
//            return data;
//        }
//    }).responseText);
//}


//GET authenticated
//trae un juego por ID (refresh)
function getGame() {
    return JSON.parse($.ajax({
        type: 'GET',
        url: endpoint + gameId,
        headers: { player: gameOwner, password: gamePassw },
        dataType: 'json',
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText);
}

//function addPlayer() {
//    var gameJoin = gameId + "/join"
//    var playerName = $('#player-name').val();
//    var passwordGame = $('#password-game').val();
//    //passwordGame = sha256(passwordGame);
//    $.ajax({
//        url: endpoint + gameJoin,
//        headers: { name: playerName, password: passwordGame },
//        type: "PUT",
//        dataType: "json",
//        contentType: "application/json",
//        success: function (result) {
//            var html = '';
//            $.each(getGame().players, function (key, item) {
//                html += "<li>" + item + "</li>";
//            });
//            $('#part-list').html(html);
//            playerCount = playerCount + 1;
//            $('#player-name').val('');
//            $('#password-game').val('');


//        },
//        error: function (errorMessage) {
//            if (errorMessage.status == 401) {
//                Swal.fire({
//                    icon: 'error',
//                    title: 'Error',
//                    text: 'Invalid credentials',
//                    showConfirmButton: false,
//                    timer: 1800
//                });
//            }
//            if (errorMessage.status == 404) {
//                Swal.fire({
//                    icon: 'error',
//                    title: 'Error',
//                    text: 'The specified resource was not found',
//                    showConfirmButton: false,
//                    timer: 1800
//                });
//            }
//            if (errorMessage.status == 409) {
//                Swal.fire({
//                    icon: 'error',
//                    title: 'Error',
//                    text: 'Asset already exists',
//                    showConfirmButton: false,
//                    timer: 1800
//                });
//            }
//            if (errorMessage.status == 428) {
//                Swal.fire({
//                    icon: 'error',
//                    title: 'Error',
//                    text: 'This action is not allowed at this time',
//                    showConfirmButton: false,
//                    timer: 1800
//                });
//            }

//        }
//    });
//    if (playerCount == 10) {
//        document.getElementById("display-modal").disabled = true;
//    }
//    if (playerCount < 5) {
//        document.getElementById("display-modal").disabled = false;
//    }


//}


//POST Authenticated
function createGame() {
    if ($('#checkLocal').prop('checked') || $('#checkRemote').prop('checked')) {
        if ($('#checkLocal').prop('checked')) {
            var ownerName = $('#ownerNameInput').val();
            var gameName = $('#gameNameInput').val();
            var gamePassword = $('#gamePassword').val();
            gameOwner = ownerName;
            gamePassw = gamePassword;
            $.ajax({
                url: endpoint,
                headers: { owner: ownerName, name: gameName },
                type: 'POST',
                data: JSON.stringify({ name: gameName, owner: ownerName, password: gamePassword }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {
                    $('#create-Game-Sect').hide();
                    $('#participants-list').show();
                    //localRemoteGames
                    //$("#display-modal").hide();

                    gameId = result.data.id;
                    var html = "<li>" + ownerName + "</li>";
                    $('#part-list').html(html);
                    $('#ownerNameInput').val('');
                    $('#gameNameInput').val('');
                    $('#gamePassword').val('');

                },

                error: function (errorMessage) {
                    alert("error");
                    if (errorMessage.status == 400) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Client error',
                            showConfirmButton: false,
                            timer: 1800
                        });

                    }
                    if (errorMessage.status == 409) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Asset already exists',
                            showConfirmButton: false,
                            timer: 1800
                        });

                    }

                }
            });

        } else {
            var ownerName = $('#ownerNameInput').val();
            var gameName = $('#gameNameInput').val();
            var gamePassword = $('#gamePassword').val();
            gameOwner = ownerName;
            gamePassw = gamePassword;
            $.ajax({
                url: endpoint,
                headers: { owner: ownerName, name: gameName },
                type: "POST",
                data: JSON.stringify({ name: gameName, owner: ownerName, password: gamePassword }),
                dataType: "json",
                contentType: "application/json",
                success: function (result) {
                    $('#remoteParticipants-list').show();
                    //localRemoteGames
                    //$("#display-modal").hide();
                    gameId = result.data.id;
                    var html = "<li>" + ownerName + "</li>";
                    $('#remotePart-list').html(html);
                    $('#ownerNameInput').val('');
                    $('#gameNameInput').val('');
                    $('#gamePassword').val('');
                    $('#create-Game-Sect').hide();

                },
                error: function (errorMessage) {
                    if (errorMessage.status == 400) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Client error',
                            showConfirmButton: false,
                            timer: 1800
                        });

                    }

                }

            });



        }

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe seleccionar un checkbox ',
            showConfirmButton: false,
            timer: 1800
        });
    }
}

function rechargePartList() {
    var gameInfo = getGame();
    var html = '';
    $.each(gameInfo.data.players, function (key, element) {
        //alert("jugadores" + element);
        html += "<li>" + element + "</li>";


    });
    $('#remotePart-list').html(html);



}

function changeEndpoint() {
    endpoint = $('#direccion').val();
    $.ajax({
        url: endpoint,
        type: "GET",
        dataType: "json",
        success: function (result) {
            $('#direccion').val('');
        },
        error: function (errorMessage) {
            if (errorMessage.status == 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El endpoint suministrado no es válido',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            endpoint = "https://contaminados.meseguercr.com/api/games/";

        }
    });
}


function sendLocalProposal(playerName) {
    var json = '{"group":[]}';
    var playersGroup = JSON.parse(json);
    $.each(proposedGroup, function (key, item) {
        playersGroup.group.push(item);
    })
    $.each(playersSelected, function (key, item) {
        document.getElementById("btn" + item).style.background = "transparent";
        playersSelected = arrayRemove(playersSelected, item);
    })
    $.each(proposedGroup, function (key, item) {
        proposedGroup = arrayRemove(proposedGroup, item);
    })

    $.ajax({
        url: endpoint + gameId + "/group",
        headers: { name: gameOwner, password: gamePassw },
        type: "POST",
        data: JSON.stringify(playersGroup),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            rechargeCard();
        },
        error: function (errorMessage) {
            if (errorMessage.status == 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La contraseña es incorrecta',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No eres parte de la lista de jugadores',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El id del juego es inválido',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 406) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La información provista es incorrecta',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 409) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ya se añadio un grupo al juego',
                    showConfirmButton: false,
                    timer: 1800
                });

            }

        }
    });
}
function startRemoteGame() {
    var psychoWins = 0;
    var psychosLost = 0;
    var gameStart = gameId + "/start"
    $('#remoteParticipants-list').hide();
    $.ajax({

        url: endpoint + gameStart,
        headers: { name: gameOwner, password: gamePassw },
        type: "HEAD",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var gameInfo = getGame();
            var count = 0;
            var html = '';
            html += '<div class="card" style="width:400px"> <div class="card-header" id="cardHead">';
            html += '<div class="d-flex justify-content-end" style="height:32px;"><button type="button" class="btn-icon" onclick="rechargeCard()"><svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class="bi bi-arrow-clockwise" viewBox = "0 0 16 16" ><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"></path><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"></path></svg ></button ></div ><div class="d-flex justify-content-center"> <h3 id="h3' + gameOwner + '" value="' + gameOwner + '">' + gameOwner + '</h3> </div></div>';
            html += '<div class="card-body" id="card' + gameOwner + '"> <div class="flex-md-column"> <div class="container" id="player' + gameOwner + 'buttons"> ';
            $.each(gameInfo.players, function (key, element) {
                if (gameInfo.psychos.includes(gameOwner) == true) {

                    if (gameInfo.psychos.includes(element) == true) {
                        html += '<div class="mb-1">';
                        html += '<button type="button" class="btn-player" id="btn' + gameOwner + count + '" value="' + element + '" onclick="return getPlayer(\'' + element + '\',\'' + count + '\',\'' + gameOwner + '\')" style="color:red;width:100px">' + element + '</button>';
                        html += '</div>';
                        count = count + 1;

                    } else {
                        html += '<div class="mb-1">';
                        html += '<button type="button" class="btn-player" id="btn' + gameOwner + count + '" value="' + element + '" onclick="return getPlayer(\'' + element + '\',\'' + count + '\',\'' + gameOwner + '\')" style="color:green;width:100px">' + element + '</button>';
                        html += '</div>';
                        count = count + 1;
                    }

                } else {
                    html += '<div class="mb-1">';
                    html += '<button type="button" class="btn-player" id="btn' + gameOwner + count + '" value="' + element + '" onclick="return getPlayer(\'' + element + '\',\'' + count + '\',\'' + gameOwner + '\')" style="width:100px;">' + element + '</button>';
                    html += '</div>';
                    count = count + 1;
                }

            });


            html += '</div></div><div class="flex-md-column"><div class="container" id="path' + gameOwner + 'buttons">';


            html += '<div class="mb-1">';
            html += '<h5 id="' + gameOwner + 'waitingPath">Esperando la selección de caminos de los jugadores escogidos</h5>';
            html += '</div>';
            html += '<div class="mb-1">';
            html += '<h5 id="' + gameOwner + 'waitSelection">Esperando la selección del grupo de trabajo</h5>';
            html += '</div>';
            html += '<div class="mb-1">';
            html += '<h5 id="' + gameOwner + 'waitStartGame">Esperando que la partida inicie</h5>';
            html += '</div>';
            html += '<div class="mb-1">';
            html += '<h5 id="' + gameOwner + 'roundGroup"></h5>';
            html += '</div>';
            html += '<div class="mb-1">';
            if (gameInfo.psychos.includes(gameOwner) == true) {

                html += '<h5 id="' + gameOwner + 'selectPath">Seleccione el camino seguro o inseguro</h5>';

            } else {
                html += '<h5 id="' + gameOwner + 'selectPath">Seleccione el camino seguro</h5>';
            }
            html += '</div>';
            html += '<div class="mb-1">';
            html += '<button type="button" class="btn btn-success" id="' + gameOwner + 'goodPath" onclick="goodPath()" value="Camino Seguro"> Camino Seguro</button>';
            html += '</div>';
            if (gameInfo.psychos.includes(gameOwner) == true) {
                html += '<div class="mb-1">';
                html += '<button type="button" class="btn btn-danger" id="' + gameOwner + 'badPath" onclick="return badPath()" value="Camino Inseguro"> Camino Inseguro</button>';
                html += '</div>';
            }
            html += '</div></div></div>';
            html += '<div class="card-footer"> <div class="d-flex justify-content-center">';
            html += '<button type="button" class="btn-primary" id="' + gameOwner + 'sendGroup"  onclick="sendLocalGroup(\'' + gameOwner + '\')"> Enviar Grupo</button>';
            html += '<button type="button" class="btn-primary" id="' + gameOwner + 'sendPath"  onclick="sendLocalPath(\'' + gameOwner + '\')"> Enviar Camino</button>';
            html += '</div></div></div>';
            $('#row-remoteCardGame').html(html);
            $('#row-remoteCardGame').show();
            $('#PsychoScore').text(psychoWins);
            $('#ExeScore').text(psychosLost);
            $('#game-score').show();
            $('#remoteCard').removeClass('card');


            $('#player' + gameOwner + 'buttons').hide();
            $('#' + gameOwner + 'sendPath').hide();
            $('#' + gameOwner + 'sendGroup').hide();
            $('#' + gameOwner + 'waitingPath').hide();
            $('#' + gameOwner + 'waitSelection').hide();
            $('#' + gameOwner + 'waitStartGame').hide();
            $('#' + gameOwner + 'goodPath').hide();
            $('#' + gameOwner + 'selectPath').hide();
            if (gameInfo.psychos.includes(gameOwner) == true) {
                $('#' + gameOwner + 'badPath').hide();
            }
            $('#' + gameOwner + 'roundGroup').hide();
            $('#remoteCard').removeClass('card');
            if (gameInfo.psychos.includes(gameOwner) == true) {
                $('#remoteCard').addClass('card border-danger');
                document.getElementById('cardHead').style.background = "#ca1010";


            } else {
                $('#remoteCard').addClass('card border-success');
                document.getElementById('cardHead').style.background = "#11b422";

            }
            document.getElementById("h3" + gameOwner).style.color = "white";

        },
        error: function (errorMessage) {
            if (errorMessage.status == 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unauthorized',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Forbidden',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Game not found',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 409) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Game already started',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 428) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Need 5 players to start',
                    showConfirmButton: false,
                    timer: 1800
                });

            }

        }
    });


}

function recharge() {
    var infoGame = getGame();
    var $olList = $("#part-list");
    $olList.empty();

    $.each(infoGame.data.players, function (index, player) {
        var $li = $("<li></li>").text(player); 

        $olList.append($li);
    });
}

function rechargeCard() {
    var gameInfo = getGame();
    var remoteRound = 0;
    var psychoWins = 0;
    var psychosLost = 0;

    status = gameInfo.status;
    if (gameInfo.rounds.length != 0) {
        remoteRound = gameInfo.rounds.length - 1;
    }
    $('#player' + gameOwner + 'buttons').hide();
    $('#' + gameOwner + 'sendPath').hide();
    $('#' + gameOwner + 'sendGroup').hide();
    $('#' + gameOwner + 'waitingPath').hide();
    $('#' + gameOwner + 'waitSelection').hide();
    $('#' + gameOwner + 'waitStartGame').hide();
    $('#' + gameOwner + 'goodPath').hide();
    $('#' + gameOwner + 'selectPath').hide();
    if (gameInfo.psychos.includes(gameOwner) == true) {
        $('#' + gameOwner + 'badPath').hide();
    }
    $('#' + gameOwner + 'roundGroup').hide();
    if (gameInfo.psychoWin.length != 0) {
        $.each(gameInfo.psychoWin, function (key, element) {
            if (element == false) {
                psychosLost = psychosLost + 1;
            } else {
                psychoWins = psychoWins + 1;
            }

        });
    }
    $('#PsychoScore').text(psychoWins);
    $('#ExeScore').text(psychosLost);
    if (status == "lobby") {
        $('#' + gameOwner + 'waitStartGame').show();
    }
    if (status == "leader") {
        if (gameInfo.rounds[remoteRound].leader == gameOwner) {
            $('#player' + gameOwner + 'buttons').show();
            $('#' + gameOwner + 'sendGroup').show();
        } else {
            $('#' + gameOwner + 'waitSelection').show();
        }
        verifyLocalSend = 0;
    }
    if (status == "rounds") {
        var rep = 0;
        $.each(gameInfo.rounds[remoteRound].group, function (key, element) {
            if (element.name == gameOwner) {
                if (element.psycho == null) {
                    $('#' + gameOwner + 'sendPath').show();
                    $('#' + gameOwner + 'goodPath').show();
                    $('#' + gameOwner + 'selectPath').show();
                    if (gameInfo.psychos.includes(gameOwner) == true) {
                        $('#' + gameOwner + 'badPath').show();
                    }
                } else {
                    $('#' + gameOwner + 'waitingPath').show();
                    var info = proposedGroupInfo();
                    $('#' + gameOwner + 'roundGroup').text(info);
                    $('#' + gameOwner + 'roundGroup').show();
                }


            } else {
                $('#' + gameOwner + 'waitingPath').show();
                var info = proposedGroupInfo();
                $('#' + gameOwner + 'roundGroup').text(info);
                $('#' + gameOwner + 'roundGroup').show();
            }

        });

    }
    if (status == "ended") {
        clearcontent("card" + gameOwner);
        var countWin = 0;
        $.each(gameInfo.psychoWin, function (key, element) {
            if (element == false) {
                countWin = countWin + 1;
            }

        });
        if (countWin == 3) {
            document.getElementById("card" + gameOwner).innerHTML = "<h4>El juego ha terminado, los ciudadanos ejemplares ganaron la partida</h4>";
        } else {
            document.getElementById("card" + gameOwner).innerHTML = "<h4>El juego ha terminado, los psicopatas ganaron la partida</h4>";
        }
        $.each(playersSelected, function (key, item) {
            playersSelected = arrayRemove(playersSelected, item);
        })
        $.each(proposedGroup, function (key, item) {
            proposedGroup = arrayRemove(proposedGroup, item);
        })
    }


}

function sendLocalPath(playerName) {
    if (path != null) {
        $.ajax({
            url: endpoint + gameId + "/go",
            headers: { name: playerName, password: gamePassw },
            type: "POST",
            data: JSON.stringify({ psycho: path }),
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                path = null;
                verifyLocalSend = verifyLocalSend + 1;
                rechargeCard();
            },
            error: function (errorMessage) {
                if (errorMessage.status == 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'La contraseña es incorrecta',
                        showConfirmButton: false,
                        timer: 1800
                    });

                }
                if (errorMessage.status == 403) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No eres parte de la lista de jugadores',
                        showConfirmButton: false,
                        timer: 1800
                    });

                }
                if (errorMessage.status == 404) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'El id del juego es inválido',
                        showConfirmButton: false,
                        timer: 1800
                    });

                }
                if (errorMessage.status == 406) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'La información provista es incorrecta',
                        showConfirmButton: false,
                        timer: 1800
                    });

                }
                if (errorMessage.status == 409) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ya se añadio un grupo al juego',
                        showConfirmButton: false,
                        timer: 1800
                    });

                }

            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe seleccionar un camino',
            showConfirmButton: false,
            timer: 1800
        });
    }

}
function proposedGroupInfo() {
    var info = "El grupo escogido fue: ";
    var gameInfo = getGame();
    var remoteRound = gameInfo.rounds.length - 1;
    $.each(gameInfo.rounds[remoteRound].group, function (key, element) {
        if (key == (gameInfo.rounds[remoteRound].group.length - 1)) {
            info += element.name;
        } else {
            info += element.name + ' , ';
        }
    });
    return info;
}


function sendLocalGroup(playerName) {
    var groupInfo = getGame();
    var playerCount = groupInfo.players.length;
    var round = groupInfo.rounds.length - 1;
    if (playerCount == 5) {
        if (round == 0 && proposedGroup.length == 2) {
            sendLocalProposal(playerName);

        }
        else if (round == 1 && proposedGroup.length == 3) {
            sendLocalProposal(playerName);

        }
        else if (round == 2 && proposedGroup.length == 2) {
            sendLocalProposal(playerName);

        }
        else if (round == 3 && proposedGroup.length == 3) {
            sendLocalProposal(playerName);

        }
        else if (round == 4 && proposedGroup.length == 3) {
            sendLocalProposal(playerName);

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad de jugadores propuestos no es correcta',
                showConfirmButton: false,
                timer: 1800
            });
        }
    }
    if (playerCount == 6) {
        if (round == 0 && proposedGroup.length == 2) {
            sendLocalProposal(playerName);

        }
        else if (round == 1 && proposedGroup.length == 3) {
            sendLocalProposal(playerName);

        }
        else if (round == 2 && proposedGroup.length == 4) {
            sendLocalProposal(playerName);

        }
        else if (round == 3 && proposedGroup.length == 3) {
            sendLocalProposal(playerName);

        }
        else if (round == 4 && proposedGroup.length == 4) {
            sendLocalProposal(playerName);

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad de jugadores propuestos no es correcta',
                showConfirmButton: false,
                timer: 1800
            });
        }
    }
    if (playerCount == 7) {
        if (round == 0 && proposedGroup.length == 2) {
            sendLocalProposal(playerName);

        }
        else if (round == 1 && proposedGroup.length == 3) {
            sendLocalProposal(playerName);

        }
        else if (round == 2 && proposedGroup.length == 3) {
            sendLocalProposal(playerName);

        }
        else if (round == 3 && proposedGroup.length == 4) {
            sendRemoteProposal(playerName);

        }
        else if (round == 4 && proposedGroup.length == 4) {
            sendLocalProposal(playerName);

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad de jugadores propuestos no es correcta',
                showConfirmButton: false,
                timer: 1800
            });
        }
    }
    if (playerCount > 7) {
        if (round == 0 && proposedGroup.length == 3) {
            sendLocalProposal(playerName);
        }
        else if (round == 1 && proposedGroup.length == 4) {
            sendLocalProposal(playerName);
        }
        else if (round == 2 && proposedGroup.length == 4) {
            sendLocalProposal(playerName);
        }
        else if (round == 3 && proposedGroup.length == 5) {
            sendLocalProposal(playerName);
        }
        else if (round == 4 && proposedGroup.length == 5) {
            sendLocalProposal(playerName);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad de jugadores propuestos no es correcta',
                showConfirmButton: false,
                timer: 1800
            });
        }
    }

}


function LoadGames() {
    $.ajax({
        url: endpoint,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result.data, function (key, item) {

                html += '<tr>';
                html += '<td>' + item.id + '</td>';
                html += '<td>' + item.name + '</td>';
                html += '<td> <button class="btn btn-primary" id="display-JoinModal" onclick="modalJoin(\'' + item.id + '\')">Unirme</button></td>';


                html += '</tr>';
            });

            $('#gamesLobby-tboody').html(html);
            $('#gamesTable-Lobby').DataTable();
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });

}

function modalJoin(id) {
    gameId = id;
    remoteGameId = id;
    $('#modal-join-game').modal("show");

}

function showGamesTable() {
    $('#gamesLobbyTable').show();
    LoadGames();
    $('#localRemoteGames').hide();
}

//devuelve todos los juegos del servidor
function rechargeGames() {
    LoadGames();
}