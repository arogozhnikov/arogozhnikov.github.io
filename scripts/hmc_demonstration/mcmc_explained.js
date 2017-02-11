"use strict";

let rejected_color = [1.0, 0.6, 0.6 ];
let accepted_color = [0.6, 1.0, 0.6 ];
let true_point_color = [0.6, 0.6, 1.0];

class MCDatasetSelector {
    constructor(wrapper_div, on_dataset_change, {n_ticks = 45, selected_dataset=0} = {}) {
        // everything is computed on the same grid
        this.n_ticks = n_ticks;
        this.axis_ticks = [];
        for (let x_tick = 0; x_tick < n_ticks; x_tick++) {
            this.axis_ticks.push((x_tick + 1.) / (n_ticks + 1));
        }
        this.datasets = MCDatasetSelector.collect_toy_datasets(this.axis_ticks);

        this.wrapper_div = wrapper_div;
        let _colors = [{r: 0x28, g: 0xa7, b: 0xcd }, {r: 0xe8, g: 0xea, b: 0xeb}, {r: 0xf5, g: 0xb3, b: 0x62}];   
        this.color_scaler_heatmap = Utils.create_nonplotly_scaler(_colors, [0, 1.5]);

        for (let i = 0; i < this.datasets.length; i++) {
            let canvas = document.createElement('canvas');
            canvas.width = n_ticks;
            canvas.height = n_ticks;
            this.wrapper_div.appendChild(canvas);
            // hover for canvas
            canvas.onclick = () => {
                this.select_dataset(i);
            };
            Utils.plot_function_to_canvas(canvas, this.datasets[i][0], this.color_scaler_heatmap);
        }
        this.selected_dataset = selected_dataset;
        // trivial event for callback
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
        let i = 0;
        let children = Array.from(this.wrapper_div.children);
        for(let control of children) {
            control.classList.remove('selected');
            if( i == this.selected_dataset ) {
                control.classList.add('selected');
            }
            i += 1;
        }
    }

    static collect_toy_datasets(axis_ticks) {
        let distributions = [];

        // distributions.push(new GaussianDistribution());
        distributions.push(new GaussianDistribution([0., 0.], 0.8, 0.4));
        distributions.push(new SnakeDistribution());
        distributions.push(new MexicanHatDistribution());
        distributions.push(new GaussianMixtureDistribution(0.4, 0.4));
        // if you're not satisfied with previous datasets
        // distributions.push(new DoubleHoleDistribution());

        let datasets = [];
        for (let i = 0; i < distributions.length; i++) {
            let compute = (x, y) => distributions[i].energy([2 * x - 1, 2 * y - 1]);
            let z_grid = Utils.compute_grid_for_function(axis_ticks, compute);
            datasets.push([z_grid, distributions[i]]);
        }
        return datasets;
    }
}


function iterate_with_pauses(context, iterator){
    // animation_id allows only one iterating process to exist within single context
    // new 'process' has priority and automatically stops previous
    let animation_id = Date.now();
    context.animation_id = animation_id;

    function iterate(iterator){
        if (context.animation_id != animation_id) {
            return;
        }
        let {value, done} = iterator.next();
        if (!done) {
            setTimeout(() => {iterate(iterator);},  value * 1000.);
        } else {
            context.animation_id = null;
        }
    }
    // run iteration
    iterate(iterator);
}

class MCVisualization {
    constructor(
        wrapper_div, 
        {methods=['mh', 'hmc'], enable_tempering=false, selected_dataset=0, initial_temperature=4} = {}) {
        this.methods = methods;
        this.enable_tempering = enable_tempering;
        this.wrapper_div = wrapper_div;
        let control_template = document.getElementById('templates').getElementsByClassName('mc_visualization_wrapper')[0];
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


        let redraw = () => { this.redraw() };
        let update = () => { this.redraw({force_restart_animation: false}) };
        this.method_select_control.oninput = redraw;
        this.temperature_control.oninput = redraw;
        this.tempering_control.oninput = redraw;
        this.length_control.oninput = redraw;
        this.mh_spread_control.oninput = redraw;
        
        this.speed_control.oninput = () => {this.redraw({speed_changed: true, force_restart_animation: false})};
        this.show_generated_control.onchange = update;
        this.show_true_control.onchange = update;
        this.show_rejected_control.onchange = update;

        this.dataset = new MCDatasetSelector(this.dataset_control, redraw, {selected_dataset: selected_dataset});
        let ticks = this.dataset.axis_ticks;


        this.plot = new Plot3D(this.main_div, {});

        let distribution = this.dataset.get_current_dataset()[1];

        this.surface = this.plot.addSurfaceMesh((x, y) => distribution.energy([x, y]));
        this.true_distribution_points = this.plot.addDynamicPoints();
        this.generated_points = this.plot.addDynamicPoints();
        this.current_position_point = this.plot.addDynamicPoints({max_points: 1});
        this.current_position_point.points.material.size = 0.025;
        this.rejected_points = this.plot.addDynamicPoints();
        this.plot.addCoordinateGrid();
        this.hmc_trajectory = this.plot.addDynamicLine();

        // Identifier of currently running animation
        this.animation_id = null;

        this.hide_controls();

        this.redraw();
    }

    hide_controls() {
        if(this.methods.length == 1) {
            this.get_by_class('method_controls').style.display = 'none';
        }
        if(this.methods.indexOf('hmc') === -1) {
            $(this.wrapper_div).find('.hmc_only_control').hide(0);
//            for(let control of this.wrapper_div.getElementsByClassName('hmc_only_control')) {
//                control.style.display = 'none';
//            }
        }
        if(this.methods.indexOf('mh') === -1) {
            $(this.wrapper_div).find('.mh_only_control').hide(0);
//            for(let control of this.wrapper_div.getElementsByClassName('mh_only_control')) {
//                control.style.display = 'none';
//            }
        }  
        if(!this.enable_tempering) {
            $(this.wrapper_div).find('.tempering_only_control').hide(0);
//            for(let control of this.wrapper_div.getElementsByClassName('tempering_only_control')) {
//                control.style.display = 'none';
//            }
        }  
    }

    get_by_class(className){
        return this.wrapper_div.getElementsByClassName(className)[0];
    }

    setTruePoints(T) {
        this.true_distribution_points.flush();
        let [z_grid, distribution] = this.dataset.get_current_dataset();
        let points = []
        distribution.init_sampler();
        let random = new RandomGenerator(42);
        for(let i = 0; i < 1000; i++){
            let [x, y] = distribution.sample(T);
            let point = [x, y, distribution.energy([x, y]) + random.random_normal(0, 0.001)];
            points.push(this.plot.normalize_point(point));
        }
        this.true_distribution_points.set_points(points, true_point_color);
    }


    addCandidate(candidate_position, rejected) {
        let normalized_position = this.plot.normalize_point(candidate_position);
        if(rejected) {
            this.rejected_points.add_point(normalized_position, rejected_color);
        } else {
            this.generated_points.add_point(normalized_position, accepted_color);
        }
    }

    setCurrentPosition(position) {
        this.current_position_point.flush();
        this.current_position_point.add_point(this.plot.normalize_point(position), accepted_color);
    }

    redraw({force_restart_animation=true, speed_changed=false} = {}) {
        // collecting parameters
        let allowedT = [0.001, 0.003, 0.01, 0.03, 0.1, 0.3];
        let T = allowedT[this.temperature_control.value];
        this.temperature_display.innerHTML = T.toString();

        this._speed = ['slow', 'fast', 'instant'][this.speed_control.value];
        this._pause = [0.25, 0.05, 0.005][this.speed_control.value];
        this.speed_display.innerHTML = this._speed;

        let allowed_alpha = [1.00, 1.01, 1.02, 1.03, 1.04, 1.05, 1.06];
        let alpha = allowed_alpha[this.tempering_control.value];
        this.tempering_display.innerHTML = alpha.toString();

        let allowed_lengths = [20, 40, 60, 100, 150];
        let length = allowed_lengths[this.length_control.value];
        this.length_display.innerHTML = length.toString();

        let allowed_spreads = [0.02, 0.05, 0.1, 0.20, 0.4];
        let spread = allowed_spreads[this.mh_spread_control.value];
        this.mh_spread_display.innerHTML = spread.toString(); 

        let method = this.method_select_control.value;

        let show_true = this.show_true_control.checked;
        let show_generated = this.show_generated_control.checked;
        let show_rejected = this.show_rejected_control.checked;

        let [z_grid, distribution] = this.dataset.get_current_dataset();
        if(force_restart_animation) {
            // updating surface        
            let new_geometry = this.plot.generateSurfaceGeometry((x, y) => distribution.energy([x, y]));
            for(let mesh of Array.from(this.surface.children)){
                mesh.geometry.dispose();
                mesh.geometry = new_geometry; 
            }
            // updating true points
            this.setTruePoints(T);
        }

        this.true_distribution_points.points.material.visible = show_true;
        this.generated_points.points.material.visible = show_generated;
        this.rejected_points.points.material.visible = show_rejected;

        let context = this;

        function* animate() {
            let mc_sampler = new MCSampler(distribution, -0.65, -0.75);
            mc_sampler.set_temperature(T);
            context.generated_points.flush();
            context.rejected_points.flush();
            for(let iteration = 0; iteration < 2000; iteration++) {
                if(method == 'mh') {
                    let [result, candidate, rejected] = mc_sampler.generate_mh(spread);
                    context.addCandidate(candidate, rejected);
                    context.setCurrentPosition(result);
                } else {
                    let [result, candidate, rejected, trajectory_3d] = mc_sampler.generate_hmc({tempering_alpha: alpha, n_steps: length});
                    context.hmc_trajectory.set_points( trajectory_3d.map((x) => context.plot.normalize_point(x)));

                    for(let j=0; j < trajectory_3d.length; j++) {
                        context.hmc_trajectory.add_visible();
                        if (context._speed != 'instant') {
                            context.plot.redraw();
                            yield context._pause / 10;
                        }
                    }
                    context.addCandidate(candidate, rejected);
                    context.setCurrentPosition(result);
                }
                context.plot.redraw();
                context.hmc_trajectory.flush();
                yield context._pause;
            }
        }


        if(force_restart_animation
           || (speed_changed && (this.animation_id == null))) {
            iterate_with_pauses(context, animate());
        }

        this.dataset.redraw();
        this.plot.redraw();
    }
}

var mcmc_visualization = new MCVisualization(
    document.getElementById('mh_visualization_wrapper'),
    {methods: ['mh'], selected_dataset: 1});
var hmc_visualization = new MCVisualization(
    document.getElementById('hmc_visualization_wrapper'), 
    {methods: ['hmc'], enable_tempering: false, selected_dataset: 2});
var hmc_tempering_visualization = new MCVisualization(
    document.getElementById('hmc_tempering_visualization_wrapper'), 
    {methods: ['hmc'], enable_tempering: true, selected_dataset: 3, initial_temperature: 2});




class TemperatureVisualization {
    constructor(wrapper_div) {
        this.wrapper_div = wrapper_div;
        this.main_div = this.get_by_class('visualization');
        this.temperature_control = this.get_by_class('temperature_control');
        this.temperature_display = this.get_by_class('temperature_display');
        this.show_true_control = this.get_by_class('show_true_control');

        let redraw = () => { this.redraw() };
        this.temperature_control.oninput = redraw;
        this.dataset_control = this.get_by_class('dataset_control');        
        this.dataset = new MCDatasetSelector(this.dataset_control, redraw, {selected_dataset: 1});
        this.show_true_control.onchange = redraw;
        
        this.plot_energy = new Plot3D(this.get_by_class('visualization_left'), {width: 398, controlsDomElement: this.main_div}); // , display_zmax: 0.01
        this.plot_pdf = new Plot3D(this.get_by_class('visualization_right'), {width: 398, controlsDomElement: this.main_div});

        for(let plot of [this.plot_pdf, this.plot_energy]) {
            plot.camera.position.z = 1.8;
            plot.camera.position.y = 0.9;
            plot.orbit.minDistance = 0.5;
            plot.orbit.maxDistance = 2.0;
            // needed to fight slow scrolling
            plot.orbit.enableDamping = false;
        }

        // rotate when scrolling window
        let scrolled = 0.;
        window.onscroll = () => {
            let new_scrolled = window.pageYOffset || document.documentElement.scrollTop;
            for(let plot of [this.plot_pdf, this.plot_energy]) {
                plot.orbit.rotate_left( (new_scrolled - scrolled) * 0.001);
                plot.orbit.update();
            }
            scrolled = new_scrolled;
        }
 

        let distribution = this.dataset.get_current_dataset()[1];

        let min_color = new THREE.Vector3(0.0, 0.2, 0.4);
        let max_color = new THREE.Vector3(0.7, 0.2, 0.0);
        this.surface_pdf = this.plot_pdf.addSurfaceMesh((x, y) => distribution.energy([x, y]), min_color, max_color);
        this.surface_energy = this.plot_energy.addSurfaceMesh((x, y) => distribution.energy([x, y]));
        this.true_distribution_points = this.plot_energy.addDynamicPoints();
        this.true_distribution_points.points.material.size = 0.015;
        this.plot_energy.addCoordinateGrid();
        this.plot_pdf.addCoordinateGrid();
        this.redraw();        
    }

    get_by_class(className){
        return this.wrapper_div.getElementsByClassName(className)[0];
    }

    setTruePoints(T) {
        this.true_distribution_points.flush();
        let [z_grid, distribution] = this.dataset.get_current_dataset();
        let points = []
        distribution.init_sampler();
        for(let i = 0; i < 1500; i++){
            let [x, y] = distribution.sample(T);
            let point = [x, y, distribution.energy([x, y])];
            points.push(this.plot_energy.normalize_point(point));
        }
        this.true_distribution_points.set_points(points, true_point_color);
    }

    redraw(){
        let allowedT = [0.01, 0.03, 0.1, 0.3, 1.];
        let T = allowedT[this.temperature_control.value];
        this.temperature_display.innerHTML = T.toString();
        let [z_grid, distribution] = this.dataset.get_current_dataset();
        this.setTruePoints(T);

        this.true_distribution_points.points.material.visible = this.show_true_control.checked;

        let min_energy = 1e10;
        for(let x=0; x < 1; x+= 0.001) {
            min_energy = Math.min(min_energy, distribution.energy([x, x]));
        }

        let new_pdf_geometry = this.plot_pdf.generateSurfaceGeometry((x, y) => 0.95 * Math.exp(- (distribution.energy([x, y]) - min_energy) / T), 200);
        for(let mesh of this.surface_pdf.children){
            mesh.geometry.dispose();
            mesh.geometry = new_pdf_geometry; 
        }

        let new_energy_geometry = this.plot_pdf.generateSurfaceGeometry((x, y) => distribution.energy([x, y]), 50);
        for(let mesh of this.surface_energy.children){
            mesh.geometry.dispose();
            mesh.geometry = new_energy_geometry; 
        }

        this.plot_pdf.redraw();
        this.plot_energy.redraw();
        this.dataset.redraw();
    }
}

var temperature_visualization = new TemperatureVisualization(document.getElementById('temperature_visualization_wrapper'))


// Bind unfolding of descriptions
$('.explanation-preview').on('click', function () {
    let name = $(this).attr('data-explained');
    let found = $.find('.explanation-content[data-explained=' + name + ']');
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