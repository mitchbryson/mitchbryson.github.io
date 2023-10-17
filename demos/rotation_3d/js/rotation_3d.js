/*
rotation_3d.js: javascript for 3D Rotation Virtual Lab
Author: Mitch Bryson
*/

class SimEnvir {
	constructor() {
		this.camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 30 );
		this.camera.position.z = 18;
		this.campitch = 0.3;
		this.camyaw = -0.4;
		pantilt_camera(this.camera,this.campitch,this.camyaw)
		this.scene = new THREE.Scene();
		//this.scene.background = new THREE.Color( 0xffffff );
		this.scene.background = new THREE.Color( 0x000000 );
		
		//this.geometry = new THREE.BoxGeometry( 8.0, 5.0, 3.0 );
		this.geometry = load_model();
		this.material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		//this.mesh.position.x = 3.0;
		this.scene.add( this.mesh );
		
		this.pointLight = new THREE.PointLight(0xFFFFFF);
		this.pointLight.position.x = 20;
		this.pointLight.position.y = -20;
		this.pointLight.position.z = 100;
		this.scene.add( this.pointLight );
		this.ambLight = new THREE.AmbientLight(0xFFFFFF);
		this.ambLight.intensity = 0.5;
		this.scene.add( this.ambLight );
		
		// render axis
		var material_line1 = new THREE.LineBasicMaterial( { color: 0x00ff00} );
		var material_line2 = new THREE.LineBasicMaterial( { color: 0x0000ff } );
		var material_line3 = new THREE.LineBasicMaterial( { color: 0xff0000 } );
		var material_line1a = new THREE.LineBasicMaterial( { color: 0xffff00 } );
		var material_line2a = new THREE.LineBasicMaterial( { color: 0x00ffff } );
		var material_line3a = new THREE.LineBasicMaterial( { color: 0xff00ff } );
		var offx = 0;
		var offy = 0;
		var offz = 0;
		var lenline = 10;
		var lenlinea = 8;
		
		var geometry_line1a = new THREE.Geometry();
		geometry_line1a.vertices.push(new THREE.Vector3( offx, offy, offz) );
		geometry_line1a.vertices.push(new THREE.Vector3( offx+lenlinea, offy, offz) );
		var geometry_line2a = new THREE.Geometry();
		geometry_line2a.vertices.push(new THREE.Vector3( offx, offy, offz) );
		geometry_line2a.vertices.push(new THREE.Vector3( offx, offy+lenlinea, offz) );
		var geometry_line3a = new THREE.Geometry();
		geometry_line3a.vertices.push(new THREE.Vector3(  offx, offy, offz) );
		geometry_line3a.vertices.push(new THREE.Vector3(  offx, offy, offz+lenlinea) );
		
		var geometry_line1 = new THREE.Geometry();
		geometry_line1.vertices.push(new THREE.Vector3( offx, offy, offz) );
		geometry_line1.vertices.push(new THREE.Vector3( offx+lenline, offy, offz) );
		var geometry_line2 = new THREE.Geometry();
		geometry_line2.vertices.push(new THREE.Vector3( offx, offy, offz) );
		geometry_line2.vertices.push(new THREE.Vector3( offx, offy+lenline, offz) );
		var geometry_line3 = new THREE.Geometry();
		geometry_line3.vertices.push(new THREE.Vector3(  offx, offy, offz) );
		geometry_line3.vertices.push(new THREE.Vector3(  offx, offy, offz+lenline) );
		
		this.axis_x_b = new THREE.Line( geometry_line1a, material_line1a );
		this.axis_y_b = new THREE.Line( geometry_line2a, material_line2a );
		this.axis_z_b = new THREE.Line( geometry_line3a, material_line3a );
		this.axis_x_w = new THREE.Line( geometry_line1, material_line1 );
		this.axis_y_w = new THREE.Line( geometry_line2, material_line2 );
		this.axis_z_w = new THREE.Line( geometry_line3, material_line3 );
		
		this.scene.add( this.axis_x_b );
		this.scene.add( this.axis_y_b );
		this.scene.add( this.axis_z_b );
		this.scene.add( this.axis_x_w );
		this.scene.add( this.axis_y_w );
		this.scene.add( this.axis_z_w );
		
		this.renderer = new THREE.WebGLRenderer( { canvas: myCanvas } );
		this.renderer.render( this.scene, this.camera );
		
		this.roll = 0;
		this.pitch = 0;
		this.yaw = 0;
		
		//this.campitch = 0;
		//this.camyaw = 0;
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
	Update_Euler() {
		this.roll = document.getElementById("slider_r").value*3.14159/180;
		this.pitch = document.getElementById("slider_p").value*3.14159/180;
		this.yaw = document.getElementById("slider_y").value*3.14159/180;
		this.draw();
	}
	update() {
		
    	//this.line4.geometry.verticesNeedUpdate = true;
        
	}
	draw() {
		
		// Update rotating object
		setobject_euler(this.mesh,this.roll,this.pitch,this.yaw)
		
		// Update body-fixed frame
		setframe_euler(this.axis_x_b,this.axis_y_b,this.axis_z_b,this.roll,this.pitch,this.yaw)
		
		// Update camera pointing
		var pitch = this.campitch + 0.005*simenvir.mouse_dy;
		var yaw = this.camyaw + 0.005*simenvir.mouse_dx;
		pantilt_camera(this.camera,pitch,yaw);
		
		this.renderer.render( this.scene, this.camera );
	}
	reset() {
		this.roll = 0
		this.pitch = 0
		this.yaw = 0
		this.draw();
	}
}

function setobject_euler(object,roll,pitch,yaw) {
	var c11 = Math.cos(yaw)*Math.cos(pitch); 
	var c12 = Math.cos(yaw)*Math.sin(pitch)*Math.sin(roll) - Math.sin(yaw)*Math.cos(roll); 
	var c13 = Math.cos(yaw)*Math.sin(pitch)*Math.cos(roll) + Math.sin(yaw)*Math.sin(roll);
	var c21 = Math.sin(yaw)*Math.cos(pitch);
	var c22 = Math.sin(yaw)*Math.sin(pitch)*Math.sin(roll) + Math.cos(yaw)*Math.cos(roll);
	var c23 = Math.sin(yaw)*Math.sin(pitch)*Math.cos(roll) - Math.cos(yaw)*Math.sin(roll);
	var c31 = -Math.sin(pitch);
	var c32 = Math.cos(pitch)*Math.sin(roll); 
	var c33 = Math.cos(pitch)*Math.cos(roll);
	/*
	object.matrix.set( c22, c23, c21, 0,
		c32, c33, c31, 0,
		c12, c13, c11, 0,
		0, 0, 0, 1 );
	*/
	object.matrix.set( c22, c23, c21, object.position.x,
		c32, c33, c31, object.position.y,
		c12, c13, c11, object.position.z,
		0, 0, 0, 1 );
	object.matrixAutoUpdate = false;
}

function setframe_euler(axis_x_b,axis_y_b,axis_z_b,roll,pitch,yaw) {
	var c11 = Math.cos(yaw)*Math.cos(pitch); 
	var c12 = Math.cos(yaw)*Math.sin(pitch)*Math.sin(roll) - Math.sin(yaw)*Math.cos(roll); 
	var c13 = Math.cos(yaw)*Math.sin(pitch)*Math.cos(roll) + Math.sin(yaw)*Math.sin(roll);
	var c21 = Math.sin(yaw)*Math.cos(pitch);
	var c22 = Math.sin(yaw)*Math.sin(pitch)*Math.sin(roll) + Math.cos(yaw)*Math.cos(roll);
	var c23 = Math.sin(yaw)*Math.sin(pitch)*Math.cos(roll) - Math.cos(yaw)*Math.sin(roll);
	var c31 = -Math.sin(pitch);
	var c32 = Math.cos(pitch)*Math.sin(roll); 
	var c33 = Math.cos(pitch)*Math.cos(roll);
	
	var lenline = 8;
	axis_x_b.geometry.vertices[1].x = lenline*c22;
	axis_x_b.geometry.vertices[1].y = lenline*c32;
	axis_x_b.geometry.vertices[1].z = lenline*c12;
	axis_x_b.geometry.verticesNeedUpdate = true;
	axis_y_b.geometry.vertices[1].x = lenline*c23;
	axis_y_b.geometry.vertices[1].y = lenline*c33;
	axis_y_b.geometry.vertices[1].z = lenline*c13;
	axis_y_b.geometry.verticesNeedUpdate = true;
	axis_z_b.geometry.vertices[1].x = lenline*c21;
	axis_z_b.geometry.vertices[1].y = lenline*c31;
	axis_z_b.geometry.vertices[1].z = lenline*c11;
	axis_z_b.geometry.verticesNeedUpdate = true;
	
}

function pantilt_camera(camera,pitch,yaw) {
	
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
	
	camera.position.x = 18*Math.cos(pitch)*Math.sin(yaw)
	camera.position.y = -18*Math.sin(pitch)
	camera.position.z = 18*Math.cos(pitch)*Math.cos(yaw)
	camera.updateProjectionMatrix()
}

// Start up a new environment and run it
let simenvir = new SimEnvir();
function ResetSim() {
    clearInterval(simenvir.interval);
    simenvir.reset();
    setparamvalue(0,0);
    setparamvalue(0,1);
    setparamvalue(0,2);
}
function ResetCamera() {
	simenvir.campitch = 0.3;
	simenvir.camyaw = -0.4;
    pantilt_camera(simenvir.camera,simenvir.pitch,simenvir.yaw)
    simenvir.draw();
}
function cycle() {
	simenvir.update();
	simenvir.draw();
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
function switchaxisonoff_w(value) {
	if (value == 0)  {
		simenvir.scene.remove( simenvir.axis_x_w );
		simenvir.scene.remove( simenvir.axis_y_w );
		simenvir.scene.remove( simenvir.axis_z_w );
	}
	else {
	 	simenvir.scene.add( simenvir.axis_x_w );
		simenvir.scene.add( simenvir.axis_y_w );
		simenvir.scene.add( simenvir.axis_z_w );
	}
	simenvir.draw()
}
function switchaxisonoff_b(value) {
	if (value == 0)  {
		simenvir.scene.remove( simenvir.axis_x_b );
		simenvir.scene.remove( simenvir.axis_y_b );
		simenvir.scene.remove( simenvir.axis_z_b );
	}
	else {
	 	simenvir.scene.add( simenvir.axis_x_b );
		simenvir.scene.add( simenvir.axis_y_b );
		simenvir.scene.add( simenvir.axis_z_b );
	}
	simenvir.draw()
}
function setparamvalue(val,inputnum) {
	switch (inputnum) {
		case 0:
			if (val > 180) {
				val = 180;
			}
			else if (val < -180) {
				val = -180;
			}
			document.getElementById("slider_r").value = val;
			document.getElementById("input_r").value = val;
			simenvir.Update_Euler()
			break;
		case 1:
			if (val > 90) {
				val = 90;
			}
			else if (val < -90) {
				val = -90;
			}
			document.getElementById("slider_p").value = val;
			document.getElementById("input_p").value = val;
			simenvir.Update_Euler()
			break;
		case 2:
			if (val > 180) {
				val = 180;
			}
			else if (val < -180) {
				val = -180;
			}
			document.getElementById("slider_y").value = val;
			document.getElementById("input_y").value = val;
			simenvir.Update_Euler()
			break;
	}
}


