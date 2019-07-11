var firebaseConfig = {
    apiKey: "AIzaSyAfrrOFijzp3rQvvs23c8MIHSlDpTZYy8w",
    authDomain: "rps-multiplayer-jr.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-jr.firebaseio.com",
    projectId: "rps-multiplayer-jr",
    storageBucket: "",
    messagingSenderId: "921677088064",
    appId: "1:921677088064:web:a121f9def6596247"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  database = firebase.database();
// variables
  let Id;
  let player;
  let playerNum;
  let enemy;
  let playerPick;
  let enemyPick;

  function winLose(){
      console.log(`player pick ${playerPick}, enemy pick ${enemyPick}`);
      if(playerPick == enemyPick){
          console.log('tie');
          return;
      }
      if(playerPick === 'rock' && enemyPick === 'scissor'){
          console.log('win')
          return;
      }else{
          console.log('lose');
      }
      if (playerPick === 'paper' && enemyPick === 'rock'){
          console.log('win')
          return;
      }else{
          console.log('lose');
      }
      if(playerPick === 'scissor' && enemyPick === 'rock'){
          console.log('win');
          return;
      }else{
          console.log('lose');
      }
  }


  $('#submit').on('click', function(e){
    e.preventDefault();
    let user = $('#Username').val().trim();

    let newRef= database.ref('Users').push({
        Username: user
    });

    Id = newRef.key;

    database.ref('Users/' + Id).once('value', function(snapshot){
        player = snapshot.val().Username;
        console.log(player);
    })

    $('#Username').val('');
});

//sets playerone to be the current user if not already chosen. 
$('#playerOne').on('click', function(){

    database.ref('PlayerOne').once('value' ,function(snap){
        if(snap.exists()){
            console.log('already chosen');
            return;
        }else{
            database.ref('PlayerOne').set({
            PlayerName: player,
             });
             playerNum = 'PlayerOne';
             enemy = 'PlayerTwo';
             console.log(playerNum + enemy);
             database.ref('PlayerOne').onDisconnect().remove();
        }
    })


})
//sets playerTwo to be the current user if not already chosen. 
$('#playerTwo').on('click', function(){
    database.ref('PlayerTwo').once('value' ,function(snap){
        if(snap.exists()){
            console.log('already chosen');
            return;
        }else{
            database.ref('PlayerTwo').set({
            PlayerName: player,
             });
             playerNum = 'PlayerTwo';
             enemy = 'PlayerOne'
             console.log(playerNum + enemy);
             database.ref('PlayerTwo').onDisconnect().remove();
        }
    })
})

$('#rock').on('click', function(){
    playerPick = 'rock';
    database.ref(playerNum).update({
        PlayerChoice: 'rock'
    })

    database.ref(`${enemy}/PlayerChoice`).once('value', function(snap){

        if(snap.exists()){
            enemyPick = snap.val();
            winLose();
        }
    })

console.log(`enemy choice ${enemyPick}, your choice ${playerPick}`);
})
