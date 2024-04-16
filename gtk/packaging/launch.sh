#!/bin/bash

ARCH=$(uname -m)
case $ARCH in
	x86_64 | s390x | sparc64)
		LIB_DIR="/usr/lib64"
		SECONDARY_LIB_DIR="/usr/lib"
		;;
	* )
		LIB_DIR="/usr/lib"
		SECONDARY_LIB_DIR="/usr/lib64"
		;;
esac

BIN_NAME="TodoPoly"

if [ ! -r "$LIB_DIR"/TodoPoly/$BIN_NAME ]; then
    if [ ! -r $SECONDARY_LIB_DIR/TodoPoly/$BIN_NAME ]; then
	  echo "Error: $LIB_DIR/TodoPoly/$BIN_NAME not found"
	  if [ -d $SECONDARY_LIB_DIR ]; then
	    echo "       $SECONDARY_LIB_DIR/TodoPoly/$BIN_NAME not found"
	  fi
	  exit 1
    fi
    LIB_DIR="$SECONDARY_LIB_DIR"
fi

PROG_DIR="$LIB_DIR/TodoPoly"
PROG_BIN="$PROG_DIR/$BIN_NAME"

exec $PROG_BIN "$@"
