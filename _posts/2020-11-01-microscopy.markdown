---
layout: post
title: Things I wish someone told me about microscopy
excerpt: some
date: 2020-11-01 12:00:00
author: Alex Rogozhnikov
tags: 
- Microscopy
---

## If you want to learn some culprits of microscopy

... you'd better watch this video by microbehunter,
because rest of the post is view of ML person on things 
you should (not) expect from lab microscopy during experiment design.

<iframe width="560" height="315" 
 src="https://www.youtube.com/embed/Ir9TGt6zljI" 
 frameborder="0" allow="clipboard-write; encrypted-media; picture-in-picture" allowfullscreen>
</iframe>

**Warning:**  
This post contains reflections and is not meant to be an easy reading.  
This post assumes that you understand wave mechanics.

I have a nice general background in physics,
however just that was clearly insufficient &mdash; a lot of specificity towards.

## Things I wanted to know about microscopy

- there are myriads of different microscopes from trivial ones for mid-schools to EM (electron microscopes) and light-sheets
  - Ranges of prices from hundreds of dollars to millions. In some applications 100x cheaper microscope can still be more useful 
  - Manual and automated. Terribly expensive still may not be automated
- microscopes are typically designed to be modular, many parts are interchangeable;
  there is still vendor- and format- specificity
- when microscope is automated, that typically means that it can at least move its specimen
  (yes, specimen is moved, microscope's camera and light path are usually steady) 
  - it may or may not be able to switch excitation / emission filters automatically, so 'automated' is not a descriptive word. 
    Ask about what is automated
- while typically microscopes are just 'make a photo with light' devices, software for microscopes is a tough topic.
  - manufacturers want to provide visual interface with windows and buttons, 
    but amount of regimes of possible usage is terribly large, 
    and those hardly can be mapped to sequence of buttons
  - as a result both API and interface are far from satisfactory
- light source is not moved with specimen, but instead aligned and fixed relative to camera. 
  - You can't image with different shifts but 'same light position'
- immersion is quite critical when going to higher resolutions (above 20x)
- objective on a microscope has everything aligned and focusing depth can be adjusted or changed.
  (objectives are also pretty expensive). That's not your smartphone's refocusing camera. 
  So 40x on your microscope means that object of size n*m in focusing plane (which is fixed) 
  literally projects in 40n*40m on detector plane. 
  To complete arithmetics you only need physical size of pixel in a camera - and voila - you have size of pixel. 
- for a long time I was surprised that biologists are on one hand limited by the number of fluorescent channels
  they can image simultaneously (emission spectra overlap, so you want them to be separable). 
  - At the same time they don't switch to quantum dots (which have much narrower emission spectra).
    Permeability may be an issue here
  - And they don't try to go significantly outside of visible spectrum.
    - *probably* this is due to objectives - correcting aberrations for wide spectrum range is tough
  - Another factor is penetration depths variability (even within water) for different wavelengths
  - You can take images in IR, but going to deep IR is still rare  
- there is an uncountable amount of imaging techniques. <br />
  Dozens of them with all their variations, with all covering only some part of information.
  - Very hard to combine many in the same system (while some useful combinations exist)
  - Dream of machine learner - having different imaging systems for the same specimen - can be implemented only in specific cases 
- more powerful microscope requires identical efforts on sample/environment side
  - Higher magnification requires better compensation of motion
  - More sensitive to optical properties means you'll see more artifacts from anything in your system. 
    Or maybe plates or slides.
    - E.g. if method can detect birefringence, any plastic labware is likely to add some birefringence patterns
- well edges introduce significant effects, plate edges also introduce some effects for imaging (both also affect biological processes)
- [ibiology](https://www.youtube.com/user/iBioEducation) provides an amazing combination of theory and practice of imaging.
  It was incredibly helpful
- imaging protocols are hardly readable. Too many things and parameters, no deduplication. 
  - They remind completely unwrapped low-level code for execution by machine, not 'settings'.
  - I've told about software being tough here, right? There are issues with interfaces on all levels
- imaging time is a real issue
  - "oh, we can just increase stack size" is correct solution to many questions in theory, 
     but not in practice 
- reproducible focusing may be an issue
- richest sources of information are available only for ex-vivo cells and tissues
- anything that produces nice high-resolution images will be called by biologist "confocal" 
  no matter if confocality is actually used there :) 
- believe data, always believe data. 
  If you think something is misaligned - it almost surely is.


## Contrasting methods


<iframe width="560" height="315" src="https://www.youtube.com/embed/FUa1GTc69y4" f
rameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" 
allowfullscreen></iframe>

The main way to achieve contrast is by using monochromatic (i.e. laser) light, 
and achieve shift in phase between "rays" started from the same source. 
Shift in phase affected by specimen provides a contrast visible by a simple detector.

- Simplest example is [DIC](https://www.olympus-lifescience.com/en/microscope-resource/primer/techniques/dic/dicconfiguration/) 
  (differential interference contrast) - light is split in two parts, 
  which come through neighboring positions in slide
- Another example is polarization contrast, where light comes though the same specimen but 
  due to [birefringence](https://en.wikipedia.org/wiki/Birefringence) of some materials different polarizations come with different speed, 
  which produces retardation of one polarization 
- [Phase contrast](https://www.microscopyu.com/tutorials/comparison-of-phase-contrast-and-dic-microscopy) 
  organizes interference between scattered and passed through waves.
  Phase delay adds phase to scattered light. Simplest to setup of these three.
  
An important property of contrasting optical paths is that optical path lengths 
for light arriving to the same location should be identical (unless sample perturbations prevent this).
Optical path is not distance, but time taken by light to travel along a trajectory.

That's a simple thought and sounds like a natural, but when you look at optical system with all its lenses, 
you should realize it's non-trivial behavior.


## Amazing variability of imaging techniques

Microscopy world is very limited within one lab (even optical lab) 
but whole large world of microscopy is so rich and interesting out there.

- Multi-photon imaging
  - deliver energy required for excitation with several photon simultaneously
  - requires an expensive laser, but imaging is simple
  - can go quite deep into tissue
  - can't guarantee narrow emission spectra because different number of ph

- Electron microscopy
  - super precise (it's completely different part of spectra) 
  - ex-vivo samples only 
  - requires isolated rooms and strong movement compensation
  - not something you will simply hold in a lab, but provides extremely detailed image 
  
- LSM: light-sheet microscopy is a demonstration that light source does not have to be on the same axis,
  while it sounds like an axiom after lab scopes
  - LLSM is times cooler   
  
- TIRF (total internal reflection) microscopy when combined with photo-activable fluorescent proteins (PALM/STORM) 
  can get to tracking trajectories of individual proteins (while still using visible range spectrum).
  
- Another interesting idea is FRET - allows detecting interaction between single molecules 
  if those have appropriate fluorescent tags. <br />
  Photons emitted by one antibody are absorbed by the second one if molecules are in proximity of each other. 
  
- [optical coherence tomography](https://www.youtube.com/watch?v=HJnNJIUPm4s) OCT 
  - has nothing to do with tomography and even works based on reflected light
  - widely used for retina scanning

- [Ghost imaging](https://www.youtube.com/watch?v=tTHvVCPaeWQ). Not-yet-there, but idea is mind-blowing
  - entangle two photons
  - the first one hits the target, while the second goes to detector
  - entanglement allows partially reconstructing properties of a photon that hit the target
  - there are classical variations as well
  
- Structured illumination (SIM)
  - Moir patterns + a bit of computational magic allows you going slightly 
    above optical resolution limit


You may want to check this video 
to orient yourself a bit and get a sense of what sounds appropriate for your case. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/01v2kR8dlnQ" 
frameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>
  
  

