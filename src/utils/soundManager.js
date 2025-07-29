import { Howl } from 'howler';

const loadRandomSounds = (count, basePath) =>
    Array.from({ length: count }, (_, i) => new Howl({
        src: [`/sounds/${basePath}/Sound ${String(i + 1).padStart(2, '0')}.ogg`],
        volume: 0.2,
    }));

export const soundManager = {
    deflectSounds: loadRandomSounds(4, 'deflect'), // change number to match your file count
    hitSounds: loadRandomSounds(4, 'hit'),
    deathSound: new Howl({ src: ['/sounds/death/male_deathcry.ogg'] }),
    bgMusic: new Howl({
        src: ['/sounds/bg_loop_130BPM.ogg'],
        loop: true,
        volume: 0.4,
    }),

    playRandomHit() {
        const sfx = this.hitSounds[Math.floor(Math.random() * this.hitSounds.length)];
        sfx.play();
    },

    playRandomDeflect() {
        const sfx = this.deflectSounds[Math.floor(Math.random() * this.deflectSounds.length)];
        sfx.play();
    },

    playDeath() {
        this.deathSound.play();
    },

    startMusic() {
        if (!this.bgMusic.playing()) {
            this.bgMusic.play();
        }
    },

    stopMusic() {
        this.bgMusic.stop();
    }
};
