var remoteNamePlayer;
var remoteGamePassword;
var remoteGameId;
var remoteGameName;
var remotePath;
var remoteRound = 0;

var gameStatus = '';

var cardCompleted = 0;

//voting
var alreadyVoteRemote = false;
var roundState = 1;
var votePhaseRemote;
var alreadyProposalRemote = false;
var remoteVote;

//proposedGroup verify
var verifySend = 0
var proposedGroupVerifyRemote = false;
var currentDecadeRemote = 0;

//scores
var enemieScore = 0;
var citizenScore = 0;

//array rounds
var roundInfo = [];

function getInfoGame() {

    var headers = { player: remoteNamePlayer };
    if (remoteGamePassword != null && remoteGamePassword != "") {
        headers.password = remoteGamePassword;
    }

        return JSON.parse($.ajax({
            type: 'GET',
            url: endpoint + "/api/games/" + remoteGameId,
            headers: headers,
            dataType: 'json',
            global: false,
            async: false,
            success: function (data) {
                return data;
            }
        }).responseText);
    
    
}

function getRoundGameRemote() {

    var headers = { player: remoteNamePlayer };
    if (remoteGamePassword != null && remoteGamePassword != "") {
        headers.password = remoteGamePassword;
    }

        $.ajax({
            type: 'GET',
            url: endpoint + "/api/games/" + remoteGameId + "/rounds",
            headers: headers,
            dataType: 'json',
            global: false,
            async: false,
            success: function (resp) {
                //console.log(JSON.stringify(resp.data));
                return roundInfo = resp.data;
            }
        }
        );
       
}

    
function addPlayerRemote() {
    var psychoWins = 0;
    var psychosLost = 0;

    remoteNamePlayer = $('#user-name').val();
    remoteGamePassword = $('#input-pwd').val();
    $('#input-pwd').val('');
    $('#user-name').val('');
    var gameInfoAux = getGameByName(remoteGameName);
    var headers = { player: remoteNamePlayer };
    console.log(remoteGamePassword);

    if (remoteGamePassword !== null && remoteGamePassword !== "") {
        headers['password'] = remoteGamePassword;
    }

    if (gameInfoAux.data[0].players.length < 10) {
        $.ajax({

            url: endpoint + "/api/games/" + remoteGameId,
            headers: headers,
            type: "PUT",
            data: JSON.stringify({ player: remoteNamePlayer }),
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                var enlace = document.getElementById("config");
                enlace.style.visibility = "hidden"; // Oculta el elemento
                $('#modal-join-game').modal("hide");
                $('#gamesLobbyTable').hide();
                var html = '';
                html += '<div class="card" style="width:400px" id="remoteCard"> <div class="card-header" id="cardHead">';
                html += '<div class="d-flex justify-content-end" style="height:32px;"><button type="button" class="btn-icon" onclick="rechargeRemoteCard()"><svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class="bi bi-arrow-clockwise" viewBox = "0 0 16 16" ><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"></path><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"></path></svg ></button ></div ><div class="d-flex justify-content-center"> <h3 id="h3' + remoteNamePlayer + '" value="' + remoteNamePlayer + '" >' + remoteNamePlayer + '</h3> </div></div>';
                html += '<div class="card-body" id="card' + remoteNamePlayer + '"> <div class="flex-md-column"> <div class="container" id="player' + remoteNamePlayer + 'buttons"> ';

                html += '</div></div><div class="flex-md-column"><div class="container" id="path' + remoteNamePlayer + 'buttons">';

                html += '<div class="mb-1">';
                html += '<h5 id="' + remoteNamePlayer + 'waitingPath">Esperando la votacion de los jugadores escogidos</h5>';
                html += '</div>';
                html += '<div class="mb-1">';
                html += '<h5 id="' + remoteNamePlayer + 'waitSelection">Esperando la selección del grupo de trabajo</h5>';
                html += '</div>';


                //lista de jugadores cuando se espera que inicie el juego
                html += '<div id="' + remoteNamePlayer + 'waitStartGame">';
                html += '<h5>Esperando que la partida inicie</h5>';
                html += '<ol id="' + remoteNamePlayer + 'waitList"></ol>';
                html += '</div>';


                html += '<div class="mb-1">';
                html += '<h5 id="' + remoteNamePlayer + 'waitVote">Esperando los otros votos</h5>';
                html += '</div>';
                html += '<div class="mb-1">';
                html += '<h5 id="' + remoteNamePlayer + 'roundGroup"></h5>';
                html += '</div>';
                html += '<div class="mb-1">';
                html += '<button type="button" class="btn btn-success" id="' + remoteNamePlayer + 'goodPath" onclick="goodRemotePath()" value="Camino Seguro">Voto a favor</button>';
                html += '</div>';

                html += '</div></div></div>';
                html += '<div class="card-footer"> <div class="d-flex justify-content-center">';
                //submits
                html += '<button type="button" class="btn-outline-success" id="' + remoteNamePlayer + 'sendGroup"  onclick="sendRemoteGroup(\'' + remoteNamePlayer + '\')"> Enviar Grupo</button>';
                html += '<button type="button" class="btn-outline-success" id="' + remoteNamePlayer + 'sendPath"  onclick="sendRemotePath(\'' + remoteNamePlayer + '\')"> Enviar voto</button>';
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
                //hiding messages
                $('#' + remoteNamePlayer + 'waitingPath').hide();
                $('#' + remoteNamePlayer + 'waitVote').hide();
                $('#' + remoteNamePlayer + 'waitSelection').hide();
                $('#' + remoteNamePlayer + 'waitStartGame').hide();
                $('#' + remoteNamePlayer + 'goodPath').hide();
                $('#' + remoteNamePlayer + 'roundGroup').hide();
                $('#row-remoteCardGame').show();
                rechargeRemoteCard();

            },
            error: function (errorMessage) {
                if (errorMessage.status == 400) {

                    if (errorMessage.msg == "Invalid password format") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Formato de la contraseña invalido',
                            showConfirmButton: false,
                            timer: 1800
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Falta contraseña o nombre de usuario',
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }

                }
                if (errorMessage.status == 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'La contraseña es incorrecta',
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
                        text: 'Formato invalido ',
                        showConfirmButton: false,
                        timer: 1800
                    });

                }
                if (errorMessage.status == 409) {

                    if (errorMessage.msg == "The game is full") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'El juego esta lleno',
                            showConfirmButton: false,
                            timer: 1800
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'El jugador ya es parte del juego',
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }

                }

            }
        });

    }
}

//lista de jugadores en lobby
function rechargePartList(gameInfo) {
    //var gameInfo = getGame();
    var html = '';
    document.getElementById(remoteNamePlayer + "waitList").innerHTML = "";
    var ol = document.getElementById(remoteNamePlayer + "waitList");
    //console.log(JSON.stringify(gameInfo));
    $.each(gameInfo.data.players, function (key, element) {
        //alert("jugadores" + element);
        //html += "<li>" + element + "</li>";
        
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(element));
        ol.appendChild(li);

    });

}

function rechargeRemoteCard() {
    var gameInfo = getInfoGame();
    var psychoWins = 0;
    var psychosLost = 0;
    getRoundGameRemote();
    //console.log(JSON.stringify(roundInfo));
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
                    html1 += '<button type="button" class="btn btn-danger" id="' + remoteNamePlayer + 'badPath" onclick="return badRemotePath()" value="Camino Inseguro">Sabotear</button>';
                    html1 += '</div>';
                    html1 += '<div class="mb-1">';
                    html1 += '<h5 id="' + remoteNamePlayer + 'selectPath">Seleccione el voto a favor o en contra</h5>';
                    html1 += '</div>';
                } else {
                    html1 += '<div class="mb-1">';
                    html1 += '<h5 id="' + remoteNamePlayer + 'selectPath">Seleccione el voto a favor</h5>';
                    html1 += '</div>';
                }
                html1 += '<div class="mb-1">';
                html1 += '<button type="button" class="btn btn-success" id="' + remoteNamePlayer + 'acceptVote" onclick="return acceptGroupVote()" value="Aceptar"> Aceptar</button>';
                html1 += '</div>';
                html1 += '<div class="mb-1">';
                html1 += '<button type="button" class="btn btn-danger" id="' + remoteNamePlayer + 'deniedVote" onclick="return deniedGroupVote()" value="No aceptar"> No aceptar</button>';
                html1 += '</div>';
                document.getElementById('path' + remoteNamePlayer + 'buttons').insertAdjacentHTML('beforeend', html1);
                cardCompleted = 1;
            }
        }
    }

    $('#player' + remoteNamePlayer + 'buttons').hide();
    $('#' + remoteNamePlayer + 'sendPath').hide();
    $('#' + remoteNamePlayer + 'sendGroup').hide();
    $('#' + remoteNamePlayer + 'sendVote').hide();
    $('#' + remoteNamePlayer + 'waitingPath').hide();
    //esconder botones para votar grupo
    $('#' + remoteNamePlayer + 'acceptVote').hide();
    $('#' + remoteNamePlayer + 'deniedVote').hide();
    $('#' + remoteNamePlayer + 'waitSelection').hide();
    $('#' + remoteNamePlayer + 'waitStartGame').hide();
    $('#' + remoteNamePlayer + 'waitVote').hide();
    $('#' + remoteNamePlayer + 'goodPath').hide();
    $('#' + remoteNamePlayer + 'selectPath').hide();

    //si el jugador es un enemigo, va a generar boton badpath, el cual se tiene que esconder
    if (gameInfo.data.enemies.includes(remoteNamePlayer) == true) {
        $('#' + remoteNamePlayer + 'badPath').hide();
    }
    $('#' + remoteNamePlayer + 'roundGroup').hide();
  
    $('#PsychoScore').text(psychoWins);
    $('#ExeScore').text(psychosLost);

    findScore(roundInfo);
    gameStatus = gameInfo.data.status;

    //logica que controla el paso de ronga para las votaciones y elecciones
    if (roundState != roundInfo.length) {
        alreadyVoteRemote = false;
    }

    roundState = roundInfo.length;
    if (roundInfo.length != 0) {
        remoteRound = findRound(roundInfo);
    }


    //el juego no ha empezado

    if (gameStatus == "lobby") {
        $('#' + remoteNamePlayer + 'waitStartGame').show();
        rechargePartList(gameInfo);
    }

    


    //el juego ha empezado
    if (gameStatus == "rounds") {
        currentDecadeRemote = roundInfo.length;
        if (currentDecadeRemote != verifySend) {
            proposedGroupVerifyRemote = false;
        }

        verifySend = currentDecadeRemote;

        if (votePhaseRemote != null && votePhaseRemote != roundInfo[remoteRound].phase) {
            alreadyVoteRemote = false;
        }

        votePhaseRemote = roundInfo[remoteRound].phase;

        if (roundInfo[remoteRound].status == "waiting-on-leader") {
            if (roundInfo[remoteRound].leader == remoteNamePlayer) {
                $('#player' + remoteNamePlayer + 'buttons').show();
                $('#' + remoteNamePlayer + 'sendGroup').show();
            } else {
                $('#' + remoteNamePlayer + 'waitSelection').show();
            }
        } 


        //mostrar votacion
        if (roundInfo[remoteRound].status == "voting" && alreadyVoteRemote == false) {
            var info = proposedRemoteGroupInfo();
            alreadyProposalRemote = false;
            $('#' + remoteNamePlayer + 'roundGroup').text(info);
            $('#' + remoteNamePlayer + 'roundGroup').show();
            $('#' + remoteNamePlayer + 'acceptVote').show();
            $('#' + remoteNamePlayer + 'deniedVote').show();
            $('#' + remoteNamePlayer + 'sendVote').show();
        } else if (roundInfo[remoteRound].status == "voting" && alreadyVoteRemote == true) {
            $('#' + remoteNamePlayer + 'waitVote').show();
        }


        //grupo escogido escoge buen o mal camino
        if (roundInfo[remoteRound].status == "waiting-on-group") {
            $.each(roundInfo[remoteRound].group, function (key, element) {
                if (element == remoteNamePlayer) {

                    if (proposedGroupVerifyRemote == false) { //element.psycho == false
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

    }
        if (gameStatus == "ended") {
            clearcontent("card" + remoteNamePlayer);
            if (citizenScore == 3) {
                document.getElementById("card" + remoteNamePlayer).innerHTML = "<h4>El juego ha terminado, los ciudadanos ejemplares ganaron la partida</h4>";
            } else if (enemieScore == 3) {
                document.getElementById("card" + remoteNamePlayer).innerHTML = "<h4>El juego ha terminado, los enemigos ganaron la partida</h4>";
            }
            
            $.each(playersSelected, function (key, item) {
                playersSelected = arrayRemove(playersSelected, item);
            })
            $.each(proposedGroup, function (key, item) {
                proposedGroup = arrayRemove(proposedGroup, item);
            })


        }

}

//encuentra puntuacion de cada bando
function findScore(roundInfo) {
    enemieScore = 0;
    citizenScore = 0;
    for (let i = 0; i < roundInfo.length; i++) {
        if (roundInfo[i].result == "enemies") {
            enemieScore += 1;
        } else if (roundInfo[i].result == "citizens") {
            citizenScore += 1;
        }
    }

    // Obtén la etiqueta por su ID
    var enemieScoreL = document.getElementById("PsychoScore");

    // Actualiza el texto utilizando textContent
    enemieScoreL.textContent = enemieScore.toString();


    var citizenScoreL = document.getElementById("ExeScore");

    // Actualiza el texto utilizando textContent
    citizenScoreL.textContent = citizenScore.toString();

    //Actualiza contador de Decada
    // Obtén la etiqueta por su ID
    var decadeCountL = document.getElementById("DecadeCount");
    // Actualiza el texto utilizando textContent
    decadeCountL.textContent = roundInfo.length.toString();
}


//encuentra ronda actual
function findRound(rounds) {
    for (let i = 0; i < rounds.length; i++) {
        if (rounds[i].status != "ended") {
            return i; // Retorna la posición del objeto con la clave buscada
        }
    }
    return rounds.length -1;
}
    function proposedRemoteGroupInfo() {
        var info = "El grupo escogido fue: ";
        var gameInfo = getInfoGame();
        var remoteRound = findRound(roundInfo);
        $.each(roundInfo[remoteRound].group, function (key, element) {
            if (key == (roundInfo[remoteRound].group.length - 1)) {
                info += element;
            } else {
                info += element + ' , ';
            }
        });

        return info;
    }

    function sendRemoteVote(playerName) {
        var remoteRound = findRound(roundInfo);
        var headers = { player: playerName };
        if (remoteGamePassword !== null && remoteGamePassword !== "") {
            headers['password'] = remoteGamePassword;
        }
        if (remoteVote != null) {
            $.ajax({
                url: endpoint + "/api/games/" + remoteGameId + "/rounds/" + roundInfo[remoteRound].id,
                headers: headers,
                type: "POST",
                data: JSON.stringify({ vote: remoteVote }),
                dataType: "json",
                contentType: "application/json",
                success: function (result) {
                    alreadyVoteRemote = true;
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
        var remoteRound = findRound(roundInfo);
        var headers = { player: playerName };
        if (remoteGamePassword != null && remoteGamePassword != "") {
            headers.password = remoteGamePassword;
        }
        if (remotePath != null) {
            $.ajax({
                url: endpoint + "/api/games/" + remoteGameId + "/rounds/" + roundInfo[remoteRound].id,
                headers: headers,
                type: "PUT",
                data: JSON.stringify({ action: remotePath }),
                dataType: "json",
                contentType: "application/json",
                success: function (result) {
                    proposedGroupVerifyRemote = true;
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
        remotePath = true;
    }
    function badRemotePath() {
        remotePath = false;
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

        var headers = { player: playerName };
        if (remoteGamePassword != null && remoteGamePassword != "") {
            headers.password = remoteGamePassword;
        }

        $.ajax({
            url: endpoint + "/api/games/" + remoteGameId + "/rounds/" + gameInfo.data.currentRound,
            headers: headers,
            type: "PATCH",
            data: JSON.stringify(playersGroup),
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                alreadyProposalRemote = true;
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