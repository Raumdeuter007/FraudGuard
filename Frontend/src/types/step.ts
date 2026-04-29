export type StepStatus = "pending" | "active" | "done" | "error";

export interface Step {
  key: string;
  label: string;
}

export const STEPS: Step[] = [
  { key: "upload", label: "File Upload and Validation" },
  { key: "inference", label: "Model Inference" },
  { key: "overlay", label: "Heatmap Generation" },
  { key: "done", label: "Result Compilation" },
];
