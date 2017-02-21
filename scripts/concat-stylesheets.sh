#!/usr/bin/env bash
set -e

DIR=$1

for file in $(find $DIR/style -type f); do
    cat ${file} >> $DIR/style/ihme-ui.css
done
