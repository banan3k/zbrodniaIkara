  import { SCORE_FONT, SCORE_TEMPLATE, GAMEOVER_TITLE_FONT, GAMEOVER_SCORE_FONT, PAUSE_TITLE_FONT, BUTTON_PADDING } from '../constants/UIConstants';
import { playAudio, manageAudio, getAudioOffset } from '../utils/AudioManager';
import Text from './Text';
import HeightBar from './HeightBar';

import { PPTStorage } from '../utils/StorageManager';

export default class GameUI {

  constructor( state ) {
    this.state = state;
    this.game = state.game;

    this.stateStatus = 'playing';

    this.time = 0;
    this.runOnce = false;
    this.gamePaused = false;
    this.heightBar = new HeightBar(state);
  }

  init() {
    this.initScore();
    this.heightBar.initHeightBar();
    this.initPauseScreen();
    this.initGameoverScreen();
    //stas_dev:pasek_postepu
    this.initStartFinLine();
  }

  initScore() {
    this.textScore = new Text( this.game, 30, this.game.world.height - 20, SCORE_TEMPLATE( this.state.score.toFixed(0), this.time ), SCORE_FONT, [ 0, 1 ] );

    this.game.time.events.loop( Phaser.Timer.SECOND * 1, this.handlePointsAddition, this );
  }

   //stas_dev:pasek_postepu
 initStartFinLine()
  {
  /*   this.pasekHorizontal = this.game.add.graphics(50,200);
    this.pasekHorizontal.lineStyle(10, 0x0000);
    this.pasekHorizontal.drawRect(10, 1, 975, 50);

    this.startLine = this.game.add.graphics(50,200);
    this.startLine.lineStyle(8, 0xffd900);
    this.startLine.drawRect(10, 1, 50, 50);

    this.finishLine = this.game.add.graphics(1025,200);
    this.finishLine.lineStyle(8, 0xFF3300);
    this.finishLine.drawRect(10, 1, 50, 50);

    this.playerPoint = this.game.add.graphics(50,200);
    this.playerPoint.lineStyle(8, 0x0000FF);
    this.playerPoint.drawRect(10, 1, 50, 50);
*/

  this.playerProgressBack =   this.game.add.sprite( 18, 60, 'pasekPostepu1' );
this.playerProgressBack.anchor.setTo( 0, 0.5 );

this.playerProgress =   this.game.add.sprite( 18, 60, 'pasekPostepu2' );
this.playerProgress.anchor.setTo( 0, 0.5 );
  }

  initPauseScreen() {
  
    this.buttonPause = this.game.add.button( this.game.world.width - BUTTON_PADDING, BUTTON_PADDING, 'button-pause', this.managePause, this, 1, 0, 2 );
    this.buttonPause.anchor.set( 1, 0 );
    this.buttonPause.input.priorityID = 0;
    this.buttonPause.visible = false;

    this.buttonPause.y = -this.buttonPause.height - BUTTON_PADDING;
    this.game.add.tween( this.buttonPause ).to( { y: BUTTON_PADDING }, 1000, Phaser.Easing.Exponential.Out, true );

    this.screenPausedGroup = this.game.add.group();
    this.screenPausedBg = this.game.add.sprite( 0, 0, 'overlay' );
    this.screenPausedBg.scale.setTo( 2 );

    this.screenPausedText = new Text( this.game, 'center', 'center', 'Paused', PAUSE_TITLE_FONT );

    this.buttonAudio = this.game.add.button( this.game.world.width - BUTTON_PADDING, BUTTON_PADDING, 'button-audio', this.clickAudio, this, 1, 0, 2 );
    this.buttonAudio.anchor.set( 1, 0 );
    this.buttonAudio.setFrames( getAudioOffset() + 1, getAudioOffset() + 0, getAudioOffset() + 2 );

    this.screenPausedBack = this.game.add.button( BUTTON_PADDING, this.game.world.height - BUTTON_PADDING, 'button-mainmenu', this.stateBack, this, 1, 0, 2 );
    this.screenPausedBack.anchor.set( 0, 1 );

    this.screenPausedContinue = this.game.add.button( this.game.world.width - BUTTON_PADDING, this.game.world.height - BUTTON_PADDING, 'button-continue', this.managePause, this, 1, 0, 2 );
    this.screenPausedContinue.anchor.set( 1, 1 );

    this.screenPausedGroup.add( this.screenPausedBg );
    this.screenPausedGroup.add( this.screenPausedText );
    this.screenPausedGroup.add( this.buttonAudio );
    this.screenPausedGroup.add( this.screenPausedBack );
    this.screenPausedGroup.add( this.screenPausedContinue );
    this.screenPausedGroup.alpha = 0;
    this.screenPausedGroup.visible = false;
  }

  initGameoverScreen() {
    this.screenGameoverGroup = this.game.add.group();
    this.screenGameoverBg = this.game.add.sprite( 0, 0, 'overlay' );
    this.screenGameoverBg.scale.setTo( 2 );
    this.screenGameoverBg.inputEnabled = true;
    this.screenGameoverBg.input.priorityID = 1;

    this.screenGameoverText = new Text( this.game, 'center', 100, 'Finished!', GAMEOVER_TITLE_FONT );

    this.screenGameoverBack = this.game.add.button( BUTTON_PADDING, this.game.world.height - BUTTON_PADDING, 'button-mainmenu', this.stateBack, this, 1, 0, 2 );
    this.screenGameoverBack.anchor.set( 0, 1 );
    this.screenGameoverBack.input.priorityID = 2;

    this.screenGameoverRestart = this.game.add.button( this.game.world.width - BUTTON_PADDING, this.game.world.height - BUTTON_PADDING, 'button-restart', this.stateRestart, this, 1, 0, 2 );
    this.screenGameoverRestart.anchor.set( 1, 1 );
    this.screenGameoverRestart.anchor.set( 1, 1 );
    this.screenGameoverRestart.input.priorityID = 2;

    this.screenGameoverScore = new Text( this.game, 'center', 'center', 'Score: ' + this.score, GAMEOVER_SCORE_FONT );

    this.screenGameoverGroup.add( this.screenGameoverBg );
    this.screenGameoverGroup.add( this.screenGameoverText );
    this.screenGameoverGroup.add( this.screenGameoverBack );
    this.screenGameoverGroup.add( this.screenGameoverRestart );
    this.screenGameoverGroup.add( this.screenGameoverScore );
    this.screenGameoverGroup.alpha = 0;
    this.screenGameoverGroup.visible = false;
  }

  updateUI() {
    switch ( this.stateStatus ) {
    case 'paused': {
      if ( !this.runOnce ) {
        this.statePaused();
        this.runOnce = true;
      }
      break;
    }
    case 'gameover': {
      if ( !this.runOnce ) {
        this.stateGameover();
        this.runOnce = true;
      }
      break;
    }
    case 'playing': {
      if ( !this.runOnce ) {
        this.statePlaying();
        this.runOnce = true;
      }

      //stas_dev:pasek postepu
      this.updateProgressBar();
    }
  }
}

  updateProgressBar() {
    const progress = this.state.currentDistance / this.state.totalDistance;

  //  this.playerPoint.x = 50 + 975 * progress;
  var fakeProgress=1050*progress+50;
  const cropRect = new Phaser.Rectangle(0, 0, fakeProgress, this.game.world.height);
  this.playerProgress.crop(cropRect);
  }

  handlePointsAddition() {
    this.time++;
    this.textScore.setText( SCORE_TEMPLATE( this.state.score.toFixed(0), this.time ) );
  }

  managePause() {
    if ( !this.screenGameoverGroup.visible ) {
      this.gamePaused = !this.gamePaused;
      playAudio( 'click' );
      if ( this.gamePaused ) {
        this.game.world.bringToTop( this.screenPausedGroup );
        this.stateStatus = 'paused';
        this.runOnce = false;
        this.game.time.events.pause();
      } else {
        this.stateStatus = 'playing';
        this.runOnce = false;
        this.game.time.events.resume();
      }
    }
  }

  statePlaying() {
    this.state.startHeads.call( this.state );
    const tween = this.game.add.tween( this.screenPausedGroup );
    tween.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true );
    tween.onComplete.add( () => {
      if ( this.screenPausedGroup.visible ) {
        this.screenPausedGroup.visible = false;
      }
    }, this );
  }

  statePaused() {
    this.screenPausedGroup.visible = true;
    this.state.stopHeads.call( this.state );
    const tween = this.game.add.tween( this.screenPausedGroup );
    tween.to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true );
  }

  stateBack() {
    playAudio( 'click' );
    this.screenGameoverGroup.visible = false;
    this.gamePaused = false;
    this.runOnce = false;
    this.stateStatus = 'playing';
    this.game.time.events.resume();
    this.state.state.start( 'MainMenu' );
  }

  stateGameover() {
    this.stateStatus = 'gameover';
    
    this.game.input.deleteMoveCallback(this.state.updateSpeed, this);
    this.heightBar.stop();
    this.game.time.events.pause();
    this.state.stopHeads.call( this.state );
    this.game.world.bringToTop( this.screenGameoverGroup );
    this.screenGameoverScore.setText( `You got ${Math.floor(this.state.score)} drahmas\nand flew for ${Math.floor( this.time )} seconds!` );

    this.screenGameoverGroup.visible = true;
    const tween = this.game.add.tween( this.screenGameoverGroup );
    tween.to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true );

    PPTStorage.setHighscore( 'PPT-highscore', this.score );
  }

  stateRestart() {
    playAudio( 'click' );
    this.screenGameoverGroup.visible = false;
    this.gamePaused = false;
    this.runOnce = false;
    this.stateStatus = 'playing';
    this.game.time.events.resume();
    this.state.state.restart( true );
  }

  clickAudio() {
    playAudio( 'click' );
    manageAudio( 'switch', this );
  }
}
