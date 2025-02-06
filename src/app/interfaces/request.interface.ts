export interface Request {
    id: string;
    type: 'Plastic' | 'Glass' | 'Paper' | 'Metal';
    weight: number;
    date: string;
    status: 'pending' | 'busy' | 'in progress' | 'validated' | 'rejected';
    timeSlot: string;
  }
  
  export interface DashboardState { 
    requests: Request[];
    points: number;
    loading: boolean;
    error: string | null;
  }