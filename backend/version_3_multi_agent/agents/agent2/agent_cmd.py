import click
import asyncio
from agents.agent2.agent import TriageAgent
from agents.agent1.agent import DescriptorAgent

async def process_triage(symptoms: str):
    """Process the triage request asynchronously"""
    try:
        # Initialize agents
        agent1 = DescriptorAgent()
        agent2 = TriageAgent()
        
        # Process through Agent 1 first
        click.echo("\nGetting detailed medical description...")
        description = agent1.invoke(symptoms, "cli_session")
        
        # Show Agent 1's output
        click.echo("\nDetailed Medical Description:")
        click.echo(description)
        
        # Process through Agent 2
        click.echo("\nPerforming triage assessment...")
        triage_result = await agent2.invoke(description, "cli_session")
        
        # Show final triage assessment
        click.echo("\nTriage Assessment:")
        click.echo(triage_result)
        
    except Exception as e:
        click.echo(f"\nError: {str(e)}", err=True)

@click.command()
def main():
    """Medical Triage CLI - Enter symptoms and get a comprehensive assessment"""
    click.echo("Welcome to the Medical Triage System")
    click.echo("Please describe the patient's symptoms and condition:")
    
    # Get user input
    symptoms = click.prompt("Enter symptoms", type=str)
    
    # Run the async process
    asyncio.run(process_triage(symptoms))

if __name__ == "__main__":
    main() 