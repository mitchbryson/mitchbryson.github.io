/*
rotating_box.js: test javascript for 3D torque-free kinetics virtual lab
*/

class SimEnvir {
	constructor() {
		this.camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 30 );
		this.camera.position.z = 18;
		this.campitch = 0.3;
		this.camyaw = -0.4;
		pantilt_camera(this.camera,this.campitch,this.camyaw);
		this.scene = new THREE.Scene();
		//this.scene.background = new THREE.Color( 0xffffff );
		
		this.geometry = new THREE.BoxGeometry( 5.0, 5.0, 5.0 );
		this.material = new THREE.MeshLambertMaterial( {color: 0xCCCCCC} );
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.scene.add( this.mesh );
		
		this.pointLight = new THREE.PointLight(0xFFFFFF);
		this.pointLight.position.x = 20;
		this.pointLight.position.y = 20;
		this.pointLight.position.z = 100;
		this.scene.add( this.pointLight );
		this.ambLight = new THREE.AmbientLight(0xFFFFFF);
		this.ambLight.intensity = 0.5;
		this.scene.add( this.ambLight );
		
		// render axis
		var material_line1 = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
		var material_line2 = new THREE.LineBasicMaterial( { color: 0x0000ff } );
		var material_line3 = new THREE.LineBasicMaterial( { color: 0xff0000 } );
		var material_line4 = new THREE.LineBasicMaterial( { color: 0xffff00 } );
		var material_line5 = new THREE.LineBasicMaterial( { color: 0x00ffff } );
		var geometry_line1 = new THREE.Geometry();
		var offx = 0;
		var offy = 0;
		var offz = 0;
		var lenline = 8;
		geometry_line1.vertices.push(new THREE.Vector3( offx, offy, offz) );
		geometry_line1.vertices.push(new THREE.Vector3( offx+lenline, offy, offz) );
		var geometry_line2 = new THREE.Geometry();
		geometry_line2.vertices.push(new THREE.Vector3( offx, offy, offz) );
		geometry_line2.vertices.push(new THREE.Vector3( offx, offy+lenline, offz) );
		var geometry_line3 = new THREE.Geometry();
		geometry_line3.vertices.push(new THREE.Vector3(  offx, offy, offz) );
		geometry_line3.vertices.push(new THREE.Vector3(  offx, offy, offz+lenline) );
		this.line1 = new THREE.Line( geometry_line1, material_line1 );
		this.line2 = new THREE.Line( geometry_line2, material_line2 );
		this.line3 = new THREE.Line( geometry_line3, material_line3 );
		this.scene.add( this.line1 );
		this.scene.add( this.line2 );
		this.scene.add( this.line3 );
		
		var geometry_line4 = new THREE.Geometry();
		geometry_line4.vertices.push(new THREE.Vector3( 0, 0, 0) );
		geometry_line4.vertices.push(new THREE.Vector3( 0, 0, 0) );
		var geometry_line5 = new THREE.Geometry();
		geometry_line5.vertices.push(new THREE.Vector3(  0, 0, 0) );
		geometry_line5.vertices.push(new THREE.Vector3(  0, 0, 0) );
		this.line4 = new THREE.Line( geometry_line4, material_line4 );
		this.line5 = new THREE.Line( geometry_line5, material_line5 );
		
		this.renderer = new THREE.WebGLRenderer( { canvas: myCanvas } );
		this.renderer.render( this.scene, this.camera );
		
		this.Ix = 0
		this.Iy = 0
		this.Iz = 0
		this.m = 10;
		
		this.dt = 0.05;
		this.time = 0.0;
		this.wx = 0;
		this.wy = 0;
		this.wz = 0;
		this.roll = 0;
		this.pitch = 0;
		this.yaw = 0;
		this.q1 = 0.0;
		this.q2 = 0.0;
		this.q3 = 0.0;
		this.q4 = 1.0;
		
		//this.campitch = 0;
		//this.camyaw = 0;
		this.mousedown = 0;
		this.mouse_x = 0;
		this.mouse_y = 0;
		this.mouse_dx = 0;
		this.mouse_dy = 0;
		
		this.text2 = document.createElement('div');
		this.text2.style.position = 'absolute';
		//this.text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
		this.text2.style.width = 100;
		this.text2.style.height = 100;
		this.text2.style.backgroundColor = "black";
		this.text2.style.color = "white";
		this.text2.innerHTML = "";
		this.text2.style.top = 390 + 'px';
		this.text2.style.left = 30 + 'px';
		document.body.appendChild(this.text2);
		
	}
	model_loaded(object) {
		this.scene.add(object);
	}
	reset_block() {
		this.scene.remove(this.mesh);
		this.geometry = new THREE.BoxGeometry( document.getElementById("blocky").value, 
			document.getElementById("blockz").value, document.getElementById("blockx").value );
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.scene.add( this.mesh );
		this.draw();
	}
	init() {
		this.wx = document.getElementById("slidevx").value*3.14159/180;
		this.wy = document.getElementById("slidevy").value*3.14159/180;
		this.wz = document.getElementById("slidevz").value*3.14159/180;
		var bx = document.getElementById("blockx").value;
		var by = document.getElementById("blocky").value;
		var bz = document.getElementById("blockz").value;
		this.Ix = (1/12.0)*this.m*(by*by + bz*bz);
		this.Iy = (1/12.0)*this.m*(bx*bx + bz*bz);
		this.Iz = (1/12.0)*this.m*(bx*bx + by*by);
		
		// Display Angular momentum vector
		var hx = this.Ix*this.wx;
		var hy = this.Iy*this.wy;
		var hz = this.Iz*this.wz;
		var hmag = Math.sqrt(hx*hx + hy*hy + hz*hz);
        if (hmag == 0) {
        	hmag = 1;
        }
        this.line5.geometry.vertices[1].x = 9*hy/hmag;
        this.line5.geometry.vertices[1].y = 9*hz/hmag;
        this.line5.geometry.vertices[1].z = 9*hx/hmag;
    	this.line5.geometry.verticesNeedUpdate = true;
		
	}
	update() {
		
		for (var i = 0; i < 5; i++) {
			var dwxdt = (this.Iy-this.Iz)*this.wy*this.wz/this.Ix;
    		var dwydt = (this.Iz-this.Ix)*this.wz*this.wx/this.Iy;
    		var dwzdt = (this.Ix-this.Iy)*this.wx*this.wy/this.Iz;
    		this.wx += dwxdt*this.dt/5;
			this.wy += dwydt*this.dt/5;
			this.wz += dwzdt*this.dt/5;
		}
		
		/*var ebn11 = 1.0;
		var ebn12 = Math.sin(this.roll)*Math.tan(this.pitch);
		var ebn13 = Math.cos(this.roll)*Math.tan(this.pitch);
        var ebn21 = 0.0;
        var ebn22 = Math.cos(this.roll);
        var ebn23 = -Math.sin(this.roll);
        var ebn31 = 0.0;
        var ebn32 = Math.sin(this.roll)*(1.0/Math.cos(this.pitch));
        var ebn33 = Math.cos(this.roll)*(1.0/Math.cos(this.pitch));
        
        var drdt = ebn11*this.wx + ebn12*this.wy + ebn13*this.wz;
        var dpdt = ebn21*this.wx + ebn22*this.wy + ebn23*this.wz;
        var dydt = ebn31*this.wx + ebn32*this.wy + ebn33*this.wz;
        this.roll += drdt*this.dt;
		this.pitch += dpdt*this.dt;
		this.yaw += dydt*this.dt;*/
        
        var dq1dt = 0.5*(this.wz*this.q2 - this.wy*this.q3 + this.wx*this.q4);
        var dq2dt = 0.5*(-this.wz*this.q1 + this.wx*this.q3 + this.wy*this.q4);
        var dq3dt = 0.5*(this.wy*this.q1 - this.wx*this.q2 + this.wz*this.q4);
        var dq4dt = 0.5*(-this.wx*this.q1 - this.wy*this.q2 - this.wz*this.q3);
        this.q1 += dq1dt*this.dt;
        this.q2 += dq2dt*this.dt;
        this.q3 += dq3dt*this.dt;
        this.q4 += dq4dt*this.dt;
        
        var mag = Math.sqrt(this.q1*this.q1 + this.q2*this.q2 + this.q3*this.q3 + this.q4*this.q4);
        this.q1 = this.q1/mag;
        this.q2 = this.q2/mag;
        this.q3 = this.q3/mag;
        this.q4 = this.q4/mag;
    	
    	// Transform angular velocity vector into world frame
    	var c11 = this.q1*this.q1 - this.q2*this.q2 - this.q3*this.q3 + this.q4*this.q4; 
		var c21 = 2*(this.q1*this.q2 + this.q3*this.q4); 
		var c31 = 2*(this.q1*this.q3 - this.q2*this.q4);
		var c12 = 2*(this.q1*this.q2 - this.q3*this.q4);
		var c22 = -this.q1*this.q1 + this.q2*this.q2 - this.q3*this.q3 + this.q4*this.q4; 
		var c32 = 2*(this.q2*this.q3 + this.q1*this.q4);
		var c13 = 2*(this.q1*this.q3 + this.q2*this.q4);
		var c23 = 2*(this.q2*this.q3 - this.q1*this.q4);
		var c33 = -this.q1*this.q1 - this.q2*this.q2 + this.q3*this.q3 + this.q4*this.q4;
		
		var wx2 = c11*this.wx + c12*this.wy + c13*this.wz;
		var wy2 = c21*this.wx + c22*this.wy + c23*this.wz;
		var wz2 = c31*this.wx + c32*this.wy + c33*this.wz;
    	
    	// Display Angular velocity vector
        //var wmag = Math.sqrt(this.wx*this.wx + this.wy*this.wy + this.wz*this.wz)
        var wmag = Math.sqrt(wx2*wx2 + wy2*wy2 + wz2*wz2)
        if (wmag == 0) {
        	wmag = 1;
        }
        this.line4.geometry.vertices[1].x = 10*wy2/wmag;
        this.line4.geometry.vertices[1].y = 10*wz2/wmag;
        this.line4.geometry.vertices[1].z = 10*wx2/wmag;
    	this.line4.geometry.verticesNeedUpdate = true;
    	
    	// time display
    	this.time += this.dt;
    	var num = new Number(this.time);
    	this.text2.innerHTML = num.toPrecision(3) + " s";
    	
    	// Pause/finish sim at 10 seconds
    	if (this.time >= 60.0) {
    		clearInterval(this.interval);
    	}
        
	}
	draw() {
		
		// Update rotating object
		//setobject_euler(this.mesh,this.roll,this.pitch,this.yaw)
		setobject_quat(this.mesh,this.q1,this.q2,this.q3,this.q4)

		// Update camera pointing
		var pitch = this.campitch + 0.005*simenvir.mouse_dy;
		var yaw = this.camyaw + 0.005*simenvir.mouse_dx;
		pantilt_camera(this.camera,pitch,yaw);
		
		this.renderer.render( this.scene, this.camera );
	}
	reset() {
		this.time = 0.0;
		this.roll = 0
		this.pitch = 0
		this.yaw = 0
		this.q1 = 0.0;
		this.q2 = 0.0;
		this.q3 = 0.0;
		this.q4 = 1.0;
		this.text2.innerHTML = "";
		this.line4.geometry.vertices[1].x = 0.0;
        this.line4.geometry.vertices[1].y = 0.0;
        this.line4.geometry.vertices[1].z = 0.0;
    	this.line4.geometry.verticesNeedUpdate = true;
    	this.line5.geometry.vertices[1].x = 0.0;
        this.line5.geometry.vertices[1].y = 0.0;
        this.line5.geometry.vertices[1].z = 0.0;
    	this.line5.geometry.verticesNeedUpdate = true;
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
	object.matrix.set( c22, c23, c21, 0,
		c32, c33, c31, 0,
		c12, c13, c11, 0,
		0, 0, 0, 1 );
	object.matrixAutoUpdate = false;
}

function setobject_quat(object,q1,q2,q3,q4) {
	/*var c11 = q1*q1 + q2*q2 - q3*q3 - q4*q4; 
	var c12 = 2*(q2*q3 - q1*q4); 
	var c13 = 2*(q2*q4 + q1*q3);
	var c21 = 2*(q2*q3 + q1*q4);
	var c22 = q1*q1 - q2*q2 + q3*q3 - q4*q4; 
	var c23 = 2*(q3*q4 - q1*q2);
	var c31 = 2*(q2*q4 - q1*q3);
	var c32 = 2*(q3*q4 + q1*q2);
	var c33 = q1*q1 - q2*q2 - q3*q3 + q4*q4;*/
	var c11 = q1*q1 - q2*q2 - q3*q3 + q4*q4; 
	var c21 = 2*(q1*q2 + q3*q4); 
	var c31 = 2*(q1*q3 - q2*q4);
	var c12 = 2*(q1*q2 - q3*q4);
	var c22 = -q1*q1 + q2*q2 - q3*q3 + q4*q4; 
	var c32 = 2*(q2*q3 + q1*q4);
	var c13 = 2*(q1*q3 + q2*q4);
	var c23 = 2*(q2*q3 - q1*q4);
	var c33 = -q1*q1 - q2*q2 + q3*q3 + q4*q4;
	object.matrix.set( c22, c23, c21, 0,
		c32, c33, c31, 0,
		c12, c13, c11, 0,
		0, 0, 0, 1 );
	object.matrixAutoUpdate = false;
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
function StartSim() {
	simenvir.init();
	document.getElementById("blockx").disabled = 1
    document.getElementById("blocky").disabled = 1
    document.getElementById("blockz").disabled = 1
    document.getElementById("slidebx").disabled = 1
    document.getElementById("slideby").disabled = 1
    document.getElementById("slidebz").disabled = 1
    document.getElementById("angvx").disabled = 1
    document.getElementById("angvy").disabled = 1
    document.getElementById("angvz").disabled = 1
    document.getElementById("slidevx").disabled = 1
    document.getElementById("slidevy").disabled = 1
    document.getElementById("slidevz").disabled = 1
    document.getElementById("start_button").disabled = 1
	simenvir.interval = setInterval(cycle, 50);
}
function ResetSim() {
    clearInterval(simenvir.interval);
    simenvir.campitch = 0.3;
	simenvir.camyaw = -0.4;
	pantilt_camera(simenvir.camera,simenvir.campitch,simenvir.camyaw);
    simenvir.reset();
    setparamvalue(5,0);
    setparamvalue(5,1);
    setparamvalue(5,2);
    setparamvalue(0,3);
    setparamvalue(0,4);
    setparamvalue(0,5);
    document.getElementById("blockx").disabled = 0
    document.getElementById("blocky").disabled = 0
    document.getElementById("blockz").disabled = 0
    document.getElementById("slidebx").disabled = 0
    document.getElementById("slideby").disabled = 0
    document.getElementById("slidebz").disabled = 0
    document.getElementById("angvx").disabled = 0
    document.getElementById("angvy").disabled = 0
    document.getElementById("angvz").disabled = 0
    document.getElementById("slidevx").disabled = 0
    document.getElementById("slidevy").disabled = 0
    document.getElementById("slidevz").disabled = 0
    document.getElementById("start_button").disabled = 0
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
function switchaxisonoff(value) {
	if (value == 0)  {
		simenvir.scene.remove( simenvir.line1 );
		simenvir.scene.remove( simenvir.line2 );
		simenvir.scene.remove( simenvir.line3 );
	}
	else {
	 	simenvir.scene.add( simenvir.line1 );
		simenvir.scene.add( simenvir.line2 );
		simenvir.scene.add( simenvir.line3 );
	}
	simenvir.draw()
}
function switchonoff_angvel(value) {
	if (value == 0)  {
		simenvir.scene.remove( simenvir.line4 );
	}
	else {
	 	simenvir.scene.add( simenvir.line4 );
	}
	simenvir.draw()
}
function switchonoff_angmom(value) {
	if (value == 0)  {
		simenvir.scene.remove( simenvir.line5 );
	}
	else {
	 	simenvir.scene.add( simenvir.line5 );
	}
	simenvir.draw()
}
function setparamvalue(val,inputnum) {
	switch (inputnum) {
		case 0:
			if (val > 10) {
				val = 10;
			}
			else if (val < 1) {
				val = 1;
			}
			document.getElementById("slidebx").value = val;
			document.getElementById("blockx").value = val;
			simenvir.reset_block()
			break;
		case 1:
			if (val > 10) {
				val = 10;
			}
			else if (val < 1) {
				val = 1;
			}
			document.getElementById("slideby").value = val;
			document.getElementById("blocky").value = val;
			simenvir.reset_block()
			break;
		case 2:
			if (val > 10) {
				val = 10;
			}
			else if (val < 1) {
				val = 1;
			}
			document.getElementById("slidebz").value = val;
			document.getElementById("blockz").value = val;
			simenvir.reset_block()
			break;
		case 3:
			if (val > 100) {
				val = 100;
			}
			else if (val < -100) {
				val = -100;
			}
			document.getElementById("slidevx").value = val;
			document.getElementById("angvx").value = val;
			break;
		case 4:
			if (val > 100) {
				val = 100;
			}
			else if (val < -100) {
				val = -100;
			}
			document.getElementById("slidevy").value = val;
			document.getElementById("angvy").value = val;
			break;
		case 5:
			if (val > 100) {
				val = 100;
			}
			else if (val < -100) {
				val = -100;
			}
			document.getElementById("slidevz").value = val;
			document.getElementById("angvz").value = val;
			break;
	}
}


