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
  let enemy;
  let playerNum;
  let playerPick;
  let enemyPick;
  let chat;

//sets function to decide who wins and loses
  function winLose(){
      if(playerPick == enemyPick){
          //updates both players results
          database.ref(enemy).update({
              Result: 'You Tied!'
          })
          database.ref(playerNum).update({
              Result: 'You Tied!'
          })
          return;
      }
      if(playerPick === 'rock' && enemyPick === 'scissor'){
        database.ref(enemy).update({
            Result: 'You Lose!'
        })
        database.ref(playerNum).update({
            Result: 'You Win!'
        })
          return;
      }
      if (playerPick === 'paper' && enemyPick === 'rock'){
        database.ref(enemy).update({
            Result: 'You Lose!'
        })
        database.ref(playerNum).update({
            Result: 'You Win!'
        })
          return;
      }
      if(playerPick === 'scissor' && enemyPick === 'rock'){
        database.ref(enemy).update({
            Result: 'You Lose!'
        })
        database.ref(playerNum).update({
            Result: 'You Win!'
        })
          return;
      }else{
        database.ref(enemy).update({
            Result: 'You Win!'
        })
        database.ref(playerNum).update({
            Result: 'You Lose!'
        })
          return;
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
    database.ref('Users/' + Id).onDisconnect().remove();
    $('#Username').val('');
});

//sets playerone to be the current user if not already chosen. 
$('#playerOne').on('click', function(){

    database.ref('PlayerOne').once('value' ,function(snap){
        if(snap.exists()){
            $('#alert1').fadeIn(300).delay(1500).fadeOut(400);
            return;
        }else{
            database.ref('PlayerOne').set({
            PlayerName: player,
             });
             playerNum = 'PlayerOne';
             enemy = 'PlayerTwo';
             console.log(playerNum + enemy);
             database.ref('PlayerOne').onDisconnect().set('null');
             database.ref('PlayerOne').onDisconnect().remove();
//sets listener once the variable are defined
             database.ref(`${playerNum}/Result`).on('value', function(snap){
                console.log('outisde')
                if(snap.exists()){
                    $(`#${playerNum}Result`).html(snap.val()).fadeIn(300).delay(1500).fadeOut(400);
                    console.log('worked');
                    return;
                }
            })

             database.ref(`${enemy}/Result`).on('value', function(snap){
                console.log(`${enemy}/Result`);
                if(snap.exists()){
                    $(`#${enemy}Result`).html(snap.val()).fadeIn(300).delay(1500).fadeOut(400);
                    console.log('worked');
                    return;
                }
            })

        }
    })


})
//sets playerTwo to be the current user if not already chosen. 
$('#playerTwo').on('click', function(){
    database.ref('PlayerTwo').once('value' ,function(snap){
        if(snap.exists()){
            console.log('already chosen');
            $('#alert2').fadeIn(300).delay(1500).fadeOut(400);
            return;
        }else{
            database.ref('PlayerTwo').set({
            PlayerName: player,
             });
             playerNum = 'PlayerTwo';
             enemy = 'PlayerOne'
             console.log(playerNum + enemy);
             database.ref('PlayerTwo').onDisconnect().set('null');
             database.ref('PlayerTwo').onDisconnect().remove();
//sets listener once the variable are defined
             database.ref(`${playerNum}/Result`).on('value', function(snap){
                console.log('outisde')
                if(snap.exists()){
                    $(`#${playerNum}Result`).html(snap.val()).fadeIn(300).delay(1500).fadeOut(400);
                    console.log('worked');
                    return;
                }
            })
             database.ref(`${enemy}/Result`).on('value', function(snap){
                console.log(`${enemy}/Result`);
                if(snap.exists()){
                    $(`#${enemy}Result`).html(snap.val()).fadeIn(300).delay(1500).fadeOut(400);
                    console.log('worked');
                    return;
                }
            })


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
            $(`${enemy}Choice`).html(snap.val());
            winLose();
        }
    })


})


$('#paper').on('click', function(){
    playerPick = 'paper';
    database.ref(playerNum).update({
        PlayerChoice: 'paper'
    })

    database.ref(`${enemy}/PlayerChoice`).once('value', function(snap){

        if(snap.exists()){
            enemyPick = snap.val();
            winLose();
        }
    })


})

$('#scissors').on('click', function(){
    playerPick = 'scissors';
    database.ref(playerNum).update({
        PlayerChoice: 'scissors'
    })

    database.ref(`${enemy}/PlayerChoice`).once('value', function(snap){

        if(snap.exists()){
            enemyPick = snap.val();
            $(`${enemy}Choice`).html(snap.val());
            winLose();
        }
    })


})

$('#chatBtn').on('click', function(e){
    e.preventDefault();
    chat = $('#chatInput').val().trim();
    
    database.ref('Chat').push({
        ChatUser: player,
        Text: chat
    })
    database.ref('Chat').onDisconnect().remove();

})
database.ref('Chat').on('child_added', function(snap){
    console.log(snap.val());
        $('#chatBox').append(snap.val().ChatUser + ': ' + snap.val().Text + '<br>');

});





database.ref('PlayerOne/PlayerName').on('value', function(snap){
    if(snap.val() == null){
        $('#playerOneName').hide();
        return;
    }
    $('#playerOneName').html(snap.val()).show();


})
database.ref('PlayerTwo/PlayerName').on('value', function(snap){
    if(snap.val() == null){
        $('#playerTwoName').hide();
        return;
    }
    $('#playerTwoName').html(snap.val()).show();
})