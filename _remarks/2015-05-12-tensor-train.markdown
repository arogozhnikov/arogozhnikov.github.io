---
layout: post
title: Thoughts about tensor train
date: '2015-05-11T15:43:00.001-07:00'
author: Alex Rogozhnikov
tags:
- Machine Learning
- Graphical Models
modified_time: '2015-05-11T15:48:30.063-07:00'
permalink: /2015/05/11/tensor-train.html
---

![Tensor Train](https://mdnip.files.wordpress.com/2012/09/tensortrain.jpg?w=500&crop=1)

One of the probable approaches to building graphical models with categorical variables is [tensor decomposition](http://bayesgroup.ru/wp-content/uploads/2014/05/icml2014_NROV-1.pdf).

Notably, both tensor decomposition (tensor train format) and the method to use it for graphical models were developed at my faculty, though by different people in different departments.

One more interesting question is the interpretation of those hidden variables emerging in the middle.

At the moment, I’m considering the possibility of integrating this into GB-train, since the trained model for each event provides a sequence of binary visible variables. In principle, this could be written in a relatively simple way. For example, if $x_i$ is a Boolean variable corresponding to the $i$th cut in the tree (or train, more precisely), one could write the partition function as:

$$ Z = A_1[x_1, y] A_2[x_2, y] \dots A_n[x_n, y] $$

or as:

$$ Z = A_1[x_1] B_1[y] A_2[x_2] B_2[y] \dots A_n[x_n] B_n[y] $$

In both cases, it’s fairly simple to estimate the posterior probability, since we have only a limited set of options (targets) to evaluate. However, determining which form to prefer and why remains an open question for me.

