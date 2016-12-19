"use strict";

class Utils {
    static create_2D_array(rows) {
        let arr = [];
        for (var i = 0; i < rows; i++) arr[i] = [];
        return arr;
    }

    static compute_grid_for_function(axis_ticks, func) {
        let n_ticks = axis_ticks.length;
        let z_grid = Utils.create_2D_array(n_ticks);
        for (let x_tick = 0; x_tick < n_ticks; x_tick++) {
            for (let y_tick = 0; y_tick < n_ticks; y_tick++) {
                let x = axis_ticks[x_tick];
                let y = axis_ticks[y_tick];
                z_grid[x_tick][y_tick] = func(x, y);
            }
        }
        return z_grid;
    }

    static convert_grid_to_training(z_grid, axis_ticks) {
        let n_ticks = axis_ticks.length;
        let trainX = [];
        let trainY = [];
        for (let x1_tick = 0; x1_tick < n_ticks; x1_tick++) {
            for (let x2_tick = 0; x2_tick < n_ticks; x2_tick++) {
                let x1 = axis_ticks[x1_tick];
                let x2 = axis_ticks[x2_tick];
                trainX.push([x1, x2]);
                trainY.push(z_grid[x1_tick][x2_tick]);
            }
        }
        return [trainX, trainY]
    }

    static rotate_dataset(X, angle) {
        let X_result = [];
        for (let i = 0; i < X.length; i++) {
            X_result.push(Utils.rotate_event(X[i], angle));
        }
        return X_result;
    }

    static plot_function_to_canvas(canvas, z_grid, color_scaler) {
        // z_grid and canvas are expected to have coinciding sizes
        let context = canvas.getContext("2d");
        let canvasData = context.getImageData(0, 0, canvas.width, canvas.height);

        // That's how you define the value of a pixel
        function draw_pixel(x, y, value) {
            y = canvasData.height - 1 - y;
            let index = (x + y * canvasData.width) * 4;
            let color = color_scaler(value);
            // console.log('tralala', z_grid, index, value, color);
            canvasData.data[index + 0] = color.r;
            canvasData.data[index + 1] = color.g;
            canvasData.data[index + 2] = color.b;
            canvasData.data[index + 3] = 256;
        }

        for (let i = 0; i < z_grid.length; i++) {
            let z_row = z_grid[i];
            for (let j = 0; j < z_row.length; j++) {
                let value = z_row[j];
                draw_pixel(i, j, value);
            }
        }
        context.putImageData(canvasData, 0, 0);
    }

    static plot_scatter_to_canvas(canvas, X, y, sizes, color_scaler) {
        let context = canvas.getContext("2d");

        for (let event_id = 0; event_id < y.length; event_id++) {
            let x1 = X[event_id][0] * canvas.width;
            let x2 = (1 - X[event_id][1]) * canvas.height;
            context.beginPath();
            context.arc(x1, x2, sizes[event_id], 0, 2 * Math.PI, false);
            context.fillStyle = color_scaler(2 * y[event_id] - 1).toString();
            context.fill();
        }
    }

    static rotate_event(x, angle) {
        let x1 = x[0] - 0.5;
        let x2 = x[1] - 0.5;
        let new_x1 = Math.cos(angle) * x1 - Math.sin(angle) * x2;
        let new_x2 = Math.sin(angle) * x1 + Math.cos(angle) * x2;
        return [new_x1 + 0.5, new_x2 + 0.5];
    }

    static create_fast_color_scaler(colors, n_shades, domain=[-1, 1]) {
        // Get a range of colors.
        let tmp_scale = Plotly.d3.scale.linear()
            .domain([0, 0.5, 1])
            .range(colors)
            .clamp(true);
        let colors_sequence = [];
        for (let shade = 0; shade < n_shades + 1; shade++) {
            colors_sequence.push(Plotly.d3.rgb(tmp_scale(shade / n_shades)))
        }
        return Plotly.d3.scale.quantize()
            .domain(domain)
            .range(colors_sequence);
    }

    static create_nonplotly_scaler(colors, domain=[-1, 1]) {
        // Get a range of colors.
        let result = function(x){
            x = (x - domain[0]) / (domain[1] - domain[0]);
            x = Math.max(x, 0.01);
            x = Math.min(x, 0.99);
            x = x * (colors.length - 1);
            let left = Math.floor(x);
            let l = colors[left];
            let r = colors[left + 1];
            let t = x - left;
            return {
                r: r.r * t + l.r * (1 - t),
                g: r.g * t + l.g * (1 - t),
                b: r.b * t + l.b * (1 - t),
            }
        }
        return result;
    }

    static get_3d_plot(axis_ticks, opacity=1.){
        let result = {
            x: clone(axis_ticks),
            y: clone(axis_ticks),
            z: Utils.compute_grid_for_function(axis_ticks, (x, y)=>{return  (x + y - 1) / 2;}),
            showscale: false,
            type: 'surface',
            hoverinfo: 'none'
        };
        if((opacity != null) && (opacity < 1)) {
            result['opacity'] = opacity;
        }
        return result;
    }

    static draw_function_on_canvas(canvas, values, minimum, maximum, color, selected_point=null){
        // learning curves
        let ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.strokeStyle = color;
        function compute_x(index){
            return index / values.length * canvas.width
        }
        function compute_y(value){
            return (1 - (value - minimum) / (maximum - minimum)) * (canvas.height - 1);
        }
        ctx.moveTo(0, compute_y(values[0]));

        for (let i = 1; i < values.length; i++) {
            ctx.lineTo(compute_x(i), compute_y(values[i]));
        }
        ctx.stroke();

        if(selected_point != null){
            var centerX = compute_x(selected_point);
            var centerY = compute_y(values[selected_point]);
            var radius = 4;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();
            //context.lineWidth = 1;
            //context.strokeStyle = '#003300';
            ctx.stroke();
        }
    }


    static compute_sum(array){
        return array.reduce(function(a, b) { return a + b; }, 0);
    }

    static compute_mean(array){
        return Utils.compute_sum(array) / array.length;
    }

    static get_subsample_indices(n_original, n_subsampled, random_seed) {
        let shuffled = [];
        for (let j = 0; j < n_original; j++) {
            shuffled[j] = j;
        }

        let random_state = new RandomGenerator(random_seed);

        let i = n_original;
        while (i--) {
            let index = Math.floor((i + 1) * random_state.random());
            let temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(0, n_subsampled);
    }

    static get_subsample(X, y, subsample, random_seed){
        let n_original = X.length;
        let n_generated = Math.ceil(subsample * n_original);
        if (subsample == 1){
            return [X, y]
        } else {
            let indices = Utils.get_subsample_indices(n_original, n_generated, random_seed);
            let X_new = [];
            let y_new = [];
            for(let i = 0; i < indices.length; i++) {
                let index = indices[i];
                X_new.push(X[index]);
                y_new.push(y[index]);
            }
            return [X_new, y_new];
        }
    }
}

class VectorUtils{
    static add(a, b){
        if(a.length != b.length){
            console.error('lengths inequal', a, b);
        }
        let result = [];
        for(let i=0; i < a.length; i++){
            result[i] = a[i] + b[i];
        }
        return result;
    }

    static add_with_coeffs(a, b, c_a, c_b){
        if(a.length != b.length){
            console.error('lengths inequal', a, b);
        }
        let result = [];
        for(let i=0; i < a.length; i++){
            result[i] = a[i] * c_a + b[i] * c_b;
        }
        return result;
    }

    static multiply(a, c_a){
        let result = [];
        for(let i=0; i < a.length; i++){
            result[i] = a[i] * c_a
        }
        return result;
    }

    static norm_squared(a){
        let result = 0.;
        for(let i = 0; i < a.length; i++){
            result += a[i] * a[i];
        }
        return result;
    }
}

function clone(object) {
    return JSON.parse(JSON.stringify(object));
}