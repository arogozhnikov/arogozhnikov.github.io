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

If you're interested in experimenting with neural networks and you know Python, my top recommendation is to use Theano.

Theano isn’t strictly about neural networks – it’s more of a mathematical engine, somewhere between Matlab and Mathematica:  
- It’s similar to Matlab because it uses vectorization (the resulting functions operate on vectors).  
- It’s akin to Mathematica because you first define expressions (functions as analytical formulas). You can compute analytical derivatives, which is critical for neural networks. Derivatives are essential, but no one wants to spend time calculating them manually, especially when a library can handle this for you.

Once you've defined the necessary function expressions (such as the activation function and the gradient of the loss function for a neural network), you can compile them with Theano. This gives you an efficient, compiled function that can evaluate arguments quickly. The compiled functions are vectorized and highly optimized (although the compilation process can take some time). Additionally, these functions can run on a GPU for even better performance.

This capability allows you to define **new** neural networks in just a few lines of code, simply by specifying the activation function. Impressive, isn’t it?

- [Documentation on Theano](http://deeplearning.net/software/theano/)  
- [GitHub](https://github.com/Theano/Theano/)  
- [Examples](http://deeplearning.net/tutorial/) (primarily focused on neural networks, making it an excellent starting point to see the power of Theano)  

Even more examples (with less explanation) can be found [here](https://github.com/lisa-lab/DeepLearningTutorials/tree/master/code).
