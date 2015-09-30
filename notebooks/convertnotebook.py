"""
This code converts notebook to post.
Html conversion is used.
"""

from __future__ import division, print_function, absolute_import

__author__ = 'Alex Rogozhnikov'
import codecs
import sys
import os
import subprocess

template = """---
layout: post
title: "{title}"
date: "{date}"
author: Alex Rogozhnikov
tags:
- notebook
---

{content}

<p>
    This post was written in IPython. You can download the notebook from
     <a href='https://github.com/arogozhnikov/arogozhnikov.github.io/tree/master/notebooks'>
    repository</a>.
</p>

"""

assert len(sys.argv) >= 2, 'one argument (filename of notebook) shall be passed to the script'


def get_notebook_title(filename):
    with codecs.open(filename=filename, encoding='utf-8') as file:
        contents = file.read()
    # first time we see line with '# ', the rest is considered as title of notebook
    title = os.path.splitext(os.path.basename(notebook_filename))[0]

    for line in contents.split('\n'):
        if line.strip().startswith('"# ') or line.strip().startswith('"## '):
            title = line
            break
    else:
        raise ValueError("Couldn't detect name of post")
    title = str(title.strip())[3:-2].strip(' #"')[:-2]
    return title


def read_html_contents(filename):
    with codecs.open(filename=filename, encoding='utf-8') as file:
        return file.read()


def convert_notebook(notebook_filename):
    html_filename = os.path.splitext(os.path.basename(notebook_filename))[0] + '.html'
    print('source file', notebook_filename)
    print('will be converted to ', html_filename)

    title = get_notebook_title(notebook_filename)

    # using ipython nbconvert to get html representation
    command = 'ipython nbconvert --to html {} --template basic --output {}'.format(notebook_filename, html_filename)
    callProcess = subprocess.Popen(command, shell=True)
    callProcess.wait()

    date = notebook_filename[:len('yyyy-mm-dd')]
    content = read_html_contents(html_filename)

    with codecs.open('../_posts/' + html_filename, mode='w', encoding='utf-8') as file:
        file.write(unicode(template).format(title=title, date=date, content=content))

    # delete temptorary file
    os.remove(html_filename)



notebook_filename = sys.argv[1]

if not os.path.exists(notebook_filename):
    sys.exit('ERROR: file {} was not found!'.format(notebook_filename))

convert_notebook(notebook_filename=notebook_filename)
