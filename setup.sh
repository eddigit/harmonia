#!/bin/bash

# Harmonia Setup Script
echo "🎵 Setting up Harmonia Application..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

echo "${BLUE}📦 Installing Frontend Dependencies...${NC}"
cd frontend
npm install
cp .env.example .env
cd ..

echo "${BLUE}📦 Installing Backend Dependencies...${NC}"
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
mkdir -p uploads outputs
cd ..

echo "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "To start the application:"
echo "1. Start the backend:"
echo "   cd backend && source venv/bin/activate && python run.py"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "Or use Docker:"
echo "   docker-compose up"
echo ""
echo "🎵 Enjoy Harmonia!"
