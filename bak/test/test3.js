var opt = {
    type: 2,
    maxAge: {
        value: 3
    },
    position: {
        value: new THREE.Vector3(0, 0, -50),
        radius: 2,
        spread: new THREE.Vector3(0, 0, 0),
    },
    color: {
        value: [new THREE.Color('white'), new THREE.Color('red')]
    },
    size: {
        value: 1
    },
    velocity: {
        value: new THREE.Vector3(0, 25, 0),
        spread: new THREE.Vector3(10, 7.5, 10)
    },
    acceleration: {
        value: new THREE.Vector3(0, -10, 0),
        spread: new THREE.Vector3(10, 0, 10)
    },
    particleCount: 250
};



//explore

opt = {
    type: 1,
    position: {
        value: new THREE.Vector3(0, 0, -20),
        spread: new THREE.Vector3(1),
        radius: 1,
    },
    velocity: {
        value: new THREE.Vector3(10, -5, 0)
    },
    acceleration: {
        value: new THREE.Vector3(0, -10, 0),
        spread: new THREE.Vector3(0, 0, 0)
    },
    size: {
        value: 1
    },
    opacity: {
        value: [1, 0]
    },
    wiggle: {
        value: Math.random() * 30,
    },
    drag: {
        value: Math.random(),
    },
    color: {
        value: [new THREE.Color('yellow'), new THREE.Color('red')]
    },
    particleCount: 500,
    alive: true,
    duration: null,
    maxAge: {
        value: 3
    }
};









AFRAME.registerComponent('particle-system', {
    schema: {},
    init: function () {},
    update: function (oldData) {
        if (this.particleGroup) {
            this.el.removeObject3D('particle-system');
        }
        this.initParticleSystem();
    },
    tick: function (time, dt) {
        this.particleGroup.tick(dt / 1000);
    },
    remove: function () {
        if (!this.particleGroup) {
            return;
        }
        this.el.removeObject3D('particle-system');
    },
    initParticleSystem: function () {
        this.particleGroup = new SPE.Group({
            texture: {
                value: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/IdeaSpaceVR/aframe-particle-system-component/master/dist/images/smokeparticle.png')
            },
            maxParticleCount: this.data.maxParticleCount
        });
        var emitter = new SPE.Emitter(opt);
        this.particleGroup.addEmitter(emitter);
        this.el.setObject3D('particle-system', this.particleGroup.mesh);
    },
});
