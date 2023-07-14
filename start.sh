# use docker backend for this, DO NOT USE colima, it can't do incrementals
docker run -it --rm --label=jekyll --volume=`pwd`:/srv/jekyll --mount type=tmpfs,destination=/srv/jekyll/_site -it -p 4000:4000 younglook/jekyll-arm64 \
 bash -c 'jekyll build && jekyll serve --incremental'


# docker run -it --rm --label=jekyll --volume=`pwd`:/srv/jekyll  -it -p 4000:4000 jekyll/jekyll bash
# jekyll serve --incremental

## Another way is using nix-shell
# nix-shell -p jekyll
# jekyll serve