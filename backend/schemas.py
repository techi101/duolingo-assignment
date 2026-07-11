from pydantic import BaseModel
from typing import Optional

class ChallengeProgressRequest(BaseModel):
    challengeId: int
    user_id: int = 1 # Assuming default user for now

class ChallengeProgressResponse(BaseModel):
    challenge_id: int
    completed: bool
    user_id: int

class UserHeartsResponse(BaseModel):
    hearts: int
    error: Optional[str] = None
