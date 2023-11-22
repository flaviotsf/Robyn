# Docker Image for Robyn

This is a sample Docker image that is able to run Robyn.

## Building steps

Run the following command to build the docker image:
```
docker build -f robyn.Dockerfile -t flaviosf310/robyn-base:latest . --platform linux/amd64
```

You can add a tag to a GCP item in a registry like 
```
 docker tag flaviosf310/robyn-base:latest us-central1-docker.pkg.dev/f51-robyn-hackathon/robyn/robyn-base:latest
```

or something like this, if you plan to 
You can change `robyn` to anything (it's a tag you will use later)

This includes all dependencies, and a sample folder to evaluate the
setup is correct. `Vim` is also included in case you need quick
editor access.

## Running the image

In order to evaluate the image has all the necessary dependencies
installed and everything works you can run the following command:

```
docker run --platform linux/amd64 -it -v $(pwd)/robyn-data:/robyn-data robyn /bin/sh
```
In this command we can mount a local volume - this is similar to what you may want to do
later in a cloud provider with a persistent volume. In this case, we're mapping a local
`robyn-data` folder to the `/robyn-data` folder on the container. `/bin/sh` will start
a terminal.

In the terminal you can:
```
$ cd R/sample

$ ./x.sh
run the x.sh command, which calls into the robyn-runner.R` script.
```

If you run that command you should have a folder with:

- `export_folder.csv` - where the files are saved
- `top_models.csv` - the list of top model ids
- `RobynModel-inputs.json` - inputs for the model

The run will also output lots of older files. An example can be seen below:


```
├── 2_18_1.png
├── 2_18_1_reallocated.csv
├── 2_18_1_reallocated_best_roas.png
├── 2_18_1_reallocated_target_roas.png
├── 2_18_9.png
├── 2_18_9_reallocated.csv
├── 2_18_9_reallocated_best_roas.png
├── 2_18_9_reallocated_target_roas.png
├── 4_18_8.png
├── 4_18_8_reallocated.csv
├── 4_18_8_reallocated_best_roas.png
├── 4_18_8_reallocated_target_roas.png
├── 4_21_1.png
├── 4_21_1_reallocated.csv
├── 4_21_1_reallocated_best_roas.png
├── 4_21_1_reallocated_target_roas.png
├── 5_22_3.png
├── 5_22_3_reallocated.csv
├── 5_22_3_reallocated_best_roas.png
├── 5_22_3_reallocated_target_roas.png
├── ROAS_convergence1.png
├── RobynModel-models.json
├── hypersampling.png
├── pareto_aggregated.csv
├── pareto_alldecomp_matrix.csv
├── pareto_clusters.csv
├── pareto_clusters_ci.csv
├── pareto_clusters_detail.png
├── pareto_clusters_wss.png
├── pareto_front.png
├── pareto_hyperparameters.csv
├── pareto_media_transform_matrix.csv
├── prophet_decomp.png
├── raw_data.csv
└── ts_validation.png
```
