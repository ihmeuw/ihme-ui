#!/bin/sh
set -e

TEST_DIRS=""

for dir in $(find ./src -depth -name 'test' -type d); do
    TEST_DIRS="$dir $TEST_DIRS"
done

echo $TEST_DIRS
