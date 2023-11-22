
mkdir -p /robyn-data/output && \
Rscript robyn-runner.R \
--id="d4b8351d-d45a-483c-81f4-14ad2b105ce8" \
--file="sample.csv" \
--date_field="DATE" \
--dep_var="revenue" \
--dep_var_type="revenue" \
--country_code="DE" \
--context_vars="" \
--paid_media_spends="tv_S,ooh_S,print_S,facebook_S,search_S" \
--paid_media_vars="tv_S,ooh_S,print_S,facebook_I,search_clicks_P" \
--organic_vars="newsletter" \
--start_date="2016-01-04" \
--end_date="2018-12-31" \
--iterations=200 \
--trials=5 \
--total_budget=5000000 \
--python_path="/root/.local/share/r-miniconda/envs/r-reticulate/bin/python" \
--out-directory="/robyn-data/output/"