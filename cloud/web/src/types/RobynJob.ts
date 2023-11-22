export type RobynJob = {
  id: number;
  filename: string;
  createdAt: Date;
  state: string;
  columns: string | null;
  exportFolder: string;
  settings: string;
  models: string[];
};
