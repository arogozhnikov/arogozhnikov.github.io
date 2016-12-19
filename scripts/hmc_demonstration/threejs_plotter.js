let vertex_shader_text = ` 			
varying vec2 uv_fragment;
varying vec3 pos;
varying vec3 normal_fragment;

void main()
{
	uv_fragment = uv;
	normal_fragment = normal;
	pos = position;
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}
`;

let fragment_shader_text = ` 			
// uniform vec2 resolution;
// uniform vec3 cameraPosition; predefined
uniform float display_zmax;
uniform vec3 min_height_color;
uniform vec3 max_height_color;
varying vec2 uv_fragment;
varying vec3 pos;
varying vec3 normal_fragment;

void main( void ) {
	float height = pos.y / display_zmax; 

	vec2 position = uv_fragment;

	if(height > 1.){
		discard;
	}
	vec3 from_camera = normalize(pos - cameraPosition);
	vec3 to_light =  vec3( 0.0, 1.0, 0.0 );
	vec3 n_normal_fragment = normalize(normal_fragment);

	float _specular = max(dot(from_camera, reflect(to_light, n_normal_fragment) ), 0.);
	vec3 specular = pow(_specular, 6.5) * vec3(0.38, 0.34, 0.32);

	// normal affects alpha
	float alpha_from_angle = 1. / (1. + exp(- 6. *  dot(from_camera, n_normal_fragment)));
	float stripes_color = max(5. * (sin(height * 10. * 6.28) - 0.95), 0.);

	// vec3 height_color = vec3(height_ * 0.7, 0.2, (1. - height_) * 0.5);
	// vec3 height_color = height_ * vec3(1., 1., 1.);
	vec3 height_color = min_height_color + (max_height_color - min_height_color) * height; 

	gl_FragColor = vec4(specular + height_color + stripes_color,
						0.15 + 0.85 * alpha_from_angle);

}
`;

// line that can is drawn starting from one end dynamically
class DynamicLine {
	constructor(color=0xff0000){
		let material = new THREE.LineBasicMaterial( { color : color, linewidth: 2 } );
		this.line = new THREE.Line(new THREE.BufferGeometry(), material);		
		this.line.translateY(5e-3);
	}

	set_points(points_list){
		
		let vectors = [];
		var positions = new Float32Array( points_list.length * 3 ); 

		for (let i = 0; i < points_list.length; i += 1) {
			let [x, y, z] = points_list[i];
			positions[3 * i + 0] = x;
			positions[3 * i + 1] = z;
			positions[3 * i + 2] = y;
		}
		let geometry = new THREE.BufferGeometry();
		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.vertices = vectors;
		this.line.geometry.dispose();
		this.line.geometry = geometry;
		this.n_visible = 0;
	}

	flush() {
		this.n_visible = 0;
		this.line.geometry.setDrawRange( 0, this.n_visible + 1);
	}

	add_visible (){
		this.n_visible += 1;
		this.line.geometry.setDrawRange( 0, this.n_visible + 1);
		return;
	}
}


class DynamicPoints{
	constructor(max_points) {
		let point_material = new THREE.PointsMaterial( { size: 0.01, vertexColors: THREE.VertexColors } );

		this.positions = new Float32Array( max_points * 3 );
		this.colors = new Float32Array( max_points * 3 );

		let point_geometry = new THREE.BufferGeometry();
		point_geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
		point_geometry.addAttribute( 'color', new THREE.BufferAttribute( this.colors, 3 ) );

		this.points = new THREE.Points(point_geometry, point_material);
		this.points.translateY(5e-3);
		this.n_visible = 0;
		this.flush();
	}

	flush() {
		this.n_visible = 0;
		this.points.geometry.setDrawRange( 0, this.n_visible);
	}

	set_points(positions, color) {
		for(let position of positions) {
			let [x, y, z] = position;
			let i = this.n_visible;
			this.positions[ 3 * i + 0 ] = x;
			this.positions[ 3 * i + 1 ] = z;
			this.positions[ 3 * i + 2 ] = y;
			this.colors[ 3 * i + 0 ] = color[0];
			this.colors[ 3 * i + 1 ] = color[1],
			this.colors[ 3 * i + 2 ] = color[2];
			this.n_visible += 1;
		}
		
		this._update();
	}

	_update() {
		this.points.geometry.attributes['position'].needsUpdate = true;
		this.points.geometry.attributes['color'].needsUpdate = true;
		this.points.geometry.setDrawRange( 0, this.n_visible);
		this.points.geometry.computeBoundingSphere();
	}

	add_point(position, color) {
		let i = this.n_visible;
		let [x, y, z] = position;

		this.positions[ 3 * i + 0 ] = x;
		this.positions[ 3 * i + 1 ] = z;
		this.positions[ 3 * i + 2 ] = y;

		this.colors[ 3 * i + 0 ] = color[0];
		this.colors[ 3 * i + 1 ] = color[1],
		this.colors[ 3 * i + 2 ] = color[2];
		this.n_visible += 1;

		this._update();
	}

	
}


class Plot3D{
	constructor(parentElement, {
		width=800,
		height=400,
		xmin = -1., 
		xmax = 1.,
		ymin = -1., 
		ymax = 1.,
		zmin = 0.,
		zmax = 1.,
		display_zmax=0.35,
		controlsDomElement=null,
	} = { }){
		this.xmin = xmin;
		this.xmax = xmax;
		this.ymin = ymin;
		this.ymax = ymax;
		this.zmin = zmin;
		this.zmax = zmax;
		this.display_zmax = display_zmax;

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);

		this.camera.position.z = 0.36;
		this.camera.position.x = -0.56;
		this.camera.position.y = this.display_zmax * 2.;

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(width, height);
		this.renderer.setPixelRatio(1);
		this.renderer.setClearColor(0xbbbbbb, 1);

		this.domElement = this.renderer.domElement;
		this.domElement.classList.add("main-canvas");

		parentElement.appendChild(this.domElement);
		parentElement.style.height = height + 'px';

		this.orbit = new THREE.OrbitControls(this.camera, controlsDomElement || this.renderer.domElement);
		this.orbit.enableDamping = true;
		this.orbit.dampingFactor = 0.25;
		this.orbit.minPolarAngle = Math.PI * 0.05;
		this.orbit.maxPolarAngle = Math.PI * 0.7;
		this.orbit.minDistance = 0.3;
		this.orbit.maxDistance = 1.5;
		this.orbit.enableKeys = false;
		this.orbit.target = new THREE.Vector3(0.5, 0.33 * this.display_zmax, 0.5);
		this.orbit.onUpdate.push( () => requestAnimationFrame(() => {this.redraw();}) );
	}
	
	normalize(func){
		// maps from [xmin, xmax], [ymin, ymax], [zmin, zmax] to [0, 1]^3
		let new_function = (u, v) => {
			let x = this.xmin + u * (this.xmax - this.xmin);
			let y = this.ymin + v * (this.ymax - this.ymin);
			let result = func(x, y);
			return (result - this.zmin) * 1. / (this.zmax - this.zmin) * this.display_zmax;
		}
		return new_function
	}

	normalize_point(point){
		let [x, y, z] = point;
		x = (x - this.xmin) / (this.xmax - this.xmin);
		z = (z - this.zmin) / (this.zmax - this.zmin) * this.display_zmax;
		y = (y - this.ymin) / (this.ymax - this.ymin);
		return [x, y, z];
	}

	to_vertex(uv_function){
		let new_function = function(u, v){
			return new THREE.Vector3(u, uv_function(u, v), v);
		}
		return new_function
	}

	addCoordinateGrid(n_points=10){
		let plane = new THREE.GridHelper(0.5, n_points, 0x0000ff, 0x808080 );
		plane.position.x = 0.5;
		plane.position.z = 0.5;
		this.scene.add(plane);

		return plane;
	}

	generateSurfaceGeometry(func, n_edges=50) {
		func = this.normalize(func);
		return new THREE.ParametricGeometry(this.to_vertex(func), n_edges, n_edges);
	}

	addSurfaceMesh(
		func, 
		min_height_color=new THREE.Vector3(0.0, 0.0, 0.0), 
		max_height_color=new THREE.Vector3(0.8, 0.8, 0.8) 
	) {
		var mesh = new THREE.Object3D()
		let geometry = this.generateSurfaceGeometry(func);

		let options = {
			uniforms: { 
				display_zmax: {value: this.display_zmax},
				min_height_color: {value: min_height_color}, 
				max_height_color: {value: max_height_color}, 
			},
			vertexShader: vertex_shader_text,
			fragmentShader: fragment_shader_text,
			side: THREE.BackSide,
			transparent: true,	
		};
		var shader_material_back = new THREE.ShaderMaterial(options);
		options['side'] = THREE.FrontSide;
		var shader_material_front = new THREE.ShaderMaterial(options);

		mesh.add(new THREE.Mesh(geometry, shader_material_back));
		mesh.add(new THREE.Mesh(geometry, shader_material_front));

		this.scene.add(mesh);
		return mesh;
	}

	addDynamicLine(color=0xff0000) {
		let line = new DynamicLine();
		this.scene.add(line.line);
		return line;
	}

	addDynamicPoints({max_points=2000}={}){
		var points = new DynamicPoints(max_points);
		this.scene.add(points.points);
		return points;
	}

	redraw () {
		// required if controls.enableDamping = true, or if controls.autoRotate = true
		this.orbit.update();
		this.renderer.render(this.scene, this.camera);
	}

}

