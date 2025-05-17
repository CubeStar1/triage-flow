import click
import httpx
import json
import os
import asyncio
from pathlib import Path
from typing import Dict, Any, Optional

ORCHESTRATOR_ENDPOINT = "http://localhost:8000/triage_orchestrator"

async def make_request(method: str, params: Optional[Dict[str, Any]] = None) -> Dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            ORCHESTRATOR_ENDPOINT,
            json={
                "jsonrpc": "2.0",
                "method": method,
                "params": params or {},
                "id": 1
            }
        )
        return response.json()

@click.group()
def cli():
    """Medical Image Triage CLI"""
    pass

@cli.command()
@click.argument('patient_id')
@click.argument('image_path', type=click.Path(exists=True))
@click.argument('labels_file', type=click.Path(exists=True))
def process_image(patient_id: str, image_path: str, labels_file: str):
    """Process a patient image through the triage pipeline"""
    with open(labels_file) as f:
        image_labels = json.load(f)
    
    result = asyncio.run(
        make_request(
            "process_image",
            {
                "patient_id": patient_id,
                "image_path": str(Path(image_path).absolute()),
                "image_labels": image_labels
            }
        )
    )
    click.echo(json.dumps(result, indent=2))

@cli.command()
def list_agents():
    """List available agents"""
    result = asyncio.run(make_request("list_agents"))
    click.echo(json.dumps(result, indent=2))

if __name__ == '__main__':
    cli() 