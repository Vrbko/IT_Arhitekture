#!/bin/bash

# Set Docker Hub username
DOCKERHUB_USER="vrbko"

# List of services to build
declare -A services=(
  ["zaloga"]="Storitev_Zaloga"
  ["uporabniki"]="Storitev_Uporabniki"
  ["php"]="Storitev_Narocanje"
  ["home"]="UporabnskiVmesnik/home"
  ["pdp"]="UporabnskiVmesnik/pdp"
  ["cart"]="UporabnskiVmesnik/cart"
  ["addtocart"]="UporabnskiVmesnik/addtocart"
  ["server"]="UporabnskiVmesnik/server"
)

# Loop through services, build and push each one
for service in "${!services[@]}"; do
  context="${services[$service]}"
  image="${DOCKERHUB_USER}/${service}:latest"

  echo "🔨 Building $service from $context..."
  docker build -t "$image" "$context" || { echo "❌ Build failed for $service"; exit 1; }

  echo "📤 Pushing $image to Docker Hub..."
  docker push "$image" || { echo "❌ Push failed for $service"; exit 1; }

  echo "✅ Done with $service"
  echo "----------------------------"
done

echo "🚀 All images built and pushed successfully!"