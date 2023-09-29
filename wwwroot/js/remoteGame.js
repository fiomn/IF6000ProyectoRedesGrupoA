var remoteNamePlayer;
var remoteGamePassword;
var remoteGameId;
var remotePath;
var remoteVote;
var remoteRound = 0;

var gameStatus = '';

var verifySend = 0
var cardCompleted = 0;
var roundInfo = [];

function getInfoGame() {
    return JSON.parse($.ajax({
        type: 'GET',
        url: endpoint + remoteGameId,
        headers: { player: remoteNamePlayer, password: remoteGamePassword },
        dataType: 'json',
        global: false,
        async: false,
        success: function (data) {
            return data;
        }
    }).responseText);
}

function getRoundGameRemote() {
    
    $.ajax({
        type: 'GET',
        url: endpoint + remoteGameId + "/rounds",
        headers: { player: remoteNamePlayer, password: remoteGamePassword },
        dataType: 'json',
        success: function (resp) {
            console.log(JSON.stringify(resp.data));
            return roundInfo = resp.data;
        }
    }
    );
}

    
function addPlayerRemote() {
    var psychoWins = 0;
    var psychosLost = 0;
    //var gameJoin = remoteGameId + "/join"
    remoteNamePlayer = $('#user-name').val();
    remoteGamePassword = $('#passwordRemoteGame').val();
    $('#password-game').val('');
    $('#user-name').val('');
    $.ajax({

        url: endpoint + remoteGameId,
        headers: { player: remoteNamePlayer, password: remoteGamePassword, },
        type: "PUT",
        data: JSON.stringify({ player: remoteNamePlayer }),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            
            $('#modal-join-game').modal("hide");
            $('#gamesLobbyTable').hide();
            var html = '';
            html += '<div class="card" style="width:400px" id="remoteCard"> <div class="card-header" id="cardHead">';
            html += '<div class="d-flex justify-content-end" style="height:32px;"><button type="button" class="btn-icon" onclick="rechargeRemoteCard()"><svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class="bi bi-arrow-clockwise" viewBox = "0 0 16 16" ><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"></path><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"></path></svg ></button ></div ><div class="d-flex justify-content-center"> <h3 id="h3' + remoteNamePlayer + '" value="' + remoteNamePlayer + '" >' + remoteNamePlayer + '</h3> </div></div>';
            html += '<div class="card-body" id="card' + remoteNamePlayer + '"> <div class="flex-md-column"> <div class="container" id="player' + remoteNamePlayer + 'buttons"> ';

            html += '</div></div><div class="flex-md-column"><div class="container" id="path' + remoteNamePlayer + 'buttons">';

            html += '<div class="mb-1">';
            html += '<h5 id="' + remoteNamePlayer + 'waitingPath">Esperando la selección de caminos de los jugadores escogidos</h5>';
            html += '</div>';
            html += '<div class="mb-1">';
            html += '<h5 id="' + remoteNamePlayer + 'waitSelection">Esperando la selección del grupo de trabajo</h5>';
            html += '</div>';
            html += '<div class="mb-1">';
            html += '<h5 id="' + remoteNamePlayer + 'waitStartGame">Esperando que la partida inicie</h5>';
            html += '</div>';
            html += '<div class="mb-1">';
            html += '<h5 id="' + remoteNamePlayer + 'roundGroup"></h5>';
            html += '</div>';
            html += '<div class="mb-1">';
            html += '<button type="button" class="btn btn-success" id="' + remoteNamePlayer + 'goodPath" onclick="goodRemotePath()" value="Camino Seguro"> Camino Seguro</button>';
            html += '</div>';

            html += '</div></div></div>';
            html += '<div class="card-footer"> <div class="d-flex justify-content-center">';
            //submits
            html += '<button type="button" class="btn-outline-success" id="' + remoteNamePlayer + 'sendGroup"  onclick="sendRemoteGroup(\'' + remoteNamePlayer + '\')"> Enviar Grupo</button>';
            html += '<button type="button" class="btn-outline-success" id="' + remoteNamePlayer + 'sendPath"  onclick="sendRemotePath(\'' + remoteNamePlayer + '\')"> Enviar Camino</button>';
            html += '<button type="button" class="btn-outline-success" id="' + remoteNamePlayer + 'sendVote"  onclick="sendRemoteVote(\'' + remoteNamePlayer + '\')"> Enviar Voto</button>';

            html += '</div></div></div>';
            $('#row-remoteCardGame').html(html);
            $('#PsychoScore').text(psychoWins);
            $('#ExeScore').text(psychosLost);
            $('#game-score').show();

            $('#player' + remoteNamePlayer + 'buttons').hide();
            //hiding submits
            $('#' + remoteNamePlayer + 'sendPath').hide();
            $('#' + remoteNamePlayer + 'sendGroup').hide();
            $('#' + remoteNamePlayer + 'sendVote').hide();

            $('#' + remoteNamePlayer + 'waitingPath').hide();
            $('#' + remoteNamePlayer + 'waitSelection').hide();
            $('#' + remoteNamePlayer + 'waitStartGame').hide();
            $('#' + remoteNamePlayer + 'goodPath').hide();
            $('#' + remoteNamePlayer + 'roundGroup').hide();
            $('#row-remoteCardGame').show();


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
                    text: 'El juego ya comenzó o esta lleno ',
                    showConfirmButton: false,
                    timer: 1800
                });

            }
            if (errorMessage.status == 409) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El jugador ya es parte del juego',
                    showConfirmButton: false,
                    timer: 1800
                });

            }

        }
    });


}



function rechargeRemoteCard() {
    var gameInfo = getInfoGame();
    var psychoWins = 0;
    var psychosLost = 0;
    //console.log("tamaño arreglo" + roundInfo.length);
    getRoundGameRemote();

    if (gameInfo.data.status == "rounds" || gameInfo.data.status == "leader") {
        if (roundInfo.length >= 0 || roundInfo.length == 1) {
            if (cardCompleted == 0) {
                var html1 = '';
                var count = 0;
                $('#remoteCard').removeClass('card');
                if (gameInfo.data.enemies.includes(remoteNamePlayer) == true) {
                    $('#remoteCard').addClass('card border-danger');
                    document.getElementById('cardHead').style.background = "#ca1010";


                } else {
                    $('#remoteCard').addClass('card border-success');
                    document.getElementById('cardHead').style.background = "#11b422";

                }
                document.getElementById("h3" + remoteNamePlayer).style.color = "white";
                $.each(gameInfo.data.players, function (key, element) {

                    //si es enemigo los botones indican quien es psyco
                    if (gameInfo.data.enemies.includes(remoteNamePlayer) == true) {

                        if (gameInfo.data.enemies.includes(element) == true) {
                            html1 += '<div class="mb-1">';
                            html1 += '<button type="button" class="btn-player" id="btn' + remoteNamePlayer + count + '" value="' + element + '" onclick="return getRemotePlayer(\'' + element + '\',\'' + count + '\',\'' + remoteNamePlayer + '\')" style="color:red;width:100px">' + element + '</button>';
                            html1 += '</div>';
                            count = count + 1;

                        } else {
                            html1 += '<div class="mb-1">';
                            html1 += '<button type="button" class="btn-player" id="btn' + remoteNamePlayer + count + '" value="' + element + '" onclick="return getRemotePlayer(\'' + element + '\',\'' + count + '\',\'' + remoteNamePlayer + '\')" style="color:green;width:100px">' + element + '</button>';
                            html1 += '</div>';
                            count = count + 1;
                        }

                    } else { //si es aliado, no se hace ninguna indicacion
                        html1 += '<div class="mb-1">';
                        html1 += '<button type="button" class="btn-player" id="btn' + remoteNamePlayer + count + '" value="' + element + '" onclick="return getRemotePlayer(\'' + element + '\',\'' + count + '\',\'' + remoteNamePlayer + '\')" style="width:100px;">' + element + '</button>';
                        html1 += '</div>';
                        count = count + 1;
                    }

                });
                $('#player' + remoteNamePlayer + 'buttons').html(html1);
                html1 = '';
                if (gameInfo.data.enemies.includes(remoteNamePlayer) == true) {

                    html1 += '<div class="mb-1">';
                    html1 += '<button type="button" class="btn btn-danger" id="' + remoteNamePlayer + 'badPath" onclick="return badRemotePath()" value="Camino Inseguro"> Camino Inseguro</button>';
                    html1 += '</div>';
                    html1 += '<div class="mb-1">';
                    html1 += '<h5 id="' + remoteNamePlayer + 'selectPath">Seleccione el camino seguro o inseguro</h5>';
                    html1 += '</div>';
                } else {
                    html1 += '<div class="mb-1">';
                    html1 += '<h5 id="' + remoteNamePlayer + 'selectPath">Seleccione el camino seguro</h5>';
                    html1 += '</div>';
                }
                document.getElementById('path' + remoteNamePlayer + 'buttons').insertAdjacentHTML('beforeend', html1);
                cardCompleted = 1;
            }
        }
    }


    html1 += '<div class="mb-1">';
    html1 += '<button type="button" class="btn-player" id="btn' + remoteNamePlayer + 'acceptVote" onclick="return acceptGroupVote()" value="Aceptar"> Aceptar</button>';
    html1 += '</div>';
    html1 += '<div class="mb-1">';
    html1 += '<button type="button" class="btn-player" id="btn' + remoteNamePlayer + 'deniedVote" onclick="return deniedGroupVote()" value="No aceptar"> No aceptar</button>';
    html1 += '</div>';


    gameStatus = gameInfo.data.status;
    if (roundInfo.length != 0) {
        remoteRound = roundInfo.length - 1;
    }
    $('#player' + remoteNamePlayer + 'buttons').hide();
    $('#' + remoteNamePlayer + 'sendPath').hide();
    $('#' + remoteNamePlayer + 'sendGroup').hide();
    $('#' + remoteNamePlayer + 'waitingPath').hide();
    //esconder botones para votar grupo
    $('#' + remoteNamePlayer + 'acceptVote').hide();
    $('#' + remoteNamePlayer + 'deniedVote').hide();
    $('#' + remoteNamePlayer + 'waitSelection').hide();
    $('#' + remoteNamePlayer + 'waitStartGame').hide();
    $('#' + remoteNamePlayer + 'goodPath').hide();
    $('#' + remoteNamePlayer + 'selectPath').hide();
    if (gameInfo.data.enemies.includes(remoteNamePlayer) == true) {
        $('#' + remoteNamePlayer + 'badPath').hide();
    }
    $('#' + remoteNamePlayer + 'roundGroup').hide();
    /*
    if (gameInfo.psychoWin.length != 0) {
        $.each(gameInfo.psychoWin, function (key, element) {
            if (element == false) {
                psychosLost = psychosLost + 1;
            } else {
                psychoWins = psychoWins + 1;
            }

        });
    }*/
    $('#PsychoScore').text(psychoWins);
    $('#ExeScore').text(psychosLost);

    if (gameStatus == "lobby") {
        $('#' + remoteNamePlayer + 'waitStartGame').show();
    }
    if (roundInfo[remoteRound].status == "waiting-on-leader") {
        if (roundInfo[remoteRound].leader == remoteNamePlayer) {
            $('#player' + remoteNamePlayer + 'buttons').show();
            $('#' + remoteNamePlayer + 'sendGroup').show();
        } else {
            $('#' + remoteNamePlayer + 'waitSelection').show();
        }
        verifySend = 0;
    }
    if (gameStatus == "rounds") {
        var rep = 0;
        $.each(roundInfo[remoteRound].group, function (key, element) {
            if (element == remoteNamePlayer) {
                if (true) { //element.psycho == false
                    $('#' + remoteNamePlayer + 'waitingPath').hide();
                    $('#' + remoteNamePlayer + 'sendPath').show();
                    $('#' + remoteNamePlayer + 'goodPath').show();
                    $('#' + remoteNamePlayer + 'selectPath').show();
                    if (gameInfo.data.enemies.includes(remoteNamePlayer) == true) {
                        $('#' + remoteNamePlayer + 'badPath').show();
                    }
                } else {
                    $('#' + remoteNamePlayer + 'waitingPath').show();
                    var info = proposedRemoteGroupInfo();
                    $('#' + remoteNamePlayer + 'roundGroup').text(info);
                    $('#' + remoteNamePlayer + 'roundGroup').show();
                }


            } else {
                var info = proposedRemoteGroupInfo();
                $('#' + remoteNamePlayer + 'waitingPath').show();
                $('#' + remoteNamePlayer + 'roundGroup').text(info);
                $('#' + remoteNamePlayer + 'roundGroup').show();
            }


        });

    }
    if (gameStatus == "ended") {
        clearcontent("card" + remoteNamePlayer);
        var countWin = 0;
        /*
        $.each(gameInfo.psychoWin, function (key, element) {
            if (element == false) {
                countWin = countWin + 1;
            }

        });
        
        if (countWin == 3) {
            document.getElementById("card" + remoteNamePlayer).innerHTML = "<h4>El juego ha terminado, los ciudadanos ejemplares ganaron la partida</h4>";
        } else {
            document.getElementById("card" + remoteNamePlayer).innerHTML = "<h4>El juego ha terminado, los psicopatas ganaron la partida</h4>";
        }
        */
        $.each(playersSelected, function (key, item) {
            playersSelected = arrayRemove(playersSelected, item);
        })
        $.each(proposedGroup, function (key, item) {
            proposedGroup = arrayRemove(proposedGroup, item);
        })


    }


}

function proposedRemoteGroupInfo() {
    var info = "El grupo escogido fue: ";
    var gameInfo = getInfoGame();
    var remoteRound = roundInfo.length -1;
    $.each(roundInfo[remoteRound].group, function (key, element) {
        if (key == (roundInfo[remoteRound].group.length - 1)) {
            info += element;
        } else {
            info += element + ' , ';
        }
    });
    //mostrar votacion
    if(roundInfo[remoteRound].status == "voting"){
        $('#' + remoteNamePlayer + 'acceptVote').show();
        $('#' + remoteNamePlayer + 'deniedVote').show();
    }
    return info;
}

function sendRemoteVote(playerName) {
    
    if (remoteVote != null) {
        $.ajax({
            url: endpoint + remoteGameId + "/rounds/" + roundInfo[roundInfo.length - 1].id,
            headers: { player: playerName, password: remoteGamePassword },
            type: "POST",
            data: JSON.stringify({ vote: remotePath }),
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                //verifySend = 1;
                remotePath = null;
                rechargeRemoteCard();
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



function sendRemotePath(playerName) {
    console.log("antes:"+remote)
    if (remotePath != null) {
        $.ajax({
            url: endpoint + remoteGameId + "/rounds/" + roundInfo[roundInfo.length-1].id,
            headers: { player: playerName, password: remoteGamePassword },
            type: "PUT",
            data: JSON.stringify({ action: remotePath }),
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                verifySend = 1;
                remotePath = null;
                rechargeRemoteCard();
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

function getRemotePlayer(namePlayer, count, leaderName) {
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

function goodRemotePath() {
    remotePath = false;
}
function badRemotePath() {
    remotePath = true;
}

function acceptGroupVote() {
    remoteVote = true;
}
function deniedGroupVote() {
    remoteVote = false;
}


function clearcontent(html) {
    document.getElementById(html).innerHTML = "";
}



function sendRemoteProposal(playerName) {
    var json = '{"group":[]}';
    var playersGroup = JSON.parse(json);
    var gameInfo = getInfoGame();
    $.each(proposedGroup, function (key, item) {
        playersGroup.group.push(item);
    });
    $.each(playersSelected, function (key, item) {
        document.getElementById("btn" + item).style.background = "transparent";
        playersSelected = arrayRemove(playersSelected, item);
    });
    $.each(proposedGroup, function (key, item) {
        proposedGroup = arrayRemove(proposedGroup, item);
    });

    $.ajax({
        url: endpoint + remoteGameId + "/rounds/"+ gameInfo.data.currentRound,
        headers: { player: remoteNamePlayer, password: remoteGamePassword },
        type: "PATCH",
        data: JSON.stringify(playersGroup),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            rechargeRemoteCard();
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

function sendRemoteGroup(playerName) {
    var groupInfo = getInfoGame();
    var playerCount = groupInfo.data.players.length;
    var round = roundInfo.length - 1;
    if (playerCount == 5) {
        if (round == 0 && proposedGroup.length == 2) {
            sendRemoteProposal(playerName);

        }
        else if (round == 1 && proposedGroup.length == 3) {
            sendRemoteProposal(playerName);

        }
        else if (round == 2 && proposedGroup.length == 2) {
            sendRemoteProposal(playerName);

        }
        else if (round == 3 && proposedGroup.length == 3) {
            sendRemoteProposal(playerName);

        }
        else if (round == 4 && proposedGroup.length == 3) {
            sendRemoteProposal(playerName);

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
            sendRemoteProposal(playerName);

        }
        else if (round == 1 && proposedGroup.length == 3) {
            sendRemoteProposal(playerName);

        }
        else if (round == 2 && proposedGroup.length == 4) {
            sendRemoteProposal(playerName);

        }
        else if (round == 3 && proposedGroup.length == 3) {
            sendRemoteProposal(playerName);

        }
        else if (round == 4 && proposedGroup.length == 4) {
            sendRemoteProposal(playerName);

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
            sendRemoteProposal(playerName);

        }
        else if (round == 1 && proposedGroup.length == 3) {
            sendRemoteProposal(playerName);

        }
        else if (round == 2 && proposedGroup.length == 3) {
            sendRemoteProposal(playerName);

        }
        else if (round == 3 && proposedGroup.length == 4) {
            sendRemoteProposal(playerName);

        }
        else if (round == 4 && proposedGroup.length == 4) {
            sendRemoteProposal(playerName);

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
            sendRemoteProposal(playerName);
        }
        else if (round == 1 && proposedGroup.length == 4) {
            sendRemoteProposal(playerName);
        }
        else if (round == 2 && proposedGroup.length == 4) {
            sendRemoteProposal(playerName);
        }
        else if (round == 3 && proposedGroup.length == 5) {
            sendRemoteProposal(playerName);
        }
        else if (round == 4 && proposedGroup.length == 5) {
            sendRemoteProposal(playerName);
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