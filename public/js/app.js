

/**
 * Set button action to trigger jTinder like & dislike.
 */
$('.actions .like, .actions .dislike').click(function(e){
	e.preventDefault();
	$("#tinderslide").jTinder($(this).attr('class'));
});

function initJTinder(){
    /**
 * jTinder initialization
 */
$("#tinderslide").jTinder({
	// dislike callback
    onDislike: function (item) {
	    // set the status text
        $('#status').html('Dislike image ' + (item.index()+1));
    },
	// like callback
    onLike: function (item) {
      // set the status text
        const itemIndex = item.index() + 1;
        const id = $('.pane'+itemIndex).attr('data-id');
        console.log('id is '+id);
        $('#status').html('Like image ' + (item.index()+1));
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
    
    const socket = io();
    //initJTinder();
    //create or join room when OK is given

    //notify when others join room
    


    //leave room

    //notify when others leave room

    //start game only if room leader

    //send like to place via placeId

    //notify when others like places
    
    //send dislike to place via placeId

    //notify when others dislike places

    //on result(s) received

    //notify when all places done
});