#!/bin/bash

echo "🚀 Starting Cypress Test Runner..."

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Server not running on localhost:3000"
    echo "🔧 Starting development server..."
    npm run dev &
    SERVER_PID=$!
    
    echo "⏳ Waiting for server to start..."
    sleep 15
    
    # Check if server started successfully
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Server is running!"
    else
        echo "❌ Failed to start server"
        exit 1
    fi
else
    echo "✅ Server is already running!"
fi

# Run the tests
echo "🧪 Running Cypress tests..."
npm run test:demo

# Clean up
if [ ! -z "$SERVER_PID" ]; then
    echo "🛑 Stopping server..."
    kill $SERVER_PID
fi

echo "✅ Tests completed!"




