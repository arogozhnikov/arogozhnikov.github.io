'use strict';

class DecisionTreeRegressor {
    // slow but clear implementation of decision tree.
    constructor(X, y, max_depth) {
        if (max_depth == 0 || y.length < 2) {
            this.is_leaf = true;
            this.leaf_prediction = Utils.compute_mean(y);
        } else {
            this.is_leaf = false;
            let split_and_value = DecisionTreeRegressor.compute_optimal_split(X, y);
            this.split_feature = split_and_value[0];
            this.split_value = split_and_value[1];
            let X_left = [];
            let y_left = [];
            let X_right = [];
            let y_right = [];

            for (let event_id = 0; event_id < X.length; event_id++) {
                let event_x = X[event_id];
                let event_y = y[event_id];
                if (this.predict_subtree(event_x) == 1) {
                    X_right.push(event_x);
                    y_right.push(event_y);
                } else {
                    X_left.push(event_x);
                    y_left.push(event_y);
                }
            }
            this.left_child = new DecisionTreeRegressor(X_left, y_left, max_depth - 1);
            this.right_child = new DecisionTreeRegressor(X_right, y_right, max_depth - 1);
        }
    }

    update_using_newton_raphson(X, antigradients, hessians){
        if(this.is_leaf){
            this.leaf_prediction = Utils.compute_sum(antigradients) / (Utils.compute_sum(hessians) + 1e-4);
        } else {
            let X_left = [];
            let g_left = [];
            let h_left = [];
            let X_right = [];
            let g_right = [];
            let h_right = [];

            for (let event_id = 0; event_id < X.length; event_id++) {
                let event_x = X[event_id];
                let event_g = antigradients[event_id];
                let event_h = hessians[event_id];
                if (this.predict_subtree(event_x) == 1) {
                    X_right.push(event_x);
                    g_right.push(event_g);
                    h_right.push(event_h);
                } else {
                    X_left.push(event_x);
                    g_left.push(event_g);
                    h_left.push(event_h);
                }
            }
            this.left_child.update_using_newton_raphson(X_left, g_left, h_left);
            this.right_child.update_using_newton_raphson(X_right, g_right, h_right);
        }
    }

    predict_subtree(x) {
        return x[this.split_feature] > this.split_value ? 0 : 1;
    }

    predict_leaf_id(x) {
        if (this.is_leaf) {
            return 1;
        }
        if (this.predict_subtree(x) == 1) {
            return 2 * this.right_child.predict_leaf_id(x) + 1;
        } else {
            return 2 * this.left_child.predict_leaf_id(x);
        }
    }

    predict_one_event(x) {
        if (this.is_leaf) {
            return this.leaf_prediction;
        }
        if (this.predict_subtree(x) == 1) {
            return this.right_child.predict_one_event(x);
        } else {
            return this.left_child.predict_one_event(x);
        }
    }

    static compute_optimal_split(X, y) {
        let y_sum = Utils.compute_sum(y);
        let best_gain = -1;
        let best_feature = 0;
        let best_split = -999;

        for (let feature = 0; feature < 2; feature++) {
            let feature_and_answer = [];
            for (let event_id = 0; event_id < y.length; event_id++) {
                feature_and_answer.push([X[event_id][feature], y[event_id]]);
            }
            feature_and_answer = feature_and_answer.sort((a, b) => a[0] - b[0]);

            let left_sum = 0.;

            for (let event_id = 0; event_id < feature_and_answer.length - 1; event_id++) {
                left_sum += feature_and_answer[event_id][1];
                let right_sum = y_sum - left_sum;
                let n_events_left = event_id + 1;
                let n_events_right = feature_and_answer.length - n_events_left;

                let gain = left_sum * left_sum / n_events_left + right_sum * right_sum / n_events_right;
                if (gain > best_gain) {
                    best_gain = gain;
                    best_feature = feature;
                    best_split = (feature_and_answer[event_id][0] + feature_and_answer[event_id + 1][0]) / 2.
                }
            }
        }
        return [best_feature, best_split];
    }
}

class GradientBoostingRegressor {
    constructor(X, y, n_estimators, max_depth, learning_rate) {
        this.max_depth = max_depth;
        this.learning_rate = learning_rate;
        this.trees = [];

        let event_predictions = new Array(y.length).fill(0.);

        for (let tree_id = 0; tree_id < n_estimators; tree_id++) {
            let target = Array(y.length);
            for (let event_id = 0; event_id < y.length; event_id++) {
                target[event_id] = y[event_id] - event_predictions[event_id];
            }
            let new_tree = new DecisionTreeRegressor(X, target, this.max_depth);
            this.trees.push(new_tree);

            for (let event_id = 0; event_id < y.length; event_id++) {
                event_predictions[event_id] += learning_rate * new_tree.predict_one_event(X[event_id]);
            }
        }
    }

    predict_one_event(x, n_trees) {
        n_trees = n_trees || this.trees.length;
        let prediction = 0;
        for (let tree_id = 0; tree_id < n_trees; tree_id++) {
            prediction += this.learning_rate * this.trees[tree_id].predict_one_event(x);
        }
        return prediction;
    }
}


class GradientBoostingClassifier {
    constructor(X, y, n_estimators, max_depth, learning_rate, subsample, use_random_rotations=true, use_newton_raphson=false) {
        this.max_depth = max_depth;
        this.learning_rate = learning_rate;
        this.trees = [];
        this.use_random_rotations = use_random_rotations;
        this.use_newton_raphson = use_newton_raphson;

        let event_predictions = new Array(y.length).fill(0.);

        for (let tree_id = 0; tree_id < n_estimators; tree_id++) {
            let target = Array(y.length);
            let hessians = Array(y.length);
            for (let event_id = 0; event_id < y.length; event_id++) {
                let sigmoid = GradientBoostingClassifier.sigmoid(event_predictions[event_id]);
                target[event_id] = y[event_id] - sigmoid;
                // this is wrong, but this is better for visualisation
                hessians[event_id] = 2 * sigmoid * (1 - sigmoid);
            }

            let tree_X = Utils.rotate_dataset(X, tree_id * this.use_random_rotations);
            let [subsampled_X, subsampled_target] = Utils.get_subsample(tree_X, target, subsample, tree_id);
            let new_tree = new DecisionTreeRegressor(subsampled_X, subsampled_target, this.max_depth);
            if (use_newton_raphson){
                new_tree.update_using_newton_raphson(tree_X, target, hessians);
            }
            this.trees.push(new_tree);

            for (let event_id = 0; event_id < y.length; event_id++) {
                event_predictions[event_id] += learning_rate * new_tree.predict_one_event(tree_X[event_id]);
            }
        }
    }

    static sigmoid(x) {
        return 1. / (1 + Math.exp(-x));
    }

    predict_one_event(x, n_trees) {
        n_trees = n_trees || this.trees.length;
        let prediction = 0;
        for (let tree_id = 0; tree_id < n_trees; tree_id++) {
            prediction += this.learning_rate * this._predict_one_event_by_tree(x, tree_id);
        }
        return GradientBoostingClassifier.sigmoid(prediction);
    }

    _predict_one_event_by_tree(x, tree_id) {
        let rotated_event = Utils.rotate_event(x, tree_id * this.use_random_rotations);
        return this.trees[tree_id].predict_one_event(rotated_event);
    }

    compute_learning_curve(X, y) {
        let losses = [Math.log(2)];
        let gradients = Utils.create_2D_array(this.trees.length);
        let event_predictions = new Array(y.length).fill(0);
        for (let tree_id = 0; tree_id < this.trees.length; tree_id++) {
            let loss = 0.;
            for (let event_id = 0; event_id < y.length; event_id++) {
                let signed_y = 2 * y[event_id] - 1;
                // important - first updating gradients, then modifying predictions.
                gradients[tree_id][event_id] = GradientBoostingClassifier.sigmoid(- signed_y * event_predictions[event_id]);
                event_predictions[event_id] += this.learning_rate * this._predict_one_event_by_tree(X[event_id], tree_id);
                loss += Math.log(1 + Math.exp(-signed_y * event_predictions[event_id]));
            }
            losses.push(loss / y.length);
        }
        return [losses, gradients];
    }
}
