# Copyright (c) Meta Platforms, Inc. and its affiliates.

# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

library(Robyn)
library(optparse)
library(showtext)
library(extrafont)

Sys.setenv(RETICULATE_PYTHON = "/root/.local/share/r-miniconda/envs/r-reticulate/bin/python")

library("reticulate")

library(ggplot2)
showtext_auto(enable = TRUE)
showtext::showtext_auto()
showtext_opts(dpi = 360)


packageVersion("Robyn")


option_list = list(
make_option(c("--id"), type="character", default=NULL,
  help="This is the run id", action="store"),
make_option(c("--file"), type="character", default=NULL,
  help="This is the path for the input file", action="store"),
make_option(c("--date_field"), type="character", default=NULL,
  help="This is name of the date column name", action="store"),
make_option(c("--dep_var"), type="character", default=NULL,
  help="This is the name of the dependent column", action="store"),
make_option(c("--dep_var_type"), type="character", default=NULL,
  help="This is the type of the dependent column (either revenue or conversions)", action="store"),
make_option(c("--country_code"), type="character", default=NULL,
  help="This is the country code (ISO 2 letters)", action="store"),
make_option(c("--context_vars"), type="character", default=NULL,
  help="This is the list of context variables", action="store"),
make_option(c("--paid_media_spends"), type="character", default=NULL,
  help="This is the list of paid media spends", action="store"),
make_option(c("--paid_media_vars"), type="character", default=NULL,
  help="This is the list of paid media variables", action="store"),
make_option(c("--organic_vars"), type="character", default=NULL,
  help="This is the list of context variables", action="store"),
make_option(c("--start_date"), type="character", default=NULL,
  help="This is the window start date", action="store"),
make_option(c("--end_date"), type="character", default=NULL,
  help="This is the window end date", action="store"),
make_option(c("--iterations"), type="character", default=2000,
  help="This is the number of model iterations", action="store"),
make_option(c("--trials"), type="character", default=5,
  help="This is the number of model iterations", action="store"),
make_option(c("--total_budget"), type="character", default=500000,
  help="This is the number of model iterations", action="store")
)

# Create a parser
parser = OptionParser(option_list=option_list)

# Parse the command-line arguments
args = parse_args(parser)

Sys.setenv(R_FUTURE_FORK_ENABLE = "true")
options(future.fork.enable = TRUE)

# Set to FALSE to avoid the creation of files locally
create_files <- TRUE

data("dt_simulated_weekly")
data("dt_prophet_holidays")

# Directory where you want to export results to (will create new folders)
robyn_out_directory <- "/robyn-data"
robyn_out_directory_with_id <- paste0(robyn_out_directory, "/", args$id)

if (!file.exists(robyn_out_directory)) {
  dir.create(robyn_out_directory)
}

if (!file.exists(robyn_out_directory_with_id)) {
  dir.create(robyn_out_directory_with_id)
}

# Example hyperparameters ranges for Weibull PDF adstock
# for each column have alphas, gammas, shapes, scales

paid_media_spends <- unlist(strsplit(args$paid_media_spends,","), use.names=FALSE)
paid_media_vars <- unlist(strsplit(args$paid_media_vars,","), use.names=FALSE)
organic_vars <- unlist(strsplit(args$organic_vars,","), use.names=FALSE)
factor_vars <- NULL
window_start <- args$start_date
window_end <- args$end_date
context_vars <- unlist(strsplit(args$context_vars,","), use.names=FALSE)
dt_data <- read.csv(args$file, header = TRUE, sep = ",", stringsAsFactors = FALSE)
joined_objectives <- unlist(list(paid_media_spends, organic_vars,factor_vars), use.names=FALSE)
date_field <- args$date_field
dep_var <- args$dep_var
dep_var_type <- args$dep_var_type
country_code <- args$country_code

iterations <- strtoi(args$iterations)
trials <- strtoi(args$trials)

# Initialize an empty list of hyperparameters
hyperparameters <- list()

# Loop through each element and create list entries
for (elem in joined_objectives) {
    hyperparameters[[paste0(elem, "_alphas")]] <- c(0.5, 3)
    hyperparameters[[paste0(elem, "_gammas")]] <- c(0.3, 1)
    hyperparameters[[paste0(elem, "_shapes")]] <- c(0, 10)
    hyperparameters[[paste0(elem, "_scales")]] <- c(0, 0.1)
}
hyperparameters[['train_size']] <- c(0.5, 0.8)
print(hyperparameters)
InputCollect <- robyn_inputs(
  dt_input = dt_data
  ,dt_holidays = dt_prophet_holidays
  ,date_var = date_field
  ,dep_var = dep_var
  ,dep_var_type = dep_var_type
  ,prophet_vars = c("trend", "season", "holiday")
  ,prophet_country = country_code
  ,context_vars = context_vars
  ,paid_media_spends = paid_media_spends
  ,paid_media_vars = paid_media_vars
  ,organic_vars = organic_vars
  ,factor_vars = factor_vars
  ,window_start = window_start
  ,window_end = window_end
  ,adstock = "weibull_pdf"
  ,hyperparameters = hyperparameters
)

InputCollect <- robyn_inputs(InputCollect = InputCollect, hyperparameters = hyperparameters)

#### Check spend exposure fit if available
if (length(InputCollect$exposure_vars) > 0) {
  lapply(InputCollect$modNLS$plots, plot)
}

##### Manually save and import InputCollect as JSON file
robyn_write(InputCollect, dir = robyn_out_directory_with_id)

################################################################
#### Step 3: Build initial model

## Run all trials and iterations. Use ?robyn_run to check parameter definition
OutputModels <- robyn_run(
  InputCollect = InputCollect, # feed in all model specification
  cores = NULL, # NULL defaults to (max available - 1)
  iterations = iterations,
  trials = trials,
  ts_validation = TRUE, # 3-way-split time series for NRMSE validation.
  add_penalty_factor = FALSE # Experimental feature. Use with caution.
)

## Check time-series validation plot (when ts_validation == TRUE)
# Read more and replicate results: ?ts_validation
if (OutputModels$ts_validation) OutputModels$ts_validation_plot

create_clusters <- TRUE

## Calculate Pareto fronts, cluster and export results and plots. See ?robyn_outputs
OutputCollect <- robyn_outputs(
  InputCollect, OutputModels,
  #pareto_fronts = 1, # automatically pick how many pareto-fronts to fill min_candidates (100)
  csv_out = "pareto", # "pareto", "all", or NULL (for none)
  clusters = create_clusters, # Set to TRUE to cluster similar models by ROAS. See ?robyn_clusters
  export = create_files, # this will create files locally
  plot_folder = robyn_out_directory_with_id, # path for plots exports and files creation
  plot_pareto = create_files # Set to FALSE to deactivate plotting and saving model one-pagers
)

if (create_clusters) {
  models <- as.data.frame(OutputCollect[["clusters"]][["models"]][["solID"]])
} else {
  models <- as.data.frame(OutputCollect[["allSolutions"]])
}

colnames(models)[1] <- "solution_id"
write.csv(models, paste0(robyn_out_directory_with_id, "/top_models.csv"), row.names = FALSE)

export_folder <- as.data.frame(OutputCollect[["plot_folder"]])
colnames(models)[1] <- "plot_folder"
write.csv(export_folder, paste0(robyn_out_directory_with_id, "/export_folder.csv"), row.names = FALSE)

allocator_max_response_fn <- function(model) {
  AllocatorCollect1 <- robyn_allocator(
    InputCollect = InputCollect,
    OutputCollect = OutputCollect,
    select_model = model[['solution_id']],
    channel_constr_low = 0.7,
    channel_constr_up = 1.5,
    scenario = "max_response",
    export = TRUE
  )
}

allocator_target_efficiency_fn <- function(model) {
  AllocatorCollect3 <- robyn_allocator(
    InputCollect = InputCollect,
    OutputCollect = OutputCollect,
    select_model = model[['solution_id']],
    scenario = "target_efficiency",
    export = TRUE
  )
}

apply(models, 1, allocator_max_response_fn)
apply(models, 1, allocator_target_efficiency_fn)
