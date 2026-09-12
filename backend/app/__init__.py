# CyberQuant AI Backend Package
import sys
from pathlib import Path

# The AI and quantitative engines remain sibling packages of the FastAPI app.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

__version__ = "1.0.0"
