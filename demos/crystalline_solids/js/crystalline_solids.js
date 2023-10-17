/*
crystalline_solids.js: javascript demo for 3D visualisation of 
Crystalline Solids
Author: Mitch Bryson
*/

class SimEnvir {
	constructor() {
		
		// Initialise Camera
		this.camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 30 );
		this.zoom_dist = 15.0;
		this.campitch = 0.5;
		this.camyaw = -0.5;
		this.camera.position.z = this.zoom_dist;
		pantilt_camera(this.camera,this.campitch,this.camyaw,this.zoom_dist)
		
		// Create Scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 'rgb(230,230,230)' );
		
		// Create basic sphere geometries and materials
		this.geometry = new THREE.SphereGeometry( 1, 32, 32 );
		this.geometry_hemi = load_hemi();
		this.geometry_8th = load_sphere8th();
		
		this.material_red = new THREE.MeshLambertMaterial( {color: 'rgb(200,0,0)'} );
		this.material_blue = new THREE.MeshLambertMaterial( {color: 'rgb(0,0,200)'} );
		this.material_red_trans = new THREE.MeshLambertMaterial( {color: 'rgb(200,0,0)', transparent: true, opacity: 1.0} );
		this.material_blue_trans = new THREE.MeshLambertMaterial( {color: 'rgb(0,0,200)', transparent: true, opacity: 1.0} );
		this.material_green_line = new THREE.LineBasicMaterial( { color: 'rgb(0,200,0)', linewidth: 2 } );
		
		// Load mesh data and add to scene
		this.meshes = []
		this.LoadSC();
		
		// Add in lighting to scene
		this.pointLight = new THREE.PointLight(0xFFFFFF);
		this.pointLight.position.x = 20;
		this.pointLight.position.y = -20;
		this.pointLight.position.z = 100;
		this.scene.add( this.pointLight );
		this.ambLight = new THREE.AmbientLight(0xFFFFFF);
		this.ambLight.intensity = 0.5;
		this.scene.add( this.ambLight );
		
		this.renderer = new THREE.WebGLRenderer( { canvas: myCanvas } );
		this.renderer.render( this.scene, this.camera );
		
		this.mousedown = 0;
		this.mouse_x = 0;
		this.mouse_y = 0;
		this.mouse_dx = 0;
		this.mouse_dy = 0;
	}
	model_loaded(object) {
		this.mesh = object;
		this.scene.add(this.mesh);
	}
	AddLatticeMesh(a) {
		this.meshes.push(new THREE.Mesh( this.geometry_8th, this.material_red ));
		this.meshes[this.meshes.length-1].position.set(a/2,a/2,a/2);
		this.meshes[this.meshes.length-1].rotateZ(Math.PI/2)
		this.meshes.push(new THREE.Mesh( this.geometry_8th, this.material_red ));
		this.meshes[this.meshes.length-1].position.set(a/2,-a/2,a/2);
		this.meshes.push(new THREE.Mesh( this.geometry_8th, this.material_red ));
		this.meshes[this.meshes.length-1].position.set(-a/2,-a/2,a/2);
		this.meshes[this.meshes.length-1].rotateZ(-Math.PI/2)
		this.meshes.push(new THREE.Mesh( this.geometry_8th, this.material_red ));
		this.meshes[this.meshes.length-1].position.set(-a/2,a/2,a/2);
		this.meshes[this.meshes.length-1].rotateZ(Math.PI)
		
		this.meshes.push(new THREE.Mesh( this.geometry_8th, this.material_red ));
		this.meshes[this.meshes.length-1].position.set(a/2,a/2,-a/2);
		this.meshes[this.meshes.length-1].rotateX(Math.PI)
		this.meshes.push(new THREE.Mesh( this.geometry_8th, this.material_red ));
		this.meshes[this.meshes.length-1].position.set(a/2,-a/2,-a/2);
		this.meshes[this.meshes.length-1].rotateY(Math.PI/2)
		this.meshes.push(new THREE.Mesh( this.geometry_8th, this.material_red ));
		this.meshes[this.meshes.length-1].position.set(-a/2,-a/2,-a/2);
		this.meshes[this.meshes.length-1].rotateY(Math.PI)
		this.meshes.push(new THREE.Mesh( this.geometry_8th, this.material_red ));
		this.meshes[this.meshes.length-1].position.set(-a/2,a/2,-a/2);
		this.meshes[this.meshes.length-1].rotateZ(Math.PI)
		this.meshes[this.meshes.length-1].rotateX(Math.PI/2)
		
		var cube = new THREE.BoxGeometry( a, a, a );
		var geo = new THREE.EdgesGeometry( cube );
		this.meshes.push(new THREE.LineSegments( geo, this.material_green_line ));
		
	}
	AddFCMesh(a) {
		this.meshes.push(new THREE.Mesh( this.geometry_hemi, this.material_blue ));
		this.meshes[this.meshes.length-1].position.set(a/2,0,0);
		this.meshes.push(new THREE.Mesh( this.geometry_hemi, this.material_blue ));
		this.meshes[this.meshes.length-1].position.set(-a/2,0,0);
		this.meshes[this.meshes.length-1].rotateY(Math.PI)
		this.meshes.push(new THREE.Mesh( this.geometry_hemi, this.material_blue ));
		this.meshes[this.meshes.length-1].position.set(0,a/2,0);
		this.meshes[this.meshes.length-1].rotateZ(Math.PI/2)
		this.meshes.push(new THREE.Mesh( this.geometry_hemi, this.material_blue ));
		this.meshes[this.meshes.length-1].position.set(0,-a/2,0);
		this.meshes[this.meshes.length-1].rotateZ(-Math.PI/2)
		this.meshes.push(new THREE.Mesh( this.geometry_hemi, this.material_blue ));
		this.meshes[this.meshes.length-1].position.set(0,0,a/2);
		this.meshes[this.meshes.length-1].rotateY(-Math.PI/2)
		this.meshes.push(new THREE.Mesh( this.geometry_hemi, this.material_blue ));
		this.meshes[this.meshes.length-1].position.set(0,0,-a/2);
		this.meshes[this.meshes.length-1].rotateY(Math.PI/2)
	}
	LoadSC() {
		var Nx = 4;
		var Ny = 4;
		var Nz = 4;
		var R = 1.0;
		var a = 2*R;
		for (var i = 0; i < this.meshes.length; i++) {
			this.scene.remove( this.meshes[i] );
		}
		this.meshes = []
		this.AddLatticeMesh(a);
		// atoms
		for (var i = 0; i < Nx; i++) {
			for (var j = 0; j < Ny; j++) {
				for (var k = 0; k < Nz; k++) {
					this.meshes.push(new THREE.Mesh( this.geometry, this.material_red_trans ));
					this.meshes[this.meshes.length-1].position.set(i*a-0.5*a*(Nx-1),j*a-0.5*a*(Ny-1),k*a-0.5*a*(Nz-1));
				}
			}
		}
		for (var i = 0; i < this.meshes.length; i++) {
			this.scene.add( this.meshes[i] );
		}
	}
	LoadBCC() {
		var Nx = 4;
		var Ny = 4;
		var Nz = 4;
		var R = 1.0;
		var a = 4.0*R/Math.sqrt(3);
		for (var i = 0; i < this.meshes.length; i++) {
			this.scene.remove( this.meshes[i] );
		}
		this.meshes = []
		this.AddLatticeMesh(a);
		this.meshes.push(new THREE.Mesh( this.geometry, this.material_blue ));
		for (var i = 0; i < Nx; i++) {
			for (var j = 0; j < Ny; j++) {
				for (var k = 0; k < Nz; k++) {
					this.meshes.push(new THREE.Mesh( this.geometry, this.material_red_trans ));
					this.meshes[this.meshes.length-1].position.set(i*a-0.5*a*(Nx-1),j*a-0.5*a*(Ny-1),k*a-0.5*a*(Nz-1));
				}
			}
		}
		for (var i = 0; i < Nx-1; i++) {
			for (var j = 0; j < Ny-1; j++) {
				for (var k = 0; k < Nz-1; k++) {
					this.meshes.push(new THREE.Mesh( this.geometry, this.material_blue_trans ));
					this.meshes[this.meshes.length-1].position.set(i*a-0.5*a*(Nx-2),j*a-0.5*a*(Ny-2),k*a-0.5*a*(Nz-2));
				}
			}
		}
		for (var i = 0; i < this.meshes.length; i++) {
			this.scene.add( this.meshes[i] );
		}
	}
	LoadFCC() {
		var Nx = 4;
		var Ny = 4;
		var Nz = 4;
		var R = 1.0;
		var a = 2.0*R*Math.sqrt(2);
		for (var i = 0; i < this.meshes.length; i++) {
			this.scene.remove( this.meshes[i] );
		}
		this.meshes = []
		this.AddLatticeMesh(a);
		this.AddFCMesh(a);
		for (var i = 0; i < Nx; i++) {
			for (var j = 0; j < Ny; j++) {
				for (var k = 0; k < Nz; k++) {
					this.meshes.push(new THREE.Mesh( this.geometry, this.material_red_trans ));
					this.meshes[this.meshes.length-1].position.set(i*a-0.5*a*(Nx-1),j*a-0.5*a*(Ny-1),k*a-0.5*a*(Nz-1));
				}
			}
		}
		for (var i = 0; i < Nx-1; i++) {
			for (var j = 0; j < Ny-1; j++) {
				for (var k = 0; k < Nz; k++) {
					this.meshes.push(new THREE.Mesh( this.geometry, this.material_blue_trans ));
					this.meshes[this.meshes.length-1].position.set(i*a-0.5*a*(Nx-2),j*a-0.5*a*(Ny-2),k*a-0.5*a*(Nz-1));
				}
			}
		}
		for (var i = 0; i < Nx-1; i++) {
			for (var j = 0; j < Ny; j++) {
				for (var k = 0; k < Nz-1; k++) {
					this.meshes.push(new THREE.Mesh( this.geometry, this.material_blue_trans ));
					this.meshes[this.meshes.length-1].position.set(i*a-0.5*a*(Nx-2),j*a-0.5*a*(Ny-1),k*a-0.5*a*(Nz-2));
				}
			}
		}
		for (var i = 0; i < Nx; i++) {
			for (var j = 0; j < Ny-1; j++) {
				for (var k = 0; k < Nz-1; k++) {
					this.meshes.push(new THREE.Mesh( this.geometry, this.material_blue_trans ));
					this.meshes[this.meshes.length-1].position.set(i*a-0.5*a*(Nx-1),j*a-0.5*a*(Ny-2),k*a-0.5*a*(Nz-2));
				}
			}
		}
		for (var i = 0; i < this.meshes.length; i++) {
			this.scene.add( this.meshes[i] );
		}
	}
	update() {
	}
	draw() {
		
		// Update camera pointing
		var pitch = this.campitch + 0.005*this.mouse_dy;
		var yaw = this.camyaw + 0.005*this.mouse_dx;
		pantilt_camera(this.camera,pitch,yaw,this.zoom_dist);
		
		this.renderer.render( this.scene, this.camera );
	}
	reset() {
		this.draw();
	}
}

function pantilt_camera(camera,pitch,yaw,zoom_dist) {
	
	var roll = 3.14159;
	var c11 = Math.cos(yaw)*Math.cos(pitch); 
	var c12 = Math.cos(yaw)*Math.sin(pitch)*Math.sin(roll) - Math.sin(yaw)*Math.cos(roll); 
	var c13 = Math.cos(yaw)*Math.sin(pitch)*Math.cos(roll) + Math.sin(yaw)*Math.sin(roll);
	var c21 = Math.sin(yaw)*Math.cos(pitch);
	var c22 = Math.sin(yaw)*Math.sin(pitch)*Math.sin(roll) + Math.cos(yaw)*Math.cos(roll);
	var c23 = Math.sin(yaw)*Math.sin(pitch)*Math.cos(roll) - Math.cos(yaw)*Math.sin(roll);
	var c31 = -Math.sin(pitch);
	var c32 = Math.cos(pitch)*Math.sin(roll); 
	var c33 = Math.cos(pitch)*Math.cos(roll);
	
	var m = new THREE.Matrix4();
	
	m.set( c22, c23, c21, 0,
		c32, c33, c31, 0,
		c12, c13, c11, 0,
		0, 0, 0, 1 );
	camera.setRotationFromMatrix(m)
	
	camera.position.x = zoom_dist*Math.cos(pitch)*Math.sin(yaw)
	camera.position.y = -zoom_dist*Math.sin(pitch)
	camera.position.z = zoom_dist*Math.cos(pitch)*Math.cos(yaw)
	camera.updateProjectionMatrix()
}

// Start up a new environment and run it
let simenvir = new SimEnvir();
function ResetSim() {
    clearInterval(simenvir.interval);
    simenvir.reset();
}
function cycle() {
	simenvir.update();
	simenvir.draw();
}

function ResetCamera() {
	simenvir.campitch = 0.5;
	simenvir.camyaw = -0.5;
	simenvir.zoom_dist = 15.0;
    pantilt_camera(simenvir.camera,simenvir.pitch,simenvir.yaw,simenvir.zoom_dist)
    simenvir.draw();
}

function ChangeModel(value) {
	if (value == 0) {
		simenvir.LoadSC()
	}
	else if (value == 1) {
		simenvir.LoadBCC()
	}
	else if (value == 2) {
		simenvir.LoadFCC()
	}
	else {
	}
	simenvir.draw()
}

function UpdateUnitcell(checked) {
	if (checked == true) {
		simenvir.material_red_trans.opacity = 0.1;
		simenvir.material_blue_trans.opacity = 0.1;
	}
	else {
		simenvir.material_red_trans.opacity = 1.0;
		simenvir.material_blue_trans.opacity = 1.0;
	}
	simenvir.draw()
}

function OnMouseDown() {
	simenvir.mousedown = 1
	var rect = document.getElementById("myCanvas").getBoundingClientRect();
	simenvir.mouse_x = event.clientX-rect.left;
	simenvir.mouse_y = event.clientY-rect.top;
}
function OnMouseUp() {
	simenvir.mousedown = 0
	simenvir.campitch = simenvir.campitch + 0.005*simenvir.mouse_dy;
	simenvir.camyaw = simenvir.camyaw + 0.005*simenvir.mouse_dx;
	simenvir.mouse_dx = 0;
	simenvir.mouse_dy = 0;
}
function OnMouseMove(event) {
	if (simenvir.mousedown == 1) {
		var rect = document.getElementById("myCanvas").getBoundingClientRect();
		simenvir.mouse_dx = event.clientX-rect.left-simenvir.mouse_x;
		simenvir.mouse_dy = event.clientY-rect.top-simenvir.mouse_y;
		simenvir.draw()
	}
	else {
		simenvir.mouse_dx = 0;
		simenvir.mouse_dy = 0;
	}
}

