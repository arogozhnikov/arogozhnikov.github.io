---
layout: post
title: Optical pooled screens of cells (overview of emerging biotechnology)
excerpt: CellPaint-POSH and PERISCOPE — new tools for unbiased biological discovery.
date: 2023-08-20 12:00:00
author: Alex Rogozhnikov
tags: 
- biology
meta: |
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Optical pooled CRISPR screens" />
    <meta property="og:description" content="CellPaint-POSH and PERISCOPE — new tools for unbiased biological discovery." />
    <meta property="og:url" content="https://arogozhnikov.github.io/2023/08/20/optical-pooled-screens.html" />
    <meta property="og:image" content="https://arogozhnikov.github.io/images/opticalscreen/optical_screen_attractive_image.png" />

---


*This month brought two preprints describing optical pooled CRISPR screens.
What's this new technology, what it can be used for, and why I've been waiting for it?
I'll make a small comparison of approaches and critically review the papers.* 

*Best of all &mdash; 
I am not affiliated with either team, and this is likely the most unbiased review you’ll find* 😅


## Papers discussed:

- **PERISCOPE** <br/> aka _Perturbation Effect Readout In situ with Single Cell Optical Phenotyping_ 
  from  [A genome-wide atlas of human cell morphology](https://www.biorxiv.org/content/10.1101/2023.08.06.552164v1.full)
  (Broad Institute)
- **CP-POSH** <br/> aka _Cell Painting Pooled Optical Screening in Human cells_ from  [A Pooled Cell Painting CRISPR Screening Platform Enables de novo Inference of
Gene Function by Self-supervised Deep Learning](https://www.biorxiv.org/content/10.1101/2023.08.13.553051v2.full.pdf)
  (Insitro Inc.)


In the next parts I discuss some details from these preprints.

## Preface

To drive experiments in biological systems you need two components: 
1. **intervention:** change something in cell (or organoid, or organism).
   <!--- Fine-grained interventions allow precise verification of hypotheses. --->

   For a broad understanding of biological system you want to have detailed control of all of its parts. 
   CRISPR solves this by individually acting on any selected gene. 
   This makes CRISPR-driven experiment more interpretable and ensures high coverage of biological processes.

2. **readout:** detect change in some characteristic.
   Better characterization of system would involve high-dimensional description. 
   E.g. just measuring cell size, cell death and pH provides little insight into what's happening. 

   Several sequencing-based assays provide rich description, and many of them provide single-cell readouts.
   [Cell painting](https://www.nature.com/articles/nprot.2016.105) stands out: it is much cheaper, 
   microscopy-based, and still captures a lot of biologically-relevant information.

   

 Effectiveness of the system for unbiased discovery, 
 roughly, *is a product of these two dimensions*: 
 how well you control the biology and how well you can describe results of intervention.

 Pooled CRISPR screens with scRNAseq/scATAC stand out in both dimensions. <br /> 
 They combine 1. complete control via CRISPR with 2. very high-dimensional interpretable readout.
 Sounds awesome (and it is!), but we need to introduce one more factor to the equation: 

{:start="3"}
3. **price per experiment.** The more observations you have the merrier. 
   We already found there are a ton of things happening in our biology,
   and to find at least a majority of them in an unbiased manner, a number of attempts is required.

   Pooled screens are very efficient in experiment material: every cell is turned into a tiny individual experiment.
   With all multiplexing/overloading tricks, a *cost-per-cell* in scRNAseq is comparable to *cost-per-well* in cell painting. 
   Quite a difference!

Optical pooled CRISPR screening replaces expensive sequencing with cheap microscopy, and drops price-per-cell >200 fold (PERISCOPE reports price-per-cell ~$0.001).
Compared to *arrayed* optical screens, lower requirements for automation can be expected as all conditions share the well.

Overall, technology opens an opportunity for massive experimentation.



## Why do we need an even more scalable assay? 🤔


Great question! 
A number of whole-genome pooled screens have been conducted, 
arrayed whole-genome screens were run with cell painting. 
Recursion, who pioneered adoption of Cell Painting, [scaled it](https://www.recursion.com/operating-system) to 2 million wells a week.
Why would you wish for _even more_?

_Gene perturbation can be more nuanced_ than just knockout. 
CRISPR tiling, an approach to scan for important positions in genome, requires a lot of experiments.

Space of interventions also goes _beyond single-gene_ at a time. 
If e.g. two proteins can perform similar function (“alternative pathways”), downregulating just one of them won’t have as much effect 
(periscope paper accidentally needs double KO of M6PR and IGF2R).
These cases, when the effect in combination is different from combination of effects, are of high interest and give a more direct hint at underlying biology than just similarity of images.
At the same time such cases are (likely) sparse, and should be found across 20k x 20k = 400m combinations…

Sometimes you need to interact with more than two genes at a time, for instance to create iPSCs.
Recall that iPSC creation relies on simultaneous expression of 4 [Yamanaka factors](https://en.wikipedia.org/wiki/Induced_pluripotent_stem_cell#Production).
For reference, the original [Yamanaka paper](https://www.cell.com/cell/fulltext/S0092-8674(06)00976-7?_returnURL=https%3A%2F%2Flinkinghub.elsevier.com%2Fretrieve%2Fpii%2FS0092867406009767%3Fshowall%3Dtrue) screened 24 candidate genes.
To improve upon this “recipe”, a large number of combinations should be tried.
Scanning just combinations of 4 factors out of 100 [TFs](https://en.wikipedia.org/wiki/Transcription_factor) already takes around 4 million attempts. 

Combinatorial space stays almost unexplored.
Dropping price even more still won’t make it possible to check all possible combinations, and this exploration should be driven by ML.
ML-friendliness thus becomes a requirement.

<!---
<div style="float: right; width: 200px; margin: 20px;" >
<img src="/images/opticalscreen/peptides.png" height="200" /><br />
<small markdown="True"><a href="https://pubmed.ncbi.nlm.nih.gov/23316341/">J. Thundimadathil, 2012</a>  </small>
</div> -->
There are non-genetic perturbations that are of high interest: cell environment, additions of chemicals or biologics.
Unfortunately, usually there is no way to ‘massively multiplex’ these conditions, and microwell stays the minimal possible unit of experiment. 
Notable exception are **peptides**, as those similarly can be barcoded and participate in a pooled screen.
Peptides can be used both as discovery tool (e.g. to block some interaction or activate receptor) and [as a therapeutic](https://en.wikipedia.org/wiki/Peptide_therapeutics).





## Challenges needed to be solved

<img src="/images/opticalscreen/cp_posh_imaging_pipeline.png" width="700">
<small>
Cell Painting (left, 5 channels + composite)
and base calling in ISS (right) have significant overlap in channels. <br />
Image from CP-POSH preprint.
</small>

Interventions are encoded with sgRNA barcodes. 
In situ sequencing (ISS) is used to read the barcode back. 

- **Main issue is merging ISS with cell painting**. 
  There is a spectral overlap between channels used for cell painting and ISS, and thus ISS becomes non-reliable.

- Cell painting degrades RNA and **destroys barcode**. Both teams addressed this by running reverse transcription and RCA (rolling cycle amplification) of DNA before cell painting. 
  ISS imaging is quite destructive (multiple cycles) and happens after cell painting step.


### How PERISCOPE solves spectral overlap

<img src='/images/opticalscreen/periscope_linker.png' style="float: right; width: 400px;">
Periscope team replaced two dyes in cell painting with fluorescent labels attached to probes with disulfide linker (see image).
Linker is cleaved right after “phenotypic” (cell painting) imaging, and these two channels could be used for ISS.
Floating fluorescent labels are partially washed and remaining (uniform) signal is cancelled out by image processing pipeline.

More specifically, membrane label Concanavalin-A was SS-conjugated to fluorophore directly, 
while mitochondria stain mitotracker was replaced with anti-TOMM20 Ab + secondary Ab SS-linked to fluorophore.
<!-- TODO (can this place be optimized to remove secondary?). --> 
Original cell painting avoided antibodies to make the process cheaper and more reproducible.

As expected, perturbation of TOMM20 distorts the signal from this channel &mdash; something to keep in mind.


### How CP-POSH solves spectral overlap

<div style="float: right; width: 400px; padding-left: 20px;">
<img src="/images/opticalscreen/mitotracker_correlation.png" style='width: 400px;'>
<small>Correlation of mitoprobe with TOMM20 and Hoechst</small>
</div>
Mitotracker was replaced with Mitoprobe &mdash; a novel RNA-based label for mitochondria, linked to Cy5 fluorophore.
Interestingly, they optimized a sequence to have high correlation with TOMM20 **and** low correlation with Hoechst (nuclei).

Resulting image (on the right) shows optimization was successful.

RNA sequences were taken from the ribosome after search for fragments that would bind to 12S rRNA and 16S rRNA (two different location), 
then tested 8 of them and left two: one for 12s and one for 16s in proportion 1:1. 
This is an interesting solution and seems to overcome the issues seen in PERISCOPE approach, and likely to work in other species too.

This replacement of mitotracker with mitoprobe _does not_ remove spectral overlap (there is overlap with base A), 
but makes it non-essential because RNA is degraded during cell-painting.
Two additional spectral overlaps (WGA <> base G) and (phalloidin <> base T) are also solved by degrading, 
and additional steps in the protocol were necessary.
These overlaps still seem to play negative role in ISS step (see later).

CP-POSH has an additional channel that can be utilized for one study-specific marker, which is later featured in one of experiments.
(They use deep red &mdash; good choice, as shorter wavelengths can be used by phenotyping!) 


<!-- I am curious if something similar to mitoprobe can be developed for F-actin (i.e. RNA-based label). 
This could make ethanol unnecessary. -->

In total both protocols are not straightforward.


### _In situ_ sequencing (ISS)

This part is very similar, as both groups:
- use Illumina’s miseq kit for ISS (sequence-by-synthesis), and both groups used lower resolution (10X) for imaging.
- use padlock with gap to amplify barcode for sequencing
- finally, barcodes used in both cases are not an additional genetic sequences, but sgRNAs themselves. <br />
  No barcodes &mdash; no problems! 


CP-POSH additionally uses tiny *image-to-image convnet to improve calling* to get +18% correct calls. 
Such a model can be trained on the screen data itself: 
almost-correctly called barcodes (with simpler pipeline) are used for training the model. 

<!---
Absence of separate barcodes, while very reliable, has its demerits too: 
cells that replicate from the same transfected cells, are not ‘true independent observations’, 
as e.g. they can carry the same mutation introduced during transfection. 
Additional barcodes could tell apart independent transfections and help in lineage tracking.
Optical pooling has partial remedy to this problem: cells coming from the same origin usually colocalize within a well. 
It could be an interesting analysis if ‘families’ of cells carry any additional visual signature that is not shared by other cells with the same sgRNA.
--->

### sgRNAs 

Groups start from existing pools of sgRNAs to guide Cas9, with minor differences in selection procedure
- Periscope uses 12 cycles and minimal Levenshtein distance ≥ 2, which means they detect if barcode contains one error (and discard the barcode).
- CP-POSH uses 13 cycles and Levenshtein distance ≥ 3, and allows up to 1 error correction.
  Most cells have more than one amplicon, which makes barcode calling even more reliable.
  Error correction adds +80% of barcoded cells in their largest screen.
  
  I hypothesize high error rate (despite CNN filtering) is connected to spectral overlaps.

Scope of experiments is different: Periscope covers 20k genes with 4 guides per gene, 
while the largest experiment in CP-POSH targets druggable genome &mdash; 1.6k genes with 10 guides per gene. 

## Phenotypic pipeline and analysis

Both teams avoid training the system on known labels.
I've also been avoiding training with supervision for a while, for a couple of reasons: 

1. no need to drop any data from analysis (no labels &rarr; no cross-validation)
2. by providing labels you already bias model into what _you believe_ is important. 
   Correspondingly model works to ignore all "irrelevant" information, and the same model can't be used (reliably) 
   for studying orthogonal questions (e.g. well-to-well variations) 
3. should there be any confounder, it is less likely to be picked

It’s actually **impressive how little prior knowledge is required to get a decent grasp of biology just from looking at static cells**.
We only need to know all genes of the organism, and that’s it.

PERISCOPE relies on [Cell Profiler](https://cellprofiler.org/), and does not train any specific pipeline. 
After averaging morphological profiles across the cells for the same gene, a matrix of gene similarities is computed.

CP-POSH relies on [CellPose](https://github.com/mouseland/cellpose) for segmentation, and either uses CellProfiler-like pipeline (dubbed CellStats) or self-supervised [DINO-ViT](https://arxiv.org/abs/2104.14294) from FAIR. 
Unsurprisingly, DINO-ViT demonstrates better quality, which improves with higher diversity of interventions provided during training.
Pre-training on cells not ImageNet works much better, as you'd expect (Insitro-ers for some reason like Imagenet-pretrained models as baseline). 
DINO-ViT also uses patches 8x8, more relevant to the scale of cell.

A nice detail: they use a well-level compensation. That's possible thanks to pooling! 

<img src="/images/opticalscreen/diffexp_visual_features.png" style='width: 400px; float: right;'>
Both papers delve into ‘differential expression’ of hand-crafted morphological features to provide arguments that readout is valid. 
For instance, periscope shows that most important features to detect interventions connected to common pathways point to the right cell compartment.

On the picture from PERISCOPE you see that disturbing a pathway results in some enrichment of 
important features (‘differentially expressed‘ features) from the corresponding cell compartment.

<div style="clear: both;"></div>

## Verification & Discovery 

"Method papers" are a special genre of literature: 1) focus of author is technology 2) focus of editor is novel biology 3) authors must provide convincing validation which no one wants to dive in.

This rarely converts into a consistent story for screens, and this time is no exception.

PERISCOPE compares two different medias, running whole-genome screens in each of them &mdash; an interesting experiment with unclear interpretation: 
there are genes that "land in different clusters" depending on the media &mdash; 
but unclear what to do with this information. 
As I understand, the goal was to demonstrate that running screen 
in a more physiologically relevant media would yield better insights, 
but it is unclear if differences (Ext Fig.8) indeed show superiority of either media.

Another interesting shot is the TMEM251 investigation with significant additional research beyond PERISCOPE. 
If the TMEM251 story really matters, I’d prefer to see it published separately and better verified (using available info from other pooled screens as well), 
Periscope in this story was needed only for initial guess based on GSEA &mdash; but this guess could come from other public screens as well.

Speaking of GSEA...  &mdash; usage of GSEA in paper (e.g. fig. 6a) makes no sense 😞.
GSEA's power is combining signal from multiple genes with low expression.
This problem *does not exist* in optical screens &mdash; as no expression is measured.
Preranked GSEA (erroneously) relies on zero correlation between genes, 
but correlation in optical screens is very high. 
In fact, this high correlation is a subject of several plots in the paper.
To compare pathways, just define another direction in embedding space for each pathway, 
as you do for single genes. 
Direction is a (weighted) average of directions for individual genes + measure separation of distributions along direction 
(e.g. ROC AUC).


<img src="/images/opticalscreen/umap_leiden_from_cellposh.png" width="700">
<small>Example UMAP from CP-POSH for one of screens</small>

CP-POSH focuses on druggable genome (1640 genes) with a couple of smaller screens.
Each version of pipeline (data + phenotyping model) is compared against [StringDB](https://string-db.org/),
providing a quantifiable comparison, so they can e.g. demonstrate that targeting more genes is slightly better. 
They also confirm that trained models generalize to new experiments.

Different versions of screen are presented in a uniform way with UMAP+Leiden clustering applied 
to genes with a clear morphological signature (see example above). 


I was confused by notable divergence between models trained on 300 and 1640 genes, figure 5a. 
In particular their lists of significant genes (AUC > 0.55) should markedly diverge across models.
Also, 0.55 may sound small &mdash; however, bear in mind this is a cell-level classification, 
and combining multiple cells will result in strong discrimination.

Both ViT and CellStats "nominate the potential role of TUT1 in cell cycle regulation". 
(No research made to confirm).
Interestingly, sgRNA consistency failed for several genes, 
and half of genes have at least one ‘outlier’ sgRNA (out of 10).

In my opinion, CP-POSH has a consistent storyline and more 'standardized' analysis.
It looks more like a validation of approach/platform, 
and less like a bunch of interesting observations (though CP-POSH has these too).
PERISCOPE presentation is more aligned to "get published in AAA journal".

Neither paper discusses cell cycle, a well-known confounder in single-cell studies, how so? 🤷
Optical screens previously characterized full images, not individual cells, 
and thus did not have to deal with this issue (as there are other cells to get signal from).
Since neither team used supervision, 
pipelines likely cluster dividing cells together, 
preferring this characteristic over perturbation.
Cancelling this in optical screen is an interesting challenge.



## So which one to choose?

Great question, fortunately we have papers to help us! So here is my insight: I don't know.
**I can’t meaningfully compare performance of two systems after reading preprints.**
Performance, I guess, is similar &mdash; but that’s only a guess. 
If some lab wants to select which one to go with, this becomes a matter of trust &mdash; not how science is supposed to work.
(ok-ok, one additional channel can actually make this choice).

Main selling points of optical pooled screens are simple scalability and fewer confounders,
which ultimately means hypothesis-free or hypothesis-light research.
I doubt that interpretable morphological features are important for practitioners.

Papers lack "power analysis" on how many cells are needed to reconstruct perturbation profile.
Very little said about cost ($0.001 per cell &mdash; estimate from PERISCOPE, no cost estimates from CP-POSH).
These two factors determine if pooled strategy pays out.

Speaking of potential, it is unclear if two sgRNAs per cell can be confidently called with either approach. 

## Can we do better?

**Screen validation should become a benchmark.**
It’s about time we had a benchmark of reproduction of gene networks/gene ontology with some predefined procedure. 
Community would benefit from comparing across the screens rather than “rediscovering” mTOR in every screen paper.

Number one question is &mdash; can screen discover culture-specific biology?
When comparing several cell lines, are gene similarities in optical screen and scRNAseq similar for the same cell line? 

It would be of high interest to highlight which pathways are detectable in scRNAseq but hardly noticeable in optical pooled screening (and vice versa). 
It is of value to know if there are pathways that can be seen in an optical screen or in scrnaseq — and can help in choosing the right instrument for the problem.

**Compare screen to screen, not screen to “common knowledge”.**
Common pathways are a very rough sanity check.
Single UMAP with gene grouped by their similarity is descriptive enough.
GSEA is a poor argument:  it is embarrassingly easy to find something pleasing with GSEA 
and throw a bunch of impressively small (incorrect) p-values at readers.

Comparison screen-to-screen can detect more subtle biology, specific to the biology of culture, and can actually bring interesting insight.

**Discoveries are usually irrelevant for the story and should not be demanded by journals.**
Method papers are demanded to “show novel biology”, and most of “byproduct discoveries” have no value for readers or authors &mdash; 
otherwise those would be a separate paper.

*Faster, cheaper, easier to scale, more reliable, easier to implement* are 
**great** arguments for technology. 
If whole smartphone industry can’t deliver “a killer feature” every year, 
how that can be a requirement for every method? 🤷


## Where would this go?

Back to point. Pooled optical screening is an exciting technology, 
and it has a number of immediate applications.
And it is super valuable to understand its current limits.

For instance, I have the following questions on my mind:

- does it transfer? When two labs experiment with same cell line, would they get similar results?
  In theory, yes, but how about practice?
- similarity and difference with arrayed screens: shared media means studied processed are limited to a single cell,
  because cell interactions are not restricted to cells with the same perturbation. 
  This has both pros (clearer signal) and cons (if cell interactions/collective behavior are of interest).  
- is it suitable to automatically find 'interesting' combinations of genes? 
  Can we train RL to discover those for us?
- can it handle tissue slices? Can we pool-screen [whole mouse](https://www.frontiersin.org/articles/10.3389/fragi.2021.714926/full)?
- can vision pipeline handle neurons? Is DINO a good choice for that?

Hopefully more research will come and we'll get answers to these and other questions soon.












<!-- 


# Cell painting channels:


Original cell paingting from the paper: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5223290/




Phenotypic images were acquired using a 20X 0.75 NA CFI Plan Apo Lambda objective (Nikon MRD00205) and the following Semrock filters for each phenotypic probe: 

Nucleus (DAPI) dual-band emission 408/473, dichroic. 
Actin (phalloidin) emission ET530/30 nm, dichroic 495 nm. 
Mitochondria (TOMM20) emission 615/24 nm, dichroic 565 nm. 
Endoplasmic reticulum (Concanavalin A) emission 680/42 nm, dichroic 660 nm. 
Golgi and plasma membrane (WGA) emission 820/110 nm, dichroic 765 nm. 



ISS cycles were imaged using a 10X 0.45 NA CFl Plan Apo Lambda objective (Nikon) with the following Semrock filters for each base: 
Miseq G emission 575/30 nm, dichroic 555 nm. excitation 543/4 nm, 
Miseq T emission 615/24 nm, dichroic 565 nm. 
Miseq A emission 680/42 nm, dichroic 660 nm. 
Miseq C emission 732/68 nm, dichroic 660 nm.

575 (-30) - 732 (+ 68)
TOMM20 intersects with T
ConA intersects with miseq A



——

Same for cell painting -POSH

Stain Target Imaging Type Stain Laser Source Laser (nm) Emission Filter (nm) Objective Exposure time (ms) 

Nucleus Phenotyping Hoechst Celesta Light Source, Lumencor, 90-10525 405 Pentacube , 441x30 20x 0.75 NA, OFN25 DIC N2
Cellular Membranes/ endoplasmic reticulum Phenotyping ConA Celesta Light Source, Lumencor, 90-10525 488 Pentacube, 511x26 20x 0.75 NA, OFN25 DIC N2
Cellular membrane/ Golgi/ER Phenotyping Wheat Germ Agglutinin Celesta Light Source, Lumencor, 90-10525 545 567/15nm Filter, Semrock, FF01-567/ 15-25 20x 0.75 NA, OFN25 DIC N2
Cytoskeleton/ F-actin Phenotyping Phalloidin Celesta Light Source, Lumencor, 90-10525 545 624/40nm Filter, Semrock, FF01-624/ 40-25 20x 0.75 NA, OFN25 DIC N2
Mitochondria Phenotyping Mitoprobe Celesta Light Source, Lumencor, 90-10525 637 Pentacube 684x34 20x 0.75 NA, OFN25 DIC N2
ribosomal protein Phenotyping pS6 primary and secondary antibody Celesta Light Source, Lumencor, 90-10525 748 Pentacube 817x66 20x 0.75 NA, OFN25 DIC N2


G    545  -> 567/15nm   <> WGA
T    545  -> 624/40nm   <>  Phalloidin one-to-one   - degraded by ethanol
A    637  -> 676/29nm   <>  Mitoprobe
C    637  -> 732/68nm


-->


