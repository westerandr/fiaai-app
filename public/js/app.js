

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
}




//Init Socket when Content Loaded
document.addEventListener("DOMContentLoaded", function(){
    const myName = $('#myName').html();
    const socket = io();
    const users = [myName];
    //initJTinder();
    //create or join room when OK is given
    socket.on('start game', function(){
        $('#jTinder-container').removeClass('d-none');
        initJTinder(socket);
        setAllUsersInGame();
    });

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

        }else{

        }
    })

    socket.on('disconnect', function(){
        window.location.href('/?errorMsg=Error+Something+Went+Wrong');
    });

    //redirection from server
    socket.on('redirect', function(url){
        window.location.href = url;
    });

    //notify when others leave room
    socket.on('user disconnect', function(name){
        if(name == myName) return;
        removeUser(name);
        users.splice(users.indexOf(name),1);
    })

    //start game only if room leader
    socket.on('all users ready', function(){
        //show start game button
        $('#toggleReadyBtn').remove();
        $('#readyBtnDiv').append('<button id="startGameBtn" class="btn btn-sm btn-primary btn-block">Start Game</button>');
        $('#startGameBtn').on('click',function(){
            socket.emit('leader start game');
        });
    });

    //notify when others like places

    //notify when others dislike places

    //on result(s) received

    //notify when all places done

   /** NON-SOCKET EVENT-LISTENERS */
    
    $('#toggleReadyBtn').on('click', function(){
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
            $(this).html('Ready?');

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
        $(this).html('In-Game')
        $(this).removeClass('bg-success');
        $(this).removeClass('bg-warning');
        $(this).addClass('bg-warning');
    })

}

function removeReadyBtnAndAddWaitingStatus(){
    $('#toggleReadyBtn').remove();
    $('#readyBtnDiv').append('<p>Waiting on Party Leader to start...</p>');
}

function gameFinished(){
    $('#jTinder-container').remove();
}