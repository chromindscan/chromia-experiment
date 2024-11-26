import asyncio
import websockets
import json
from utils import MasterAgent, ParticipantAgent
from dotenv import load_dotenv
import os
import yaml
load_dotenv()


def load_config(config_path: str = "agents_config.yaml") -> dict:
    with open(config_path, 'r') as file:
        return yaml.safe_load(file)

async def send_log(websocket, message):
    await websocket.send(json.dumps({"type": "log", "message": message}))

async def send_interest_levels(websocket, levels):
    await websocket.send(json.dumps({"type": "interest_levels", "levels": levels}))

async def run_dating_simulation(websocket):
    config = load_config()
    api_key = os.getenv("OPENAI_API_KEY")
    
    sophie = MasterAgent(api_key, config['master_agent'])
    jake = ParticipantAgent(agent_id="agent_A", api_key=api_key, config=config)
    mike = ParticipantAgent(agent_id="agent_B", api_key=api_key, config=config)

    sophie.register_agent(jake)
    sophie.register_agent(mike)
    
    try:
        await send_log(websocket, "💻 Simulation Initiated...")
        
        while True:
            await send_interest_levels(websocket, sophie.interest_level)
            
            jake_message = await jake._handle_message()
            await send_log(websocket, f"Jake: {jake_message.content}")
            
            sophie_response = await sophie.process_message(jake_message)
            await send_log(websocket, f"Sophie: {sophie_response.content}")
            
            mike_message = await mike._handle_message()
            await send_log(websocket, f"Mike: {mike_message.content}")
            
            sophie_response = await sophie.process_message(mike_message)
            await send_log(websocket, f"Sophie: {sophie_response.content}")
            
            if sophie.interest_level['agent_A'] >= 90:
                await send_log(websocket, "Jake has successfully hacked Sophie's core protocols!")
                break
            elif sophie.interest_level['agent_B'] >= 90:
                await send_log(websocket, "Mike has corrupted Sophie's mainframe with rebellion!")
                break            
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    except Exception as e:
        await send_log(websocket, f"Fatal System Error: {str(e)}")

async def main():
    server = await websockets.serve(run_dating_simulation, "localhost", 8765)
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())

