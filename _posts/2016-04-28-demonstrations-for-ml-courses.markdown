---
layout: post
title:  "Interactive demonstrations for ML courses"
date: 2016-04-28 12:00:00
author: Alex Rogozhnikov
excerpt: Things from machine learning to try in your browser.
tags: 
- Machine Learning
---

<style>
    .post-content img { box-shadow: 0 0 10px black; }
</style>

Machine learning becomes more and more popular, and there are now many demonstrations available 
over the internet which help to demonstrate some ideas about algorithms in a more vivid way.
(many of those are java-applets which are not so easy to use). 

There are certain arguments against having courses overloaded with interactive things 
since those frequently prevent students from diving into mathematics beyond machine learning, 
but generally I consider demonstrations helpful.

Here are some demos which I find useful:

## Demo of ROC curve

ROC curve is fairly simple subject, but having a demo is nice way to demonstrate some 
important limit cases. I have prepared simple html demo for this.

![ROC curve demonstration](/images/ml_demonstrations/roc_curve.png)
 
There is [mini-version](http://arogozhnikov.github.io/RocCurve.html) and 
[a detailed post]({% post_url 2015-10-05-roc-curve %}).


## Demos by Andrej Karpathy

Andrej Karpathy prepared a bulk of demos with same interface for different classification algorithms:


<table>
    <tr>
        <td>
            <img src="/images/ml_demonstrations/forestjs.png" height="200"/>
        </td>
        <td>
            <img src="/images/ml_demonstrations/svmjs.png" height="200"/>
        </td>
        <td>
            <img src="/images/ml_demonstrations/convnetjs.png" height="200"/>
        </td>
    </tr>
    <tr>
        <td> <a href="http://cs.stanford.edu/~karpathy/svmjs/demo/demoforest.html">RandomForest</a>
        </td>
        <td> <a href="http://cs.stanford.edu/people/karpathy/svmjs/demo/" >SVM</a>
        </td>
        <td> <a href="http://cs.stanford.edu/people/karpathy/convnetjs/demo/classify2d.html">Neural network</a>
        </td>
    </tr>
</table>
<br />

There are also other interesting demonstrations like t-SNE and RNNs,
you're welcome to check [Andrej's github page](https://github.com/karpathy?tab=repositories).

Also I highly recommend looking at [other convnet.js demos](http://cs.stanford.edu/people/karpathy/convnetjs/index.html). 

## Decision tree

![decision tree demo](/images/ml_demonstrations/decision_tree_in_course.png)

I didn't find a good interactive playground for a single decision tree.
While one can use random forest with a single tree, it doesn't help much to understand 
splitting criterion.

However, there is a [nice intro into data analysis](http://www.r2d3.us/visual-intro-to-machine-learning-part-1/), 
which demonstrates the process of building a tree.
It's not super-useful during classes, but can be given as an additional material.


## Gradient Boosting (and decision tree for regression) 

[![gradient boosting demo](/images/ml_demonstrations/gradient_boosting_explained.png)](https://arogozhnikov.github.io/2016/06/24/gradient_boosting_explained.html)

An explanatory post about [how gradient boosting works](https://arogozhnikov.github.io/2016/06/24/gradient_boosting_explained.html).


## Mini-course on reinforcement learning

<img src="/images/ml_demonstrations/reinforcejs.png" width="500" />

There is also a very nice mini-course of 
[reinforcement learning](http://cs.stanford.edu/people/karpathy/reinforcejs/)
in the format of set of interactive demonstrations, 
which I highly recommend as a separate reading, but not part of other course.
 

## Neural network demo by TensorFlow team

![interactive demonstration of neural networks](/images/ml_demonstrations/tensorflow_demo.png)

What was really missing in the Karpathy's presentation about neural networks 
is demonstration of activations of inner neurons, and 
while I was planning when I can contribute this feature, tensorflow team
  published an awesome demo, which already has this and also provides more different knobs to play with.
  
  
## Gradient boosting demo for classification
 
You can play with gradient boosting online too:

![gradient boosting playground online](/images/gb-playground-preview.png)
   
## Reconstructing an image with different ML techniques

![reconstructing an image with machine learning](/images/ml_demonstrations/reconstructing_images.png)

Formally, this is not an interactive demonstration, since you can't play with it online.
But I show it in the end of the course as a fast and pleasant way to revisit the whole course.


## Demonstrations by Victor Powell

There is a nice mini-project ["Explained Visually"](http://setosa.io/) by Victor Powell
with demonstrations of mathematical things. 
 
While most of those are about things too simple (like eigenvectors, sin, ordinary least squares),
there are also some more useful visualizations.


<table>
    <tr>
        <td>
            <img src="/images/ml_demonstrations/victor_pca.png" height="200"/>
        </td>
        <td>
            <img src="/images/ml_demonstrations/victor_convolutions.png" height="200"/>
        </td>
        <td>
            <img src="/images/ml_demonstrations/victor_mc.png" height="200"/>
        </td>
    </tr>
    <tr>
        <td> <a href="http://setosa.io/ev/principal-component-analysis/">PCA</a>
        </td>
        <td> <a href="http://setosa.io/ev/image-kernels/" >Convolution (image kernels)</a>
        </td>
        <td> <a href="http://setosa.io/ev/markov-chains/" >Markov Chains</a>
        </td>
    </tr>
</table>
<br />

## Dimensionality reduction

![embddings](/images/ml_demonstrations/colah_embeddings.png)

A [post](http://colah.github.io/posts/2014-10-Visualizing-MNIST/) by Christopher Olah 
visualizes different dimensionality reduction algorithms using MNIST dataset.

## Variational AutoEncoder

![dreaming digits](/images/ml_demonstrations/dream_mnist.png)

A [demonstration](http://dpkingma.com/sgvb_mnist_demo/demo.html) 
by Durk Kingma, where
you can play with hidden parameters and let networks "dream"
MNIST digits.

## [Keras JS demonstrations](https://transcranial.github.io/keras-js/)

Classical demonstrations of neural networks right in the browser. 
Has very handy interface and also can use GPU right from the browser.

![keras_js](/images/lstm_reviews.png)


## Attention and memory in neural networks

are explained in a [this post](http://distill.pub/2016/augmented-rnns/) by Google Brain team

![Interactive demonstration of attention and augmentation in neural networks](/images/attention_memory.png)

## Misread tSNE

Another [long-read](http://distill.pub/2016/misread-tsne/) from Google Brain team is devoted to understanding tSNE and its output

![Misread tSNE blog](/images/misread-tsne.png)

## Generative adversarial networks

![Generative adversarial networks demo](/images/ml_demonstrations/gan.png)

[Here](http://www.inference.vc/an-alternative-update-rule-for-generative-adversarial-networks/) 
you can find some demonstration of GAN, though author prepared this not as a demo, 
but rather as a visualization for his version of update rule.  

<!-- TODO Kalman filtering http://www.anuncommonlab.com/articles/how-kalman-filters-work/ -->
<!-- EKF http://home.wlu.edu/~levys/kalman_tutorial/ -->
<!-- TODO convolutions https://github.com/vdumoulin/conv_arithmetic -->


### Missing things

Demonstrations I haven't found so far (but It would be nice to have those):

 - <strike> nice standalone demonstration of decision trees </strike>
 - <strike> gradient boosting </strike>
 - Expectation-Maximization algorithm for fitting mixtures
 - Viterbi algorithm
 - RBMs dropped out of the fashion, but it would be nice e.g. to demonstrate contrastive divergence. 
 
There are some things connected to RNNs / text / word embeddings, 
but I don't mention those here.

