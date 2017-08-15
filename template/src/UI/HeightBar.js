export default class HeightBar {
  constructor(state)
  {
    this.state = state;
    this.game = state.game;

    this.heightBarWidth = 50;
    this.heightBarBorder = 5;

    this.minSpeedThreshold = 1030;
    this.maxSpeedThreshold = 550;
  }

  initHeightBar() {
    const barBackgroundWidth = this.heightBarWidth + 2 * this.heightBarBorder;

  /*  let backgroundBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    backgroundBitmap.ctx.fillStyle = '#000';
    backgroundBitmap.ctx.beginPath();
    backgroundBitmap.ctx.rect(0, 0, barBackgroundWidth, this.game.world.height);
    backgroundBitmap.ctx.fill();
    this.bgSprite = this.game.add.sprite(this.game.world.width - barBackgroundWidth, 0, backgroundBitmap);*/
    this.playerProgressBack =   this.game.add.sprite( this.game.world.width-70, this.game.world.height, 'pasekPredkosci1' );
    this.playerProgressBack.anchor.setTo( 0.5, 1 );

    // let heightWindowBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    // heightWindowBitmap.ctx.beginPath();
    // heightWindowBitmap.ctx.rect(0, this.maxSpeedThreshold, barBackgroundWidth + 2 * this.heightBarBorder, this.minSpeedThreshold);
    // heightWindowBitmap.ctx.lineWidth = '2';
    // heightWindowBitmap.ctx.strokeStyle = '#ff0';
    // this.heightWindowSprite = this.game.add.sprite(this.game.world.width - barBackgroundWidth - this.heightBarBorder, 0, heightWindowBitmap);

  /*  let healthBarBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    healthBarBitmap.ctx.fillStyle = '#fff';
    healthBarBitmap.ctx.beginPath();
    healthBarBitmap.ctx.rect(0, 0, this.heightBarWidth, this.game.world.height);
    healthBarBitmap.ctx.fill();
    this.heightBarSprite = this.game.add.sprite(this.game.world.width - this.heightBarWidth - this.heightBarBorder, this.game.world.height, healthBarBitmap);
    this.heightBarSprite.anchor.y = 1;*/
    this.heightBarSprite =   this.game.add.sprite( this.game.world.width-70, this.game.world.height, 'pasekPredkosci2' );
    this.heightBarSprite.anchor.setTo( 0.5, 1 );

    this.game.input.addMoveCallback(this.updateHeightBar, this);
  }

  stop() {
    this.game.input.deleteMoveCallback(this.updateHeightBar, this);
  }

  updateHeightBar(pointer, x, y, state) {
/*    if (y > this.maxSpeedThreshold && y < this.minSpeedThreshold) {
      this.heightBarSprite.tint = 0xffffff;
    } else if (y < this.maxSpeedThreshold) {
      this.heightBarSprite.tint = 0xffff00;
    } else {
      this.heightBarSprite.tint = 0xff0000;
    }*/
    //1620 - dol, 80-gora
    //const tempY = -y/1920;
    //const newY = 1540-(1-(y/1920));

    const cropRect = new Phaser.Rectangle(0, y, this.game.world.width, this.game.world.height);
    this.heightBarSprite.crop(cropRect);
  }
}
