module.exports = {

    STATUS: {
        UNREADY:0,
        STARTED:1,
        ENDED:2
    },

    places: [

        {id:"sa123",title:'Coffee Bean', image: '/places/coffee_bean.JPG'},
        {id:"sa124",title:'Georgies Pizza', image: '/places/georgies_pizza.JPG'},
        {id:"sa125",title:'Island Grill', image: '/places/island_grill.JPG'},
        {id:"sa126",title:'Izzys', image: '/places/izzys.PNG'},
        {id:"sa127",title:'Krush', image: '/places/krush.JPG'},
        {id:"sa128",title:'McDonalds', image: '/places/maccas.JPG'},
        {id:"sa129",title:'Phat Burger', image: '/places/phat_burger.JPG'},
        {id:"sa130",title:'Seafood Gourmet', image: '/places/seafood_gourmet.JPG'},

    ],

    createRoom: function(name, gameId){
        return {name: name, gameId: gameId};
    },
    createGame: function(roomName, id){
        return {
            id: id,
            room: roomName,
            status: this.STATUS.UNREADY,
            places: this.places.map(place => {place.id, 0})
        }
    }






}