// TODO add a separate plot with decision function
"use strict";

// everything is computed on the same grid
let n_ticks = 50;
let axis_ticks = [];
for (let x_tick = 0; x_tick < n_ticks; x_tick++) {
    axis_ticks.push((x_tick + 0.5) / n_ticks);
}


class LogisticRegressionRule {
    constructor(x_start, y_start, x_end, y_end) {
        let scale = 10;
        this.cx = (x_end - x_start) * scale;
        this.cy = (y_end - y_start) * scale;
        this.bias = -(this.cx * x_start + this.cy * y_start);
    }

    static sigmoid(x) {
        x = Math.max(x, -10);
        x = Math.min(x, 10);
        return 1 / (1 + Math.exp(-x));
    }

    compute_decision(x, y) {
        return (this.bias + this.cx * x + this.cy * y);
    }

    compute_probability(x, y) {
        return LogisticRegressionRule.sigmoid(this.compute_decision(x, y));
    }

    compute_loss(x, y, target) {
        let y_signed = target > 0 ? 1 : -1;
        return Math.log(1 + Math.exp(-y_signed * this.compute_decision(x, y)));
    }
}


function generate_dataset(n_samples){
    let trainX = [];
    let trainY = [];
    for(let i=0; i<n_samples; i++){
        let label = i % 2;
        trainY.push(label);
        let phi = Math.random() * 2 * Math.PI;
        let rho = Math.random() * 0.4;
        let x = rho * Math.cos(phi) + 0.3 + 0.4 * label;
        let y = rho * Math.sin(phi) + 0.3 + 0.4 * label;
        trainX.push([x, y])
    }
    return [trainX, trainY];
}

class LogiticRegressionPlayground {
    constructor() {
        this.canvas_size = 600;
        this.main_canvas = document.getElementById('regression2d');
        this.main_canvas.width = this.canvas_size;
        this.main_canvas.height = this.canvas_size;
        this.main_canvas.onclick = (e) => {
            this.onclick(e);
        };
        document.getElementById('regression2d-wrapper').onmousemove = (e) => {
            this.onmousemove(e);
        };

        this.n_ticks = 100;
        this.invisible_canvas = document.createElement('canvas');
        this.invisible_canvas.width = this.n_ticks;
        this.invisible_canvas.height = this.n_ticks;

        // true if first line is ok, but not the second
        this.is_still_drawing = false;

        // positions of normal vector
        this.start = [0.5, 0.5];
        this.end = [0.51, 0.51];

        this.color_scaler_points = Utils.create_fast_color_scaler(["#f59322", "#e8eaeb", "#0877bd"], 3);
        this.color_scaler_heatmap = Utils.create_fast_color_scaler(["#f5b362", "#e8eaeb", "#28a7cd"], 100);

        let train = generate_dataset(100);
        this.trainX = train[0];
        this.trainY = train[1];

        this.redraw();
    }

    onclick(event) {
        console.log(event.pageY, event.screenY);
        let position = this.get_cursor_position(event);
        if (this.is_still_drawing) {
            this.end = position;
        } else {
            this.start = position;
        }
        this.is_still_drawing = !this.is_still_drawing;
        this.redraw();
    }

    onmousemove(event) {
        let position = this.get_cursor_position(event);
        if (this.is_still_drawing) {
            this.end = position;
            this.redraw();
        }
    }

    get_cursor_position(event) {
        let box = this.main_canvas.getBoundingClientRect();
        let x = (event.pageX - box.left) / this.canvas_size;
        let y = (event.pageY - box.top) / this.canvas_size;
        return [x, 1 - y];
    }

    compute_heatmap() {
        let lr = new LogisticRegressionRule(this.start[0], this.start[1], this.end[0], this.end[1]);
        let heatmap = Utils.create_2D_array(this.n_ticks);
        for (let x_tick = 0; x_tick < this.n_ticks; x_tick++) {
            for (let y_tick = 0; y_tick < this.n_ticks; y_tick++) {
                heatmap[x_tick][y_tick] = lr.compute_probability(x_tick / this.n_ticks, y_tick / this.n_ticks) * 2 - 1;
            }
        }
        return heatmap;
    }

    compute_losses(X, y) {
        let lr = new LogisticRegressionRule(this.start[0], this.start[1], this.end[0], this.end[1]);
        let losses = [];
        for (let i = 0; i < X.length; i++) {
            losses[i] = lr.compute_loss(X[i][0], X[i][1], y[i]) * 4;
        }
        return losses;
    }

    static draw_arrow(canvas, fromx, fromy, tox, toy) {
        let context = canvas.getContext('2d');
        // length of head in pixels
        var head_length = 10;
        toy = 1 - toy;
        fromy = 1 - fromy;
        var angle = Math.atan2(toy - fromy, tox - fromx);
        fromx *= canvas.width;
        tox *= canvas.width;
        fromy *= canvas.height;
        toy *= canvas.height;

        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - head_length * Math.cos(angle - Math.PI / 6), toy - head_length * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - head_length * Math.cos(angle + Math.PI / 6), toy - head_length * Math.sin(angle + Math.PI / 6));
        context.stroke();
        context.closePath();
    }

    redraw() {
        let data = this.compute_heatmap();
        Utils.plot_function_to_canvas(this.invisible_canvas, data, this.color_scaler_heatmap);

        this.main_canvas.getContext('2d').drawImage(this.invisible_canvas, 0, 0,
            this.main_canvas.width, this.main_canvas.height);

        // Drawing canvas
        //Utils.plot_scatter_to_canvas(this.main_canvas, [this.start, this.end], [0, 1], [3, 3],
        //    this.color_scaler_points);

        // drawing points
        let losses = this.compute_losses(this.trainX, this.trainY);
        Utils.plot_scatter_to_canvas(this.main_canvas, this.trainX, this.trainY, losses,
            this.color_scaler_points);

        LogiticRegressionPlayground.draw_arrow(this.main_canvas, this.start[0], this.start[1], this.end[0], this.end[1])
    }

}

var playground = new LogiticRegressionPlayground();
