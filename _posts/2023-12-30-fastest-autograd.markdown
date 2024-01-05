---
layout: post
title: Fastest Autograd in the West
excerpt: Who needs fast autograd? Seemingly everyone!
date: 2023-12-28 12:00:00
author: Alex Rogozhnikov
tags: 
- autograd
- optimization
meta: |
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Fastest Autograd in the West" />
    <meta property="og:description" content="Who needs fast autograd? Seemingly everyone!" />
    <meta property="og:url" content="https://arogozhnikov.github.io/2023/12/28/fastest-autograd.html" />
    <meta property="og:image" content="https://arogozhnikov.github.io/images/NFS_autograd.jpg" />

---


Who needs fast autograd? Seemingly everyone these days!

And once upon a time I needed an autograd that is **actually fast**.
Leaving project details aside, here are the requirements:

- we test many computation graphs (graph is changing constantly)
- many-many scalar operations with roughly **10k—100k nodes** in each graph
- every graph should be compiled and ran around **10k times** both forward and backward
- this should be done **wicked fast**, and with a convenient pythonic interface 

Path that awaits us ahead:
1. autograd in torch
2. autograd in jax
3. autograd in python
4. autograd in rust
5. autograd in C
6. autograd in assembly

Plus a significant amount of sloppy code and timings on M1 macbook.

### Let's autograd in pytorch

We start our journey with pytorch — the default autograd engine in research. 
We'll create a graph with many nodes, and to keep things simple our benchmark has only several kinds of operations: unary (softplus), binary (multiplication), n-ary (sum) and n-to-n (softmax). 

This allows using just a few operations, but resembles a realistic load.
All benchmarks in this post will reimplement the same logic as below.

```python
def run_graph(initial_variables, n_operations: int):
    nodes = [*initial_variables]

    for op in range(n_operations):
        match op % 4:
            case 0:
                # softplus
                nodes.append(F.softplus(nodes[-10]))
            case 1:
                # sum
                nodes.append(sum(nodes[-30:-10:5]))
            case 2:
                # prod
                nodes.append(nodes[-20] * nodes[-10])
            case 3:
                # softmax
                softmaxes = F.softmax(torch.stack(nodes[-4:], dim=0), dim=0)
                nodes.extend(softmaxes)

    return nodes


def run_benchmark_pytorch(n_iterations, n_operations):
    init_vars = torch.arange(100, dtype=torch.float32, requires_grad=True)
    for _ in range(n_iterations):
        nodes = run_graph(
            initial_variables=init_vars,
            n_operations=n_operations,
        )
        nodes[-1].backward()
```

Run-time for 10k ops x 100 iterations: 11.3 seconds
<br />Run-time for 10k ops x 10k iterations: **1130 seconds** (estimate)

Given we created 100M python objects, it's actually quite fast.
And yes, that's not going to deliver an interactive experience.

Let's also discuss `torch.compile`, a major innovation in pytorch 2.0.

At 100 operations torch.compile takes 4.5 seconds. 
Execution gets faster: for 100 operations and 10k iterations it takes 4.52 seconds with torch.compile and 10.4 seconds without. 
Compilation + execution are still in the same ballpark. 
For bigger graphs (1k operations) `torch.compile` crashes.

### Let's autograd in jax

Jax is the new cool kid... well, not that new anymore.
But in some aspects it is very interesting. Jax's focus on JIT-compiling static graphs is very suitable for the problem at hand.

Implementation for benchmark is similar to pytorch:
```python
import jax
import numpy as np

def run_graph_jax(initial_variables):
    nodes = [*initial_variables]
    for op in range(n_operations):
        match op % 4:
            case 0:
                # softplus
                nodes.append(jax.nn.softplus(nodes[-10]))
            case 1: 
                # sum
                nodes.append(sum(nodes[-30:-10:5]))
            case 2: 
                # prod 
                nodes.append(nodes[-20] * nodes[-10])
            case 3: 
                # softmax
                softmaxes = jax.nn.softmax(jax.numpy.stack(nodes[-4:]), axis=0)
                nodes.extend(softmaxes)
                
    return nodes[-1]

run_graph_and_grad = jax.value_and_grad(run_graph_jax)
# or 
run_graph_and_grad = jax.jit(jax.value_and_grad(run_graph_jax))
```

Without jit computations are extremely slow: 
<br /> 1k ops x 10 iterations => 15.9 seconds
<br /> 10k ops x 10k iterations => 159,000 seconds (estimate)

That's a bit longer than forever! But whole point of jax is to JIT-compile stuff. So let's do it.

jit: compilation of 1k ops = 47 seconds
<br /> jit: run-time for 1k ops x 10k iterations = 0.66 seconds
<br /> jit: 10k ops x 10k iterations (compilation + run-time) => **470 seconds** (estimate)

Speed up in execution time is more than impressive, but we spend  >99% of time compiling. 

#### Tensorflow
Someone will mention TF anyway. I'll leave this as an exercise for you, TF fans.

### Let's autograd in python 

Done with baselines, time to see if we can speed things up.

Let's create a simplistic pseudo-framework and see how it competes with previous candidates.
We'll implement a tape-like autograd where operations order is explicitly tracked in a tape.

<details markdown="1">
<summary class="code-summary">show autograd engine in plain python
</summary>
```python
class NaiveVar:
    def __init__(self, val):
        self.val = val
        self.grad = 0.
    
class NaiveTape:
    def __init__(self, input_values):
        self.ops = []
        
    def sum(self, *vars):
        res = NaiveVar(sum(v.val for v in vars))
        self.ops.append(('sum', vars, res))
        return res

    def prod(self, var1, var2):
        res = NaiveVar(var1.val * var2.val)
        self.ops.append(('prod', [var1, var2], res))
        return res

    def softmax(self, *vars):
        vals = [v.val for v in vars]
        maxval = max(vals)
        vals = [v - maxval for v in vals]
        denom = sum(math.exp(v) for v in vals)
        res = [NaiveVar(math.exp(v) / denom) for v in vals]
        self.ops.append(('softmax', vars, denom))
        return res

    def softplus(self, var):
        res = NaiveVar(math.log1p(math.exp(var.val)))
        self.ops.append(('splus', var, res))
        return res

    def backward(self, var):
        assert var.grad == 0
        var.grad += 1
        for op, inputs, outputs in self.ops[::-1]:
            match op:
                case 'sum':
                    out = outputs
                    for v in inputs:
                        v.grad += out.grad
                case 'prod':
                    out = outputs
                    in1, in2 = inputs
                    in1.grad += in2.val * out.grad
                    in2.grad += in1.val * out.grad
                case 'splus':
                    inputs.grad += out.grad / (1 + math.exp(-inputs.val))
                case 'softmax':
                    pass # skip for now
                case _:
                    raise NotImplementedError()
```
</details>

and reimplement reference task using our new pseudo-framework:
<details markdown="1">
<summary class="code-summary">show benchmarking code
</summary>
```python
def run_graph_python_and_backward(initial_variables, n_operations):
    nodes = [NaiveVar(x) for x in initial_variables]
    tape = NaiveTape(nodes)
    for op in range(n_operations):
        match op % 4:
            case 0: 
                # softplus
                nodes.append(tape.softplus(nodes[-10]))
            case 1: 
                # sum
                nodes.append(tape.sum(*nodes[-30:-10:5]))
            case 2: 
                # prod 
                nodes.append(tape.prod(nodes[-20], nodes[-10]))
            case 3: 
                # softmax
                nodes.extend(tape.softmax(*nodes[-4:]))

    tape.backward(nodes[-1])
    return tape
```
</details>

Run-time for 10k ops and 10k iterations: **312 seconds**.

Expectably not fast. But compared to previous candidates, that's actually quite competitive!

### Let's autograd in python, again

This time we move all values into tape instead of keeping in variables. 
Additionally tape will keep a 'static graph' of computations by recording indices of variables participating in every operation. 

<details markdown="1">
<summary class="code-summary">show code for autograd in plain python
</summary>
```python
import numba
import math

class VarInd:
    def __init__(self, index):
        self.index = index # variable is just a unique index in tape
    
class TapeInd:
    def __init__(self):
        self.ops = []
        self.vals = []  # flat memory with values
        self.grads = [] # flat memory with gradients

    def make_var(self, value):
        self.vals.append(value)
        self.grads.append(0.)
        return VarInd(len(self.vals) - 1)

    def val(self, v: VarInd):
        return self.vals[v.index]

    def add_op(self, kls, input_vars, output_vars):
	    # translate variable to indices. self.ops keeps only indices
        self.ops.append((kls, [x.index for x in input_vars], [x.index for x in output_vars]))        
        
    def sum(self, *vars):
        res = self.make_var(sum(self.val(v) for v in vars))
        self.add_op('sum', vars, [res])
        return res

    def prod(self, var1, var2):
        res = self.make_var(self.val(var1) * self.val(var2))
        self.add_op('prod', [var1, var2], [res])
        return res

    def softmax(self, *vars):
        vals = [self.val(v) for v in vars]
        maxval = max(vals)
        vals = [v - maxval for v in vals]
        denom = sum(math.exp(v) for v in vals)
        res = [self.make_var(math.exp(v) / denom ) for v in vals]
        self.add_op('softmax', vars, res)
        return res

    def softplus(self, var):
        res = self.make_var(math.log1p( math.exp(self.val(var)) ))
        self.add_op('splus', [var], [res])
        return res

    def forward_backward_external(self, grad_var: VarInd):
        return forward_backward_optimal(self.vals, self.grads, self.ops, grad_var_index=grad_var.index)

def forward_backward_external(
	vals: list[float], 
	grads: list[float], 
	ops: list[tuple[str, list[int], list[int]]],
	grad_var_index: int
):
    v: list[float] = vals
    g: list[float] = grads
    # forward pass
    for op, ins, outs in ops:
        match op:
            case 'sum':
                v[outs[0]] = sum(v[i] for i in ins)
            case 'prod':
                v[outs[0]] = v[ins[0]] * v[ins[1]]
            case 'splus':
                v[outs[0]] = math.log1p(math.exp( v[ins[0]] ))
            case 'softmax':
                maximal = max(v[i] for i in ins)
                exps = [math.exp(v[i] - maximal) for i in ins]
                denom = sum(outs)
                for i, exp in zip(outs, exps):
                    v[i] = exp / denom

    g[grad_var_index] += 1

	# backward pass
    for op, ins, outs in ops[::-1]:
        match op:
            case 'sum':
                for i in ins:
                    g[i] += g[outs[0]]
            case 'prod':
                out: int = outs[0]
                in1, in2 = ins
                g[in1] += v[in2] * g[out]
                g[in2] += v[in1] * g[out]
            case 'splus':
                g[ins[0]] += g[outs[0]] / (1 + math.exp(-v[ins[0]]))
            case 'softmax':
				avg_grad = sum(v[j] * g[j] for j in outs)
				for i, j in zip(ins, outs):
					g[i] += v[j] * (g[j] - avg_grad)
```
and corresponding launching code
```python
def run_graph_python_and_backward(n_operations, n_iterations):
    tape = TapeInd()
    nodes = [tape.make_var(float(x)) for x in range(100)]
    
    for op in range(n_operations):
        match op % 4:
            case 0: 
                # softplus
                nodes.append(tape.softplus(nodes[-10]))
            case 1: 
                # sum
                nodes.append(tape.sum(*nodes[-30:-10:5]))
            case 2: 
                # prod 
                nodes.append(tape.prod(nodes[-20], nodes[-10]))
            case 3: 
                # softmax
                softmaxes = tape.softmax(*nodes[-4:])
                nodes.extend(softmaxes)

    for _ in range(n_iterations):
        tape.forward_backward(nodes[-1])
```
</details>

Run-time for 10k ops x 10k iterations: **94 seconds** 

As we see, moving all values into tape and switching to operating on indices is quite an efficient strategy. 
We still use python, but are now ~5-10 fold faster than `pytorch` or `jax`.

At this point, I want to mention one more experiment: code above is organized to be `numba`-friendly. 
[Numba](https://numba.readthedocs.io/en/stable/) is famous for speeding up number crunching in python with minimal changes by providing just-in-time compilation. 
Recent addition of `numba.typed.List`  makes it possible to efficiently handle list of lists.

Run-time with numba, 10k ops x 10k iterations: **41 second**. <br />
At this point we're >10-fold faster than jax/pytorch (and still writing code in python). 

### Let's autograd in rust

Once we moved graph tracking to tape, we can now use something fast to run computations for us. For instance, rust. 
For rust↔python interop I've used a small wrapper around [rustimport](https://github.com/mityax/rustimport).
`Rustimport` allows to conveniently "import" a single rust file without creating a full-fledged rust project.

Some optimization remarks:
-  `softmax` was a bottleneck, so I switched to creating temporary arrays on stack instead of Vecs, which required specializing on input sizes
- I followed rust-y approach with iterators to reduce number of boundary checks 
- I wondered if match with multiple options checked one-by-one is slow. In synthetic tests it seemed to be relatively fast, but I wish jump table optimization was implemented here
  (e.g. it is supported for [enums](https://users.rust-lang.org/t/match-statement-efficiency/4488) in rust, 
  and clang [uses](https://stackoverflow.com/questions/60109992/why-is-a-switch-not-optimized-the-same-way-as-chained-if-else-in-c-c) this optimization in C for switch-case)


<details markdown="1">
<summary class="code-summary">show rust code for minimal autograd
</summary>
```rust
// rustimport:pyo3
use pyo3::prelude::*;


// slower softmax version for larger number of inputs
fn softmax_varlength(vals: &mut Vec<f32>, ins: &[usize], outs: &[usize]) {
    let mut max = -1e20_f32;
    let loc_vals: Vec<f32> = ins.into_iter().map(|i| { let x = vals[*i]; max = max.max(x); x} ).collect();
    let mut sum: f32 = 0.0_f32;
    let exps: Vec<f32> = loc_vals.iter().map(|v| {let _exp = f32::exp(*v - max); sum += _exp; _exp}).collect();
    outs.iter().zip(exps.iter()).for_each(|(j, exp)| vals[*j] = exp / sum );
}


// vecs are slow! so allocate slices on stack, and explicit grouping of computations also helps
fn softmax<const N: usize>(vals: &mut Vec<f32>, ins: &[usize], outs: &[usize]) {
    let mut loc_vals: [f32; N] = [0_f32; N];
    let mut exps: [f32; N] = [0_f32; N];
    let mut max = -1e20_f32;
    let mut sum: f32 = 0.;
    for (n, i) in ins.into_iter().enumerate() {
        let v = vals[*i];
        loc_vals[n] = v;
        max = max.max(v);
    }
    for (n, _i) in ins.into_iter().enumerate() {
        let exp = f32::exp(loc_vals[n] - max);
        exps[n] = exp;
        sum += exp;
    }
    let invsum = 1.0_f32 / sum;
    for (n, j) in outs.into_iter().enumerate() {
        vals[*j] = exps[n] * invsum;
    }
}

fn sigmoid(x: f32) -> f32 {
    1.0 / (1.0 + (-x).exp())
}


#[pyfunction]
unsafe fn autograd(
    vals_input: Vec<f32>,
    ops: Vec<i32>,
    input_ids: Vec<Vec<usize>>, 
    output_ids: Vec<Vec<usize>>,
    backward_node_id: usize,
    n_iteration: i32,
) -> (Vec<f32>, Vec<f32>) {
    let mut vals: Vec<f32> = vals_input.iter().map(|x| *x).collect();
    let mut grad: Vec<f32> = vals_input.into_iter().map(|_| 0.0_f32).collect();

    for _ in 0..n_iteration {
        for (i_op, op) in ops.iter().enumerate(){
            let ins: &Vec<usize> = &input_ids[i_op];
            let outs: &Vec<usize> = &output_ids[i_op];
            
            match op {
                0 => {
                    // softplus
                    let x = vals[ins[0]];
                    let max = f32::max(0., x);
                    let min = f32::min(0., x);
                    vals[outs[0]] = max + f32::ln_1p(f32::exp(min - max));
                }
                1 => {
                    // sum
                    vals[outs[0]] = ins.iter().map(|i| vals.get_unchecked(*i)).sum();
                }
                2 => {
                    // prod
                    vals[outs[0]] = vals[ins[0]] * vals[ins[1]];
                }
                3 => {
                    // softmax. we will need switch-case resolution here for most common cases
                    match ins.len() {
                        1 => {softmax::<1>(&mut vals, &ins, &outs)}
                        2 => {softmax::<2>(&mut vals, &ins, &outs)}
                        3 => {softmax::<3>(&mut vals, &ins, &outs)}
                        4 => {softmax::<4>(&mut vals, &ins, &outs)}
                        5 => {softmax::<5>(&mut vals, &ins, &outs)}
                        _ => {softmax_varlength(&mut vals, &ins, &outs)}
                    }
                }
                _ => { panic!(""); }
           }
        }
        grad[backward_node_id] = 1.;
        
        for (i_op, op) in ops.iter().enumerate(){
            let ins: &Vec<usize> = &input_ids[i_op];
            let outs: &Vec<usize> = &output_ids[i_op];
            
            match op {
                0 => {
                    // softplus
                    grad[ins[0]] += grad[outs[0]] * sigmoid(vals[ins[0]]);
                }
                1 => {
                    // sum
                    ins.iter().for_each(|i| grad[*i] += grad[outs[0]]);
                }
                2 => {
                    // prod
                    grad[ins[0]] += grad[outs[0]] * vals[ins[1]];
                    grad[ins[1]] += grad[outs[0]] * vals[ins[0]];
                }
                3 => {
	                // softmax
                    let avg_grad: f32 = outs.iter().map(|j| grad[*j] * vals[*j] ).sum();
                    for (i, j) in ins.iter().zip(outs.iter()) {
                        grad[*i] += vals[*j] * (grad[*j] - avg_grad);
                    }
                }
                _ => { panic!(""); }
           }
        }        
    }
    (vals, grad)
}
```
</details>

Run-time for 10k ops x 10k iterations: **1.4 seconds**

Success: we are in the realm of interactive experiences. <br />
Recall we started from >1000 seconds. But should we stop here?

### Let's autograd in C

Time to implement autograd logic in C. 
For interop with python I use [python-cffi](https://cffi.readthedocs.io/en/stable/index.html). 

I went bananas on optimization:
- I used the fact that output nodes are placed consequentially in memory, so we pass only index of the first output
- number of inputs is limited to 8, and those are baked into struct as `int[8]`, not `int *`  to avoid jumps in memory
- dynamic stack allocations of variable size (compared to rust, those are straightforward in C)
- `-O3`, and unsafe math: `-ffast-math`. Even experimented memory alignment and restrict-ing pointers, but no luck

<details markdown="1">
<summary class="code-summary">show me some code in C
</summary>
```cpp
#include <math.h>

typedef struct { 
    int opcode;
    size_t n_arguments; // used for softmax and sum
    int ins[8];         // at most 8 inputs
    int out;            // points to the first output variable
} MyOperation;


MyOperation * allocate_memory(int n_elements) {
    return (MyOperation *) malloc(sizeof(MyOperation) * n_elements);
}

// stable implementation
double logaddexp(double x, double y) {
    if (x > y) { return x + log1p(exp(y - x)); }
    else       { return y + log1p(exp(x - y)); }
}

double sigmoid(double x) { return 1.0 / (1.0 + exp(-x)); }

void run_multiple_passes(
    int n_operations,
    MyOperation *ops,
    double *values,
    double *grads,
    int n_iterations
) {
    for(int iteration = 0; iteration < n_iterations; iteration++) {
        for(int operation = 0; operation < n_operations; operation++) {
            MyOperation op = ops[operation];
            switch(op.opcode) {
                case 1: 
                    values[op.out] = logaddexp(0., values[op.ins[0]]);
                    break;
                case 2: 
                    {
                        double out = 0.;
                        for(size_t i=0; i < op.n_arguments; i++) {
                            out += values[op.ins[i]];
                        }
                        values[op.out] = out;
                    }
                    break;
                case 3:
                    values[op.out] = values[op.ins[0]] * values[op.ins[1]];
                    break;
                case 4:
                    {
                        double maximal = -1e20;
                        size_t n_arg = (size_t) op.n_arguments;
                        for(size_t i = 0; i < n_arg; i++) {
                            maximal = fmax(maximal, values[op.ins[i]]);
                        }
                        double exps[n_arg];
                        double sum = 0;
                        for(size_t i = 0; i < n_arg; i++) {
                            exps[i] = exp(op.ins[i] - maximal);
                            sum += exps[i];
                        }
                        for(size_t i = 0; i < n_arg; i++) {
                            values[op.out + i] = exps[i] / sum;
                        }
                    }
                    break;
            }
        }  // end forward

        // TODO set grad for target variable.

        for(int operation = 0; operation < n_operations; operation++) {
            MyOperation op = ops[n_operations - 1 - operation];
            switch(op.opcode) {
                case 1: 
                    grads[op.ins[0]] += grads[op.out] * sigmoid(values[op.ins[0]]);
                    break;
                case 2: 
                    {
                        for(size_t i=0; i < op.n_arguments; i++) { grads[op.ins[i]] += grads[op.out]; }
                    }
                    break;
                case 3:
                    grads[op.ins[0]] += grads[op.out] * values[op.ins[1]];
                    grads[op.ins[1]] += grads[op.out] * values[op.ins[0]];
                    break;
                case 4:
                    {
                        size_t n_arg = (size_t) op.n_arguments;
                        double avg_grad = 0.0;
                        for(size_t i = 0; i < n_arg; i++) {
                            avg_grad += values[op.out + i] * grads[op.out + i];
                        }
                        for(size_t i = 0; i < n_arg; i++) {
                            grads[op.ins[i]] += values[op.out + i] * (grads[op.out + i] - avg_grad);
                        }
                    }
                    break;
            }
        }  // end backward
    }
}
```
</details>

Run-time for 10k ops x 10k iterations: **0.99 second**

I liked ergonomics of rust better, but achieving high speed in C is way easier.
Rust's interop with python is also way more convenient.

### Let's autograd in C (again)

Another approach I've taken is to 'compile' traced graph to C.
So python produces a long C file where operations are called one-by-one with explicit indices, something like
```cpp
...
vals[215] = vals[195] * vals[205];
vals[216] = vals[196] + vals[201] + vals[204];
... // etcetc, and then backward steps are also written the same way
```

Source code is lengthy, outputs are enormous, and to speed up compilation we can set `-O0` in clang. Using `-O0` produces slower binaries, but interestingly *did not* speed up compilation.
Best results I got are around 1 minute for compilation and 1 second for a full run. Surprisingly, eliminating switch/case and memory lookups for arguments did not result in faster execution.

Given that recompilation is needed any time the graph is changed, real time experienced by user is 1 minute. That's a no go.


### Assembly

In this endeavor to get maximal speed, I decided to go down to assembly. Otherwise it feels like an incomplete journey. 
We can map a computational graph to just a set of low-level instruction, and avoid "costly" compilation.
These days x86/64 is not a king anymore, but neither armv7/armv8 is — 
and writing assembly for several architectures is totally unreasonable.

So ... how about using webassembly? It is low-level, fast to compile, and still cross-platform. Projects like `wasmer`/`wasmtime` allow interacting with wasm code from other languages.
That's my first encounter with WASM, and I've got quite positive impression: WASM mixes lisp-style syntax (for efficient streaming parsing) and execution model of stack machine. 
Unlike canonical stack machines, and unlike canonical assembly, WASM allows grouping expressions, e.g.

```lisp
;; canonical stack-machine way to compute a * b + c
(local.get $a)
(local.get $b)
f32.mul
(local.get $c)
f32.add

;; another way to say write the same, also perfectly legal in wasm
(f32.add 
    (f32.mul (local.get $a) (local.get $b))  
    (local.get $c) 
)
```

This convenience allows writing significantly more readable code in WASM compared to ye-olde-assembly. 
Level of abstraction looks just right to me — low-level instructions, but no need to manage register allocations.

Webassembly is still very close to assembly in terms of instructions, i.e. there is no `exp`, `log`, let alone `log1p`  and alike. 
Fortunately, there is a WASM [implementation](https://gist.github.com/going-digital/02e46c44d89237c07bc99cd440ebfa43) of `exp2`/`log2` by Peter Knight. 

My major question was if speed of exponentiation is going to be sufficient, as `exp` consumes significant time in C implementation. 
Alas, in a simple benchmark computing just exponents in wasm takes ~1.9 seconds, leaving it behind rust/C. 
For reference, javascript computes the same number of exponents in 0.7 seconds.
Hence, I take WASM branding of 'near-native speed' with a grain of salt, at least in the context of number crunching. 
Hopefully this will improve, but for now WASM is out of competition.


## Summary

So, we achieved a **1000X speed up** compared to leading libraries.

I don't find this surprising — major usecase for autograd system is manipulating large ndarrays. 
Memory management, copy elimination, device synchronization, parallelization of computations — these things are the main focus, 
and throughput of 1 million ops per second is totally reasonable for the vast majority of scenarios and users.

Not for me though. My scenario is totally different in terms of numbers and setup, and tensor-focused autograds are too slow.
For the problem at hand departing from the common autograd systems was the right and the only possible choice.
Exploring different options was quite fun, and my expectations were challenged several times along this exploration.


<div style="text-align: center; font-size: 40px; padding: 110px">👋</div>

❗ I'm currenlty open for new positions. Details in [github profile](https://github.com/arogozhnikov).
