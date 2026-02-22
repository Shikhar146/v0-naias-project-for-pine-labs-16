#!/bin/bash

# NAIAS MongoDB + Next.js Startup Script
# This script starts MongoDB and the Next.js development server

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════╗"
echo "║     NAIAS - MongoDB + Next.js Development Setup     ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "🔍 Checking MongoDB container..."
CONTAINER_STATUS=$(docker ps -a --filter "name=naias-mongodb" --format "{{.State}}")

if [ -z "$CONTAINER_STATUS" ]; then
    echo "📦 MongoDB container not found. Starting docker-compose..."
    docker-compose up -d
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 5
elif [ "$CONTAINER_STATUS" = "exited" ]; then
    echo "🔄 Starting stopped MongoDB container..."
    docker start naias-mongodb
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 3
elif [ "$CONTAINER_STATUS" = "running" ]; then
    echo "✅ MongoDB is already running"
fi

# Verify MongoDB is responding
echo "🔐 Verifying MongoDB connection..."
if docker exec naias-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin --eval "db.adminCommand('ping')" &> /dev/null; then
    echo "✅ MongoDB is ready!"
else
    echo "⏳ MongoDB is starting... waiting a bit more..."
    sleep 5
fi

echo ""
echo "📊 MongoDB Connection Details:"
echo "   URI: mongodb://admin:admin123@localhost:27017/naias"
echo "   Database: naias"
echo "   Collections: investigations, queries, timelines, users, organizations, sessions"
echo ""

# Display MongoDB data
echo "📈 Current MongoDB Statistics:"
INVESTIGATION_COUNT=$(docker exec naias-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin --eval "db.naias.investigations.countDocuments()" 2>/dev/null | grep -oP '^\d+' || echo "0")
echo "   Investigations: $INVESTIGATION_COUNT"
echo ""

echo "🚀 Starting Next.js development server..."
echo "   URL: http://localhost:3000"
echo "   Hot reload: Enabled"
echo ""
echo "💡 Tips:"
echo "   - Create investigation: Go to /investigations/new"
echo "   - View investigations: Go to /investigations"
echo "   - View MongoDB data: docker exec -it naias-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin"
echo ""
echo "Press Ctrl+C to stop the development server (MongoDB will keep running)"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

# Start Next.js dev server
npm run dev

# Cleanup on exit
echo ""
echo "🛑 Development server stopped"
echo "ℹ️  MongoDB container is still running. To stop it, use:"
echo "   docker stop naias-mongodb"
echo "or"
echo "   docker-compose down"
