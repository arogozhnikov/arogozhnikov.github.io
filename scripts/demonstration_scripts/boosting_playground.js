// TODO unfolding of trees?
// TODO optimize drawing?
// TODO second-order xgboost-like building?
// TODO show losses vs show gradients on hover?
// TODO exploss, mse_loss for comparison?
// TODO show test data?


"use strict";

// everything is computed on the same grid in this demo
let n_ticks = 50;
let axis_ticks = [];
for (let x_tick = 0; x_tick < n_ticks; x_tick++) {
    axis_ticks.push((x_tick + 0.5) / n_ticks);
}

class PlaygroundVisualization {
    constructor() {
        this.main_canvas = this.getId('playground_visualization_canvas');
        this.main_canvas.width = this.main_canvas.height = 250;
        this.learning_curves_canvas = this.getId('playground_learning_curves_canvas');
        this.learning_curves_canvas.width = 250;
        this.learning_curves_canvas.height = 60;
        this.train_loss_display = this.getId('playground_train_loss_display');
        this.test_loss_display = this.getId('playground_test_loss_display');

        this.separate_trees_container_div = this.getId('playground_trees_container');
        this.prediction_label = this.getId('playground_prediction_label');
        this.depth_control = this.getId('playground_depth_control');
        this.depth_display = this.getId('playground_depth_display');
        this.rate_control = this.getId('playground_rate_control');
        this.rate_display = this.getId('playground_rate_display');
        this.ntrees_control = this.getId('playground_ntrees_control');
        this.ntrees_display = this.getId('playground_ntrees_display');
        this.subsample_control = this.getId('playground_subsample_control');
        this.subsample_display = this.getId('playground_subsample_display');
        this.angle_control = this.getId('playground_angle_control');
        this.rotate_trees_control = this.getId('playground_rotate_control');
        this.show_gradients_control = this.getId('playground_show_gradient_control');
        this.use_newton_raphson_control = this.getId('playground_use_newton_raphson');

        let redraw = () => {
            this.redraw();
        };
        this.rate_control.oninput = redraw;
        this.ntrees_control.oninput = redraw;
        this.depth_control.oninput = redraw;
        this.angle_control.oninput = redraw;
        this.subsample_control.oninput = redraw;
        this.rotate_trees_control.onchange = redraw;
        this.show_gradients_control.onchange = redraw;
        this.use_newton_raphson_control.onchange = redraw;

        this.invisible_canvas = document.createElement('canvas');
        this.invisible_canvas.width = n_ticks;
        this.invisible_canvas.height = n_ticks;

        this.color_scaler_points = Utils.create_fast_color_scaler(["#f59322", "#e8eaeb", "#0877bd"], 30);
        this.color_scaler_heatmap = Utils.create_fast_color_scaler(["#f5b362", "#e8eaeb", "#28a7cd"], 30);

        this.n_shown_trees = 30;
        this.n_trained_trees = 100;
        this.getId('span_n_shown_trees').innerHTML = this.n_shown_trees.toString();

        this.trees_canvases = [];
        this.plus_controls = [];

        // Canvases for separate trees
        for (let tree_id = 0; tree_id < this.n_shown_trees; tree_id++) {
            let canvas = document.createElement('canvas');
            canvas.setAttribute('class', 'separate_tree_visualization');
            canvas.width = n_ticks;
            canvas.height = n_ticks;
            // hover for canvas
            canvas.onmouseenter = canvas.ontouchstart = () => {
                this.redraw_main_canvas(1, tree_id);
            };
            canvas.onmouseleave = canvas.ontouchend  = () => {
                this.redraw_main_canvas(0, null);
            };

            let plus_control = document.createElement('div');
            plus_control.appendChild(document.createElement('div'));
            plus_control.setAttribute('class', 'plus_control_element');
            plus_control.onmouseenter = plus_control.ontouchstart = () => {
                this.set_participation_in_sum(tree_id + 1);
                this.redraw_main_canvas(2, tree_id);
            };
            plus_control.onmouseleave = plus_control.ontouchend = () => {
                this.set_participation_in_sum(0);
                this.redraw_main_canvas(0, null);
            };

            this.separate_trees_container_div.appendChild(canvas);
            this.separate_trees_container_div.appendChild(plus_control);
            this.trees_canvases.push(canvas);
            this.plus_controls.push(plus_control);
        }

        this.classification_datasets = collect_datasets(300, 42);
        this.classification_test_datasets = collect_datasets(300, 1234);
        this.selected_dataset_id = 2;
        this.redraw_datasets();
        this.redraw();
    }

    getId(id){
        let result = document.getElementById(id);
        console.assert(result != null, 'no such id');
        return result;
    }

    set_participation_in_sum(n_estimators) {
        // sets classes to elements participating in sum
        let previous_elements = document.getElementsByClassName('participates-in-sum');
        for (let i = previous_elements.length - 1; i >= 0 ; i--) {
            previous_elements[i].classList.remove('participates-in-sum');
        }
        for (let i = 0; i < n_estimators; i++) {
            this.trees_canvases[i].classList.add('participates-in-sum');
            this.plus_controls[i].classList.add('participates-in-sum');
        }
    }

    compute_store_predictions(trainX, trainY, testX, testY, depth, learning_rate,
                              n_estimators, subsample, rotate_trees, use_newton_raphson) {
        let gb_clf = new GradientBoostingClassifier(trainX, trainY, n_estimators, depth, learning_rate,
            subsample, rotate_trees, use_newton_raphson);
        this.n_trained_trees = n_estimators;
        this.computed_predictions = {};
        this.computed_predictions['trees'] = [];
        this.computed_predictions['stage_predictions'] = [];
        let cumulative_decision_function = Utils.compute_grid_for_function(axis_ticks, function (x1, x2) {
            return 0;
        });

        //for (let tree_id = 0; tree_id < this.n_shown_trees; tree_id++) {
        for (let tree_id = 0; tree_id < this.n_trained_trees; tree_id++) {
            let tree_prediction = Utils.compute_grid_for_function(axis_ticks, function (x1, x2) {
                return gb_clf._predict_one_event_by_tree([x1, x2], tree_id);
            });
            this.computed_predictions['trees'][tree_id] = tree_prediction;
            let stage_predictions = Utils.create_2D_array(n_ticks);
            for (let i = 0; i < n_ticks; i++) {
                for (let j = 0; j < n_ticks; j++) {
                    cumulative_decision_function[i][j] += gb_clf.learning_rate * tree_prediction[i][j];
                    stage_predictions[i][j] = 2 * GradientBoostingClassifier.sigmoid(cumulative_decision_function[i][j]) - 1;
                }
            }
            this.computed_predictions['stage_predictions'][tree_id] = stage_predictions;
        }

        // store for visualization
        this.trainX = trainX;
        this.trainY = trainY;
        this.testX = testX;
        this.testY = testY;
        [this.train_losses, this.train_gradients] = gb_clf.compute_learning_curve(trainX, trainY);
        [this.test_losses, this.test_gradients] = gb_clf.compute_learning_curve(testX, testY);
    }

    redraw() {
        let learning_rate = this.rate_control.value * 0.01;
        this.rate_display.innerHTML = learning_rate.toString().substr(0, 4);
        let ntrees = this.ntrees_control.value;
        this.ntrees_display.innerHTML = ntrees.toString();
        let depth = this.depth_control.value;
        this.depth_display.innerHTML = depth.toString();
        let subsample = this.subsample_control.value * 0.01;
        this.subsample_display.innerHTML = Math.ceil(subsample * 100).toString();

        this.show_gradients = this.show_gradients_control.checked ? 1 : 0;
        let use_newton_raphson = this.use_newton_raphson_control.checked ? 1 : 0;


        let rotation_angle = -this.angle_control.value / 180 * Math.PI;
        let rotate_trees = this.rotate_trees_control.checked ? 1 : 0;

        let [trainX, trainY] = this.classification_datasets[this.selected_dataset_id];
        let [testX, testY] = this.classification_test_datasets[this.selected_dataset_id];
        trainX = Utils.rotate_dataset(trainX, rotation_angle);
        testX = Utils.rotate_dataset(testX, rotation_angle);

        this.compute_store_predictions(trainX, trainY, testX, testY,
            depth, learning_rate, ntrees, subsample, rotate_trees, use_newton_raphson);

        this.redraw_main_canvas(0, null);
        this.redraw_trees_canvases();
        this.redraw_learning_curves();

    }

    draw_on_main_canvas(data, gradient_sizes) {
        let average_size = 3;
        gradient_sizes = gradient_sizes.map((x) => Math.sqrt(x));
        if(this.show_gradients) {
            let factor = average_size / Utils.compute_mean(gradient_sizes);
            for (let i = 0; i < gradient_sizes.length; i++) {
                gradient_sizes[i] *= factor;
            }
        } else {
            gradient_sizes = Array(gradient_sizes.length).fill(average_size);
        }

        Utils.plot_function_to_canvas(this.invisible_canvas, data, this.color_scaler_heatmap);
        this.main_canvas.getContext('2d').drawImage(this.invisible_canvas, 0, 0,
            this.main_canvas.width, this.main_canvas.height);
        Utils.plot_scatter_to_canvas(this.main_canvas, this.trainX, this.trainY,
            gradient_sizes, this.color_scaler_points);
    }

    redraw_main_canvas(mode, pointed_tree=null) {
        // special function for hover effect
        if (mode == 0) {
            let staged = this.computed_predictions['stage_predictions'];
            let gradient_sizes = Array(this.trainY.length).fill(1);
            this.draw_on_main_canvas(staged[staged.length - 1], gradient_sizes);
            this.prediction_label.innerHTML = "predictions of GB (all " + this.n_trained_trees.toString() + " trees)";
        } else if (mode == 1) {
            this.draw_on_main_canvas(this.computed_predictions['trees'][pointed_tree],
                this.train_gradients[pointed_tree]);
            this.prediction_label.innerHTML = "predictions of tree #"
                + (pointed_tree + 1).toString() + " <br /> and used gradients ";
        } else {
            // stage predictions
            this.draw_on_main_canvas(this.computed_predictions['stage_predictions'][pointed_tree],
                this.train_gradients[pointed_tree + 1]);
            this.prediction_label.innerHTML = "predictions of GB after building tree #"
                + (pointed_tree + 1).toString() + " <br /> and computed gradients";
        }
        this.redraw_learning_curves(pointed_tree);
    }

    redraw_trees_canvases() {
        // Drawing separate trees
        for (let tree_id = 0; tree_id < this.n_shown_trees; tree_id++) {
            let z_grid = this.computed_predictions['trees'][tree_id];
            let canvas = this.trees_canvases[tree_id];
            Utils.plot_function_to_canvas(canvas, z_grid, this.color_scaler_heatmap);
        }
    }

    redraw_datasets() {
        let wrapper_div = this.getId('classification_datasets');
        wrapper_div.innerHTML = "";
        for (let dataset_id = 0; dataset_id < this.classification_datasets.length; dataset_id++) {
            let canvas = document.createElement('canvas');
            canvas.width = 40;
            canvas.height = 40;
            canvas.className = 'dataset-preview';
            canvas.onclick = () => {
                this.selected_dataset_id = dataset_id;
                this.redraw();
                this.redraw_datasets();
            };
            if (dataset_id == this.selected_dataset_id){
                canvas.classList.add("selected-dataset-preview");
            }
            let dataset = this.classification_datasets[dataset_id];
            let sizes = Array(dataset[1].length).fill(1);
            Utils.plot_scatter_to_canvas(canvas, dataset[0], dataset[1], sizes, this.color_scaler_heatmap);
            wrapper_div.appendChild(canvas);
        }
    }

    redraw_learning_curves(pointed_tree=null){
        let canvas = this.learning_curves_canvas;
        // clearing
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        let maximum = this.train_losses[0] * 1.1;
        Utils.draw_function_on_canvas(canvas, this.train_losses, 0, maximum, '#888', pointed_tree);
        Utils.draw_function_on_canvas(canvas, this.test_losses, 0, maximum, '#000', pointed_tree);

        if(pointed_tree == null){
            pointed_tree = this.train_losses.length - 1;
        }
        this.train_loss_display.innerHTML = this.train_losses[pointed_tree].toFixed(3);
        this.test_loss_display.innerHTML = this.test_losses[pointed_tree].toFixed(3);
    }
}

let playground = new PlaygroundVisualization();
