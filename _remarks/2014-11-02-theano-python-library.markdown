---
layout: post
title: Theano (python library)
date: '2014-11-01T14:28:00.001-07:00'
author: Alex Rogozhnikov
tags:
- Theano
- Python
- Neural Networks
modified_time: '2014-11-23T12:59:14.267-08:00'
permalink: /2014/11/01/theano-python-library.html
---

If you want to experiment with neural networks, and you know Python, then my best recommendation is: use Theano.

Theano is not about neural networks, really – it is ... hm ... a mathematical engine. Something between Matlab and Mathematica.
- It is close to Matlab because it uses vectorization (the final function will operate on vectors).
- It is close to Mathematica because first you define some expressions (functions as analytical expressions). You can compute (analytical) derivatives, which is crucial for neural networks because the main thing you need is derivatives, and nobody wants to spend time computing derivatives manually, especially when a library can do this for you.

After you define the needed function-expressions (e.g., activation function and gradient of the loss function for a neural network), you can compile them with Theano (resulting in a function that can be evaluated for some arguments). The compiled function is vectorized and very fast (though compilation usually takes some time). Your functions can also be evaluated on a GPU.

This allows you to define your **new** neural networks in a few lines of code (just by defining the activation function). Impressive?

- [Documentation on Theano](http://deeplearning.net/software/theano/)
- [GitHub](https://github.com/Theano/Theano/)
- [Examples](http://deeplearning.net/tutorial/) (mostly about neural networks, probably the easiest way to start and understand how good Theano is)

Even more examples (with less explanation) can be found [here](https://github.com/lisa-lab/DeepLearningTutorials/tree/master/code).
