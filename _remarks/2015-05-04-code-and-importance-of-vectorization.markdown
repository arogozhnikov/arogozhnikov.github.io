---
layout: post
title: Code and the importance of vectorization
date: '2015-05-04T12:07:00.001-07:00'
author: Alex Rogozhnikov
tags:
- RBM
- Python
- numpy
- Neural Networks
- Graphical Models
modified_time: '2015-05-04T12:07:10.229-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-1652987814485965830
blogger_orig_url: http://brilliantlywrong.blogspot.com/2015/05/code-and-importance-of-vectorization.html
---

That awkward moment when the code written in MATLAB is easier to read and understand than tons of explanations:  
[Salakhudinov’s code of RBM](http://www.cs.toronto.edu/~hinton/code/rbm.m)

This code, in my humble opinion, is a good argument when you need to explain to someone that they **really** need to learn at least one language or tool with vectorization, no matter whether it is R, MATLAB, NumPy, or Theano in Python.

I also want to note that vectorization is not a `silver bullet`.  
For example, you can see Friedman’s highly optimized Fortran  
[code of GLM](https://github.com/dwf/glmnet-python/blob/master/glmnet/glmnet.f)  
(Generalized Linear Models).

**Disclaimer**: You'll be unable to unsee this.
