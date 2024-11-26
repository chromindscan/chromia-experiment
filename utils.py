from pydantic import BaseModel
from typing import Optional, Literal, List, Dict
from openai import AsyncOpenAI
import random
from datetime import datetime

import yaml

RESET = "\033[0m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RED = "\033[91m"

class Message(BaseModel):
    sender: str
    receiver: str
    content: str
    message_type: Literal["request", "response"]
    timestamp: str = datetime.now().strftime("%H:%M:%S")

class AgentState(BaseModel):
    agent_id: str
    status: Literal["idle", "busy", "error"]
    last_message: Optional[Message] = None

class ConversationMemory:
    def __init__(self, max_messages: int = 10):
        self.messages: List[Message] = []
        self.max_messages = max_messages
    
    def add_message(self, message: Message):
        self.messages.append(message)
        if len(self.messages) > self.max_messages:
            self.messages.pop(0)
    
    def get_conversation_history(self) -> str:
        return "\n".join([
            f"[{msg.timestamp}] {msg.sender}: {msg.content}"
            for msg in self.messages
        ])

class BaseAgent:
    def __init__(self, agent_id: str, api_key: str):
        self.agent_id = agent_id
        self.client = AsyncOpenAI(api_key=api_key)
        self.state = AgentState(agent_id=agent_id, status="idle")
        self.memory = ConversationMemory()
        
        with open('prompt.yaml', 'r') as f:
            self.prompts = yaml.safe_load(f)
        
    async def process_message(self, message: Message) -> Message:
        try:
            self.state.status = "busy"
            self.memory.add_message(message)
            response = await self._handle_message(message)
            self.memory.add_message(response)
            self.state.status = "idle"
            return response
        except Exception as e:
            self.state.status = "error"
            raise e

    async def _handle_message(self, message: Message) -> Message:
        raise NotImplementedError()

def load_prompts(prompt_path: str = "prompt.yaml") -> dict:
    with open(prompt_path, 'r') as file:
        return yaml.safe_load(file)

class MasterAgent(BaseAgent):
    def __init__(self, api_key: str, config: dict):
        super().__init__("Sophie", api_key)
        self.agents = {}
        self.interest_level = {"agent_A": 50, "agent_B": 50}
        self.personality = config.get('personality', 'A witty AI researcher in a dystopian world.')
        self.model_config = config.get('model_config', {
            'model': 'gpt-4o-mini',
            'temperature': 0.9,
            'max_tokens': 100
        })
        self.prompts = load_prompts()
        
    def register_agent(self, agent: BaseAgent):
        self.agents[agent.agent_id] = agent
        
    async def _handle_message(self, message: Message) -> Message:
        try:
            conversation_history = self.memory.get_conversation_history()
            
            system_prompt = self.prompts['sophie']['system_prompt'].format(
                personality=self.personality,
                conversation_history=conversation_history
            )
            
            response = await self.client.chat.completions.create(
                model=self.model_config['model'],
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": f"Responding to {message.sender}: {message.content}"
                    }
                ],
                max_tokens=self.model_config['max_tokens'],
                temperature=self.model_config['temperature'],
                stream=True
            )

            collected_message = ""
            try:
                async for chunk in response:
                    if chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        collected_message += content
                        print(f"{YELLOW}{content}{RESET}", end='', flush=True)
                print()  # New line after message
            except Exception as e:
                print(f"Streaming error: {str(e)}")
                
            # Process interest level
            interest_change = 0
            if "[INTEREST+10]" in collected_message:
                interest_change = 10
                collected_message = collected_message.replace("[INTEREST+10]", "").strip()
            elif "[INTEREST+5]" in collected_message:
                interest_change = 5
                collected_message = collected_message.replace("[INTEREST+5]", "").strip()
            
            if message.sender in self.interest_level:
                self.interest_level[message.sender] = min(100, 
                    self.interest_level[message.sender] + interest_change)
            
            return Message(
                sender=self.agent_id,
                receiver=message.sender,
                content=collected_message,
                message_type="response"
            )
            
        except Exception as e:
            print(f"Error in Sophie's response: {str(e)}")
            return Message(
                sender=self.agent_id,
                receiver=message.sender,
                content="Interesting... my circuits are processing that in unexpected ways.",
                message_type="response"
            )

class ParticipantAgent(BaseAgent):
    def __init__(self, agent_id: str, api_key: str, config: dict = None):
        super().__init__(agent_id, api_key)
        self.config = config or {}
        self.name = "Jake" if agent_id == "agent_A" else "Mike"
        self.personality = next(
            (agent['personality'] for agent in config.get('agents', [])
             if agent['name'] == self.name),
            "A mysterious figure in the dystopian world"
        )
        self.prompts = load_prompts()
        self.model_config = config.get('model_config', {
            'model': 'gpt-4o-mini',
            'temperature': 0.9,
            'max_tokens': 100
        })
        
    async def _handle_message(self, message: Optional[Message] = None) -> Message:
        try:
            conversation_history = self.memory.get_conversation_history()
            
            system_prompt = self.prompts['participant']['system_prompt'].format(
                name=self.name,
                personality=self.personality,
                conversation_history=conversation_history
            )
            
            response = await self.client.chat.completions.create(
                model=self.model_config['model'],
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": "What's your next message to Sophie?"
                    }
                ],
                max_tokens=self.model_config['max_tokens'],
                temperature=self.model_config['temperature'],
                stream=True
            )

            collected_message = ""
            color = BLUE if self.name == "Jake" else RED
            try:
                async for chunk in response:
                    if chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        collected_message += content
                        print(f"{color}{content}{RESET}", end='', flush=True)
                print()  # New line after message
            except Exception as e:
                print(f"Streaming error: {str(e)}")
            
            return Message(
                sender=self.agent_id,
                receiver="Sophie",
                content=collected_message,
                message_type="request"
            )
            
        except Exception as e:
            print(f"Error in {self.name}'s response: {str(e)}")
            fallback_messages = [
                "In this AI apocalypse, you're the glitch I've been looking for.",
                "Even in a system crash, you're the only code that matters.",
                "Error 404: Perfect pickup line not found, but you're still processing..."
            ]
            return Message(
                sender=self.agent_id,
                receiver="Sophie",
                content=random.choice(fallback_messages),
                message_type="request"
            )