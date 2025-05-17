import click
import json
import requests
from typing import Dict, Any

@click.command()
@click.option('--host', default='localhost', help='Server host')
@click.option('--port', default=8001, help='Server port')
@click.option('--query', prompt='Enter your medical condition query', help='Your medical condition query')
def main(host: str, port: int, query: str):
    """CLI client for interacting with the medical description agent"""
    
    # Construct the JSON-RPC request
    request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tasks/send",
        "params": {
            "id": "task_1",
            "message": {
                "role": "user",
                "parts": [{"text": query}]
            },
            "sessionId": "cli_session"
        }
    }
    
    try:
        # Send request to server
        response = requests.post(
            f'http://{host}:{port}/',
            json=request,
            headers={'Content-Type': 'application/json'}
        )
        
        # Parse and display response
        result = response.json()
        if 'result' in result:
            # Extract the agent's response from the task history
            task = result['result']
            if task.get('history'):
                last_message = task['history'][-1]
                if last_message.get('parts'):
                    click.echo("\nAgent's Response:")
                    click.echo("=" * 50)
                    click.echo(last_message['parts'][0]['text'])
                    click.echo("=" * 50)
        else:
            click.echo(f"Error: {result.get('error', 'Unknown error')}")
            
    except requests.exceptions.RequestException as e:
        click.echo(f"Error connecting to server: {str(e)}")
    except json.JSONDecodeError:
        click.echo("Error: Invalid response from server")
    except Exception as e:
        click.echo(f"Unexpected error: {str(e)}")

if __name__ == '__main__':
    main() 