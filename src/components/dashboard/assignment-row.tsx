"use client"

import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Save, X, Trash2 } from 'lucide-react';
import type { Assignment, Supervisor } from '@/lib/data';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';

interface AssignmentRowProps {
  assignment: Assignment;
  supervisors: Supervisor[];
  onUpdateAssignment: (assignment: Assignment) => void;
  onClearAssignment: (assignmentId: string) => void;
}

const getStatus = (packerPickerName: string | null) => {
  if (!packerPickerName) {
    return { text: 'Vacant', className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200' };
  }
  if (packerPickerName.toLowerCase().includes('recount')) {
    return { text: 'PSI Recount', className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200' };
  }
  return { text: 'Assigned', className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' };
};

export default function AssignmentRow({ assignment, supervisors, onUpdateAssignment, onClearAssignment }: AssignmentRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAssignment, setEditedAssignment] = useState<Assignment>(assignment);
  const { toast } = useToast();

  const status = getStatus(assignment.packerPickerName);
  const isAssigned = !!assignment.packerPickerName;

  const handleEdit = () => {
    setEditedAssignment(assignment);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    if(!editedAssignment.packerPickerName && isAssigned) {
        toast({
            variant: "destructive",
            title: "Invalid Action",
            description: "To clear an assignment, please use the Delete button.",
        });
        return;
    }
    if(editedAssignment.packerPickerName && !editedAssignment.supervisorName) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please select a supervisor.",
        });
        return;
    }
    onUpdateAssignment(editedAssignment);
    setIsEditing(false);
    toast({
        title: "Assignment Updated",
        description: `${editedAssignment.id} has been successfully updated.`,
    })
  };

  const handleClear = () => {
    onClearAssignment(assignment.id);
    setIsEditing(false);
    toast({
        title: "Assignment Cleared",
        description: `${assignment.id} is now vacant.`,
    })
  };

  if (isEditing) {
    return (
      <TableRow className="bg-accent/50">
        <TableCell className="font-medium">{assignment.id}</TableCell>
        <TableCell>
          <Select
            value={editedAssignment.supervisorName || ''}
            onValueChange={(value) => setEditedAssignment({ ...editedAssignment, supervisorName: value })}
          >
            <SelectTrigger className="w-full min-w-[150px]">
              <SelectValue placeholder="Select Supervisor" />
            </SelectTrigger>
            <SelectContent>
              {supervisors.map(s => (
                <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            value={editedAssignment.packerPickerName || ''}
            onChange={(e) => setEditedAssignment({ ...editedAssignment, packerPickerName: e.target.value })}
            placeholder="Enter Packer/Picker Name"
          />
        </TableCell>
        <TableCell>
          <Badge variant="outline" className={getStatus(editedAssignment.packerPickerName).className}>
            {getStatus(editedAssignment.packerPickerName).text}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={handleSave} aria-label="Save">
              <Save className="h-4 w-4 text-primary" />
            </Button>
            {isAssigned && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Delete">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will clear the assignment for {assignment.id}. The slot will become vacant.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClear} className="bg-destructive hover:bg-destructive/90">Clear Assignment</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Cancel">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{assignment.id}</TableCell>
      <TableCell>{assignment.supervisorName || '—'}</TableCell>
      <TableCell>{assignment.packerPickerName || '—'}</TableCell>
      <TableCell>
        <Badge variant="outline" className={status.className}>{status.text}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Pencil className="mr-2 h-3 w-3" />
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
}
