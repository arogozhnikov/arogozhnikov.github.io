---
layout: post
title: Theano-based libraries for machine learning
date: '2015-05-12T07:44:00.001-07:00'
author: Alex
tags:
- Machine Learning
- Deep Learning
- Theano
- Neural Networks
modified_time: '2015-05-22T04:20:23.817-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-4594518966614646355
blogger_orig_url: http://brilliantlywrong.blogspot.com/2015/05/libraries-of-machine-learning.html
---

I've posted several times about the mathematical vector engine Theano and its benefits.

If you're planning to dive deep into neural networks, I recommend learning and using pure **Theano**. However, there are numerous neural network libraries based on Theano. Here’s a list of some of them:

- **Theanets**: [http://theanets.readthedocs.org/](http://theanets.readthedocs.org/)
  *(Note: this is different from "theanet," which I haven’t found useful)*
  Theanets is a good starting point. It's quite efficient and simple, with support for recurrent neural networks. However, note that its RPROP implementation uses mini-batches, which makes it unstable.

- **Keras**: [http://keras.io/](http://keras.io/)
  So far, Keras seems to be a very well-designed Theano library. It contains several mini-batch-based optimizers and various loss functions, primarily for regression tasks. The authors compare it to Torch.

- **Pylearn2**: [http://deeplearning.net/software/pylearn2/](http://deeplearning.net/software/pylearn2/)
  This library was developed by LISA-lab, the creators of Theano. While it is highly advanced, it is also extremely complex. In my experience, it’s often easier to write things from scratch than to work with its YAML-based configuration.

- **Others** (less mature and partially forgotten):
  - [Lasagne](https://github.com/benanne/Lasagne)
  - [Blocks](https://github.com/bartvm/blocks)
  - [Crino](https://github.com/jlerouge/crino)
  - [DeepANN](https://github.com/glorotxa/DeepANN) (deprecated)

- I also have my own **My Nano-Library**!:
  A lightweight library (~500 lines of code) that supports 5 trainers and 6 loss functions for feedforward networks.
  - Supports weights and is extremely flexible, following the paradigm: *"write an expression."*
    You can use Theano to define an activation function, and black-box optimization methods will handle the rest. This flexibility allows the creation of complex activations without being restricted to traditional "layered" models or arbitrary function fitting.
  - [GitHub: hep_ml/nnet.py](https://github.com/iamfullofspam/hep_ml/blob/master/hep_ml/nnet.py)
  - It uses the scikit-learn interface, enabling its integration into pipelines or use with tools like AdaBoost over neural networks (which is also very fast).

