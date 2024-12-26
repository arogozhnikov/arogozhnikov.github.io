---
layout: post
title: Decision train classifier
date: '2015-05-22T04:54:00.000-07:00'
author: Alex
tags:
- Machine Learning
- Experiments
- bit-hacks
- vectorization
modified_time: '2015-05-22T04:54:19.085-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-1585621610654534431
blogger_orig_url: http://brilliantlywrong.blogspot.com/2015/05/decision-train-classifier.html
permalink: /2015/05/22/decision-train-classifier.html
---

During the weekend, I've been working on the implementation of **decision train**.

---

Decision train is a classification/regression model, which I first introduced as a way to speed up gradient boosting with bit-hacks. Its main purpose was to demonstrate how bit operations, coupled with proper preprocessing of data plus revisiting, can speed up training/application of the trained formula. It may sound strange, but this incredibly fast algorithm was written in Python (all the computationally expensive operations use NumPy).

In general, I found its basic version to be no worse than GBRT from scikit-learn. And my implementation is, of course, much faster.

An interesting aspect of my approach: I am writing the `hep_ml` library in a modular way. 
For instance, considering the GBRT implementation, there are separate classes/functions for:

- **Boosting algorithm**
- **Base estimator**  
  At this moment, only different trees are supported, but I believe that one can use any clustering algorithm, like k-means. While this sounds a bit strange, experiments with pruning show that getting estimators from some predefined pool can yield very good results in classification.
- **Loss function**  
  The only difference between regression, binary classification, and ranking for gradient boosting is in the loss function used.
- **Splitting criterion**  
  This may also be called a loss function. It’s the figure of merit (FOM) minimized when building a new tree. GBRT usually uses MSE as this criterion.

---

This 'modular structure' made it possible to write loss functions once and use them with different classifiers.

Maybe I'll find time to provide support for [FlatnessLoss](http://arxiv.org/abs/1410.4140) inside [my neural networks](http://brilliantlywrong.blogspot.com/2015/05/libraries-of-machine-learning.html). Since it is flexible and uses only gradients, this should not be very complicated.
