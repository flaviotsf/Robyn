library("reticulate")

Sys.setenv(RETICULATE_PYTHON = "/root/.local/share/r-miniconda/envs/r-reticulate/bin/python")

py_config()

py_install("numpy", pip = TRUE)
# 8. Install nevergrad
py_install("nevergrad", pip = TRUE)
