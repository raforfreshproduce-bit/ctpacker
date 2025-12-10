import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GanttChart, UserCheck, UserX } from 'lucide-react';

interface KpiCardsProps {
  totalSlots: number;
  assignedSlots: number;
  vacantSlots: number;
}

export default function KpiCards({ totalSlots, assignedSlots, vacantSlots }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
          <GanttChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSlots}</div>
          <p className="text-xs text-muted-foreground">Fixed number of CTPACKER slots</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Currently Assigned</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{assignedSlots}</div>
          <p className="text-xs text-muted-foreground">Slots with an assigned employee</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vacant Slots</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{vacantSlots}</div>
          <p className="text-xs text-muted-foreground">Slots available for assignment</p>
        </CardContent>
      </Card>
    </div>
  );
}
