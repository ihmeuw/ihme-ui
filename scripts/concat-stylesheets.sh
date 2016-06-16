#!/usr/bin/env bash
set -e

for dir in $(find lib/style -type f); do
    cat ${dir} >> style/ihme-ui.css
done
