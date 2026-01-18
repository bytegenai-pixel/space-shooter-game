export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Stop any previous music and play victory/ending music
        this.sound.stopAll();
        this.music = this.sound.add('music-ending', { loop: true, volume: 0.5 });
        this.music.play();

        // Epic golden tinted background
        this.bg = this.add.image(240, 320, 'background')
            .setDisplaySize(480, 640)
            .setTint(0x332200);

        // Fast scrolling stars (victory zoom effect)
        this.stars = this.add.tileSprite(0, 0, 480, 640, 'stars')
            .setOrigin(0, 0)
            .setTileScale(2)
            .setTint(0xffdd88);

        // Celebration fireworks
        this.time.addEvent({
            delay: 500,
            callback: () => this.createFirework(),
            loop: true
        });

        // ===== VICTORY TITLE =====

        const victoryText = this.add.text(width / 2, 100, 'VICTORY', {
            fontFamily: 'monospace',
            fontSize: '64px',
            fill: '#ffffff',
            stroke: '#ff8800',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.tweens.add({
            targets: victoryText,
            scale: { from: 1, to: 1.05 },
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ===== HERO SHIP =====

        this.ship = this.add.sprite(240, 280, 'ship').setScale(4);
        this.ship.play('ship-thrust');

        this.tweens.add({
            targets: this.ship,
            y: { from: 280, to: 260 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ===== SCORE =====

        const scoreText = this.add.text(width / 2, 400, '0', {
            fontFamily: 'monospace',
            fontSize: '48px',
            fill: '#ffdd00',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.addCounter({
            from: 0,
            to: this.finalScore,
            duration: 1500,
            ease: 'Power2',
            onUpdate: (tween) => {
                scoreText.setText(Math.floor(tween.getValue()).toString());
            }
        });

        // High score check
        const highScore = parseInt(localStorage.getItem('highScore')) || 0;
        if (this.finalScore > highScore) {
            localStorage.setItem('highScore', this.finalScore);

            const newRecordText = this.add.text(width / 2, 450, 'NEW HIGH SCORE', {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#ff00ff',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);

            this.tweens.add({
                targets: newRecordText,
                alpha: { from: 1, to: 0.5 },
                duration: 400,
                yoyo: true,
                repeat: -1
            });
        }

        // Save completion
        localStorage.setItem('gameCompleted', 'true');
        localStorage.setItem('bestLevel', '3');

        // ===== RETURN BUTTON =====

        const playAgainBtn = this.add.text(width / 2, 540, '[ RETURN TO BASE ]', {
            fontFamily: 'monospace',
            fontSize: '20px',
            fill: '#00ffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        playAgainBtn.on('pointerover', () => {
            playAgainBtn.setScale(1.1);
            playAgainBtn.setFill('#ffffff');
        });
        playAgainBtn.on('pointerout', () => {
            playAgainBtn.setScale(1);
            playAgainBtn.setFill('#00ffff');
        });
        playAgainBtn.on('pointerdown', () => {
            this.cameras.main.flash(500, 255, 255, 255);
            this.time.delayedCall(300, () => {
                this.scene.start('MenuScene');
            });
        });

        this.tweens.add({
            targets: playAgainBtn,
            alpha: { from: 1, to: 0.6 },
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // ===== INPUT =====

        this.input.keyboard.once('keydown-SPACE', () => {
            this.cameras.main.flash(500, 255, 255, 255);
            this.time.delayedCall(300, () => {
                this.scene.start('MenuScene');
            });
        });

        this.input.once('pointerdown', () => {
            this.cameras.main.flash(500, 255, 255, 255);
            this.time.delayedCall(300, () => {
                this.scene.start('MenuScene');
            });
        });

        // Initial celebration flash
        this.cameras.main.flash(1000, 255, 200, 0);
    }

    update() {
        this.stars.tilePositionY -= 2;
    }

    createFirework() {
        const x = Phaser.Math.Between(50, 430);
        const y = Phaser.Math.Between(50, 600);

        const colors = [0xffdd00, 0x00ffff, 0xff00ff, 0x00ff00, 0xff8800];
        const color = Phaser.Math.RND.pick(colors);

        const explosion = this.add.sprite(x, y, 'explosion-large')
            .setScale(Phaser.Math.Between(8, 12) / 10)
            .setTint(color)
            .setAlpha(0.7);

        explosion.play('explode-large');
        explosion.on('animationcomplete', () => explosion.destroy());
    }
}
