---
layout: post
title: Multimixture fitting
date: '2015-07-04T14:36:00.000-07:00'
author: Alex Rogozhnikov
tags:
- Machine Learning
- Graphical Models
modified_time: '2015-07-04T14:36:00.664-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-1319838903330630919
blogger_orig_url: http://brilliantlywrong.blogspot.com/2015/07/multimixture-fitting.html
---

I was wondering how one can modify Expectation-Maximization procedure for fitting mixtures
(well, gaussian mixtures, because it's the only nontrivial and quite general multivariate distribution that can be fitted easily)
to support *really* many overlapping summands in the mixture.

Randomization probably can be a solution to this problem.
It seems that expectation in EM algorithm is the proper place to introduce it,
but in this case maximization step should receive some inertial momentum-like corrections.

Probably it is a good idea to remind how EM works.
There are two steps that are computed iteratively:

- (Expectation) where we compute probability that each particular event belongs to each distribution 
  (which component 'explains' observation best)
- (Maximization) where given the probabilities we maximize parameters of each distribution.

What if we sample events according to distribution from expectation step?
At each stage we attribute each event to one (in simplest case) component of mixture, or maybe several of them (that's the main difference I want to achieve) .
This kind of randomization should prevent 'shrinking' of component distributions.

The core idea I am trying to introduce here is very similar to **dropout** &mdash; a trick,
which allowed researches to train neural networks with more parameters than amount of observations we have.
