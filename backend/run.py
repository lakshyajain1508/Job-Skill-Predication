#!/usr/bin/env python
"""
CareerPilot AI Backend - Entry Point

Usage:
    python run.py                    # Run with default settings
    python run.py --reload          # Run with hot reload
    python run.py --port 8001       # Run on custom port
"""

import uvicorn
import logging
from pathlib import Path
import sys

logger = logging.getLogger(__name__)


def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(description="CareerPilot AI Backend Server")
    parser.add_argument("--host", default="0.0.0.0", help="Server host (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="Server port (default: 8000)")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload on code changes")
    parser.add_argument("--workers", type=int, default=1, help="Number of worker processes")

    args = parser.parse_args()

    # Log startup info
    print("\n" + "=" * 60)
    print("🚀 CareerPilot AI Backend Server")
    print("=" * 60)
    print(f"📍 Starting server at http://{args.host}:{args.port}")
    print(f"🔄 Auto-reload: {'Enabled' if args.reload else 'Disabled'}")
    print(f"👷 Workers: {args.workers}")
    print("=" * 60 + "\n")

    # Run server
    uvicorn.run(
        "app.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        workers=args.workers,
        log_level="info",
    )


if __name__ == "__main__":
    main()
