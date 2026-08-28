---
layout: post
title: Machine learning used in tracking of COMET (japanese particle physics experiment),
  part I
date: '2015-06-22T03:13:00.001-07:00'
author: Alex
tags:
- Machine Learning
- High Energy Physics
- Gradient Boosting
- tracking
- Optimization
- COMET
modified_time: '2015-07-04T16:22:39.747-07:00'
thumbnail: http://1.bp.blogspot.com/-RGV4jfTobMQ/VYdZvdgY0kI/AAAAAAAAADk/rlqSVY8nE0M/s72-c/COMETenergies.png
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-6320540861611256767
blogger_orig_url: http://brilliantlywrong.blogspot.com/2015/06/machine-learning-used-in-tracking-of.html
---

Recently I worked together with intern from Imperial College over the tracking system of COMET for two months, and here I'm going to briefly sum our (impressing) results. To begin with, let's explain what this experiment about.

From physics courses we know that there are conservation laws, most famous are conservation of energy and momenta, but there are other. For example, conservation of different [leptonic family numbers](https://en.wikipedia.org/wiki/Lepton_number).

For instance, electronic number is number of electrons + number of electronic neutrinos. For some time these numbers (electronic number, muonic number, tauonic number) were considered to be preserved, but in the late 1960's it was proved, that [neutrino oscillations](https://en.wikipedia.org/wiki/Neutrino_oscillation) change the leptonic number of system (neutrino can become electronic from muonic, for instance). This observation is called **lepton flavour violation**. However, in the Standard Model overall leptonic number (which is sum of three named family numbers) is conserved.

Since that time physicists are searching for other processes which change the leptonic number and include **charged** leptons (electrons, muons, tauons), which could be a key for new physics, however no success in this direction and the results are currently mostly upper limits we can prove for some processes. Such possible processes have the name of CLFV (**charged lepton flavour violation**).

### Details of [COMET](http://comet.kek.jp/Introduction.html) experiment

COMET is small experiment (which is only in plans at this moment) built to detect one specific decay (muon to electron conversion on nucleus), which is suppressed in the standard model:

$$ \mu^{-} + N \to e^{-} + N.$$

The frequency of this process is extremely small in SM: it's probability is about $10^{-52}$, which in particular means that we are sure this will not happen during the experiment.

COMET is sending lots of muons (with fixed energy) on aluminum, and makes the muons to interact with it. The process we are looking for is

$$ \mu^{-} + Al \to e^{-} + Al,$$

while this isn't the only way we can obtain electron from muon

$$ \mu^{-} \to e^{-} + \nu_{\mu} + \overline{\nu}_e.$$

Pay attention, that second process is 'normal' in the sense it doesn't violate the leptonic conservation laws.

The only way to determine whether we had decay-in-orbit (DIO) or not is to measure the energy of resulting electron (since neutrinos are very elusive particles and we are unable to detect it). Fortunately, the distributions of energies of electron is quite different for these processes and background electrons usually have lower energy.

<img src="/images/COMETenergies.png" width="400" height="298" />
<small>Distribution of energies for signal process and main background (Decay-in-orbit) in COMET</small>

### Some other illustrations of COMET experiment

<img src="/images/COMETscheme.png" width="400" height="343" />
<small>The scheme of planned experiment COMET. Detector (with aluminum target) will be in the end of this pipeline.
This is what planned during phase II, but for the first time experiment will be simpler</small>

<img src="/images/icimages.jpg" width="400" height="157" />
<small>COMET during phase I will be much simpler.</small>

<img src="/images/COMET3dscheme.png" width="320" height="189" />
<small>Detector of COMET (CyDET). The detector is filled with sensitive wires (white).
When muon hits the aluminum target (in the center), the electron produced travels over helix trajectories of larger radius in magnetic field and hits wires. The radius of trajectory depends on the transverse momentum of electron.</small>

### Data collected from COMET

The main information (apart one from trigger) is the data taken from wires, which are registering when charged particle flies nearby (by adsorbing the particles after ionization) and also it measures the time when this happened.

Another characteristic, which helps in distinguishing electrons, is the radius of trajectory, which is computed (in constant magnetic field) by formula

$$r = \dfrac{p_T}{eB}, $$

so for electron we know the distribution of [gyroradius](https://en.wikipedia.org/wiki/Gyroradius) from distribution of energies. Gyroradius is how we actually will reconstruct energy of electron.

<img src="/images/COMEThelixing.png" width="286" height="320" />
<small>Typical signal event in COMET, particle is helixing in magnetic field, leaving energy in drift cambers.</small>

In orthogonal projection of CyDET, the collected information from wires will look like this:

<img src="/images/COMET2dprojection.png" width="320" height="317" />
<small>Typical picture of signal event in experiment. Red dots are corresponding to signal hits and form a circle of needed radius.
Also one can see here many background hits, which come from other particles flying through detector.</small>

But the shape of circle with some radius is not the only useful information. During signal hits usually less energy is disposed (which may sound a bit contradictory to what I wrote earlier, but the faster particle flies, the less energy it disposes).

<img src="/images/COMETdepositions.png" width="320" height="269" />
<small>The energy deposited is very strong feature, though leaves significant amount of bck hits, which can spoil the picture, when we have high occupancy.</small>

Apart from this, we can use the 'hit time' (measured from the moment when trigger detected particle).

<img src="/images/COMEThittime.png" width="320" height="248" />
<small>The time after trigger tends to be smaller, while background hits are distributed uniformly across the time.
This is actually to be checked with better monte-carlo simulations (which are quite poor at the moment).</small>

The main goal of our part is classification of signal vs background hits.

In the next post I'll write about how we applied machine learning to this problem and achieved promising results.

PS. There is [second part](http://brilliantlywrong.blogspot.com/2015/07/machine-learning-in-comet-experiment.html) of this post, devoted to machine learning.

### Links

1. Official [COMET](http://comet.kek.jp/Introduction.html) site.
2. Detailed [presentation about CLFV, COMET (and e2mu).](http://www-physics.lbl.gov/seminars/old/LBNL2014KUNO.pdf)
3. [Раритеты микромира](https://nplus1.ru/news/2015/05/29/reareevents), an article in russian about rare processes (CLFV is one of examples)
4. [COMET phase-I proposal](http://comet.kek.jp/Documents_files/Phase-I-Proposal-v1.2.pdf)
5. [Repository](https://github.com/e-gillies-ix/track-finding-yandex) with algorithms and results of tracking.
