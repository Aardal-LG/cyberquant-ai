from pydantic import BaseModel, Field


class ControlComplianceMapping(BaseModel):
    control_id: str = Field(..., example="CTRL-001")
    control_name: str = Field(..., example="Next-Gen EDR Deployment")
    framework: str = Field(..., example="NIST_800_53")
    mapped_requirements: list[str] = Field(..., example=["DE.CM-4", "PR.PT-1"])


class FrameworkComplianceSummary(BaseModel):
    framework_name: str = Field(..., example="NIST Cybersecurity Framework (CSF 2.0)")
    code: str = Field(..., example="NIST_CSF")
    overall_compliance_score: float = Field(..., example=78.5)
    implemented_controls_count: int = Field(..., example=4)
    total_required_controls_count: int = Field(..., example=6)
    gap_areas: list[str] = Field(..., example=["PR.AC Access Control", "DE.CM Security Continuous Monitoring"])


class ComplianceResponse(BaseModel):
    frameworks: list[FrameworkComplianceSummary]
    control_mappings: list[ControlComplianceMapping]
