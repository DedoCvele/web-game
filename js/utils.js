// ------------------------------funkcija za detektrianje lupanje---------------
function recCollision({rec1, rec2}) {
    return (
        rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x && 
        rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
        rec1.attackBox.position.y + rec1.attackBox.height >= rec2.position.y &&
        rec1.attackBox.position.y <= rec2.position.y + rec2.height
    )
}

//------------------------------------winner function--------------------------------

function determineWinner({player, enemy, timerID}){
    clearTimeout(timerID) 
    document.querySelector('#Text').style.display = 'flex'
    
    if (player.health === enemy.health){
        document.querySelector('#Text').innerHTML = 'Tie';
        
    } else if (player.health > enemy.health){
        document.querySelector('#Text').innerHTML = 'Player 1 Wins';
        
    } else if (enemy.health > player.health){
        document.querySelector('#Text').innerHTML = 'Player 2 Wins';   
        
    }
}



//------------------------------------------timer ---------------------------------

let timerID
let timer = 60
function decreaseTimer() {
    if(timer > 0) {
        timerID = setTimeout (decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0){
        
        determineWinner({player, enemy, timerID})
    }
}