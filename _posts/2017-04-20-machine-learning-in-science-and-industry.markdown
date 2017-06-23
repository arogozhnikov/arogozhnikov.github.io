---
layout: post
title: "Machine Learning in Science and Industry slides"
excerpt: "Mini-course about machine learning given at GradDays of Heidelberg University"

date: "2017-04-20"
author: Alex Rogozhnikov, Tatiana Likhomanenko
tags:
- demonstrations
- lectures 
- machine learning

---

Recently we (Alex & Tatiana) were invited to give lectures about machine learning at
[GradDays](http://gsfp.physi.uni-heidelberg.de/graddays/) —
an event that is organized twice a year at the [Heidelberg University](http://gsfp.physi.uni-heidelberg.de/graddays/) 
(Germany's oldest university).

GradDays are giving courses that broaden the physics knowledge of students and teach specialized useful techniques.

Program of GradDays included:

- Black Holes and Quantum Gravity Constraints on Field Theories
- Correlated Quantum Dynamics of Ultracold Few- to Many-Body Systems
- Quantum Simulation with Quantum Optical Systems 
- The formation of structure in cosmology
- Solar System Exploration Missions and their Scientific Outcome
- Quantum Field Theory in Extreme Environments

as well as [other sweet things](http://gsfp.physi.uni-heidelberg.de/graddays/index.php?m=2).

Even so, our course **"Machine learning and applications in Science and Industry"** was the most popular.
Focus of the course (heavily influenced by time constraints: only 4 days) 
was to give a **wide overview** of useful models in Machine Learning and their applications in very different areas, 
and even contained optional practice!

That's why we put inside many _interactive demonstrations_ of machine learning techniques! 

Also we tried to create a nice bridge between models and their real-life applications.
Many of the examples were from particle physics — an area that we're working in 
(tracking, tagging, reweighting, uniform boosting, particle identification, simulation refinement, 
tuning of simulation parameters, etc.). 
However we also included some notable examples from other data-intensive areas: astronomy, neuroscience, medicine, climatology and biology.

Finally, many other interesting things done with machine learning were discussed: 
spam detection, search engines, visual recognition, kinect and AlphaGo, recommender systems and news clustering.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/360y3XpmIhKlJN" width="700" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>
<div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/arogozhnikov/machine-learning-in-science-and-industry-day-1" title="Machine learning in science and industry — day 1" target="_blank">Machine learning in science and industry — day 1</a> </strong> from <strong><a target="_blank" href="https://www.slideshare.net/arogozhnikov">arogozhnikov</a></strong> </div>

Lecture of the first day gives some introduction into problems, applications and notions of machine learning.
Several simple models are discussed to get an impression:
 
- knn and search for neighbours
- density estimation techniques
- mixtures of distributions
- clustering methods 
- linear models with regularization. 


<iframe src="//www.slideshare.net/slideshow/embed_code/key/aox1TNWKmYLww3" width="700" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> 
<div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/arogozhnikov/machine-learning-in-science-and-industry-day-2" title="Machine learning in science and industry — day 2" target="_blank">Machine learning in science and industry — day 2</a> </strong> from <strong><a target="_blank" href="https://www.slideshare.net/arogozhnikov">arogozhnikov</a></strong> </div>

In the second day we made focus on tree-based techniques, specially boosting, that aren't popular in research now, 
but work very well in practice and are best-performers in many examples with tabular data

- decision trees for classification and regression
- Random Forest
- AdaBoost and Reweighter
- Gradient Boosting for classification, regression and ranking (ordering of items)  
- Uniform boosting 
- applications: particle identification, triggers and search engines


<iframe src="//www.slideshare.net/slideshow/embed_code/key/FFA7fguBQKuGmx" width="700" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> 
<div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/arogozhnikov/machine-learning-in-science-and-industry-day-3-75239567" title="Machine learning in science and industry — day 3" target="_blank">Machine learning in science and industry — day 3</a> </strong> from <strong><a target="_blank" href="//www.slideshare.net/arogozhnikov">arogozhnikov</a></strong> </div>

On the third day we get back to continuous optimization models, start from revisiting linear and generalized linear models, 
then more involved models are introduced

- linear models and their generalizations
- regularizations (again)
- SVM and kernel trick
- spam detection and elements of visual recognition
- factorization models and recommender systems
- factorization machines
- unsupervised dimensionality reduction techniques (PCA, LLE and IsoMAP)
- supervised dimensionality reduction techniques: CSP and LDA
- artificial neural networks



<iframe src="//www.slideshare.net/slideshow/embed_code/key/3kHaY8EtDzwHsd" width="700" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> 
<div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/arogozhnikov/machine-learning-in-science-and-industry-day-4" title="Machine learning in science and industry — day 4" target="_blank">Machine learning in science and industry — day 4</a> </strong> from <strong><a target="_blank" href="https://www.slideshare.net/arogozhnikov">arogozhnikov</a></strong> </div>

Finally, the last day was devoted mostly to deep learning: convolutional and recurrent neural networks, 
autoencoders, embeddings, GANs and others.

Also, an active learning was demonstrated in couple with gaussian processes.

# Links

- [interactive demonstrations of machine learning models](http://arogozhnikov.github.io/2016/04/28/demonstrations-for-ml-courses.html)
    - thanks to authors of all materials / demonstrations that were used in the course
- [materials of GradDays at github (including practice assignments in jupyter notebooks)](https://github.com/yandexdataschool/MLAtGradDays)