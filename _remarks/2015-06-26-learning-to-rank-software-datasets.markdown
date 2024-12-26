---
layout: post
title: Learning to rank (software, datasets)
date: '2015-06-26T12:48:00.000-07:00'
author: Alex Rogozhnikov
tags:
- Machine Learning
- Ranking
modified_time: '2015-07-04T10:00:50.221-07:00'
thumbnail: http://3.bp.blogspot.com/-U_C84v4_WZU/VY2ollTlRHI/AAAAAAAAAFM/8G1c8hieciQ/s72-c/letor_number1.png
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-5222473215527059864
blogger_orig_url: http://brilliantlywrong.blogspot.com/2015/06/learning-to-rank-software-datasets.html
---

For some time I've been working on ranking. I was going to adopt pruning techniques to ranking problem, which could be rather helpful, but the problem is I haven't seen any significant improvement with changing the algorithm.

Ok, anyway, let's collect what we have in this area.

### Datasets for ranking (LETOR datasets)


* [MSLR-WEB10k and MSLR-WEB30k](http://research.microsoft.com/en-us/projects/mslr/download.aspx)
You'll need much patience to download it, since Microsoft's server seeds with the speed of 1 Mbit or even slower.
<br /><br />
The only difference between these two datasets is the number of queries (10000 and 30000 respectively). They contain 136 columns, mostly filled with different term frequencies and so on. (but the text of query and document are available)

*  Apart from these datasets, 
[LETOR3.0](http://research.microsoft.com/en-us/um/beijing/projects/letor/letor3dataset.aspx) and [LETOR 4.0](http://research.microsoft.com/en-us/um/beijing/projects/letor/letor4dataset.aspx)
are available, which were published in 2008 and 2009. Those datasets are smaller. From LETOR4.0 MQ-2007 and MQ-2008 are interesting (46 features there). 
MQ stays for million queries.

* [Yahoo! LETOR dataset](http://webscope.sandbox.yahoo.com/catalog.php?datatype=c),&nbsp;from challenge organized in 2010. There are currently two versions: 1.0(400Mb) and 2.0 (600Mb). Here is more info about two sets within this data<br />
	<table class='comparison'>
		<tbody>
			<tr>
				<td></td>
				<td colspan="3">Set 1</td>
				<td colspan="3">Set 2</td>
			</tr>
			<tr>
				<td></td>
				<td>Train</td>
				<td>Val</td>
				<td>Test</td>
				<td>Train</td>
				<td>Val</td>
				<td>Test</td>
			</tr>
			<tr>
				<td># queries</td>
				<td>19,944</td>
				<td>2,994</td>
				<td>6,983</td>
				<td>1,266</td>
				<td>1,266</td>
				<td>3,798</td>
			</tr>
			<tr>
				<td># urls</td>
				<td>473,134</td>
				<td>71,083</td>
				<td>165,660</td>
				<td>34,815</td>
				<td>34,881</td>
				<td>103,174</td>
			</tr>
			<tr>
				<td># features</td>
				<td colspan="3">519</td>
				<td colspan="3">596</td>
			</tr>
		</tbody>
	</table>

* There is also [Yandex imat'2009](http://imat2009.yandex.ru/en/datasets) (Интернет-Математика 2009) dataset, which is rather small. (~100000 query-pairs in test and the same in train, 245 features).&nbsp;

And these are most valuable datasets (hey Google, maybe you publish at least something?).

### Algorithms

There are plenty of <a href="https://en.wikipedia.org/wiki/Learning_to_rank#List_of_methods">algorithms</a> on wiki and their modifications created specially for LETOR (with papers).

### Implementations

There are many algorithms developed, but checking most of them is real problem, because there is no available implementation one can try. But constantly new algorithms appear and their developers claim that new algorithm provides best results on all (or almost all) datasets.

This of course hardly believable, specially provided that most researchers *don't publish* code of their algorithms. In theory, &nbsp;one shall publish not only the code of algorithms, but the whole code of experiment.

However, there are some algorithms that are available (apart from regression, of course).

1. LEMUR.Ranklib project incorporates many algorithms in C++<br /><a href="http://sourceforge.net/projects/lemur/">http://sourceforge.net/projects/lemur/</a><br />the best option unless you need implementation of something specific. Currently contains<br /><br />MART (=GBRT), RankNet, RankBoost, AdaRank, Coordinate Ascent, LambdaMART and ListNet
2. <a href="https://bitbucket.org/ilps/lerot">LEROT</a>: written in python <i>online learning to rank</i> framework.<br />Also there is less detailed, butlonger list of datasets:&nbsp;<a href="https://bitbucket.org/ilps/lerot#rst-header-data">https://bitbucket.org/ilps/lerot#rst-header-data</a>
2. <a href="https://github.com/ogrisel/notebooks/blob/master/Learning%20to%20Rank.ipynb">IPython demo</a> on learning to rank
3. <a href="https://github.com/arifqodari/ExpediaLearningToRank">Implementation of LambdaRank</a>&nbsp;(in python specially for kaggle ranking competition)
4. <a href="https://github.com/xapian/xapian/tree/master/xapian-letor">xapian-letor</a>&nbsp;is part of xapian project, this library was developed at GSoC 2014. Though I haven't found anythong on ranking in documentation, some implementations can be found in C++ code:<br />https://github.com/xapian/xapian/tree/master/xapian-letor<br />https://github.com/v-hasu/xapian/tree/master/xapian-letor
5. <a href="https://github.com/bmcfee/mlr">Metric learning to rank</a>&nbsp;(mlr)&nbsp;for matlab
6. <a href="http://www.cs.cornell.edu/people/tj/svm_light/svm_rank.html">SVM-Rank implementation</a> in C++
7. <a href="http://sourceforge.net/projects/listmle/">ListMLE</a>, <a href="http://sourceforge.net/projects/listnet/?source=recommended">ListNET</a> rankers (probably these were used in xapian)
9. <a href="http://projects.yisongyue.com/svmmap/">SVM-MAP implementation</a> in C++


### Some comparison (randomly sampled pictures from net):

<figure class='image'>
<img src="/images/letor_number1.png" />
<caption>Taken from&nbsp;<a href="http://www2009.org/pdf/T7A-LEARNING%20TO%20RANK%20TUTORIAL.pdf">http://www2009.org/pdf/T7A-LEARNING%20TO%20RANK%20TUTORIAL.pdf</a></caption>
</figure>

<br />

<figure class='image'>
<img src="/images/letor_numbers2.png" />
<caption>Comparison from&nbsp;<a href="http://www.ke.tu-darmstadt.de/events/PL-12/papers/07-busa-fekete.pdf">http://www.ke.tu-darmstadt.de/events/PL-12/papers/07-busa-fekete.pdf</a>, <br />though paper was about comparison of nDCG implementations.</caption>
</figure>

