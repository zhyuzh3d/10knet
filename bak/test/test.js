AFRAME.registerComponent('fwfk', {
    schema: {},
    init: function () {
        this.createPS();
    },
    update: function (oldData) {

    },
    tick: function (time, deltaTime) {
        this.animatePS(deltaTime);
    },
    remove: function () {
        if (!this.PSG) {
            return;
        }
        this.el.removeObject3D('fwfk');
    },
    createPS: function () {
        var particleCount = 100;
        var particles = new THREE.Geometry();
        for (var p = 0; p < particleCount; p++) {
            var x = Math.random() * 400 - 200;
            var y = Math.random() * 400 - 200;
            var z = Math.random() * 400 - 200;
            var particle = new THREE.Vector3(x, y, z);
            particles.vertices.push(particle);
        }
        var particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 4,
            map: THREE.ImageUtils.loadTexture("./particle.png"),
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        var ps = new THREE.Points(particles, particleMaterial);

        this.PSG = ps;
        this.el.setObject3D('fwfk', ps);

        return ps;
    },
    animatePS: function (deltaTime) {
        var verts = this.PSG.geometry.vertices;
        for (var i = 0; i < verts.length; i++) {
            var vert = verts[i];
            if (vert.y < -200) {
                vert.y = Math.random() * 400 - 200;
            }
            vert.y = vert.y - (0.1 * deltaTime);
        }
        this.PSG.geometry.verticesNeedUpdate = true;
    },

});









//
