---
layout: post
title:  "MLHEP 2015 lectures slides"
date: 2015-09-07 12:00:00
author: Alex Rogozhnikov
tags: 
- teaching
- materials
- Machine Learning
- MLHEP 2015
---

In the end of this August our team from Yandex organized MLHEP 2015 - summer school on Machine Learning in High Energy Physics.

School lasted only for 4 days, but even in this little time we managed to teach many things.

School contained of two tracks: introductory and advanced, every day each track has 2 lectures + 2 practical seminars.
Also in each evening there was a special physical talk by invited speakers from CERN. 

No, this is not everything: we organized [inclass kaggle competition](http://inclass.kaggle.com/c/comet-track-recognition-mlhep-2015)
based on the COMET tracking problem I wrote about ([part 1]({% post_url 2015-06-22-machine-learning-used-in-tracking-of%}), 
[part 2]({% post_url 2015-07-05-machine-learning-in-comet-experiment %})), 
so participants played with ML methods on real-world problem.

I gave lectures on introductory track. This was really challenging - put the course of ML in 4 days to people who have no experience in ML 
and have different background (while major part of introductory track listeners were particle physicists, but this is not very helpful).
 
One more caveat: since the schedule was completely filled, we decided to give no tasks (and thus all the theoretical knowledge
will be obtained from slides). 

For this purpose I decided to minimize the number of things introduced in course. The only non-trivial notion I used was decision function.
No $F(x)$, no $h_i(x)$, no $Q(x, y)$, no margins, no $\Theta$, no $C(Y, F)$ and other stuff.

Despite this limitations, course contained all the 'starter kit' and even more:

 * knn
 * optimal bayesian classifier, QDA
 * logistic regression
 * neural networks
 * decision trees, building, splitting criterions
 * estimating feature importance 
 * overfitting
 * ensembles, bagging
 * Random Forest
 * comparison of multidimensional distributions
 * AdaBoost
 * Gradient Boosting, modifications for regression,  classification, ranking 
 * Boosting to uniformity (uBoost and FlatnessLoss)
 * Fast predictions for online trigger systems (Bonsai BDT) 
 * reweighting, Gradient Boosted reweighting
 * hyper-parameters optimization, Gaussian Processes
 * using classifiers' output to test physical hypotheses
 * unsupervised ML: PCA, autoencoders 

Also I significantly reduced number of formulas and added different demonstrations of how different algorithms work.
  
This is really much for introductory 4-days course, but I consider this to be ok to give more during the course. 
The problem is I forgot to put some important notes with conclusions, next time I'll add them explicitly to slides :) 

## Slides 

<iframe src="//www.slideshare.net/slideshow/embed_code/key/C40KT1Ng02zYZy" width="500" height="400" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/arogozhnikov/mlhep-2015-introductory-lecture-1" title="MLHEP 2015: Introductory Lecture #1" target="_blank">MLHEP 2015: Introductory Lecture #1</a> </strong> from <strong><a href="//www.slideshare.net/arogozhnikov" target="_blank">arogozhnikov</a></strong> </div>

<iframe src="//www.slideshare.net/slideshow/embed_code/key/2CSzDBNcRQHxiU" width="500" height="400" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/arogozhnikov/mlhep-2015-introductory-lecture-2" title="MLHEP 2015: Introductory Lecture #2" target="_blank">MLHEP 2015: Introductory Lecture #2</a> </strong> from <strong><a href="//www.slideshare.net/arogozhnikov" target="_blank">arogozhnikov</a></strong> </div>

<iframe src="//www.slideshare.net/slideshow/embed_code/key/rHAE48h13Oau0T" width="500" height="400" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/arogozhnikov/mlhep-2015-introductory-lecture-3" title="MLHEP 2015: Introductory Lecture #3" target="_blank">MLHEP 2015: Introductory Lecture #3</a> </strong> from <strong><a href="//www.slideshare.net/arogozhnikov" target="_blank">arogozhnikov</a></strong> </div>

<iframe src="//www.slideshare.net/slideshow/embed_code/key/zb1y3nmyaSgaJv" width="500" height="400" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/arogozhnikov/mlhep-2015-introductory-lecture-4" title="MLHEP 2015: Introductory Lecture #4" target="_blank">MLHEP 2015: Introductory Lecture #4</a> </strong> from <strong><a href="//www.slideshare.net/arogozhnikov" target="_blank">arogozhnikov</a></strong> </div>

## Links

1. [All materials from school](https://github.com/yandexdataschool/mlhep2015)
2. [Official school site](http://hse.ru/mlhep2015)
3. [Kaggle competition for school](http://inclass.kaggle.com/c/comet-track-recognition-mlhep-2015)
 

