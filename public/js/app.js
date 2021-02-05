$('.actions .like, .actions .dislike').hide();
$('#banner-img').hide()
/**
 * Set button action to trigger jTinder like & dislike.
 */
$('.actions .like, .actions .dislike').click(function(e){
	e.preventDefault();
	$("#tinderslide").jTinder($(this).attr('class'));
});

function initJTinder(socket){
    /**
 * jTinder initialization
 */
$("#tinderslide").jTinder({
	// dislike callback
    onDislike: function (item) {
	    const itemIndex = item.index() + 1;
        const id = $('.pane'+itemIndex).attr('data-id');
        socket.emit('dislike', id);
    },
	// like callback
    onLike: function (item) {
      // set the status text
      const itemIndex = item.index() + 1;
      const id = $('.pane'+itemIndex).attr('data-id');
      console.log(id);
      socket.emit('like', id);
    },
	animationRevertSpeed: 200,
	animationSpeed: 400,
	threshold: 1,
	likeSelector: '.like',
	dislikeSelector: '.dislike'
});
$('#tinderslide').removeClass('invisible');
$('#tinderslide').addClass('visible');
$('.actions .like, .actions .dislike').show(200);
}




//Init Socket when Content Loaded
document.addEventListener("DOMContentLoaded", function(){
    $('#banner-img').fadeIn(600);
    const myName = $('#myName').html();
    const socket = io();
    const users = [myName];
    
    let leader = false;
    $('#numPlaces').html($('#len').val());

    //initJTinder();
    //create or join room when OK is given
    socket.on('start game', function(){
        scrollTopAnimated();
        $('#banner-img').hide(700);
        initJTinder(socket);      
        setAllUsersInGame();
        addInstructionOverlay();
    });

    socket.on('leader', function(){
        leader = true;
        console.log('I AM LEADER');
    })

    //notify when others join room
    socket.on('user join', function(user){
        if(user.name == myName || users.includes(user.name)) return;
        addUser(user.name);
        users.push(user.name);
        if(user.ready){
            setUserReady(user.name);
        }else{
            setUserUnready(user.name);
        }
    });

    //notify when a user is ready
    socket.on('user ready', function(name){
        if(name == myName) return;
        setUserReady(name);
    });
    
    //notify when a user is not ready
    socket.on('user unready', function(name){
        if(name == myName) return;
        setUserUnready(name);
    });

    //remove ready up feature when everyone is ready
    socket.on('remove ready btn', function(){
        if($('#startGameBtn').length) return;
        removeReadyBtnAndAddWaitingStatus();
    });



    socket.on('user finish game', function(name){
        if(name == myName){
            gameFinished();
        }
        setUserFinishedGame(name);
    })

    // socket.on('disconnect', function(){
    //     window.location.replace('/?errorMsg=Error+Something+Went+Wrong');
    // });

    //redirection from server
    socket.on('redirect', function(url){
        window.location.replace(url);
    });

    //notify when others leave room
    socket.on('user disconnect', function(name){
        if(name == myName) return;
        removeUser(name);
        users.splice(users.indexOf(name),1);
        //someone disconnects and reconnects 
        if($('#startGameBtn').length){

        }
    })

    //start game only if room leader
    socket.on('all users ready', function(){
        if($('#startGameBtn').length)return;
        //show start game button
        $('#toggleReadyBtn').hide();
        $('#readyBtnDiv').append('<button id="startGameBtn" class="btn btn-sm btn-primary btn-block">Start Game 😎</button>');
        $('#startGameBtn').on('click',function(){
            socket.emit('leader start game');
        });
    });

    socket.on('game over', function(data){
        let winnerName = data.winner;
        let winnerImg = data.img;
        $('#winner-name').html(winnerName);
        $('#winner-img').attr('src', winnerImg);
        $('#winner-img').attr('alt', 'Winning Place');
        var myModal = new bootstrap.Modal(document.getElementById('myModal'))
        myModal.show();
    });

    //notify when others like places

    //notify when others dislike places

    //on result(s) received

    //notify when all places done

   /** NON-SOCKET EVENT-LISTENERS */

   $('#leaveRoomBtn').on('click', function(){
      $(this).prop('disabled', true);
       socket.emit('leave room');
      
   });
    
    $('#toggleReadyBtn').click(function(){
        alert(777)
        var name = $('#myName').html();
        var isReady = $(`#${name}-div .ready-status`).hasClass('bg-danger');
        isReady? setUserReady(name): setUserUnready(name);
        var readyStatus = isReady?'ready': 'unready';
        if(isReady){
            $(this).removeClass('btn-outline-success');
            $(this).addClass('btn-outline-danger');
            $(this).html('Unready');
        }else{
            $(this).removeClass('btn-outline-danger');
            $(this).addClass('btn-outline-success');
            $(this).html('Ready');

        }
        socket.emit('user '+readyStatus, name);
    });

});

/** HELPER FUNCTIONS */

function addUser(name){
    $('#usersInRoom').append(`
    <div class="row d-flex" id="${name}-div">
        <div class="col">
            <li>${name}</li>
        </div>
        <div class="col">
            <li><span class="badge bg-danger ready-status">Unready</span></li>
        </div>
    </div>
    `);

}

function removeUser(name){
    $(`#${name}-div`).remove();
}


function setUserReady(name){
    var userStatus = $(`#${name}-div .ready-status`);
    userStatus.removeClass('bg-danger');
    userStatus.addClass('bg-success');
    userStatus.html('Ready');
}

function setUserUnready(name){
    var userStatus = $(`#${name}-div .ready-status`);
    userStatus.removeClass('bg-success');
    userStatus.addClass('bg-danger');
    userStatus.html('Unready');
}

function setAllUsersInGame(){
    $('#toggleReadyBtn').remove();
    $('#readyBtnDiv p').remove();
    $('#startGameBtn').remove();
    $('span.badge.ready-status').each(function(){
        $(this).html('In-Game 🎮')
        $(this).removeClass('bg-success');
        $(this).removeClass('bg-warning');
        $(this).addClass('bg-warning');
    })

}

function setUserFinishedGame(name){
    let status = $(`#${name}-div span.badge.ready-status`);
    status.html('Finished 🤗');
    status.removeClass('bg-warning');
    status.addClass('bg-secondary');
}

function removeReadyBtnAndAddWaitingStatus(){
    $('#toggleReadyBtn').remove();
    $('#readyBtnDiv p').remove();
    $('#readyBtnDiv').append('<p>Waiting for Host to start 😴</p>');
}

function gameFinished(){
    $('#jTinder-container').remove();
}

function scrollTopAnimated() { 
    $("html, body").animate({ scrollTop: "0" },500); 
} 

function addInstructionOverlay(){
    var body = $('body');
    var dislikeOverlay = $('#dislike-overlay');
    var likeOverlay = $('#like-overlay');
    likeOverlay.attr('data-intro', "Swipe 👉 to Like");
    likeOverlay.attr('data-position', "top");
    dislikeOverlay.attr('data-intro', "Swipe  👈  to Dislike");
    dislikeOverlay.attr('data-position', "bottom");
    body.chardinJs('start')
}