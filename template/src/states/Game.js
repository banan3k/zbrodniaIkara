import GameUI from '../UI/GameUI';

export default class Game extends Phaser.State {

  create() {
    this.gameUI = new GameUI( this );

    this.camera.resetFX();
    this.camera.flash( 0x000000, 500, false );

    this.game.onResume.add( () => {
      if ( this.gameUI.stateStatus !== 'playing' ) {
        this.game.time.events.pause();
      }
    } );

    this.createGame();

    this.gameUI.init();
  }

  createGame() {
      this.bg = this.game.add.tileSprite(0, 0, 1200, 1920, "background");

    this.currentVelocity = 0;
    this.totalDistance = 10000;
    this.currentDistance = 0.0;

    this.score = 0;
    this.isPlayerUpToSpeed = false;

    this.heads = this.game.add.group();
    this.heads.enableBody = true;
    this.heads.physicsBodyType = Phaser.Physics.ARCADE;

    const width = 300;
    const height = 300;
    const bmd = this.game.add.bitmapData( width, height );

    bmd.ctx.beginPath();
    bmd.ctx.rect( 0, 0, width, height );
    bmd.ctx.lineWidth = 6;
    bmd.ctx.strokeStyle = '#1c1c1c';
    bmd.ctx.fillStyle = '#373737';
    bmd.ctx.fill();
    bmd.ctx.stroke();




var sprite1 = this.game.add.sprite( this.game.world.centerX, this.game.height, 'ikar' );
this.game.physics.enable([sprite1], Phaser.Physics.ARCADE);
 sprite1.body.setSize(1,1,10,10);
 //this.player = sprite1;
//    this.player = this.game.add.sprite( this.game.world.centerX, this.game.height, bmd );
this.player = this.game.add.sprite( this.game.world.centerX, this.game.height, 'ikar' );
    this.player.anchor.setTo( 0.5, 1.25 );

    this.game.physics.arcade.enable( this.player );
    this.player.body.moves = false;
    this.player.body.immovable = true;


this.player.body.setSize(1,300,250,0);



    this.interval = 0.1;

    this.game.time.events.add( Phaser.Timer.SECOND, this.spawnHead, this );
    this.game.input.addMoveCallback(this.updateSpeed, this);

  }



  handleCollision() {
    this.score -= 20;
    if (this.score < 0) {
      this.score = 0.0;
    }

    this.camera.shake(0.01, 100, true, Phaser.Camera.SHAKE_BOTH, true);
    // this.gameUI.stateGameover();
    // this.game.input.deleteMoveCallback(this.updateSpeed, this);
  }

  updateSpeed(pointer, x, y, state) {
    this.currentVelocity = (this.game.world.height - y) * 0.25;
    this.heads.setAll('body.velocity.y', this.currentVelocity);
    this.bg.autoScroll(0, this.currentVelocity);
  }

  spawnHead() {
    const head = this.heads.create( 0, 0, 'kolumna' );
    head.x = this.game.rnd.integerInRange( head.width, this.game.width );
    head.anchor.set( 1, 1 );
    head.body.immovable = true;
    // head.immovable = true;

    head.body.setSize(200,290,100,-60);

    this.interval *= 1.005;

    this.game.time.events.add( Phaser.Timer.SECOND * ( 1 / this.interval ), this.spawnHead, this );
  }

  stopHeads() {
    this.heads.forEach( ( head ) => {
      head.savedVY = head.body.velocity.y;
      head.body.velocity.y = 0;
    } );
  }

  startHeads() {
    this.heads.forEach( ( head ) => {
      head.body.velocity.y = head.savedVY;
    } );
  }

  isSpeedTooHigh() {
    if (this.game.input.y <= 550) {
      return Math.abs(550 - this.game.input.y);
    }
    
    return 0;
  }

  isSpeedTooLow() {
    if (this.game.input.y >= 1030) {
      return Math.abs(this.game.input.y - 1030);
    }
    
    return 0;
  }

  accelerateMovement(x) {
//    integer distance = this.player.x-this.game.input.x;
//this.player.x=0;
    this.player.distance = x-this.game.input.x;
    //if(this.player.distance<0)
    //  this.player.distance*=-1;
    /*if(this.player.x > this.game.input.x)
      this.player.x += this.player.distance;
    else if(this.player.x<this.game.input.x)
      this.player.x -= this.player.distance;*/
      if(this.player.speedX==null)
          this.player.speedX=0;
      //this.player.x += this.motion(x, this.game.input.x);
//      this.player.x += this.player.speedX;
this.player.speedX+=this.motion(x, this.game.input.x);
if(this.player.x<300)
{
  this.player.x=300;
}
if(this.player.x>900)
{
  this.player.x=900;
}

    // console.log(this.player.speedX);
     this.player.x += this.player.speedX;
//      console.log(x + " vs "+this.game.input.x);
  // console.log(this.player.position + " vs "+this.player.x-this.game.input.x+" vs "+this.player.distance)
  }

  motion(x,x2) {
      this.player.distance = x-x2;


  //    console.log(this.player.distance);
      if(this.player.distance>100)
        this.player.angle = -10;
      else if(this.player.distance<-100)
        this.player.angle = 10;
      else
        this.player.angle=0;

      if(this.player.distance < 0)
        this.player.distance *= -1;



      if(this.player.distance>200)
      {
        if(x>150 && x<1150) {
          if(x<x2)
            return 10;
          else if(x>x2)
            return -10;
          else
            return 0;
        }
        else if(x>150) {
          if(x>x2)
            return -10;
          else
            return 0;
        }
        else if(x<1150) {
          if(x<x2)
            return 10;
          else {
            return 0;
          }
        }
        else {
          return 0;
        }
      } else {
        if(this.player.speedX<0)
          return 10;
        else if(this.player.speedX>10)
          return -10;
        else
          return 0;
    }


  }
 //int speedX=10;

  update() {
    this.gameUI.updateUI();

    if ( this.gameUI.stateStatus === 'playing' ) {
      this.currentDistance += this.game.time.physicsElapsed * this.currentVelocity;

      const speedTooHigh = this.isSpeedTooHigh();
      const speedTooLow = this.isSpeedTooLow();

      if (speedTooHigh > 0) {
        this.score -= speedTooHigh * this.game.time.physicsElapsed;
        this.camera.shake(0.005, 25, true, Phaser.Camera.SHAKE_BOTH, true);        
      } else if (speedTooLow > 0) {
        this.score -= speedTooLow * this.game.time.physicsElapsed;

        if (this.isPlayerUpToSpeed) {
          this.camera.shake(0.005, 25, true, Phaser.Camera.SHAKE_BOTH, true);        
        }
      } else {
        this.isPlayerUpToSpeed = true;
        this.score += this.game.time.physicsElapsed * this.currentVelocity;
      }

      if (this.score < 0) {
        this.score = 0.0;
      }

      //1030 i 550

      if (this.currentDistance >= this.totalDistance) {
        this.gameUI.stateGameover();
      }

      this.game.physics.arcade.collide( this.player, this.heads, this.handleCollision, null, this );
  //    this.player.x = this.game.input.x;
  //  console.log(+" vs "+this.game.input.x);
    this.accelerateMovement(this.player.x);
  //    this.player.y = this.game.input.y;
    }
  }

}
