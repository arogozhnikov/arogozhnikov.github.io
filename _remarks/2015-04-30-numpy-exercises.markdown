---
layout: post
title: Numpy exercises
date: '2015-04-30T12:31:00.000-07:00'
author: Alex
tags:
- numpy one-liners
- Python
- numpy
modified_time: '2015-04-30T12:31:13.299-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-7890012778117168020
blogger_orig_url: https://brilliantlywrong.blogspot.com/2015/04/numpy-exercises.html
permalink: /2015/04/30/numpy-exercises.html
---

<p>When one starts writing in python, the typical reaction is disappointment about how slow it is compared to any compilable language. After a while, you learn numpy and find out it's actually not so bad.</p>
<p>Having spent a month with numpy, I found out that many things can be written in it.</p>
<p>Having spent a year with it, I found out that almost any algorithm may be vectorized, though it's sometimes non-trivial.</p>
<p>I'm still quite disappointed about the majority of answers at stackoverflow, where people prefer plain python for anything more complicated than computing a sum of an array.</p>
<br/>
<p>
	For instance, you need to <a href="https://stackoverflow.com/questions/12414043/map-each-list-value-to-its-corresponding-percentile?rq=1">compute statistics</a> of values in an array.
</p>
<p>
	There is a function in the `scipy.stats` library which is created specifically for this purpose:
</p>
```python
order_statistics = rankdata(initial_array)
```

Another option is to sort the array and keep track of initial positions (quite vectorizable).

Alternatively, you can compute statistics in `numpy` with a one-liner:

```python
order_statistics = numpy.argsort(numpy.argsort(initial_array))
```
(isn't this beautiful? I don't say simple, I say beautiful)

<br/>
Want to compute the mean value over the group of events? With a one-liner? Here you go:

```python
means = numpy.bincount(group_indices, weights=values) / numpy.bincount(group_indices)
```


Writing an oblivious decision tree in numpy is very simple and computations there are done really fast.

As a non-trivial problem: will you be able to write an inference of a generic decision tree (like one in sklearn) in pure numpy?
For simplicity, you can first consider only trees with equal depth of all leaves.

<p>See also:</p>

<ul>
	<li>Numpy tips and tricks for data analysis, <a href="{% post_url 2015-09-29-NumpyTipsAndTricks1 %}">part1</a> and
		<a href="{% post_url 2015-09-30-NumpyTipsAndTricks2 %}">part2</a>.
	</li>
	<li>
		Numpy <a href="{% post_url 2015-09-08-SpeedBenchmarks %}">speed benchmark</a>.
	</li>
	<li>
		See <a href="https://github.com/rougier/numpy-100">100 numpy exercises</a> for challenging problems.
		Most of them are also solved with one-liners.
	</li>
</ul>