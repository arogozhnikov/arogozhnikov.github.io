'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DecisionTreeRegressor = function () {
    // slow but clear implementation of decision tree.

    function DecisionTreeRegressor(X, y, max_depth) {
        _classCallCheck(this, DecisionTreeRegressor);

        if (max_depth == 0 || y.length < 2) {
            this.is_leaf = true;
            this.leaf_prediction = y.reduce(function (a, b) {
                return a + b;
            }, 0) * 1. / y.length;
        } else {
            this.is_leaf = false;
            var split_and_value = DecisionTreeRegressor.compute_optimal_split(X, y);
            this.split_feature = split_and_value[0];
            this.split_value = split_and_value[1];
            var X_left = [];
            var y_left = [];
            var X_right = [];
            var y_right = [];

            for (var event_id = 0; event_id < X.length; event_id++) {
                var event_x = X[event_id];
                var event_y = y[event_id];
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

    _createClass(DecisionTreeRegressor, [{
        key: 'predict_subtree',
        value: function predict_subtree(x) {
            return x[this.split_feature] > this.split_value ? 0 : 1;
        }
    }, {
        key: 'predict_leaf_id',
        value: function predict_leaf_id(x) {
            if (this.is_leaf) {
                return 1;
            }
            if (this.predict_subtree(x) == 1) {
                return 2 * this.right_child.predict_leaf_id(x) + 1;
            } else {
                return 2 * this.left_child.predict_leaf_id(x);
            }
        }
    }, {
        key: 'predict_one_event',
        value: function predict_one_event(x) {
            if (this.is_leaf) {
                return this.leaf_prediction;
            }
            if (this.predict_subtree(x) == 1) {
                return this.right_child.predict_one_event(x);
            } else {
                return this.left_child.predict_one_event(x);
            }
        }
    }], [{
        key: 'compute_optimal_split',
        value: function compute_optimal_split(X, y) {
            var y_sum = y.reduce(function (a, b) {
                return a + b;
            }, 0.);
            var best_gain = -1;
            var best_feature = 0;
            var best_split = -999;

            for (var feature = 0; feature < 2; feature++) {
                var feature_and_answer = [];
                for (var event_id = 0; event_id < y.length; event_id++) {
                    feature_and_answer.push([X[event_id][feature], y[event_id]]);
                }
                feature_and_answer = feature_and_answer.sort(function (a, b) {
                    return a[0] - b[0];
                });

                var left_sum = 0.;

                for (var _event_id = 0; _event_id < feature_and_answer.length - 1; _event_id++) {
                    left_sum += feature_and_answer[_event_id][1];
                    var right_sum = y_sum - left_sum;
                    var n_events_left = _event_id + 1;
                    var n_events_right = feature_and_answer.length - n_events_left;

                    var gain = left_sum * left_sum / n_events_left + right_sum * right_sum / n_events_right;
                    gain += Math.random() * 1e-5;
                    if (gain > best_gain) {
                        best_gain = gain;
                        best_feature = feature;
                        best_split = (feature_and_answer[_event_id][0] + feature_and_answer[_event_id + 1][0]) / 2.;
                    }
                }
            }
            return [best_feature, best_split];
        }
    }]);

    return DecisionTreeRegressor;
}();

var GradientBoostingRegressor = function () {
    function GradientBoostingRegressor(X, y, n_estimators, max_depth, learning_rate) {
        _classCallCheck(this, GradientBoostingRegressor);

        this.max_depth = max_depth;
        this.learning_rate = learning_rate;
        this.trees = [];

        var event_predictions = new Array(y.length).fill(0.);

        for (var tree_id = 0; tree_id < n_estimators; tree_id++) {
            var target = Array(y.length);
            for (var event_id = 0; event_id < y.length; event_id++) {
                target[event_id] = y[event_id] - event_predictions[event_id];
            }
            var new_tree = new DecisionTreeRegressor(X, target, this.max_depth);
            this.trees.push(new_tree);

            for (var _event_id2 = 0; _event_id2 < y.length; _event_id2++) {
                event_predictions[_event_id2] += learning_rate * new_tree.predict_one_event(X[_event_id2]);
            }
        }
    }

    _createClass(GradientBoostingRegressor, [{
        key: 'predict_one_event',
        value: function predict_one_event(x, n_trees) {
            n_trees = n_trees || this.trees.length;
            var prediction = 0;
            for (var tree_id = 0; tree_id < n_trees; tree_id++) {
                prediction += this.learning_rate * this.trees[tree_id].predict_one_event(x);
            }
            return prediction;
        }
    }]);

    return GradientBoostingRegressor;
}();

var GradientBoostingClassifier = function () {
    function GradientBoostingClassifier(X, y, n_estimators, max_depth, learning_rate) {
        var use_random_rotations = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];

        _classCallCheck(this, GradientBoostingClassifier);

        this.max_depth = max_depth;
        this.learning_rate = learning_rate;
        this.trees = [];
        this.use_random_rotations = use_random_rotations;

        var event_predictions = new Array(y.length).fill(0.);

        for (var tree_id = 0; tree_id < n_estimators; tree_id++) {
            var target = Array(y.length);
            for (var event_id = 0; event_id < y.length; event_id++) {
                target[event_id] = y[event_id] - GradientBoostingClassifier.sigmoid(event_predictions[event_id]);
            }

            var tree_X = Utils.rotate_dataset(X, tree_id * this.use_random_rotations);
            var new_tree = new DecisionTreeRegressor(tree_X, target, this.max_depth);
            this.trees.push(new_tree);

            for (var _event_id3 = 0; _event_id3 < y.length; _event_id3++) {
                event_predictions[_event_id3] += learning_rate * new_tree.predict_one_event(tree_X[_event_id3]);
            }
        }
    }

    _createClass(GradientBoostingClassifier, [{
        key: 'predict_one_event',
        value: function predict_one_event(x, n_trees) {
            n_trees = n_trees || this.trees.length;
            var prediction = 0;
            for (var tree_id = 0; tree_id < n_trees; tree_id++) {
                prediction += this.learning_rate * this._predict_one_event_by_tree(x, tree_id);
            }
            return GradientBoostingClassifier.sigmoid(prediction);
        }
    }, {
        key: '_predict_one_event_by_tree',
        value: function _predict_one_event_by_tree(x, tree_id) {
            var rotated_event = Utils.rotate_event(x, tree_id * this.use_random_rotations);
            return this.trees[tree_id].predict_one_event(rotated_event);
        }
    }, {
        key: 'compute_learning_curve',
        value: function compute_learning_curve(X, y) {
            var losses = [Math.log(2)];
            var event_predictions = new Array(y.length).fill(0);
            for (var tree_id = 0; tree_id < this.trees.length; tree_id++) {
                var loss = 0.;
                //let tree = this.trees[tree_id];
                for (var event_id = 0; event_id < y.length; event_id++) {
                    event_predictions[event_id] += this.learning_rate * this._predict_one_event_by_tree(X[event_id], tree_id);
                    var signed_y = 2 * y[event_id] - 1;
                    loss += Math.log(1 + Math.exp(-signed_y * event_predictions[event_id]));
                }
                losses.push(loss / y.length);
            }
            return losses;
        }
    }], [{
        key: 'sigmoid',
        value: function sigmoid(x) {
            return 1. / (1 + Math.exp(-x));
        }
    }]);

    return GradientBoostingClassifier;
}();

//# sourceMappingURL=gradient_boosting-compiled.js.map