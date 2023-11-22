install.packages("reticulate")

# 1. load reticulate
library("reticulate")
# 2. Install conda if not available
install_miniconda()
# 3. create virtual environment
conda_create("r-reticulate")
# 4. use the environment created
use_condaenv("r-reticulate")
# 5. point Python path to the python file in the virtual environment. Below is
#    an example for MacOS M1 or above. The "~" is my home dir "/Users/gufengzhou".
#    Show hidden files in case you want to locate the file yourself
# Sys.setenv(RETICULATE_PYTHON = "~/Library/r-miniconda-arm64/envs/r-reticulate/bin/python")
