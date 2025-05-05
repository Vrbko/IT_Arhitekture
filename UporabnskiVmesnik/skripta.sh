#!/bin/bash

# Run 'yarn' in addtocart
cd addtocart && yarn && yarn start &

# Run 'yarn' in cart
cd cart && yarn && yarn start &

# Run 'yarn' in home
cd home && yarn && yarn start &

# Run 'yarn' in pdp
cd pdp && yarn && yarn start &

# Run 'yarn' in server
cd server && yarn && yarn start &

# Wait for all background jobs to finish
wait