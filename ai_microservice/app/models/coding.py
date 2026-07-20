from pydantic import BaseModel, Field
from typing import List, Optional

class CodeReviewRequest(BaseModel):
    code: str = Field(..., description="Raw code snippet from the editor")
    language: str = Field("python", description="Programming language of the code")
    problem_description: str = Field(..., description="The problem statement prompt")

class CodeReviewResponse(BaseModel):
    passed: bool = Field(..., description="Whether the basic syntax and logic passes basic screening")
    feedback: str = Field(..., description="Qualitative feedback on the solution")
    explanation: str = Field(..., description="Line-by-line or conceptual explanation of the code")
    time_complexity: str = Field(..., description="Calculated Time Complexity (e.g. O(N log N))")
    space_complexity: str = Field(..., description="Calculated Space Complexity (e.g. O(1))")
    optimized_code: Optional[str] = Field(None, description="Suggested optimized solution snippet")

class JudgeExecutionRequest(BaseModel):
    code: str = Field(..., description="Code snippet to compile and run")
    language_id: int = Field(..., description="Judge0 programming language ID")
    stdin: Optional[str] = Field(None, description="Input for execution")

class JudgeExecutionResponse(BaseModel):
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    compile_output: Optional[str] = None
    status_id: int
    status_description: str
    time: Optional[float] = None
    memory: Optional[int] = None
