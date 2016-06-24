"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: "create_2D_array",
        value: function create_2D_array(rows) {
            var arr = [];
            for (var i = 0; i < rows; i++) {
                arr[i] = [];
            }return arr;
        }
    }, {
        key: "compute_grid_for_function",
        value: function compute_grid_for_function(axis_ticks, func) {
            var n_ticks = axis_ticks.length;
            var z_grid = Utils.create_2D_array(n_ticks);
            for (var x_tick = 0; x_tick < n_ticks; x_tick++) {
                for (var y_tick = 0; y_tick < n_ticks; y_tick++) {
                    var x = axis_ticks[x_tick];
                    var y = axis_ticks[y_tick];
                    z_grid[x_tick][y_tick] = func(x, y);
                }
            }
            return z_grid;
        }
    }, {
        key: "convert_grid_to_training",
        value: function convert_grid_to_training(z_grid, axis_ticks) {
            var n_ticks = axis_ticks.length;
            var trainX = [];
            var trainY = [];
            for (var x1_tick = 0; x1_tick < n_ticks; x1_tick++) {
                for (var x2_tick = 0; x2_tick < n_ticks; x2_tick++) {
                    var x1 = axis_ticks[x1_tick];
                    var x2 = axis_ticks[x2_tick];
                    trainX.push([x1, x2]);
                    trainY.push(z_grid[x1_tick][x2_tick]);
                }
            }
            return [trainX, trainY];
        }
    }, {
        key: "rotate_dataset",
        value: function rotate_dataset(X, angle) {
            var X_result = [];
            for (var i = 0; i < X.length; i++) {
                X_result.push(Utils.rotate_event(X[i], angle));
            }
            return X_result;
        }
    }, {
        key: "plot_function_to_canvas",
        value: function plot_function_to_canvas(canvas, z_grid, color_scaler) {
            // z_grid and canvas are expected to have coinciding sizes
            var context = canvas.getContext("2d");
            var canvasData = context.getImageData(0, 0, canvas.width, canvas.height);

            // That's how you define the value of a pixel
            function draw_pixel(x, y, value) {
                y = canvasData.height - 1 - y;
                var index = (x + y * canvasData.width) * 4;
                var color = color_scaler(value);
                canvasData.data[index + 0] = color.r;
                canvasData.data[index + 1] = color.g;
                canvasData.data[index + 2] = color.b;
                canvasData.data[index + 3] = 256;
            }

            for (var i = 0; i < z_grid.length; i++) {
                var z_row = z_grid[i];
                for (var j = 0; j < z_row.length; j++) {
                    var value = z_row[j];
                    draw_pixel(i, j, value);
                }
            }
            context.putImageData(canvasData, 0, 0);
        }
    }, {
        key: "plot_scatter_to_canvas",
        value: function plot_scatter_to_canvas(canvas, X, y, sizes, color_scaler) {
            var context = canvas.getContext("2d");

            for (var event_id = 0; event_id < y.length; event_id++) {
                var x1 = X[event_id][0] * canvas.width;
                var x2 = (1 - X[event_id][1]) * canvas.height;
                context.beginPath();
                context.arc(x1, x2, sizes[event_id], 0, 2 * Math.PI, false);
                context.fillStyle = color_scaler(2 * y[event_id] - 1);
                context.fill();
            }
        }
    }, {
        key: "rotate_event",
        value: function rotate_event(x, angle) {
            var x1 = x[0] - 0.5;
            var x2 = x[1] - 0.5;
            var new_x1 = Math.cos(angle) * x1 - Math.sin(angle) * x2;
            var new_x2 = Math.sin(angle) * x1 + Math.cos(angle) * x2;
            return [new_x1 + 0.5, new_x2 + 0.5];
        }
    }, {
        key: "create_fast_color_scaler",
        value: function create_fast_color_scaler(colors, n_shades) {
            // Get a range of colors.
            var tmp_scale = Plotly.d3.scale.linear().domain([0, 0.5, 1]).range(colors).clamp(true);
            var colors_sequence = [];
            for (var shade = 0; shade < n_shades + 1; shade++) {
                colors_sequence.push(Plotly.d3.rgb(tmp_scale(shade / n_shades)));
            }
            return Plotly.d3.scale.quantize().domain([-1, 1]).range(colors_sequence);
        }
    }, {
        key: "get_3d_plot",
        value: function get_3d_plot(axis_ticks) {
            var opacity = arguments.length <= 1 || arguments[1] === undefined ? 1. : arguments[1];

            var result = {
                x: clone(axis_ticks),
                y: clone(axis_ticks),
                z: Utils.compute_grid_for_function(axis_ticks, function (x, y) {
                    return (x + y - 1) / 2;
                }),
                showscale: false,
                type: 'surface',
                hoverinfo: 'none'
            };
            if (opacity != null && opacity < 1) {
                result['opacity'] = opacity;
            }
            return result;
        }
    }]);

    return Utils;
}();

function clone(object) {
    return JSON.parse(JSON.stringify(object));
}

//# sourceMappingURL=utils-compiled.js.map