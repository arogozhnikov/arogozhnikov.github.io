"use strict";

//
// TODO твиттер-теги, картинка (или GIF?)

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rejected_color = [1.0, 0.6, 0.6];
var accepted_color = [0.6, 1.0, 0.6];
var true_point_color = [0.6, 0.6, 1.0];

var MCDatasetSelector = function () {
    function MCDatasetSelector(wrapper_div, on_dataset_change) {
        var _this = this;

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref$n_ticks = _ref.n_ticks,
            n_ticks = _ref$n_ticks === undefined ? 45 : _ref$n_ticks,
            _ref$selected_dataset = _ref.selected_dataset,
            selected_dataset = _ref$selected_dataset === undefined ? 0 : _ref$selected_dataset;

        _classCallCheck(this, MCDatasetSelector);

        // everything is computed on the same grid
        this.n_ticks = n_ticks;
        this.axis_ticks = [];
        for (var x_tick = 0; x_tick < n_ticks; x_tick++) {
            this.axis_ticks.push((x_tick + 1.) / (n_ticks + 1));
        }
        this.datasets = MCDatasetSelector.collect_toy_datasets(this.axis_ticks);

        this.wrapper_div = wrapper_div;
        var _colors = [{ r: 0x28, g: 0xa7, b: 0xcd }, { r: 0xe8, g: 0xea, b: 0xeb }, { r: 0xf5, g: 0xb3, b: 0x62 }];
        this.color_scaler_heatmap = Utils.create_nonplotly_scaler(_colors, [0, 1.5]);

        var _loop = function _loop(i) {
            var canvas = document.createElement('canvas');
            canvas.width = n_ticks;
            canvas.height = n_ticks;
            _this.wrapper_div.appendChild(canvas);
            // hover for canvas
            canvas.onclick = function () {
                _this.select_dataset(i);
            };
            Utils.plot_function_to_canvas(canvas, _this.datasets[i][0], _this.color_scaler_heatmap);
        };

        for (var i = 0; i < this.datasets.length; i++) {
            _loop(i);
        }
        this.selected_dataset = selected_dataset;
        // trivial event for callback
        this.on_dataset_change = on_dataset_change;
    }

    _createClass(MCDatasetSelector, [{
        key: 'get_current_dataset',
        value: function get_current_dataset() {
            return this.datasets[this.selected_dataset];
        }
    }, {
        key: 'select_dataset',
        value: function select_dataset(selected_dataset) {
            this.selected_dataset = selected_dataset;
            this.redraw();
            this.on_dataset_change();
        }
    }, {
        key: 'redraw',
        value: function redraw() {
            var i = 0;
            var children = Array.from(this.wrapper_div.children);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var control = _step.value;

                    control.classList.remove('selected');
                    if (i == this.selected_dataset) {
                        control.classList.add('selected');
                    }
                    i += 1;
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
        }
    }], [{
        key: 'collect_toy_datasets',
        value: function collect_toy_datasets(axis_ticks) {
            var distributions = [];

            // distributions.push(new GaussianDistribution());
            distributions.push(new GaussianDistribution([0., 0.], 0.8, 0.4));
            distributions.push(new SnakeDistribution());
            distributions.push(new MexicanHatDistribution());
            distributions.push(new GaussianMixtureDistribution(0.4, 0.4));
            // if you're not satisfied with previous datasets
            // distributions.push(new DoubleHoleDistribution());

            var datasets = [];

            var _loop2 = function _loop2(i) {
                var compute = function compute(x, y) {
                    return distributions[i].energy([2 * x - 1, 2 * y - 1]);
                };
                var z_grid = Utils.compute_grid_for_function(axis_ticks, compute);
                datasets.push([z_grid, distributions[i]]);
            };

            for (var i = 0; i < distributions.length; i++) {
                _loop2(i);
            }
            return datasets;
        }
    }]);

    return MCDatasetSelector;
}();

function iterate_with_pauses(context, iterator) {
    // animation_id allows only one iterating process to exist within single context
    // new 'process' has priority and automatically stops previous
    var animation_id = Date.now();
    context.animation_id = animation_id;

    function iterate(iterator) {
        if (context.animation_id != animation_id) {
            return;
        }

        var _iterator$next = iterator.next(),
            value = _iterator$next.value,
            done = _iterator$next.done;

        if (!done) {
            setTimeout(function () {
                iterate(iterator);
            }, value * 1000.);
        } else {
            context.animation_id = null;
        }
    }
    // run iteration
    iterate(iterator);
}

var MCVisualization = function () {
    function MCVisualization(wrapper_div) {
        var _this2 = this;

        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$methods = _ref2.methods,
            methods = _ref2$methods === undefined ? ['mh', 'hmc'] : _ref2$methods,
            _ref2$enable_temperin = _ref2.enable_tempering,
            enable_tempering = _ref2$enable_temperin === undefined ? false : _ref2$enable_temperin,
            _ref2$selected_datase = _ref2.selected_dataset,
            selected_dataset = _ref2$selected_datase === undefined ? 0 : _ref2$selected_datase,
            _ref2$initial_tempera = _ref2.initial_temperature,
            initial_temperature = _ref2$initial_tempera === undefined ? 4 : _ref2$initial_tempera;

        _classCallCheck(this, MCVisualization);

        this.methods = methods;
        this.enable_tempering = enable_tempering;
        this.wrapper_div = wrapper_div;
        var control_template = document.getElementById('templates').getElementsByClassName('mc_visualization_wrapper')[0];
        this.wrapper_div.innerHTML = control_template.innerHTML;

        this.main_div = this.get_by_class('visualization');

        this.method_select_control = this.get_by_class('method_select_control');
        this.method_select_control.value = this.methods[0];
        this.dataset_control = this.get_by_class('dataset_control');
        this.temperature_control = this.get_by_class('temperature_control');
        this.temperature_control.value = initial_temperature;
        this.temperature_display = this.get_by_class('temperature_display');
        this.tempering_control = this.get_by_class('tempering_control');
        this.tempering_display = this.get_by_class('tempering_display');
        this.speed_control = this.get_by_class('speed_control');
        this.speed_display = this.get_by_class('speed_display');
        this.length_control = this.get_by_class('trajectory_length_control');
        this.length_display = this.get_by_class('trajectory_length_display');
        this.mh_spread_control = this.get_by_class('spread_control');
        this.mh_spread_display = this.get_by_class('spread_display');

        this.show_generated_control = this.get_by_class('show_generated_control');
        this.show_true_control = this.get_by_class('show_true_control');
        this.show_rejected_control = this.get_by_class('show_rejected_control');

        var redraw = function redraw() {
            _this2.redraw();
        };
        var update = function update() {
            _this2.redraw({ force_restart_animation: false });
        };
        this.method_select_control.oninput = redraw;
        this.temperature_control.oninput = redraw;
        this.tempering_control.oninput = redraw;
        this.length_control.oninput = redraw;
        this.mh_spread_control.oninput = redraw;

        this.speed_control.oninput = function () {
            _this2.redraw({ speed_changed: true, force_restart_animation: false });
        };
        this.show_generated_control.onchange = update;
        this.show_true_control.onchange = update;
        this.show_rejected_control.onchange = update;

        this.dataset = new MCDatasetSelector(this.dataset_control, redraw, { selected_dataset: selected_dataset });
        var ticks = this.dataset.axis_ticks;

        this.plot = new Plot3D(this.main_div, {});

        var distribution = this.dataset.get_current_dataset()[1];

        this.surface = this.plot.addSurfaceMesh(function (x, y) {
            return distribution.energy([x, y]);
        });
        this.true_distribution_points = this.plot.addDynamicPoints();
        this.generated_points = this.plot.addDynamicPoints();
        this.current_position_point = this.plot.addDynamicPoints({ max_points: 1 });
        this.current_position_point.points.material.size = 0.025;
        this.rejected_points = this.plot.addDynamicPoints();
        this.plot.addCoordinateGrid();
        this.hmc_trajectory = this.plot.addDynamicLine();

        // Identifier of currently running animation
        this.animation_id = null;

        this.hide_controls();

        this.redraw();
    }

    _createClass(MCVisualization, [{
        key: 'hide_controls',
        value: function hide_controls() {
            if (this.methods.length == 1) {
                this.get_by_class('method_controls').style.display = 'none';
            }
            if (this.methods.indexOf('hmc') === -1) {
                $(this.wrapper_div).find('.hmc_only_control').hide(0);
                //            for(let control of this.wrapper_div.getElementsByClassName('hmc_only_control')) {
                //                control.style.display = 'none';
                //            }
            }
            if (this.methods.indexOf('mh') === -1) {
                $(this.wrapper_div).find('.mh_only_control').hide(0);
                //            for(let control of this.wrapper_div.getElementsByClassName('mh_only_control')) {
                //                control.style.display = 'none';
                //            }
            }
            if (!this.enable_tempering) {
                $(this.wrapper_div).find('.tempering_only_control').hide(0);
                //            for(let control of this.wrapper_div.getElementsByClassName('tempering_only_control')) {
                //                control.style.display = 'none';
                //            }
            }
        }
    }, {
        key: 'get_by_class',
        value: function get_by_class(className) {
            return this.wrapper_div.getElementsByClassName(className)[0];
        }
    }, {
        key: 'setTruePoints',
        value: function setTruePoints(T) {
            this.true_distribution_points.flush();

            var _dataset$get_current_ = this.dataset.get_current_dataset(),
                _dataset$get_current_2 = _slicedToArray(_dataset$get_current_, 2),
                z_grid = _dataset$get_current_2[0],
                distribution = _dataset$get_current_2[1];

            var points = [];
            distribution.init_sampler();
            var random = new RandomGenerator(42);
            for (var i = 0; i < 1000; i++) {
                var _distribution$sample = distribution.sample(T),
                    _distribution$sample2 = _slicedToArray(_distribution$sample, 2),
                    x = _distribution$sample2[0],
                    y = _distribution$sample2[1];

                var point = [x, y, distribution.energy([x, y]) + random.random_normal(0, 0.001)];
                points.push(this.plot.normalize_point(point));
            }
            this.true_distribution_points.set_points(points, true_point_color);
        }
    }, {
        key: 'addCandidate',
        value: function addCandidate(candidate_position, rejected) {
            var normalized_position = this.plot.normalize_point(candidate_position);
            if (rejected) {
                this.rejected_points.add_point(normalized_position, rejected_color);
            } else {
                this.generated_points.add_point(normalized_position, accepted_color);
            }
        }
    }, {
        key: 'setCurrentPosition',
        value: function setCurrentPosition(position) {
            this.current_position_point.flush();
            this.current_position_point.add_point(this.plot.normalize_point(position), accepted_color);
        }
    }, {
        key: 'redraw',
        value: function redraw() {
            var _marked = [animate].map(regeneratorRuntime.mark);

            var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref3$force_restart_a = _ref3.force_restart_animation,
                force_restart_animation = _ref3$force_restart_a === undefined ? true : _ref3$force_restart_a,
                _ref3$speed_changed = _ref3.speed_changed,
                speed_changed = _ref3$speed_changed === undefined ? false : _ref3$speed_changed;

            // collecting parameters
            var allowedT = [0.001, 0.003, 0.01, 0.03, 0.1, 0.3];
            var T = allowedT[this.temperature_control.value];
            this.temperature_display.innerHTML = T.toString();

            this._speed = ['slow', 'fast', 'instant'][this.speed_control.value];
            this._pause = [0.25, 0.05, 0.005][this.speed_control.value];
            this.speed_display.innerHTML = this._speed;

            var allowed_alpha = [1.00, 1.01, 1.02, 1.03, 1.04, 1.05, 1.06];
            var alpha = allowed_alpha[this.tempering_control.value];
            this.tempering_display.innerHTML = alpha.toString();

            var allowed_lengths = [20, 40, 60, 100, 150];
            var length = allowed_lengths[this.length_control.value];
            this.length_display.innerHTML = length.toString();

            var allowed_spreads = [0.02, 0.05, 0.1, 0.20, 0.4];
            var spread = allowed_spreads[this.mh_spread_control.value];
            this.mh_spread_display.innerHTML = spread.toString();

            var method = this.method_select_control.value;

            var show_true = this.show_true_control.checked;
            var show_generated = this.show_generated_control.checked;
            var show_rejected = this.show_rejected_control.checked;

            var _dataset$get_current_3 = this.dataset.get_current_dataset(),
                _dataset$get_current_4 = _slicedToArray(_dataset$get_current_3, 2),
                z_grid = _dataset$get_current_4[0],
                distribution = _dataset$get_current_4[1];

            if (force_restart_animation) {
                // updating surface       
                var new_geometry = this.plot.generateSurfaceGeometry(function (x, y) {
                    return distribution.energy([x, y]);
                });
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Array.from(this.surface.children)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var mesh = _step2.value;

                        mesh.geometry.dispose();
                        mesh.geometry = new_geometry;
                    }
                    // updating true points
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                this.setTruePoints(T);
            }

            this.true_distribution_points.points.material.visible = show_true;
            this.generated_points.points.material.visible = show_generated;
            this.rejected_points.points.material.visible = show_rejected;

            var context = this;

            function animate() {
                var mc_sampler, iteration, _mc_sampler$generate_, _mc_sampler$generate_2, result, candidate, rejected, _mc_sampler$generate_3, _mc_sampler$generate_4, _result, _candidate, _rejected, trajectory_3d, j;

                return regeneratorRuntime.wrap(function animate$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                mc_sampler = new MCSampler(distribution, -0.65, -0.75);

                                mc_sampler.set_temperature(T);
                                context.generated_points.flush();
                                context.rejected_points.flush();
                                iteration = 0;

                            case 5:
                                if (!(iteration < 2000)) {
                                    _context.next = 33;
                                    break;
                                }

                                if (!(method == 'mh')) {
                                    _context.next = 12;
                                    break;
                                }

                                _mc_sampler$generate_ = mc_sampler.generate_mh(spread), _mc_sampler$generate_2 = _slicedToArray(_mc_sampler$generate_, 3), result = _mc_sampler$generate_2[0], candidate = _mc_sampler$generate_2[1], rejected = _mc_sampler$generate_2[2];

                                context.addCandidate(candidate, rejected);
                                context.setCurrentPosition(result);
                                _context.next = 26;
                                break;

                            case 12:
                                _mc_sampler$generate_3 = mc_sampler.generate_hmc({ tempering_alpha: alpha, n_steps: length }), _mc_sampler$generate_4 = _slicedToArray(_mc_sampler$generate_3, 4), _result = _mc_sampler$generate_4[0], _candidate = _mc_sampler$generate_4[1], _rejected = _mc_sampler$generate_4[2], trajectory_3d = _mc_sampler$generate_4[3];

                                context.hmc_trajectory.set_points(trajectory_3d.map(function (x) {
                                    return context.plot.normalize_point(x);
                                }));

                                j = 0;

                            case 15:
                                if (!(j < trajectory_3d.length)) {
                                    _context.next = 24;
                                    break;
                                }

                                context.hmc_trajectory.add_visible();

                                if (!(context._speed != 'instant')) {
                                    _context.next = 21;
                                    break;
                                }

                                context.plot.redraw();
                                _context.next = 21;
                                return context._pause / 10;

                            case 21:
                                j++;
                                _context.next = 15;
                                break;

                            case 24:
                                context.addCandidate(_candidate, _rejected);
                                context.setCurrentPosition(_result);

                            case 26:
                                context.plot.redraw();
                                context.hmc_trajectory.flush();
                                _context.next = 30;
                                return context._pause;

                            case 30:
                                iteration++;
                                _context.next = 5;
                                break;

                            case 33:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _marked[0], this);
            }

            if (force_restart_animation || speed_changed && this.animation_id == null) {
                iterate_with_pauses(context, animate());
            }

            this.dataset.redraw();
            this.plot.redraw();
        }
    }]);

    return MCVisualization;
}();

var mcmc_visualization = new MCVisualization(document.getElementById('mh_visualization_wrapper'), { methods: ['mh'], selected_dataset: 1 });
var hmc_visualization = new MCVisualization(document.getElementById('hmc_visualization_wrapper'), { methods: ['hmc'], enable_tempering: false, selected_dataset: 2 });
var hmc_tempering_visualization = new MCVisualization(document.getElementById('hmc_tempering_visualization_wrapper'), { methods: ['hmc'], enable_tempering: true, selected_dataset: 3, initial_temperature: 2 });

var TemperatureVisualization = function () {
    function TemperatureVisualization(wrapper_div) {
        var _this3 = this;

        _classCallCheck(this, TemperatureVisualization);

        this.wrapper_div = wrapper_div;
        this.main_div = this.get_by_class('visualization');
        this.temperature_control = this.get_by_class('temperature_control');
        this.temperature_display = this.get_by_class('temperature_display');
        this.show_true_control = this.get_by_class('show_true_control');

        var redraw = function redraw() {
            _this3.redraw();
        };
        this.temperature_control.oninput = redraw;
        this.dataset_control = this.get_by_class('dataset_control');
        this.dataset = new MCDatasetSelector(this.dataset_control, redraw, { selected_dataset: 1 });
        this.show_true_control.onchange = redraw;

        this.plot_energy = new Plot3D(this.get_by_class('visualization_left'), { width: 398, controlsDomElement: this.main_div }); // , display_zmax: 0.01
        this.plot_pdf = new Plot3D(this.get_by_class('visualization_right'), { width: 398, controlsDomElement: this.main_div });

        var _arr = [this.plot_pdf, this.plot_energy];
        for (var _i = 0; _i < _arr.length; _i++) {
            var plot = _arr[_i];
            plot.camera.position.z = 1.8;
            plot.camera.position.y = 0.9;
            plot.orbit.minDistance = 0.5;
            plot.orbit.maxDistance = 2.0;
            // needed to fight slow scrolling
            plot.orbit.enableDamping = false;
        }

        // rotate when scrolling window
        var scrolled = 0.;
        window.onscroll = function () {
            var new_scrolled = window.pageYOffset || document.documentElement.scrollTop;
            var _arr2 = [_this3.plot_pdf, _this3.plot_energy];
            for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
                var plot = _arr2[_i2];
                plot.orbit.rotate_left((new_scrolled - scrolled) * 0.001);
                plot.orbit.update();
            }
            scrolled = new_scrolled;
        };

        var distribution = this.dataset.get_current_dataset()[1];

        var min_color = new THREE.Vector3(0.0, 0.2, 0.4);
        var max_color = new THREE.Vector3(0.7, 0.2, 0.0);
        this.surface_pdf = this.plot_pdf.addSurfaceMesh(function (x, y) {
            return distribution.energy([x, y]);
        }, min_color, max_color);
        this.surface_energy = this.plot_energy.addSurfaceMesh(function (x, y) {
            return distribution.energy([x, y]);
        });
        this.true_distribution_points = this.plot_energy.addDynamicPoints();
        this.true_distribution_points.points.material.size = 0.015;
        this.plot_energy.addCoordinateGrid();
        this.plot_pdf.addCoordinateGrid();
        this.redraw();
    }

    _createClass(TemperatureVisualization, [{
        key: 'get_by_class',
        value: function get_by_class(className) {
            return this.wrapper_div.getElementsByClassName(className)[0];
        }
    }, {
        key: 'setTruePoints',
        value: function setTruePoints(T) {
            this.true_distribution_points.flush();

            var _dataset$get_current_5 = this.dataset.get_current_dataset(),
                _dataset$get_current_6 = _slicedToArray(_dataset$get_current_5, 2),
                z_grid = _dataset$get_current_6[0],
                distribution = _dataset$get_current_6[1];

            var points = [];
            distribution.init_sampler();
            for (var i = 0; i < 1500; i++) {
                var _distribution$sample3 = distribution.sample(T),
                    _distribution$sample4 = _slicedToArray(_distribution$sample3, 2),
                    x = _distribution$sample4[0],
                    y = _distribution$sample4[1];

                var point = [x, y, distribution.energy([x, y])];
                points.push(this.plot_energy.normalize_point(point));
            }
            this.true_distribution_points.set_points(points, true_point_color);
        }
    }, {
        key: 'redraw',
        value: function redraw() {
            var allowedT = [0.01, 0.03, 0.1, 0.3, 1.];
            var T = allowedT[this.temperature_control.value];
            this.temperature_display.innerHTML = T.toString();

            var _dataset$get_current_7 = this.dataset.get_current_dataset(),
                _dataset$get_current_8 = _slicedToArray(_dataset$get_current_7, 2),
                z_grid = _dataset$get_current_8[0],
                distribution = _dataset$get_current_8[1];

            this.setTruePoints(T);

            this.true_distribution_points.points.material.visible = this.show_true_control.checked;

            var min_energy = 1e10;
            for (var x = 0; x < 1; x += 0.001) {
                min_energy = Math.min(min_energy, distribution.energy([x, x]));
            }

            var new_pdf_geometry = this.plot_pdf.generateSurfaceGeometry(function (x, y) {
                return 0.95 * Math.exp(-(distribution.energy([x, y]) - min_energy) / T);
            }, 200);
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.surface_pdf.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var mesh = _step3.value;

                    mesh.geometry.dispose();
                    mesh.geometry = new_pdf_geometry;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var new_energy_geometry = this.plot_pdf.generateSurfaceGeometry(function (x, y) {
                return distribution.energy([x, y]);
            }, 50);
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.surface_energy.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _mesh = _step4.value;

                    _mesh.geometry.dispose();
                    _mesh.geometry = new_energy_geometry;
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            this.plot_pdf.redraw();
            this.plot_energy.redraw();
            this.dataset.redraw();
        }
    }]);

    return TemperatureVisualization;
}();

var temperature_visualization = new TemperatureVisualization(document.getElementById('temperature_visualization_wrapper'));

// Bind unfolding of descriptions
$('.explanation-preview').on('click', function () {
    var name = $(this).attr('data-explained');
    var found = $.find('.explanation-content[data-explained=' + name + ']');
    $(found).fadeIn(500);
});

// testing derivatives
//function test_derivatives() {
//    let rand = new RandomGenerator(42);
//    let eps = 1e-3;
//    let datasets = MCDatasetSelector.collect_toy_datasets([1]);
//    for (let i = 0; i < datasets.length; i++) {
//        console.log('dataset', i);
//        let [z_grid, distribution] = datasets[i];
//        for (let j = 0; j < 10; j++) {
//            let x = rand.random();
//            let y = rand.random();
//            let der_x = (distribution.energy([x + eps, y]) - distribution.energy([x - eps, y])) / 2 / eps;
//            let der_y = (distribution.energy([x, y + eps]) - distribution.energy([x, y - eps])) / 2 / eps;
//            let [derx1, dery1] = distribution.gradient([x, y]);
//            console.assert(Math.abs(der_x - derx1) < 0.1 * Math.abs(der_x) + 1e-4, der_x, derx1);
//            console.assert(Math.abs(der_y - dery1) < 0.1 * Math.abs(der_y) + 1e-4, der_y, dery1);
//        }
//    }
//}
//test_derivatives();

//# sourceMappingURL=mcmc_explained-compiled.js.map