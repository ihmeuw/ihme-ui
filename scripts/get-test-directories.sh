#!/bin/sh
set -e

TEST_DIRS=""

for f in src/*; do
  if [ -n "$TEST_ONLY" ] && [ `basename $f` != "$TEST_ONLY" ]; then
    continue
  fi

  if [ -d "$f/test" ]; then
    TEST_DIRS="$f/test $TEST_DIRS"
  fi

  # nested test dirs
  for j in $f/*; do
      if [ -n "$TEST_ONLY" ] && [ `basename $j` != "$TEST_ONLY" ]; then
        continue
      fi

      if [ -d "$j/test" ]; then
        TEST_DIRS="$j/test $TEST_DIRS"
      fi
  done
done

echo $TEST_DIRS