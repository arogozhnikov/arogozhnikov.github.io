'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var vertex_shader_text = ' \t\t\t\nvarying vec2 uv_fragment;\nvarying vec3 pos;\nvarying vec3 normal_fragment;\n\nvoid main()\n{\n\tuv_fragment = uv;\n\tnormal_fragment = normal;\n\tpos = position;\n\tvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\tgl_Position = projectionMatrix * mvPosition;\n}\n';

var fragment_shader_text = ' \t\t\t\n// uniform vec2 resolution;\n// uniform vec3 cameraPosition; predefined\nuniform float display_zmax;\nuniform vec3 min_height_color;\nuniform vec3 max_height_color;\nvarying vec2 uv_fragment;\nvarying vec3 pos;\nvarying vec3 normal_fragment;\n\nvoid main( void ) {\n\tfloat height = pos.y / display_zmax; \n\n\tvec2 position = uv_fragment;\n\n\tif(height > 1.){\n\t\tdiscard;\n\t}\n\tvec3 from_camera = normalize(pos - cameraPosition);\n\tvec3 to_light =  vec3( 0.0, 1.0, 0.0 );\n\tvec3 n_normal_fragment = normalize(normal_fragment);\n\n\tfloat _specular = max(dot(from_camera, reflect(to_light, n_normal_fragment) ), 0.);\n\tvec3 specular = pow(_specular, 6.5) * vec3(0.38, 0.34, 0.32);\n\n\t// normal affects alpha\n\tfloat alpha_from_angle = 1. / (1. + exp(- 6. *  dot(from_camera, n_normal_fragment)));\n\tfloat stripes_color = max(5. * (sin(height * 10. * 6.28) - 0.95), 0.);\n\n\t// vec3 height_color = vec3(height_ * 0.7, 0.2, (1. - height_) * 0.5);\n\t// vec3 height_color = height_ * vec3(1., 1., 1.);\n\tvec3 height_color = min_height_color + (max_height_color - min_height_color) * height; \n\n\tgl_FragColor = vec4(specular + height_color + stripes_color,\n\t\t\t\t\t\t0.15 + 0.85 * alpha_from_angle);\n\n}\n';

// line that can is drawn starting from one end dynamically

var DynamicLine = function () {
	function DynamicLine() {
		var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0xff0000;

		_classCallCheck(this, DynamicLine);

		var material = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
		this.line = new THREE.Line(new THREE.BufferGeometry(), material);
		this.line.translateY(5e-3);
	}

	_createClass(DynamicLine, [{
		key: 'set_points',
		value: function set_points(points_list) {

			var vectors = [];
			var positions = new Float32Array(points_list.length * 3);

			for (var i = 0; i < points_list.length; i += 1) {
				var _points_list$i = _slicedToArray(points_list[i], 3),
				    x = _points_list$i[0],
				    y = _points_list$i[1],
				    z = _points_list$i[2];

				positions[3 * i + 0] = x;
				positions[3 * i + 1] = z;
				positions[3 * i + 2] = y;
			}
			var geometry = new THREE.BufferGeometry();
			geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
			geometry.vertices = vectors;
			this.line.geometry.dispose();
			this.line.geometry = geometry;
			this.n_visible = 0;
		}
	}, {
		key: 'flush',
		value: function flush() {
			this.n_visible = 0;
			this.line.geometry.setDrawRange(0, this.n_visible + 1);
		}
	}, {
		key: 'add_visible',
		value: function add_visible() {
			this.n_visible += 1;
			this.line.geometry.setDrawRange(0, this.n_visible + 1);
			return;
		}
	}]);

	return DynamicLine;
}();

var DynamicPoints = function () {
	function DynamicPoints(max_points) {
		_classCallCheck(this, DynamicPoints);

		var point_material = new THREE.PointsMaterial({ size: 0.01, vertexColors: THREE.VertexColors });

		this.positions = new Float32Array(max_points * 3);
		this.colors = new Float32Array(max_points * 3);

		var point_geometry = new THREE.BufferGeometry();
		point_geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
		point_geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3));

		this.points = new THREE.Points(point_geometry, point_material);
		this.points.translateY(5e-3);
		this.n_visible = 0;
		this.flush();
	}

	_createClass(DynamicPoints, [{
		key: 'flush',
		value: function flush() {
			this.n_visible = 0;
			this.points.geometry.setDrawRange(0, this.n_visible);
		}
	}, {
		key: 'set_points',
		value: function set_points(positions, color) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = positions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var position = _step.value;

					var _position = _slicedToArray(position, 3),
					    x = _position[0],
					    y = _position[1],
					    z = _position[2];

					var i = this.n_visible;
					this.positions[3 * i + 0] = x;
					this.positions[3 * i + 1] = z;
					this.positions[3 * i + 2] = y;
					this.colors[3 * i + 0] = color[0];
					this.colors[3 * i + 1] = color[1], this.colors[3 * i + 2] = color[2];
					this.n_visible += 1;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			this._update();
		}
	}, {
		key: '_update',
		value: function _update() {
			this.points.geometry.attributes['position'].needsUpdate = true;
			this.points.geometry.attributes['color'].needsUpdate = true;
			this.points.geometry.setDrawRange(0, this.n_visible);
			this.points.geometry.computeBoundingSphere();
		}
	}, {
		key: 'add_point',
		value: function add_point(position, color) {
			var i = this.n_visible;

			var _position2 = _slicedToArray(position, 3),
			    x = _position2[0],
			    y = _position2[1],
			    z = _position2[2];

			this.positions[3 * i + 0] = x;
			this.positions[3 * i + 1] = z;
			this.positions[3 * i + 2] = y;

			this.colors[3 * i + 0] = color[0];
			this.colors[3 * i + 1] = color[1], this.colors[3 * i + 2] = color[2];
			this.n_visible += 1;

			this._update();
		}
	}]);

	return DynamicPoints;
}();

var Plot3D = function () {
	function Plot3D(parentElement) {
		var _this = this;

		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		    _ref$width = _ref.width,
		    width = _ref$width === undefined ? 800 : _ref$width,
		    _ref$height = _ref.height,
		    height = _ref$height === undefined ? 400 : _ref$height,
		    _ref$xmin = _ref.xmin,
		    xmin = _ref$xmin === undefined ? -1. : _ref$xmin,
		    _ref$xmax = _ref.xmax,
		    xmax = _ref$xmax === undefined ? 1. : _ref$xmax,
		    _ref$ymin = _ref.ymin,
		    ymin = _ref$ymin === undefined ? -1. : _ref$ymin,
		    _ref$ymax = _ref.ymax,
		    ymax = _ref$ymax === undefined ? 1. : _ref$ymax,
		    _ref$zmin = _ref.zmin,
		    zmin = _ref$zmin === undefined ? 0. : _ref$zmin,
		    _ref$zmax = _ref.zmax,
		    zmax = _ref$zmax === undefined ? 1. : _ref$zmax,
		    _ref$display_zmax = _ref.display_zmax,
		    display_zmax = _ref$display_zmax === undefined ? 0.35 : _ref$display_zmax,
		    _ref$controlsDomEleme = _ref.controlsDomElement,
		    controlsDomElement = _ref$controlsDomEleme === undefined ? null : _ref$controlsDomEleme;

		_classCallCheck(this, Plot3D);

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
		this.orbit.onUpdate.push(function () {
			return requestAnimationFrame(function () {
				_this.redraw();
			});
		});
	}

	_createClass(Plot3D, [{
		key: 'normalize',
		value: function normalize(func) {
			var _this2 = this;

			// maps from [xmin, xmax], [ymin, ymax], [zmin, zmax] to [0, 1]^3
			var new_function = function new_function(u, v) {
				var x = _this2.xmin + u * (_this2.xmax - _this2.xmin);
				var y = _this2.ymin + v * (_this2.ymax - _this2.ymin);
				var result = func(x, y);
				return (result - _this2.zmin) * 1. / (_this2.zmax - _this2.zmin) * _this2.display_zmax;
			};
			return new_function;
		}
	}, {
		key: 'normalize_point',
		value: function normalize_point(point) {
			var _point = _slicedToArray(point, 3),
			    x = _point[0],
			    y = _point[1],
			    z = _point[2];

			x = (x - this.xmin) / (this.xmax - this.xmin);
			z = (z - this.zmin) / (this.zmax - this.zmin) * this.display_zmax;
			y = (y - this.ymin) / (this.ymax - this.ymin);
			return [x, y, z];
		}
	}, {
		key: 'to_vertex',
		value: function to_vertex(uv_function) {
			var new_function = function new_function(u, v) {
				return new THREE.Vector3(u, uv_function(u, v), v);
			};
			return new_function;
		}
	}, {
		key: 'addCoordinateGrid',
		value: function addCoordinateGrid() {
			var n_points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

			var plane = new THREE.GridHelper(0.5, n_points, 0x0000ff, 0x808080);
			plane.position.x = 0.5;
			plane.position.z = 0.5;
			this.scene.add(plane);

			return plane;
		}
	}, {
		key: 'generateSurfaceGeometry',
		value: function generateSurfaceGeometry(func) {
			var n_edges = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

			func = this.normalize(func);
			return new THREE.ParametricGeometry(this.to_vertex(func), n_edges, n_edges);
		}
	}, {
		key: 'addSurfaceMesh',
		value: function addSurfaceMesh(func) {
			var min_height_color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new THREE.Vector3(0.0, 0.0, 0.0);
			var max_height_color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new THREE.Vector3(0.8, 0.8, 0.8);

			var mesh = new THREE.Object3D();
			var geometry = this.generateSurfaceGeometry(func);

			var options = {
				uniforms: {
					display_zmax: { value: this.display_zmax },
					min_height_color: { value: min_height_color },
					max_height_color: { value: max_height_color }
				},
				vertexShader: vertex_shader_text,
				fragmentShader: fragment_shader_text,
				side: THREE.BackSide,
				transparent: true
			};
			var shader_material_back = new THREE.ShaderMaterial(options);
			options['side'] = THREE.FrontSide;
			var shader_material_front = new THREE.ShaderMaterial(options);

			mesh.add(new THREE.Mesh(geometry, shader_material_back));
			mesh.add(new THREE.Mesh(geometry, shader_material_front));

			this.scene.add(mesh);
			return mesh;
		}
	}, {
		key: 'addDynamicLine',
		value: function addDynamicLine() {
			var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0xff0000;

			var line = new DynamicLine();
			this.scene.add(line.line);
			return line;
		}
	}, {
		key: 'addDynamicPoints',
		value: function addDynamicPoints() {
			var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    _ref2$max_points = _ref2.max_points,
			    max_points = _ref2$max_points === undefined ? 2000 : _ref2$max_points;

			var points = new DynamicPoints(max_points);
			this.scene.add(points.points);
			return points;
		}
	}, {
		key: 'redraw',
		value: function redraw() {
			// required if controls.enableDamping = true, or if controls.autoRotate = true
			this.orbit.update();
			this.renderer.render(this.scene, this.camera);
		}
	}]);

	return Plot3D;
}();

//# sourceMappingURL=threejs_plotter-compiled.js.map