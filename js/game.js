var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1024,
  height: 768,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image('logo', 'img/logo.png');
}

function create() {
  const self = this;
  this.logo = this.add.image(1024 / 2, 768 / 2, 'logo');
  this.logo.setScale(0.5);

  this.tweens.add({
    targets: this.logo,
    y: 450,
    duration: 2000,
    ease: 'Power2',
    yoyo: true,
    loop: -1
  });

  this.add.text(1024 / 2, 100, 'Phaser1-test', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' }).setOrigin(0.5);

  self.deferredPrompt = undefined;
  window.addEventListener('beforeinstallprompt', function (e) {
    console.log('beforeinstallprompt triggered');
    e.preventDefault();
    self.deferredPrompt = e;
  });

  window.addEventListener('appinstalled', function () {
    console.log('应用已安装');
  });

  window.onappinstalled = function (ev) {
    console.log('The application was installed.');
  };


  self.text = this.add.text(1024, 100, '下载', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' })
    .setOrigin(1, 0.5).setInteractive({ useHandCursor: true }).on('pointerup', function () {
      var x;
      var r = confirm("按下按钮!");
      if (r == true) {
        x = "你按下了\"确定\"按钮!";
        console.log('deferredPrompt.prompt();', self.deferredPrompt);
        self.deferredPrompt.prompt();
      } else {
        x = "你按下了\"取消\"按钮!";
      }
      console.log('x', x);
    }).setVisible(false);


  this.add.text(1024 / 2, 600, 'baidu', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' })
    .setOrigin(1, 0.5).setInteractive({ useHandCursor: true }).on('pointerup', function () {
      window.location.href = 'https://www.baidu.com/';
    });
}

var flag = false;
function update() {
  const self = this;
  if (self.deferredPrompt != undefined && !flag) {
    flag = true;
    setTimeout(function () {
      self.text.setVisible(true);
    }, 2000);
  }
}
