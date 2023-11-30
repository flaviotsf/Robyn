FROM rocker/r2u:22.04
RUN install.r rjson reticulate
COPY R/deps/py ./R/deps/py
RUN Rscript ./R/deps/py/install-reticulate.R
RUN install.r optparse showtext extrafont
RUN Rscript ./R/deps/py/install-nevergrad.R

COPY R/deps/base ./R/deps/base
RUN Rscript ./R/deps/base/install-robyn.R
RUN Rscript ./R/deps/base/install-fonts.R


RUN echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections
RUN apt install ttf-mscorefonts-installer -y
RUN apt install fontconfig

COPY R/deps/lares ./R/deps/lares
RUN Rscript ./R/deps/lares/install-lares.R

COPY R/deps/fonts /usr/share/fonts
RUN fc-cache -f -v

RUN apt install vim -y

COPY R/sample ./R/sample
