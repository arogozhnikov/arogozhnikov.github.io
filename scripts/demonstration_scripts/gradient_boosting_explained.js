// TODO оптимизация графика gb-построения. Он тормозит.
// TODO поговорить про классификацию?
// TODO процесс построения одного дерева внутри бустинга?

"use strict";

let base_3d_layout = {
    scene: {
        // axes' names are UTFed, since plotly.js doesn't support latex in 3d.
        xaxis: {title: 'x₁'},
        yaxis: {title: 'x₂'},
        zaxis: {title: 'y '},
        // also I found no good way for isometric projection in plotly.js
        camera: {
            eye: {x: 1.25, y: 1.25, z: 1.25}
        }
    },
    margin: {l: 0, r: 20, b: 0, t: 0}
};

let one_column_3d_layout = {
    autosize: false,
    width: 400,
    height: 400
};

for (let attr_name in base_3d_layout) {
    one_column_3d_layout[attr_name] = base_3d_layout[attr_name];
}

class DatasetSelector {
    constructor(wrapper_div, on_dataset_change, n_ticks = 50) {
        // everything is computed on the same grid
        this.n_ticks = n_ticks;
        this.axis_ticks = [];
        for (let x_tick = 0; x_tick < n_ticks; x_tick++) {
            this.axis_ticks.push((x_tick + 0.5) / n_ticks);
        }
        this.datasets = DatasetSelector.collect_toy_datasets(this.axis_ticks);

        this.wrapper_div = wrapper_div;
        this.color_scaler_heatmap = Utils.create_fast_color_scaler(["#28a7cd", "#e8eaeb", "#f5b362"], 30);

        for (let i = 0; i < this.datasets.length; i++) {
            let canvas = document.createElement('canvas');
            canvas.width = n_ticks;
            canvas.height = n_ticks;
            this.wrapper_div.appendChild(canvas);
            // hover for canvas
            canvas.onclick = () => {
                this.select_dataset(i);
            };
            Utils.plot_function_to_canvas(canvas, this.datasets[i][2], this.color_scaler_heatmap);
        }
        this.selected_dataset = 0;
        // trivial event
        this.on_dataset_change = on_dataset_change;
    }

    get_current_dataset() {
        return this.datasets[this.selected_dataset];
    }

    select_dataset(selected_dataset) {
        this.selected_dataset = selected_dataset;
        this.redraw();
        this.on_dataset_change();
    }

    redraw() {
        // seemingly, nothing to change
        return;
    }

    static approximated_function_pyramid(x1, x2) {
        return Math.sin(4 * x1) * Math.cos(3 * x2) * 0.5;
    }

    static approximated_function_teardrop(x1, x2) {
        x1 -= 0.3;
        x2 -= 0.7;
        let r = Math.sqrt(x1 * x1 + x2 * x2) * 10;
        return 0.5 * Math.cos(r);
        //return Math.cos(r) / (2 + r / 5.);
    }

    static approximated_function_wall(x1, x2) {
        return (x1 + x2 < 1) ? 0.5 : -0.5;
    }

    static approximated_function_xor(x1, x2) {
        return (x1 - 0.4) * (x2 - 0.6) > 0 ? 0.5 : -0.5;
    }

    static approximated_function_diffgauss(x1, x2) {
        let shift = 0.1;
        let gauss1x = x1 - 0.5 + shift;
        let gauss1y = x2 - 0.5 + shift;
        let gauss2x = x1 - 0.5 - shift;
        let gauss2y = x2 - 0.5 - shift;
        return Math.exp(-7 * (gauss1x * gauss1x + gauss1y * gauss1y))
            - Math.exp(-7 * (gauss2x * gauss2x + gauss2y * gauss2y));
    }

    static collect_toy_datasets(axis_ticks) {
        let z_grids = [];

        z_grids.push(Utils.compute_grid_for_function(axis_ticks, DatasetSelector.approximated_function_pyramid));
        z_grids.push(Utils.compute_grid_for_function(axis_ticks, DatasetSelector.approximated_function_teardrop));
        z_grids.push(Utils.compute_grid_for_function(axis_ticks, DatasetSelector.approximated_function_wall));
        z_grids.push(Utils.compute_grid_for_function(axis_ticks, DatasetSelector.approximated_function_diffgauss));
        z_grids.push(Utils.compute_grid_for_function(axis_ticks, DatasetSelector.approximated_function_xor));

        let train_datasets = [];

        for (let i = 0; i < z_grids.length; i++) {
            let z_grid = z_grids[i];
            let [trainX, trainY] = Utils.convert_grid_to_training(z_grid, axis_ticks);
            train_datasets.push([trainX, trainY, z_grid]);
        }
        return train_datasets;
    }
}

class DecisionTreeVisualization {
    constructor() {
        this.main_div = document.getElementById('tree_visualization');
        this.tree_depth_control = document.getElementById('tree_depth_control');
        this.tree_depth_display = document.getElementById('tree_depth_display');
        this.look_from_above_button = document.getElementById('tree_look_from_above_control');
        this.dataset_control = document.getElementById('tree_dataset_select_control');

        this.tree_depth_control.oninput = () => {
            this.redraw()
        };
        this.look_from_above_button.onclick = () => {
            this.look_from_above();
        };
        this.dataset = new DatasetSelector(this.dataset_control, () => {
            this.redraw()
        });
        let ticks = this.dataset.axis_ticks;
        Plotly.newPlot(this.main_div,
            [Utils.get_3d_plot(ticks, 0.95), Utils.get_3d_plot(ticks, 1.0)],
            clone(base_3d_layout));
        this.redraw();
    }

    compute_tree_prediction(depth) {
        let [trainX, trainY, z_grid] = this.dataset.get_current_dataset();
        let tree = new DecisionTreeRegressor(trainX, trainY, depth);
        return Utils.compute_grid_for_function(this.dataset.axis_ticks, function (x1, x2) {
            return tree.predict_one_event([x1, x2])
        });
    }

    look_from_above() {
        let new_layout = clone(base_3d_layout);
        new_layout['scene']['camera'] = {eye: {x: 0.1, y: 0.1, z: Math.sqrt(3) * 1.25}};
        // Plotly.relayout doesn't change camera position. So I have to recreate the plot.
        Plotly.newPlot(this.main_div, this.main_div.data, new_layout);
        this.redraw();
    }

    redraw() {
        let new_depth = this.tree_depth_control.value;
        this.tree_depth_display.innerHTML = new_depth.toString();
        let tree_predictions = this.compute_tree_prediction(new_depth);
        Plotly.restyle(this.main_div, {z: [tree_predictions]}, 1);
        let function_z_grid = this.dataset.get_current_dataset()[2];
        Plotly.restyle(this.main_div, {z: [function_z_grid]}, 0);

    }
}
var tree_visualization = new DecisionTreeVisualization(50);


class GradientBoostingInitialVisualization {
    constructor() {
        this.main_div = document.getElementById('gb_simple_visualization');
        this.depth_control = document.getElementById('gb_simple_depth_control');
        this.depth_display = document.getElementById('gb_simple_depth_display');
        this.depth_control.oninput = () => {
            this.redraw();
        };
        //this.computed_results = [];

        this.dataset_control = document.getElementById('gb_simple_dataset_select_control');
        this.dataset = new DatasetSelector(this.dataset_control, () => {
            this.redraw()
        });

        let ticks = this.dataset.axis_ticks;
        Plotly.newPlot(this.main_div,
            [Utils.get_3d_plot(ticks, 0.95), Utils.get_3d_plot(ticks, 1.0)],
            clone(base_3d_layout));

        this.redraw();
    }

    compute_boosting_prediction(depth) {
        let [trainX, trainY, z_grid] = this.dataset.get_current_dataset();
        // saves already computed values
        //if (this.computed_results[depth] === undefined) {
        let n_estimators = 100;
        let learning_rate = 0.1;
        let gb_reg = new GradientBoostingRegressor(trainX, trainY, n_estimators, depth, learning_rate);
        return Utils.compute_grid_for_function(this.dataset.axis_ticks, function (x1, x2) {
            return gb_reg.predict_one_event([x1, x2])
        });
        //}
        //return this.computed_results[depth];
    }

    redraw() {
        let depth = this.depth_control.value;
        this.depth_display.innerHTML = depth.toString();
        Plotly.restyle(this.main_div, {z: [this.compute_boosting_prediction(depth)]}, 1);
        let function_z_grid = this.dataset.get_current_dataset()[2];
        Plotly.restyle(this.main_div, {z: [function_z_grid]}, 0);
    }
}
var gradient_boosting_initial_visualization = new GradientBoostingInitialVisualization();


class GradientBoostingBuildingVisuzalization {
    constructor() {
        this.left_div = document.getElementById('gb_build_visualization_prediction');
        this.right_div = document.getElementById('gb_build_visualization_residual');

        this.depth_control = document.getElementById('gb_build_depth_control');
        this.depth_display = document.getElementById('gb_build_depth_display');

        this.estimator_control = document.getElementById('gb_build_estimator_control');
        this.estimator_display = document.getElementById('gb_build_estimator_display');

        this.dataset_control = document.getElementById('gb_build_dataset_select_control');

        this.trained_gb_regressors = Utils.create_2D_array(10);

        this.depth_control.oninput = () => {
            this.redraw();
        };
        this.estimator_control.oninput = () => {
            this.redraw();
        };

        this.dataset = new DatasetSelector(this.dataset_control, () => {
            this.redraw()
        });
        let ticks = this.dataset.axis_ticks;

        // target and boosting predictions
        Plotly.newPlot(this.left_div,
            [Utils.get_3d_plot(ticks, 0.95), Utils.get_3d_plot(ticks, 1.0)],
            one_column_3d_layout);

        Plotly.newPlot(this.right_div,
            [Utils.get_3d_plot(ticks, 0.95), Utils.get_3d_plot(ticks, 1.0)],
            one_column_3d_layout);

        // target and boosting predictions
        //Plotly.newPlot(this.left_div, [clone(function_plot), clone(prediction3d_plot)], one_column_3d_layout);
        // residual and tree predictions
        //Plotly.newPlot(this.right_div, [clone(function_plot), clone(prediction3d_plot)], one_column_3d_layout);

        this.redraw();
    }

    compute_prediction_and_residual(depth, estimator) {
        let [trainX, trainY, function_z_grid] = this.dataset.get_current_dataset();
        let axis_ticks = this.dataset.axis_ticks;
        let n_ticks = axis_ticks.length;
        let selected_dataset = this.dataset.selected_dataset;
        if (this.trained_gb_regressors[depth][selected_dataset] === undefined) {
            // save trained regressor
            let n_estimators = 12;
            let learning_rate = 0.3;
            this.trained_gb_regressors[depth][selected_dataset] =
                new GradientBoostingRegressor(trainX, trainY, n_estimators, depth, learning_rate);
        }
        let gb_reg = this.trained_gb_regressors[depth][selected_dataset];
        let tree = gb_reg.trees[estimator];

        let truncated_predict = function (x1, x2) {
            return gb_reg.predict_one_event([x1, x2], estimator)
        };
        let gb_truncated_predictions = Utils.compute_grid_for_function(axis_ticks, truncated_predict);
        let tree_predict = function (x1, x2) {
            return tree.predict_one_event([x1, x2])
        };
        let tree_predictions = Utils.compute_grid_for_function(axis_ticks, tree_predict);

        let residual = Utils.create_2D_array(n_ticks);
        for (let x_tick = 0; x_tick < n_ticks; x_tick++) {
            for (let y_tick = 0; y_tick < n_ticks; y_tick++) {
                residual[x_tick][y_tick] = function_z_grid[x_tick][y_tick] - gb_truncated_predictions[x_tick][y_tick];
            }
        }
        return [gb_truncated_predictions, residual, tree_predictions];
    }

    redraw() {
        let estimator = this.estimator_control.value;
        let depth = this.depth_control.value;
        this.estimator_display.innerHTML = estimator.toString();
        this.depth_display.innerHTML = depth.toString();

        let [prediction, residual, tree_prediction] = this.compute_prediction_and_residual(depth, estimator);
        let function_z_grid = this.dataset.get_current_dataset()[2];
        Plotly.restyle(this.left_div, {z: [function_z_grid]}, 0);
        Plotly.restyle(this.left_div, {z: [prediction]}, 1);
        Plotly.restyle(this.right_div, {z: [tree_prediction]}, 1);
        // this one takes damn long. I don't know why
        Plotly.restyle(this.right_div, {z: [residual]}, 0);
    }
}
var gradient_boosting_visualization = new GradientBoostingBuildingVisuzalization();


// Bind unfolding of descriptions
$('.explanation-preview').on('click', function () {
    let name = $(this).attr('data-explained');
    let found = $.find('.explanation-content[data-explained=' + name + ']');
    $(found).fadeIn(400);
});
