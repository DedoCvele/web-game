{/* za deklariranje na canvas, querySelector se koristi za zimanje na del od html */}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

{/* za visina i sirina na canvas */}

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7

//-----------------------BackGround i show------------------

const backGround = new Sprite({
    position:{
        x:0,
        y:0
    },
    imgSrc: './img/background.png'
})

const Shop = new Sprite({
    position:{
        x:620,
        y:161
    },
    imgSrc: './img/shop.png',
    scale: 2.5,
    frameMax: 6
})

//*---------------------za osnovni informacii na player-------------*/}

const player = new Fighter({
    position:{
    x:0, y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset:{
        x:0,
        y:0
    },
    imgSrc: './img/samuraiMack/Idle.png',
    frameMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites:{
        idle:{
            imgSrc: './img/samuraiMack/Idle.png',
            frameMax: 8
        },
        run:{
            imgSrc: './img/samuraiMack/Run.png',
            frameMax: 8
        },
        jump:{
            imgSrc: './img/samuraiMack/Jump.png',
            frameMax: 2
        },
        fall:{
            imgSrc: './img/samuraiMack/Fall.png',
            frameMax: 2
        },
        attack1: {
            imgSrc: './img/samuraiMack/Attack1.png',
            frameMax: 6
        },
        takeHit:{
            imgSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            frameMax: 4
        },
        death:{
            imgSrc: './img/samuraiMack/Death.png',
            frameMax: 6
        }
    },
    attackBox: {
        offset:{
            x:65,
            y:50
        },
        width: 175,
        height: 50
    }
})


const enemy = new Fighter({
    position:{
        x:400, y:100
    },
    velocity:{
        x:0,
        y:0
    },
    color: 'blue',
    offset:{
        x:-50,
        y:0
    },
    imgSrc: './img/kenji/Idle.png',
    frameMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 171
    },
    sprites:{
        idle:{
            imgSrc: './img/kenji/Idle.png',
            frameMax: 4
        },
        run:{
            imgSrc: './img/kenji/Run.png',
            frameMax: 8
        },
        jump:{
            imgSrc: './img/kenji/Jump.png',
            frameMax: 2
        },
        fall:{
            imgSrc: './img/kenji/Fall.png',
            frameMax: 2
        },
        attack1: {
            imgSrc: './img/kenji/Attack1.png',
            frameMax: 4
        },
        takeHit:{
            imgSrc: './img/kenji/Take hit.png',
            frameMax: 3
        },
        death:{
            imgSrc: './img/kenji/Death.png',
            frameMax: 7
        }
    },
    attackBox: {
        offset:{
            x:-170,
            y:50
        },
        width: 170,
        height: 50
    }
})


console.log(player)

//------------------delot kade pravi refresh na ekranot i go updatenuva*/

const keys = {
    a:{
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

// -------------------------------------za da se animira--------------------

function animate () {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)

    backGround.update()
    Shop.update()

    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    
    //------------------------------------player movement--------------------
    
    

    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if ( keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

    //------------------------------------Enemy movement----------------------

    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if ( keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //-----------------------------------detect collison---------------------
    if( recCollision({rec1: player, rec2: enemy }) && player.isAttacking && player.frameCurrent === 4){
        
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#playerHealth',{
           width: enemy.health + '%'
        })
    }

    //------------------------------------ako promasi------------------------------

    if(player.isAttacking && player.frameCurrent===4){
        player.isAttacking = false
    }

    //-------------------------------enemy detect collision------------------------

    if( recCollision({rec1: enemy, rec2: player }) && enemy.isAttacking && enemy.frameCurrent === 2){
       
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#enemyHealth',{
            width: player.health + '%'
         })
    }

    if(enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking = false
    }

    //---------------------------------------END GAME HP --------------------------//\
    if(enemy.health <=0 || player.health <=0 ){
        determineWinner({player, enemy, timerID})
    }
}


animate()

//za -------------------------------------jump i dvizenja------------------------

window.addEventListener ('keydown', (event) => {
    if(!player.dead){
        switch(event.key){
        
            case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
    
            case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
    
            case 'w':
            player.velocity.y = -20
            break
    
            case ' ':
            player.attack()
            break
        }
    }
    if(!enemy.dead){
    switch(event.key){
        case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break

        case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break

        case 'ArrowUp':
        enemy.velocity.y = -20
        break

        case 'ArrowDown':
        enemy.attack()
        break
    }
}
})

window.addEventListener ('keyup', (event) => {
    switch(event.key){
        case 'd':
        keys.d.pressed = false
        break

        case 'a':
        keys.a.pressed = false
        break
    }

    switch(event.key){
        case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break

        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
    }
    //enemy keys

})

