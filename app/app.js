define([
	'jquery', 'objects/Ship', 'objects/Box', 'Camera', 'KeyHandler', 'PointerLock', 'programs/ClassicProgram', 'lights/Light'
],
function($, Ship, Box, Camera, KeyHandler, PointerLock, ClassicProgram, Light) {


	// SETUP START
	window.gl = new GL(c);

	var keys = new KeyHandler();
	keys.startListening();

	//var pointerLock = new PointerLock(c);

	// SETUP END

	var program = new ClassicProgram();


	var xOffset = 0;
	var last = false;

	var box;
	for (var i=0; i<100; i++) {
		if (i > 10 && !last && Math.round(Math.random() * 10) == 5) {
			last = true;
			continue;
		}
		last = false;
		box = new Box(0.8, 0.05, 1.6);

		if (i > 3) xOffset += (Math.random() - 0.5) / 2;
		box.setPosition(box.x + xOffset, box.y +  1.6 * i, -0.2);
		program.addObject(box);
	}


	box = new Box(0.4, 0.2, 1.6);
	box.y += 1.6*4;
	box.z += 0.2;
	program.addObject(box);






	// LIGHTS
	var lantern = new Box(0.05, 0.05, 0.05);
	lantern.setColor(1, 1, 0);
	lantern.material.emission = [1, 1, 0.5, 1.0];
	lantern.setPosition(-0.8, 0.8, 0.2);
	program.addObject(lantern);

	var light = new Light();
	light.setPosition(lantern.x, lantern.y, lantern.z);
	program.addLight(light);



	var lantern2 = new Box(0.05, 0.05, 0.05);
	lantern2.setColor(1, 1, 0);
	lantern2.material.emission = [1, 1, 0.5, 1.0];
	lantern2.setPosition(0, 3.5, 0.2);
	program.addObject(lantern2);

	var light2 = new Light();
	light2.attQ = 2;

	light2.setPosition(lantern2.x, lantern2.y, lantern2.z);
	program.addLight(light2);


	var spaceShipLight = new Light();
	spaceShipLight.attL = 0.1;
	spaceShipLight.setColor(0.1, 0.1, 0.1);
	program.addLight(spaceShipLight);







	var pMatrix = mat4.create();



	var spaceship = new Ship();
	program.addObject(spaceship);

	setTimeout(function() {
		GL.animate(redraw);
		redraw();
	}, 0);



	var yPosition = 0;

	var cameraX = 0;
	var cameraY = -1.0;
	var cameraZ = 0.35;

	var camera = new Camera(cameraX, cameraY, cameraZ);
	camera.setCenter(0.4, 1.0, 0.35);
	camera.computeUp();

	program.addCamera(camera);

	window.camera = camera;
	window.program = program;



	var staticCamera1 = new Camera(-1.0, 0.9, 0.4);
	staticCamera1.setCenter(0, 1.0, 0.35);
	staticCamera1.computeUp();
	program.addCamera(staticCamera1);

	var staticCamera2 = new Camera(2.0, -1.0, 0.4);
	staticCamera2.setCenter(0, 1.0, 0.35);
	staticCamera2.computeUp();
	program.addCamera(staticCamera2);




	function handleKeys(ms) {
		if (keys.isDown('LEFT')) {
			spaceship.x -= spaceship.xSpeed * ms;
			camera.x -= spaceship.xSpeed * ms;
		} else if (keys.isDown('RIGHT')) {
			spaceship.x += spaceship.xSpeed * ms;
			camera.x += spaceship.xSpeed * ms;
		}

		if (keys.isDown('UP') && spaceship.speed < spaceship.maxSpeed) {
			spaceship.speed += 0.3 * ms;
		} else if (keys.isDown('DOWN')  && spaceship.speed > -spaceship.maxSpeed) {
			spaceship.speed -= 0.3 * ms;
		}

		if (keys.isDown('SPACE') && spaceship.jumping == false) {
			spaceship.jumpSpeed = 0.08;
			spaceship.jumping = true;
		}
		if (spaceship.jumping) {
			spaceship.z += spaceship.jumpSpeed;
			spaceship.jumpSpeed -= 0.3 * ms;
			if (spaceship.z < 0.15) {
				spaceship.z = 0.15;
				spaceship.jumping = false;
			}
		}

		var centerX = Math.sin(GL.degToRad(program.getCamera().rotateX)) * 2;
		var centerY = Math.cos(GL.degToRad(program.getCamera().rotateX)) * 2;
		var centerZ = -Math.sin(GL.degToRad(program.getCamera().rotateY)) * 2;


		if (keys.isDown('I')) {
			program.getCamera().y += centerY / 20;
			program.getCamera().x += centerX / 20;
			program.getCamera().z += centerZ / 20;
			program.getCamera().computeUp();
		} else if (keys.isDown('K')) {
			program.getCamera().y -= centerY / 20;
			program.getCamera().x -= centerX / 20;
			program.getCamera().z -= centerZ / 20;
			program.getCamera().computeUp();
		}

		if (keys.isDown('J')) {
			program.getCamera().rotateX -= 5;
		} else if (keys.isDown('L')) {
			program.getCamera().rotateX += 5;
		} else if (keys.isDown('U')) {
			program.getCamera().rotateY += 2;
		} else if (keys.isDown('O')) {
			program.getCamera().rotateY -= 2;
		} else if (keys.isDown('M')) {
			program.getCamera().rotateX = 0;
			program.getCamera().rotateY = 0;
			program.getCamera().x = spaceship.x;
			program.getCamera().y = spaceship.y - 1.0;
			program.getCamera().z = 0.35;
		} else if (keys.isDown('H')) {

			program.nextCamera();

			/*

			var newSelectedCamera = (selectedCamera + 1) % 3;

			//if (newSelectedCamera == 0) {

				var dynamicCamera = [
					[cameraX, cameraY + yPosition, cameraZ + 0.05], // eye xyz
					[cameraX + centerX, cameraY + centerY + yPosition, cameraZ], // center xyz
					[0.0, 0.0, 1.0]   // up vector
				];

				if (newSelectedCamera == 0) {
					camera.transition.start(staticCameras[1], dynamicCamera);
				} else if (newSelectedCamera == 1) {
					camera.transition.start(dynamicCamera, staticCameras[0]);
				} else if (newSelectedCamera == 2) {
					camera.transition.start(staticCameras[0], staticCameras[1]);
				}
			//}
			selectedCamera = newSelectedCamera;
			*/


			keys.setKey('H', false);
		}
	}


	function redraw(fps) {

		//light.y += 0.001;
		//lantern.y  = light.y;
		spaceShipLight.x = spaceship.x;
		spaceShipLight.y = spaceship.y;
		spaceShipLight.z = spaceship.z + 1;


		document.querySelector('output').innerHTML = Math.round(1000 / fps);

		var ms = fps / 1000;



		//if (!program.getCamera().transition.enabled) {
		handleKeys(ms);
		//}

		//if (!program.getCamera().transition.enabled) {

			spaceship.speed *= 0.96;
			yPosition += spaceship.speed;
			spaceship.y = yPosition;
			camera.y += spaceship.speed;


			// od 0.001 do 0.009


			var centerX = Math.sin(GL.degToRad(program.getCamera().rotateX)) * 2;
			var centerY = Math.cos(GL.degToRad(program.getCamera().rotateX)) * 2;
			var centerZ = -Math.sin(GL.degToRad(program.getCamera().rotateY)) * 2;

			//if (selectedCamera == 0) {

				//camera.setPosition(camera.x, camera.y + yPosition, cameraZ + 0.05);
				program.getCamera().setCenter(
					program.getCamera().x + centerX,
					program.getCamera().y + centerY,
					program.getCamera().z + centerZ
				);
				program.getCamera().computeUp();
			/*} else {
				var camVectors = staticCameras[selectedCamera - 1];
				camera.setPosition.apply(camera, camVectors[0]);
				camera.setCenter.apply(camera, camVectors[1]);
				camera.setUp.apply(camera, camVectors[2]);
			}*/


		//}
		/*
		 else {
			var camVectors = camera.transition.getStep(camera.transition.step++);
			if (camera.transition.step >= 9) camera.transition.stop();
			camera.setPosition.apply(camera, camVectors[0]);
			camera.setCenter.apply(camera, camVectors[1]);
			camera.setUp.apply(camera, camVectors[2]);
		}

		mat4.multiply(pMatrix, mProjection, camera.getMatrix());
		*/

		gl.clear();
		program.draw();


		if (keys.isDown('LEFT')) {
			spaceship.rotateY = -10;
			//mat4.rotateZ(spaceship.transform, spaceship.transform, GL.degToRad(-10));
		} else if (keys.isDown('RIGHT')) {
			spaceship.rotateY = 10;
			//mat4.rotateZ(spaceship.transform, spaceship.transform, GL.degToRad(10));
		} else {
			spaceship.rotateY = 0;
		}

	}



	var mouse = {
		init: true
	};



	document.addEventListener('mousemove', function(e) {
		return;
		if (!mouse.init) {
			program.getCamera().rotateX += e.webkitMovementX / 5;
			program.getCamera().rotateY += e.webkitMovementY / 5;
		}

		if (mouse.init) mouse.init = false;
	});



	return {
		start: function() {
			console.log('app started');
		}
	}
});